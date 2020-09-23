const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../src/app');

/*const knex = require('knex');
const startingPointServices = require('../startingPoint/startingPoint-services')
const startingPointResults = require('./apiResults/startingPointGet')*/

//General Tests to make sure the base server is working
describe('App', () => {
    it('GET / responds within 200 containing "Dnd monster creator server is running!"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Dnd monster creator server is running!')
    })
})

describe('Starting Point', () => {
    it('Get /api/monsterStartingPoint/testingRouterTest. This is to make sure we can test routers', () => {
        return supertest(app)
            .get('/api/monsterStartingPoint/testingRouterTest')
            .expect(200, 'The test endpoint works!')
    })
})

/*describe('GET starting point info', () => {

    try{
        it('Grabs the data from the starting point endpoint', () => {
        return supertest(app)
            .get('/api/monsterStartingPoint')
            .expect(200, 'Object here')
        })
    }
    catch(error) {
        console.log(error)
    }

})*/

/*
describe('Create new user', () => {
    //const knexInstance = req.app.get('db')

    let data = {
        "username": "Aaron",
        "userpass": "1234567890"
    }

    it('POST new user and password in the table', () => {
        return supertest(app)
            .post('/api/users')
            .send(data)
            .expect(201, 'test')
    })
})
*/

/*Starting Point tests
describe('Starting Point Service Object', () => {
    let db;

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env_TEST_DATABASE_URL
        })
    })


describe('GET Starting Point', () => {
    it('Get /api/monsterStartingPoint response with 200 and contains the list of starting points by CR', () => {
        return startingPointServices.getAllCombatRating()
            .then(actual => {
                expect(actual).to.eql(startingPointResults)
            })
    })
})
    
})*/