import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mysql from '../adapters/mysql.js';
import { errorHandler } from '../utils/errors.js';
import { getEndpointsModel } from '../models/authorization/endpointsModel.js';
import { noResults } from '../validators/result-validators.js';
import { error404, error403 } from '../utils/errors.js';

dotenv.config();

/**
 * Decodes and verifies a JWT token.
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<Object>} - Resolves with the decoded token payload.
*/
const getDataFromToken = (token, expectedType = 'access') => {
  return new Promise((resolve, reject) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else if (decoded.type !== expectedType) {
        const err = error403()
        const error = errorHandler(err)
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
};

/**
 * Generates a new JWT token.
 * @param {Object} payload - The payload to include in the token.
 * @returns {string} - The generated JWT token.
*/
const generateAccessToken = (payload) => {
  const contents = { ...payload, type: 'access' };
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_TIME = parseInt(process.env.JWT_TIME, 10);
  return jwt.sign(contents, JWT_SECRET, JWT_TIME ? { expiresIn: JWT_TIME } : {});
};

const generateRefreshToken = (payload) => {
  const contents = { ...payload, type: 'refresh' };
  const JWT_SECRET = process.env.JWT_SECRET
  const JWT_TIME = parseInt(process.env.JWT_REFRESH_TIME, 10);
  return jwt.sign(contents, JWT_SECRET, JWT_TIME ? { expiresIn: JWT_TIME } : {});
}

const generateTokens = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
}

/**
 * Checks if a user has permission to perform an action on a resource.
 * @param {string} userId - The ID of the user.
 * @param {string} action - The action to check (e.g., GET, POST, PUT, DELETE).
 * @param {string} endpoin - The endpoint of the attack
 * @param {Array} userPermissions - The list of permissions assigned to the user.
 * @returns {Promise<Object>} - Resolves with an object containing permission details.
 */
const checkPermission = (action, endpoint, userPermissions, config) => {
  return _getEndpointByRoute(endpoint, config) 
    .then((endpointInfo) => {
      const hasPermission = userPermissions.some(
        (permission) =>
          permission.permission_action === action &&
          permission.permission_endpoint === endpointInfo.id // Comparar con el ID del endpoint
      );

      if (hasPermission) {
        return { hasPermission: true };
      }
      return { hasPermission: false };
    })
};

const _getEndpointByRoute = (route, config) => {
  const conn = mysql.start(config)
  return getEndpointsModel({ route, conn }) 
    .then((endpointInformation) => {
      return endpointInformation[0]
    })
    .finally(() => {
      mysql.end(conn)
    })
}

export {
  getDataFromToken,
  generateTokens,
  checkPermission,
};