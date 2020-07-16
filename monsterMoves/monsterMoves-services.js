const MonsterMovesService = {
    //grabs moves by monster id and action type
    getMoveByMonsterIdAndActionType(knex) {
        return knex.select('*').from('monster_moves').where('monster_id').and('action_type', action_type)
    },
    
    //creates a new move
    insertMove(knex, newMove) {
        return knex
            .insert(newMove)
            .into('monster_moves')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    //deletes a move
    deleteMove(knex, id){
        return knex('monster_moves')
            .where({id})
            .delete()
    },

    //Updats a move
    updateMoves(knex, id, updateMoves) {
        return knex('monster_moves')
            .where({id})
            .update(updateMoves)
    }
}

module.exports = MonsterMovesService;