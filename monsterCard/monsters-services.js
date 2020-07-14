const MonstersService = {
    //Grabs all monsters
    getAllMonsters(knex) {
        return knex.select('*').from('monsters')
    },

    //grabs monsters with id X
    getById(knex, id) {
        return knex.from('monsters').select('*').where('id', id).first()
    },

    //gets monsters with user_id x
    getAllByUserId(knex, user_id) {
        return knex.select('*').from('monsters').where('user_id', user_id)
    },

    //add a monster to monster table
    insertMonster(knex, newMonster) {
        return knex
            .insert(newMonster)
            .into('monsters')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    //deletes a monster and because of cascading in the database, all thing associated will also be deleted
    deleteMonster(knex, id){
        return knex('monsters')
            .where({id})
            .delete()
    },

    updateMonster(knex, id, updatedMonster) {
        return knex('monsters')
            .where({id})
            .update(updatedMonster)
    },
}

module.exports = MonstersService