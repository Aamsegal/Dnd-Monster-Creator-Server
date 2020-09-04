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

    getByUserAndId(knex,  username, userpass) {
        return knex.from('user_table').select('*').where('username', username).where('userpass', userpass)

    }
}

module.exports = UserServices;