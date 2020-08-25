const UserServices = {

    insertUser(knex, userInfo) {
        return knex
            .insert(userInfo)
            .into('user_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getByUserAndId(knex, id, username) {
        return knex.from('user_table').select('*').where('id', id).where('username', username)

    }
}

module.exports = UserServices;