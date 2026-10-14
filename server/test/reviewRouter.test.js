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
        expect(data).to.have.lengthOf(0)
    })

    // test that invalid movie id is rejected
    it('should return 400 when movie id is not a valid number', async () => {
        const res = await fetch('http://localhost:3000/reviews/movie/abc')
        const data = await res.json()

        // route should respond with HTTP 400 Bad Request
        expect(res.status).to.equal(400)

        // response should contain an error message
        expect(data).to.have.property('error')
    })
})

