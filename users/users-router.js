const path = require('path');
const express = require('express');
const xss = require('xss');
const UserServices = require('./users-services');

const userRouter = express.Router();
const jsonParser = express.json();

const serializeUser = userInfo => ({
    id: userInfo.id,
    username: xss(userInfo.username)
})

userRouter
    .route('/')

    .post(jsonParser, (req, res, next) => {
        const { username, password } = req.body;

        const newUser = { username, password };

        UserServices.insertUser(
            req.app.get('db'),
            newUser
        )

        .then(user => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(serializeUser(user))
        })

        .catch(next)
    })

userRouter
    .route('/:username/:password')

    .get((req, res, next) => {
        UserServices.getByUserAndId(
            req.app.get('db'),
            req.params.username,
            req.params.password
        )

        .then(user => {
            res.json(user)
        })
        .catch(next)
    })

module.exports = userRouter;