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
	  .withMessage(`|${field}| must be a valid JSON string`);

export {
	integer,
	integerRange,
	uuid,
	varChar,
	bigInt,
	latitudeRange,
	longitudeRange,
	json
}