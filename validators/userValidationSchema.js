const Joi = require('@hapi/joi');

const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  mobileNo: Joi.string().regex(/^[6-9]([0-9]){9}$/).required(),
  gender: Joi.string().valid('Female', 'Male'),
  isHosteler: Joi.boolean(),
  isVerified: Joi.boolean(),
  name: Joi.string().regex(/^[a-zA-Z]+(?: [a-zA-Z.]+){0,2}$/).required(),
  studentNo: Joi.string().pattern(/^(22[1-3]\d{6}|2215\d{5})-?d?$/).required(),
  branch: Joi.string().valid('IT', 'CSE', 'CSEAIML', 'AIML', 'CS', 'EN', 'ECE', 'MECHANICAL', 'CSEDS', 'CSIT', 'CIVIL'),
  responses: Joi.array().items(Joi.string()),
  password: Joi.string().min(6).required(),
  logintime: Joi.number(),
  isRelogin: Joi.boolean(),
  isSubmit: Joi.boolean(),
  category: Joi.string(),
  score: Joi.number(),
}).prefs({ convert: false }); 

module.exports = userValidationSchema;
