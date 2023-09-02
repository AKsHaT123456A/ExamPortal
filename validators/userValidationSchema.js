const Joi = require('@hapi/joi');

const userValidationSchema = Joi.object({
  email: Joi.string().regex(/^([a-zA-Z]){2,15}[2][12](([x]{3})|[0-9]{2,3})([0-9]){3}(-d)?@akgec.ac.in$/).required(),
  mobileNo: Joi.string().regex(/^[6-9]([0-9]){9}$/).required(),
  gender: Joi.string(),
  isHosteler: Joi.boolean(),
  isVerfied: Joi.boolean(),
  name: Joi.string().regex(/^[a-zA-Z]{2,15}(\s[a-zA-Z.]{1,10})?(\s[a-zA-Z]{2,10})?(\s[a-zA-Z]{2,10})?$/).required(),
  studentNo: Joi.string().pattern(/^[2][12](([x]{3})|[0-9]{2,3})([0-9]){3}(-d)?$/).required(),
  branch: Joi.string(),
  responses: Joi.string(), 
  score: Joi.number(),
});

module.exports = userValidationSchema;