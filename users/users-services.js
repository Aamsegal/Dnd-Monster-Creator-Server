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

    getByUserAndId(knex, password, username) {
        return knex.from('user_table').select('*').where('username', username).where('password', password)

    }
}

module.exports = UserServices;