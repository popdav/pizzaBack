const jwt = require("jsonwebtoken")
const jwtKey = "my_secret_key"
const jwtExpirySeconds = 300

const Producer = require('../producer/index')
const ingrediantModel = require('../models/ingredients').Ingredient
const memberModel = require('../models/member').Member
const ingredients = require('../ingredients.json');

const queryBuilder = (type, query, res) => {
    let newQuery = {
        type: type,
        data: JSON.stringify(query)
    }
    let producer = new Producer();
    producer.sendQuery(newQuery, res);
}

const insertIngredient = async () => {
    const res = await ingrediantModel.find();
    if(res.length === 0)
        ingrediantModel.insertMany(ingredients);
} 

const getIngerdients = async () => {
    return await ingrediantModel.find();
}

const insertAdmin = async () => {
    const res = await memberModel.find()
    if (res.length === 0)
        memberModel.insertMany([{member: 'admin', code: 'admin'}])
}

const singin = async (username, password) => {
    const user = await memberModel.findOne({member: username});
    if (user.code !== password || user === undefined || user === null) {
        return false;
    }
    
    const token = jwt.sign({ username }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    });
    return token;
}

module.exports = {queryBuilder, insertIngredient, getIngerdients, singin, insertAdmin};