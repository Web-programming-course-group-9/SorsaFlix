import { expect } from 'chai'

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
                'Authorization': 'Bearer '+ loginData.token }
        })
        expect(res.status).to.equal(200)
    })
})