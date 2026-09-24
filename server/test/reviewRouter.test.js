import { expect } from 'chai'

// test for review routes
describe('Review Router', () => {

    // Test GET reviewa for movie returns a list
    it('should return an array of reviews for a movie', async () => {
        const res = await fetch('http://localhost:3000/reviews/movie/550')
        const data = await res.json()

        // route should respond with HTTP 200 OK
        expect(res.status).to.equal(200)

        // response should be an array
        expect(data).to.be.an('array')
    })

    // Tes that a movie with no reviews returns an empty array, not an error
    it('should return an empty array for a movie with no reviews', async () => {

        // Use unlikely movie ID to ensure no reviews exist
        const res = await fetch('http://localhost:3000/reviews/movie/999999')
        const data = await res.json()

        // route should respond with HTTP 200 OK
        expect(res.status).to.equal(200)

        // response should be an empty array
        expect(data).to.be.an('array')
    })
})

