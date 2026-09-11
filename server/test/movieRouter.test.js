import { expect } from 'chai'

// Test for the movie routes
describe('Movie Routes', () => {
    // test that the GET /movies route returns a list of movies
    it('should return now-playing movies', async () => {
        const res = await fetch('http://localhost:3000/movies/now-playing')
        const data = await res.json()

        //The route should respond with HTTP 200 (success)
        expect(res.status).to.equal(200)
        //The response should be an array of movies
        expect(data).to.be.an('array')
    })

    //Test GET to search movies by title where query is given correctly. Using "terminator" as test query.
    it('should return search result when query is provided', async () => {
        const res = await fetch('http://localhost:3000/movies/search?query=terminator')
        const data = await res.json()

        //The route should respond with HTTP 200 (success)
        expect(res.status).to.equal(200)
        //The response should be an array of movies
        expect(data).to.be.an('array')
    })
    //Test movie search with missing query parameter
    it('should return 400 when query parameter is missing', async () => {
        const res = await fetch('http://localhost:3000/movies/search')
        const data = await res.json()

        //No query parameter means that the request is invalid, should respond with status code 400
        expect(res.status).to.equal(400)
        //The error response should contain an error message
        expect(data).to.have.property('error')
    })
})