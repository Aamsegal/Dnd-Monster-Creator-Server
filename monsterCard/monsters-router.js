const path = require('path');
const express = require('express');
const xss = require('xss');
const MonstersService = require('./monsters-services');
const { serialize } = require('v8');

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
    strengthsave: xss(monster.strengthsave),
    dexteritysave: xss(monster.dexteritysave),
    constitutionsave: xss(monster.constitutionsave),
    inteligencesave: xss(monster.inteligencesave),
    wisdomsave: xss(monster.wisdomsave),
    charismasave: xss(monster.charismasave),
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

    //grabs all monsters
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        MonstersService.getAllMonsters(knexInstance)
            .then(monsters => {
                res.json(monsters.map(serializeMonster))
            })
            .catch(next)
    })

    //adds a monster
    .post(jsonParser, (req, res, next) => {

        const {monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, attackbonus,
        savedc, speed, strength, dexterity, constitution, inteligence, wisdom, charisma, strengthsave, dexteritysave, 
        constitutionsave, inteligencesave, wisdomsave, charismasave,damagevulnerability, damageresistances, damageimmunities,
        senses,creature_language, notes, user_id} = req.body;

        const requriedInfo = {monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, attackbonus,
            savedc, speed, strength, dexterity, constitution, inteligence, wisdom, charisma, strengthsave, dexteritysave, 
            constitutionsave, inteligencesave, wisdomsave, charismasave, user_id};

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
    .route('/:id')
    
    //Grabs all monster with id X
    .all((req, res, next) => {
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
                res.monster = monster
                next()
            })
            .catch(next)
    })

    //returns the monsters with the id
    .get((req, res, next) => {
        res.json(serializeMonster(res.monster))
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

    .patch(jsonParser, (req, res, next) => {
        const {monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, attackbonus,
            savedc, strength, dexterity, constitution, inteligence, wisdom, charisma, strengthsave, dexteritysave, 
            constitutionsave, inteligencesave, wisdomsave, charismasave, user_id} = req.body;
            
        const updatedMonster = {monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, attackbonus,
            savedc, strength, dexterity, constitution, inteligence, wisdom, charisma, strengthsave, dexteritysave, 
            constitutionsave, inteligencesave, wisdomsave, charismasave, user_id};
        
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
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
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