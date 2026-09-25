-- =============================================================
-- Movie application database schema (PostgreSQL)
--
-- Run once when the database container is first created
-- (mounted into /docker-entrypoint-initdb.d).
--
-- =============================================================

BEGIN;

-- -------------------------------------------------------------
-- users: registered accounts
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users
(
    id       serial,
    email    character varying(255)  NOT NULL,
    -- Always stores a bcrypt hash, never a plaintext password,
    -- which is why 255 characters are reserved here
    password_hash character varying(255) NOT NULL,
    username character varying(50)  NOT NULL,
    -- Set automatically by the database when the row is created
    created_at    timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    -- UNIQUE prevents registering twice with the same address or username
    UNIQUE (email),
    UNIQUE (username)
);

-- -------------------------------------------------------------
-- refresh tokens: long-lived tokens used to issue new access
-- tokens without forcing the user to log in again

-- We store a hash of the token never the token itself. This way
-- even if the database gets leaked, stolen rows couldnt
-- be used as valid refresh tokens
CREATE TABLE IF NOT EXISTS public.refresh_tokens
(
    id serial,
    user_id integer NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    token_hash character varying(64) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (token_hash)
);

-- -------------------------------------------------------------
-- groups: user-created groups
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.groups
(
    id       serial,
    name     character varying(50) NOT NULL,
    -- ON DELETE CASCADE: deleting an account also deletes the
    -- groups that account owns (requirement 4)
    owner_id integer NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- group_members: memberships and pending join requests
-- status is 'pending' until the group owner accepts or rejects
-- the request
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.group_members
(
    id       serial,
    group_id integer NOT NULL REFERENCES public.groups (id) ON DELETE CASCADE,
    user_id  integer NOT NULL REFERENCES public.users  (id) ON DELETE CASCADE,
    status   character varying(20) NOT NULL DEFAULT 'pending',
    PRIMARY KEY (id),
    -- The same user can only appear once per group, which also
    -- prevents duplicate join requests
    UNIQUE (group_id, user_id)
);

-- -------------------------------------------------------------
-- group_movies: movies added to a group page 
--
-- movie_id holds a TMDB movie id rather than referencing a local
-- table, because movie data is fetched from the TMDB API and is
-- not stored in this database.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.group_movies
(
    id       serial,
    group_id integer NOT NULL REFERENCES public.groups (id) ON DELETE CASCADE,
    movie_id integer NOT NULL,
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- favorites: a user's personal favorites list 
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites
(
    id       serial,
    user_id  integer NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    movie_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    -- The same movie cannot be added twice to one list
    UNIQUE (user_id, movie_id)
);

-- -------------------------------------------------------------
-- reviews: movie reviews written by logged-in users
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews
(
    id          serial,
    user_id     integer NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    movie_id    integer NOT NULL,
    review_text text    NOT NULL,
    -- CHECK enforces the 1-5 star range required by the spec
    stars       integer NOT NULL CHECK (stars BETWEEN 1 AND 5),
    -- Timestamp is set automatically when the review is created
    created_at  timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- -------------------------------------------------------------
-- Indexes on foreign key columns. PostgreSQL indexes primary
-- keys automatically but not the columns referencing them, so
-- these speed up lookups such as "all reviews by this user" or
-- "all members of this group".
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id on public.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_groups_owner_id        ON public.groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id  ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_movies_group_id  ON public.group_movies(group_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id      ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id        ON public.reviews(user_id);

COMMIT;
