const MonsterMovesService = {
    //grabs moves by monster id and action type
    getAllMoves(knex) {
        return knex.select('*').from('monster_moves')
    },

    getMoveByMonsterId(knex, monster_id) {
        return knex.select('*').from('monster_moves').where('monster_id', monster_id)
    },

    getMoveByMonsterIdAndActionType(knex, monster_id, style) {
        return knex.select('*').from('monster_moves').where('monster_id', monster_id).where('style', style)
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