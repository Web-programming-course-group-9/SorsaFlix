import { expect } from 'chai'
import { pool } from "../db/index.js"

//For register, login and logout tests you must point out to the correct database DATABASE_URL in
//a .env file in ./server/.env, without that the tests will fail on some parts since these use direct db functionality to
//remove db entries for test users

//Function that deletes test user by email. we use this after each test
async function deleteUserByEmail(email) {
    await pool.query('DELETE FROM users WHERE email = $1', [email])
}

describe('Register', () => {

    //Define test user for registration testing
    const testUser = {
        username: 'registertestuser',
        email: 'registertest@example.com',
        password: 'Testpassword1'
    }

    //Cleanup after the test is done, removes testusers
    after(async () => {
        await deleteUserByEmail(testUser.email)
        await deleteUserByEmail('weakpassword@example.com')
        await deleteUserByEmail('missingfields@example.com')
    })

    it('it should return 201 and the created user when registration data is valid', async () => {
        const res = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        })
        const data = await res.json()

        expect(res.status).to.equal(201)
        expect(data).to.have.property('username', testUser.username)
        expect(data).to.have.property('email', testUser.email)
        expect(data).to.not.have.property('password_hash')

    })

    it('should return 409 when email is already in use', async () => {
        const res = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...testUser, username: 'someoneelse' })
        })
        expect(res.status).to.equal(409)
    })

    it('should return 400 when password does not meet the requirements', async () => {
        const res = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'weakpassworduser',
                email: 'weakpassword@example.com',
                password: 'weak'
            })
        })
        expect(res.status).to.equal(400)
    })

    it('should return 400 when a required field is missing', async () => {
        const res = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'missingfields@example.com',
                password: 'Testpassword1'
            })
        })
        expect(res.status).to.equal(400)
    })

})


//Login tests 
describe('Login', () => {

    //Define test user for login testing
    const testUser = {
        username: 'logintestuser',
        email: 'logintest@example.com',
        password: 'Testpassword1'
    }

    // Create the user once before all tests in this block, since every
    // test here needs the same already-registered user to log in with
    before(async () => {
        await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        })
    })

    after(async () => {
        await deleteUserByEmail(testUser.email)
    })


    it('should return 200 and a token when credentials are correct', async () => {
        const res = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        })
        const data = await res.json()

        expect(res.status).to.equal(200)
        expect(data).to.have.property('token')
        expect(data.user).to.have.property('email', testUser.email)
    })

    it('should return 401 when password is incorrect', async () => {
        const res = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: testUser.email,
                password: 'WrongPassword1'
            })
        })
        expect(res.status).to.equal(401)
    })

    it('should return 400 when password is missing', async () => {
        const res = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: testUser.email
            })
        })
        expect(res.status).to.equal(400)
    })

})


//Logout testing
describe('Logout', () => {


    const testUser = {
        username: 'logouttestuser',
        email: 'logouttest@example.com',
        password: 'Testpassword1'
    }
    //Creating a test user before running the tests
    before(async () => {
        await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        })
    })
    //Cleanup test users after tests are done
    after(async () => {
        await deleteUserByEmail(testUser.email)
    })

    //Log in to get a cookie function
    async function loginAndGetCookie() {
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        })
        const setCookieHeader = loginRes.headers.get('set-cookie')
        return setCookieHeader.split(';')[0]
    }

    it('should return 204 when a valid refresh token cookie is provided', async () => {
        const cookie = await loginAndGetCookie()

        const res = await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            headers: {
                'Cookie': cookie
            }
        })
        expect(res.status).to.equal(204)
    })


    it('should invalidate the refresh token so it can no longer be used', async () => {
        const cookie = await loginAndGetCookie()

        await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            headers: {
                'Cookie': cookie
            }
        })

        const refreshRes = await fetch('http://localhost:3000/auth/refresh', {
            method: 'POST',
            headers: {
                'Cookie': cookie
            }
        })
        expect(refreshRes.status).to.equal(401)
    })
})





// Test for account deletion
describe('Account Deletion', () => {

    // Each test creates its own user so the tests can be repeated
    const testUser = {
        username: 'deletetestuser',
        email: 'deletetest@example.com',
        password: 'Testpassword1'
    }

    // Register a fresh test user before each test
    beforeEach(async () => {
        await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        })
    })

    //Delete without a token -> should be rejected (401)
    it('should return 401 when no token is provided', async () => {
        const res = await fetch('http://localhost:3000/auth/account', {
            method: 'DELETE',
        })
        expect(res.status).to.equal(401)
    })

    //Delete with valid token -> should succeed with 200
    it('should delete the account when valid token is provided', async () => {
        // log in to get token
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        })

        const loginData = await loginRes.json()
        // Use the token to delete the account
        const res = await fetch('http://localhost:3000/auth/account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + loginData.token
            }
        })
        expect(res.status).to.equal(200)
    })
})