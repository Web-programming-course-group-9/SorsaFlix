import { expect } from 'chai'
import { pool } from "../db/index.js"


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
    after(async() => {
        await deleteUserByEmail(testUser.email)
        //await deleteUserByEmail('weakpassword@example.com')
        //await deleteUserByEmail('missingfields@example.com')
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