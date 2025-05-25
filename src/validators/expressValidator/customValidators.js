import { check } from 'express-validator'

const varChar = (field, { max = 255 } = {}) => check(field).isString().trim().isLength({ min: 1, max }).withMessage(`|${field}| must be a string with a length between 1 and ${max}`)
const integer = field => check(field).isInt({min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER}).withMessage(`|${field}| must be an integer`)
const integerRange = (field, { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) => check(field).isInt({min, max}).withMessage(`|${field}| must be an integer between ${min} and ${max}`)
const uuid = field => check(field).isUUID('all').withMessage(`|${field}| must be a valid UUID`)
const bigInt = field => check(field).isBigInt().withMessage(`|${field}| must be a valid BigInt`)
const longitudeRange = (field, { min = -180, max = 180 } = {}) => 
	check(field)
	  .isFloat({ min, max })
	  .withMessage(`|${field}| must be a number between ${min} and ${max}`)
  
const latitudeRange = (field, { min = -90, max = 90 } = {}) => 
	check(field)
	  .isFloat({ min, max })
	  .withMessage(`|${field}| must be a number between ${min} and ${max}`)

const json = (field) => 
	check(field)
	  .isJSON()
	  .withMessage(`|${field}| must be a valid JSON string`)

const isUUID = str => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)

const arrayOf = (field, validator, errorMessage) => {	  return check(field).isArray().withMessage(`|${field}| must be an array`)		  .custom(arr => arr.every(validator))		  .withMessage(errorMessage || `|${field}| contains invalid items`);
};

const validators = {	  
	string: item => typeof item === 'string',	  
	number: item => typeof item === 'number',	  
	boolean: item => typeof item === 'boolean',	  
	uuid: item => typeof item === 'string' && isUUID(item),	  
	email: item => typeof item === 'string' && /\S+@\S+\.\S+/.test(item),	  
	url: item => typeof item === 'string' && /^https?:\/\/.+/.test(item),	  
	positive: item => typeof item === 'number' && item > 0,	  
	nonEmpty: item => typeof item === 'string' && item.trim().length > 0
};	 

export {
	integer,
	integerRange,
	uuid,
	varChar,
	bigInt,
	latitudeRange,
	longitudeRange,
	json,
	validators,
	arrayOf
}