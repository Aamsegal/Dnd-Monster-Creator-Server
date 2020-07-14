const path = require('path');
const express = require('express');
const xss = require('xss');
const MonstersService = require('./monsters-services');
const { serialize } = require('v8');

const monstersRouter = express.Router();
const jsonParser = express.json();

const serializeMonster = monster => ({
    id: monster.id,
    monster_name: monster.monster_name,
    monster_type: monster.monster_type,
    challenge_rating: monster.challenge_rating,
    proficiencybonus: monster.proficiencybonus,
    armorclass: monster.armorclass,
    hitpoints: monster.hitpoints,
    attackbonus: monster.attackbonus,
    savedc: monster.savedc,
    strength: monster.strength,
    dexterity: monster.dexterity,
    constitution: monster.constitution,
    inteligence: monster.inteligence,
    wisdom: monster.wisdom,
    charisma: monster.charisma,
    strengthsave: monster.strengthsave,
    dexteritysave: monster.dexteritysave,
    constitutionsave: monster.constitutionsave,
    inteligencesave: monster.inteligencesave,
    wisdomsave: monster.wisdomsave,
    charismasave: monster.charismasave,
    vulnerability: monster.damagevulnerability,
    resistance: monster.damageresistance,
    immunities: monster.damageimmunities,
    senses: monster.senses,
    language: monster.creature_language,
    user_id: monster.user_id,
})

monstersRouter
    .route('/')

    //grabs all monsters
    .get((req, res, next) => {
        console.log('base route works')
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
        savedc, strength, dexterity, constitution, inteligence, wisdom, charisma, strengthsave, dexteritysave, 
        constitutionsave, inteligencesave, wisdomsave, charismasave, user_id} = req.body;
        
        const newMonster = {monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, attackbonus,
            savedc, strength, dexterity, constitution, inteligence, wisdom, charisma, strengthsave, dexteritysave, 
            constitutionsave, inteligencesave, wisdomsave, charismasave, user_id};

        for(const [key, value] of Object.entries(newMonster))
            if(value == null)
                return res.status(400).json({
                    error: {message: `Missing '${key} in request body`}
                })

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

module.exports = monstersRouter;