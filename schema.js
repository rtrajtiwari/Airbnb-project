const Joi = require('joi');
const review = require('./models/review');

const schema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().uri().required()  
        }).required(), 
        price: Joi.number().required(),
        country: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});


const reviewschema = Joi.object({
    review : Joi.object({
         comment : Joi.string().required(),
         rating : Joi.number().required().min(1).max(5)
    }).required()
});

module.exports = { schema, reviewschema }; 

