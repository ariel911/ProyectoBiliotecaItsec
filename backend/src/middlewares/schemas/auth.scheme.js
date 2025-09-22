const Joi = require('joi')

const login = Joi.object({
    correo: Joi.string().email().required(),
    password: Joi.string().optional()
})

module.exports = {
    login
}