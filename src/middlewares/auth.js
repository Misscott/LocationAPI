import { sendResponseAccessDenied, sendResponseUnauthorized, sendResponseNotFound } from '../utils/responses.js';
import { checkPermission, getDataFromToken, generateTokens} from '../services/authService.js';
import { getRolesHasPermissionsModel } from '../models/authorization/roles_has_permissionsModel.js';
import { error404, errorHandler } from '../utils/errors.js';
import { noResults } from '../validators/result-validators.js';
import mysql from '../adapters/mysql.js';

const obtainToken = (req, res) => {
    return new Promise((resolve, reject) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            resolve(token);
        } else {
            return sendResponseUnauthorized(res, { message: 'No authorization provided. Access token required' })
        }
    });
};

const setToken = (result, req, res, next, config) => {
	const { uuid, role } = result._data
    const payload = {role, user: uuid}
	const {accessToken, refreshToken} = generateTokens(payload)
	next({ user: { ...result, accessToken, refreshToken} })
}

const authenticateToken = (req, res, next) => {
    obtainToken(req, res)
        .then((token) => getDataFromToken(token))
        .then((decoded) => {
            req.auth = decoded;
            next();
        })
        .catch((error) => {
            return sendResponseUnauthorized(res, error);
        });
};

const refreshAuthenticate = (req, res, next) => {
    const token = req.body.refreshToken
    getDataFromToken(token)
        .then((decoded) => {
            req.auth = decoded;
            next();
        })
        .catch((error) => {
            return sendResponseUnauthorized(res, error);
        });
  }

const authorizePermission = (endpoint) => {
    return (req, res, next, config) => {
        obtainToken(req, res)
            .then((token) => getDataFromToken(token)) //extract user data from the token
            .then((decoded) => {
                const roleName = decoded.role
                _getRolePermissionsByName(roleName, config)
                    .then((rolePermissions) => {
                        const action = req.method
                        //check if the user has the necessary permissions
                        return checkPermission(action, endpoint, rolePermissions, config)
                            .then(({ hasPermission }) => {
                                if (!hasPermission) {
                                    return sendResponseAccessDenied(res, {
                                        message: `Access denied. User does not have permission`
                                    });
                                }
                                req.auth.user = decoded.user
                                req.auth.role = roleName;
                            
                                next(); 
                            })
                        })
            })
            .catch((error) => {
                return sendResponseAccessDenied(res, error);
            });
    };
};

const _getRolePermissionsByName = (roleName, config) => {
    const conn = mysql.start(config)
    return getRolesHasPermissionsModel({ roleName, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(response, error)
            }
            return response.map(({ permission_action, permission_endpoint }) => ({
                permission_action,
                permission_endpoint
            }))
        })
        .catch((err) => {
            errorHandler(err, config.environment)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

export {
    authenticateToken,
    authorizePermission,
    setToken,
    refreshAuthenticate
};