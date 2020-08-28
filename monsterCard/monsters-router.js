const path = require('path');
const express = require('express');
const xss = require('xss');
const MonstersService = require('./monsters-services');
const { serialize } = require('v8');
const app = require('../src/app');

const monstersRouter = express.Router();
const jsonParser = express.json();

const serializeMonster = monster => ({
    id: monster.id,
    monster_name: xss(monster.monster_name),
    monster_type: xss(monster.monster_type),
    challenge_rating: xss(monster.challenge_rating),
    proficiencybonus: xss(monster.proficiencybonus),
    armorclass: xss(monster.armorclass),
    hitpoints: xss(monster.hitpoints),
    attackbonus: xss(monster.attackbonus),
    speed: xss(monster.speed),
    savedc: xss(monster.savedc),
    strength: xss(monster.strength),
    dexterity: xss(monster.dexterity),
    constitution: xss(monster.constitution),
    inteligence: xss(monster.inteligence),
    wisdom: xss(monster.wisdom),
    charisma: xss(monster.charisma),
    vulnerability: xss(monster.damagevulnerability),
    resistance: xss(monster.damageresistances),
    immunities: xss(monster.damageimmunities),
    senses: xss(monster.senses),
    language: xss(monster.creature_language),
    notes: xss(monster.notes),
    user_id: xss(monster.user_id),
})

monstersRouter
    .route('/')

    //adds a monster
    .post(jsonParser, (req, res, next) => {
        const {id, monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, speed, attackbonus,
        savedc, strength, dexterity, constitution, inteligence, wisdom, charisma, damagevulnerability, damageresistances, damageimmunities,
        senses, creature_language, notes, user_id} = req.body;

        const requriedInfo = {id, monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, attackbonus,
            savedc, speed, strength, dexterity, constitution, inteligence, wisdom, charisma, user_id};

        const notRequiredInfo = {damagevulnerability, damageresistances, damageimmunities, senses, creature_language, notes}

        for(const [key, value] of Object.entries(requriedInfo)) {
            if(value === '')
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
        }
        
        let newMonster = {
            ...requriedInfo,
            ...notRequiredInfo
        }

        MonstersService.insertMonster(
            req.app.get('db'),
            newMonster
        )
            .then(monster => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${monster.id}`))
                    .json(serializeMonster(monster))
            })
            .catch(next)
    })


monstersRouter
    .route('/monsterId/:id')

    //returns the monster with the id
    .get((req, res, next) => {

        MonstersService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(monster => {
                if(!monster) {
                    return res.status(404).json({
                        error: {message: `Monster doesnt exist`}
                    })
                }

                res.json(serializeMonster(res.monster))

                next()
            })
            
            .catch(next)
            
    })

    //deletes the monster data that matches the id
    .delete((req, res, next) => {
        MonstersService.deleteMonster(
            req.app.get('db'),
            req.params.id
        )   
            
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

    //  Attepts to patch the monster id. If it doesnt exist it routes to a post request
    .patch(jsonParser, (req, res, next) => {
        const   {id, monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, speed, attackbonus, savedc,
                    strength, dexterity, constitution, inteligence, wisdom, charisma,  damagevulnerability, damageresistances, 
                    damageimmunities, senses, creature_language, notes
                } = req.body;
            
        const updatedMonster = {id, monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, speed, attackbonus, savedc,
                    strength, dexterity, constitution, inteligence, wisdom, charisma, damagevulnerability, damageresistances, damageimmunities, 
                    senses, creature_language, notes};
        
        const numberOfValues = Object.values(updatedMonster).filter(Boolean).length
        if(numberOfValues === 0)
            return res.status(400).json({
                error: { message: `Request body must contain new monster information`}
            })

        
        MonstersService.updateMonster(
            req.app.get('db'),
            req.params.id,
            updatedMonster
        )

            .then(monster => {
                if(!monster) {
                    const {id, monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, speed, attackbonus,
                        savedc, strength, dexterity, constitution, inteligence, wisdom, charisma, damagevulnerability, damageresistances, damageimmunities,
                        senses, creature_language, notes, user_id} = req.body;
                
                        const requriedInfo = {id, monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, attackbonus,
                            savedc, speed, strength, dexterity, constitution, inteligence, wisdom, charisma, user_id};
                
                        const notRequiredInfo = {damagevulnerability, damageresistances, damageimmunities, senses, creature_language, notes}
                
                        for(const [key, value] of Object.entries(requriedInfo)) {
                            if(value === '')
                                return res.status(400).json({
                                    error: {message: `Missing '${key}' in request body`}
                                })
                        }
                        
                        let newMonster = {
                            ...requriedInfo,
                            ...notRequiredInfo
                        }
                
                        MonstersService.insertMonster(
                            req.app.get('db'),
                            newMonster
                        )
                            .then(monster => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${monster.id}`))
                                    .json(serializeMonster(monster))
                            })
                            .catch(next)

                } else {
                    res
                        .status(204).end()

                    next()
                }

                
            })  
            
            .catch(error => {
                console.error({error})
            })
        
        
    })

monstersRouter
    .route('/userId/:user_id')

    //Grabs all the monsters with the correct user id
    .get((req, res, next) => {
        MonstersService.getAllByUserId(
            req.app.get('db'),
            req.params.user_id
        )
            .then( monster => {
                if(monster === []) {
                    return res.statsus(404).json({
                        error: {message: `User id does not have any monsters`}
                    })
                } else{
                    res.json(monster.map(serializeMonster))
                }
                
            })
            .catch(next)  
    })
    //Currently the if statement never gets called

module.exports = monstersRouter;