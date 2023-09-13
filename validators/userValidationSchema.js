const Joi = require('@hapi/joi');

const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  mobileNo: Joi.string().regex(/^[6-9]([0-9]){9}$/).required(),
  gender: Joi.string().valid('Female', 'Male'),
  isHosteler: Joi.boolean(),
  isVerified: Joi.boolean(),
  name: Joi.string().regex(/^[a-zA-Z]+(?: [a-zA-Z.]+){0,2}$/).required(),
  studentNo: Joi.string().pattern(/^[2][12](([x]{3})|[0-9]{2,3})([0-9]){3}(-d)?$/).required(),
  branch: Joi.string().valid('IT', 'CSE', 'CSE-AIML', 'AIML', 'CS', 'EN', 'ECE', 'ME', 'CSE-DS', 'CSIT', 'CE','CSE-HINDI'),
  responses: Joi.array().items(Joi.string()),
  password: Joi.string().min(6).required(),
  logintime: Joi.number(),
  isRelogin: Joi.boolean(),
  isSubmit: Joi.boolean(),
  category: Joi.string(),
  score: Joi.number(),
}).prefs({ convert: false }); 

module.exports = userValidationSchema;
