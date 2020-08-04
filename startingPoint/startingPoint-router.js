const path = require('path')
const express = require('express')
const xss = require('xss')
const StartingPointServices = require('./startingPoint-services')

const startingPointRouter = express.Router();
const jsonParser = express.json();

/*const serializeStartingPoint = startingPoint => ({
    combat_rating: startingPoint.combat_rating,
    proficiencyBonus: startingPoint.combat_rating,
    armorClassSuggestion: startingPoint.armorClassSuggestion,
    armorClassStartingPoint: startingPoint.armorClassStartingPoint,
    hitPointsSuggestion: startingPoint.hitPointsSuggestion,
    hitPointsMin: startingPoint.hitPointsMin,
    hitPointsMax: startingPoint.hitPointsMix,
    attackBonusSuggestion: startingPoint.attackBonusSuggestion,
    attackBonus: startingPoint.attackBonus,
    damagePerRoundSuggestion: startingPoint.damagePerRoundSuggestion,
    saveDcSuggestion: startingPoint.saveDcSuggestion,
    saveDc: startingPoint.saveDc
})*/

startingPointRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        StartingPointServices.getAllCombatRating(knexInstance)
            .then(startingPoints => {
                res.json(startingPoints)
            })
            .catch(next)
    })

module.exports = startingPointRouter;