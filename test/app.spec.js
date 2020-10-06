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