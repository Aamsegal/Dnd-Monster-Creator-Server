const path = require('path');
const express = require('express');
const xss = require('xss');
const MonsterMovesService = require('./monsterMoves-services');
const { serialize } = require('v8');
const { route } = require('../src/app');

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

movesRouter
    .route('/:move_id')

    //deletes the move with that id
    .delete((req, res, next) => {
        MonsterMovesService.deleteMove(
            req.app.get('db'),
            req.params.move_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

    .patch(jsonParser, (req, res, next) => {
        const { action_name, action_details, style, monster_id } = req.body;
        const updatedMove = { action_name, action_details, style, monster_id};

        const numberOfValues = Object.values(updatedMove).filter(Boolean).length
        if( numberOfValues === 0)
            return res.status(400).json({
                error: {message: `Body requies one of the following. action_name, action_details, style, monster_id`}
            })

        MonsterMovesService.updateMoves(
            req.app.get('db'),
            req.params.move_id,
            updatedMove
        )
            .then(numRowAffected => {
                res.status(204).end()
            })
            .catch(next)
    })



movesRouter
    .route('/specificMoves/:monster_id/:style')

    .get((req, res, next) => {
        MonsterMovesService.getMoveByMonsterIdAndActionType(
            req.app.get('db'),
            req.params.monster_id,
            req.params.style
        )
            .then(moves => {
                res.json(moves.map(serializeMoves))
            })
            .catch(next)
    })


module.exports = movesRouter;