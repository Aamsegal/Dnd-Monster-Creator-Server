const StartingPointService = {
    getAllCombatRating(knex) {
        return knex.select('*').from('monster_starting_point')
    }
}

module.exports = StartingPointService