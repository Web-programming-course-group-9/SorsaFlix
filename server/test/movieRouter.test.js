import { expect } from 'chai';

// Test for the movie routes
describe('Movie Routes', () => {
    // test that the GET /movies route returns a list of movies
    it('should return now-playing movies', async () => {
        const res = await fetch('http://localhost:3000/movies/now-playing');
        const data = await res.json();

        //The route should respond with HTTP 200 (success)
        expect(res.status).to.equal(200);
        //The response should be an array of movies
        expect(data).to.be.an('array');
    });
});