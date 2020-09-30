const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const { v4: uuidv4 } = require('uuid');

const app = require('../src/app');

describe('User endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    //after('disconnect from db', () => db.destroy())

    //before('clean the table', () => db('user_table').truncate())

    context('Given this new user information', () => {
        const uniqueId = uuidv4();

        const testUser = {
            username: 'testUser_1',
            userpass: 'testPassword_1',
            userId: uniqueId
        };

        /*
        beforeEach('insert user', () => {
            return db
                .into('user_table')
                .insert(testUser)
        })
        */

        it('Post /users responds with 201 and all of the users', () => {
            return supertest(app)
                .post('/api/users')
                .send(testUser)
                .expect(201)
        })
    })

    context('Loging in with a user', () => {
        const testUserLogin = {
            username: 'testUser_1',
            userpass: 'testPassword_1'
        };

        /*
        beforeEach('insert user', () => {
            return db
                .into('user_table')
                .insert(testUser)
        })
        */

        it('Get /users responds with 201 and all of the users', () => {
            return supertest(app)
                .get(`/api/users/${testUserLogin.username}/${testUserLogin.userpass}`)
                .expect(200)
        })
    })
})