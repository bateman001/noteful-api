const knex = require('knex')
const app = require('../src/app')
const { makeFoldersArray } = require('./folders.fixtures')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Folders endpoints', () => {
    let db
    before('Make knex', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })

        app.set(db, 'db')
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('folders').truncate())
  
    afterEach('cleanup', () => db.raw('TRUNCATE folder, notes RESTART IDENTITY CASCADE'))

    describe('GET /folders', () => {
        context('Given there are no article', () => {
            it('responds with 200 and empty list', () => {
                return supertest(app)
                    .get('/api/folders')
                    .expect(200, [])
            })
        })
    })
  })
