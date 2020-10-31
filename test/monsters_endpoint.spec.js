const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const { v4: uuidv4 } = require('uuid');

const app = require('../src/app');


describe('Monster + MonsterMoves Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })


    const monsterId = uuidv4();

    context('Given this new monster information', () => {

        const testMonster = {
            id: monsterId, monster_name: 'Monster Name X', monster_type: 'Gnome', 
            challenge_rating: '10', proficiencybonus: 10, armorclass: '20', hitpoints: 150, 
            speed: '30 ft', attackbonus: 5, savedc: 7, strength: 18, dexterity: 16, 
            constitution: 14, inteligence: 12, wisdom: 10, charisma: 8, damagevulnerability: 'None', 
            damageresistances: 'all', damageimmunities: 'some', senses: 'vision', 
            creature_language: 'common', notes: 'notes go here', user_id: 1
        };

        /*
        beforeEach('insert user', () => {
            return db
                .into('user_table')
                .insert(testUser)
        })
        */
    
        it('Post /api/monster responds with 201 and the monster just sent', () => {
            return supertest(app)
                .post('/api/monsters')
                .send(testMonster)
                .expect(201, {
                    armorclass: '20', attackbonus: '5', challenge_rating: '10', charisma: '8', constitution: '14', dexterity: '16',  hitpoints: '150', id: monsterId, immunities: 'some',
                    inteligence: '12', language: 'common', monster_name: 'Monster Name X', monster_type: 'Gnome', notes: 'notes go here', savedc: '7', senses: 'vision',
                    proficiencybonus: '10', resistance: 'all', speed: '30 ft', strength: '18', user_id: '1', vulnerability: 'None', wisdom: '10'
                })
        })

        it('Get /monsters responds with 202 and the monster info', () => {
            return supertest(app)
                .get(`/api/monsters/userId/${1}`)
                .expect(200, [{
                    id: monsterId, monster_name: 'Monster Name X', monster_type: 'Gnome', 
                    challenge_rating: '10', proficiencybonus: '10', armorclass: '20', hitpoints: '150', 
                    attackbonus: '5', speed: '30 ft', savedc: '7', strength: '18', dexterity: '16', 
                    constitution: '14', inteligence: '12', wisdom: '10', charisma: '8', vulnerability: 'None', 
                    resistance: 'all', immunities: 'some', senses: 'vision', 
                    language: 'common', notes: 'notes go here', user_id: '1'
                }])
        })
        
    })

    context('Monster Move endpoint testing', () => {
        
        const move1Id = uuidv4();
        const move2Id = uuidv4();
        
        const moveList = [

            {
            id: move1Id, action_name: 'Attack 1', action_details: 'Attack 1 Details',
            damage_dice: '4d4', style: 'Action', monster_id: monsterId
            },

            {
            id: move2Id, action_name: 'Reaction 1', action_details: 'Reaction 1 Details', 
            damage_dice: '6d6', style: 'Reaction', monster_id: monsterId
            }
        ]

        for(i=0; moveList.length > i; i++) {
            const currentMove = moveList[i]
            it(`Post /api/monsterMoves Adds the ${i}th move to monster with id 1`, () => {
                return supertest(app)
                    .post('/api/monsterMoves')
                    .send(currentMove)
                    .expect(201, 
                        {
                            id: currentMove.id, action_name: currentMove.action_name, action_details: currentMove.action_details,
                            damage_dice: currentMove.damage_dice, style: currentMove.style, monster_id: monsterId
                        }
                    )
            })
        }

        it('GET /api/monsterMoves/specificMonster/:monster_id', () => {
            return supertest(app)
                .get(`/api/monsterMoves/specificMonster/${monsterId}`)
                .expect(200, [
                    {
                        id: move1Id, action_name: 'Attack 1', action_details: 'Attack 1 Details',
                        damage_dice: '4d4', style: 'Action', monster_id: monsterId
                    },
            
                    {
                        id: move2Id, action_name: 'Reaction 1', action_details: 'Reaction 1 Details', 
                        damage_dice: '6d6', style: 'Reaction', monster_id: monsterId
                    }
                ])
        })

        
        for(i=0; moveList.length > i; i++) {
            const currentMoveName = moveList[i].action_name;
            const currentMoveId = moveList[i].id;
            it(`DELETE /api/monsterMoves/:move_id will delete ${currentMoveName}`, () => { 
                return supertest(app)
                    .delete(`/api/monsterMoves/${currentMoveId}`)
                    .expect(204, '')
            })
        }
    })

    context('Deleting the monster', () => {

        it('Delete /monsters responds with 204 and deletes the monster', () => {
            return supertest(app)
                .delete(`/api/monsters/monsterId/${monsterId}`)
                .expect(204, '')
        })

    })

})