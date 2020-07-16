const path = require('path');
const express = require('express');
const xss = require('xss');
const MonsterMovesService = require('./monsterMoves-services');
const { serialize } = require('v8');

const movesRouter = express.Router();
const jsonParser = express.json();

const serializeMoves = moves =>({
    id: moves.id,
    action_name: xss(moves.action_name),
    action_details: xss(moves.action_details),
    style: xss(moves.style),
    monster_id: xss(moves.monster_id),
})

movesRouter
    .route('/')

    .post(jsonParser, (req, res, next) => {
        //accesses all the values in the body that match
        const { action_name, action_details, style, monster_id } = req.body;

        //saves those values to newMove
        const newMove = { action_name, action_details, style, monster_id };

        //checks if any values are null
        for(const [key, value] of Object.entries(newMove))
            if(value == null)
                return res.status(400).json({
                    error: {message: `Missing '${key} in request body'`}
                })

        //Checks if style is = to one one of the style data values        
        if(newMove.style === 'Action' || newMove.style === 'Reaction' || newMove.style == 'Skill') {
            console.log(newMove)
        } else {
            console.log(newMove.style)
            return res.status(400).json({
                error: {message: 'Please make sure the action style is either, Action, Reaction or Skill'}
            })
        }

        MonsterMovesService.insertMove(
            req.app.get('db'),
            newMove
        )
            .then(move => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${move.id}`))
                    .json(serializeMoves(move))
            })
            .catch(next)
    })
module.exports = movesRouter;