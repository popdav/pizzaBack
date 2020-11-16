const express = require('express');
const jwt = require("jsonwebtoken")
const jwtKey = "my_secret_key"
const router = express.Router();
const { queryBuilder, getIngerdients, singin } = require('../services/index')

router.get('/hello', (req, res) => {
    res.send('Hello World!')
})

router.post('/addToQueue', (req, res) => {
    const query = req.body
    queryBuilder('produce', query, res);
})

router.post('/checkStatus', (req, res) => {
    const query = req.body
    queryBuilder('query', query, res);
})

router.post('/getAll', (req, res) => {
    queryBuilder('query', {}, res);
})

router.post('/getIngredients', async (req, res) => {
    try{
        const ingredients = await getIngerdients();
        res.send(ingredients);
    }
    catch(e) {
        console.log(e);
        res.status(400).end()
    }
})

router.post('/adminLogin', async (req, res) => {
    try {
        const {username, password} = req.body;
        const token = await singin(username, password);
        if (!token) {
            res.status(401).end()
        } else {
            res.send({token: token});
        }
    }
    catch(e) {
        console.log(e);
        res.status(400).end()
    }
})

router.post('/adminQuery', async (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    let payload;
    try {
        payload = jwt.verify(token, jwtKey);
    }
    catch(e) {
        if (e instanceof jwt.JsonWebTokenError) {
		    res.status(401).end()
		} else {
            res.status(400).end()
        }
    }

    const query = req.body
    queryBuilder('query', query, res);
})

module.exports = router;