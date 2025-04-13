/**
 * @fileoverview This file contains the route definitions for the user-related endpoints.
 */
import {Router, text} from 'express'             
import { getUserListController, getUserInfoController, postUserController, putUserController, softDeleteUserController } from '../controllers/authorization/userController.js'
import { getRoleController, getRoleInfoController, postRoleController, putRoleController, deleteRoleController } from '../controllers/authorization/rolesController.js'
import { getPermissionController, getPermissionByUuidController, postPermissionController, putPermissionController, softDeletePermissionController } from '../controllers/authorization/permissionsController.js'
import { indexController } from '../controllers/indexController.js'
import { postLoginController } from '../controllers/authorization/loginController.js'
import { addLinks } from '../utils/links.js'
import { linkRoutes } from '../index.js'
import {
    sendCreatedResponse,
	sendLoginSuccessfullResponse,
	sendOkResponse,
    sendResponseNoContent,
} from '../utils/responses.js'
import { integer, uuid, varChar } from '../validators/expressValidator/customValidators.js'
import { integerRange } from '../validators/expressValidator/integerRangeValidator.js' // Adjust the path as needed
import {payloadExpressValidator} from '../validators/expressValidator/payloadExpressValidator.js'
import { authorizePermission, setToken, authenticateToken, refreshAuthenticate} from '../middlewares/auth.js'
import { postRegisterController } from '../controllers/authorization/registerController.js'
import { postRefreshTokenController } from '../controllers/authorization/refreshTokenController.js'
import { 
    getEndpointsController,
    getEndpointsByUuidController,
    postEndpointsController,
    putEndpointsController,
    softDeleteEndpointsController
} from '../controllers/authorization/endpointsController.js'
import { 
    getRolesHasPermissionsByUuidController,
    getRolesHasPermissionsController, 
    postRolesHasPermissionsController, 
    putRolesHasPermissionsController, 
    softDeleteRolesHasPermissionsController,
 } from '../controllers/authorization/roles_has_permissionsController.js'
import { deletePlaceController, getPlaceByUuidController, getPlaceListController, insertPlaceController, modifyPlaceController } from '../controllers/resource_types/placesController.js'
import { deleteCoordinatesController, getCoordinatesByUuidController, getCoordinatesListController, postCoordinatesController, putCoordinatesController } from '../controllers/resource_types/coordinatesController.js'
import { deleteUserHasPlacesController, getUserHasPlacesByUuidController, getUserHasPlacesListController, postUserHasPlacesController, putUserHasPlacesController } from '../controllers/resource_types/usersHasPlacesController.js'
import { getReportTypesByUuidController, getReportTypesListController, postReportTypesController, putReportTypesController, softDeleteReportTypesController } from '../controllers/resource_types/reportTypesController.js'

/**
 * @function default 
 * @param {Object} configuration based on environment
 * @returns {Router} all endpoint routes
 */
/**
 * @fileoverview This file defines the routes for the REST API, including endpoints for devices, users, roles, permissions, and login.
 * It uses Express.js to define and manage routes, and includes middleware for authentication, authorization, validation, and response handling.
 * 
 * @module routes/index
 * @requires express.Router
 * @requires controllers
 * @requires middlewares
 * @requires validators
 * 
 * @param {Object} config - Configuration object for the application.
 * @param {string} config.environment - The current environment (e.g., 'production', 'development').
 * @returns {Object} routes - The configured Express router with all defined routes.
 */
export default(config) => {
    /**
    * Express router to mount user related functions on.
    * @type {Object}
    * @const
    * @namespace placeRouter
    */
    const routes = Router()
    const hasAddLinks = config.environment !== 'production'

    /**
    * Gets message from data object result from index controller to check if server is up.
    * Ideally, if server is working correctly it should return message
    * @name get/
    * @function
    * @inner
    * @memberof placeRouter
    * @route GET /
    * @returns {Device} 200 - The data object with message 
    * @returns {ErrorResponse} 404 - Data not found
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.get(
        '/',
        (req, res, next) => indexController(req, res, next),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    // User Routes
    /**
     * @name get/users
     * @function
     * @inner
     * @memberof deviceRouter
     * @route GET /users
     * @group Users - Operations about users
     * @param {string} uuid.path.required - The unique identifier for the user
     * @param {string} username.path.required - The username of the user
     * @param {string} email.path.required - The email of the user
     * @returns {User} 200 - The user object
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * */
    routes.get(
        '/users',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('username').optional({ nullable: false, values: 'falsy' }),
            varChar('email').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserListController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name get/users/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /users/{uuid}
     * @group Users - Operations about users
     * @param {string} uuid.path.required - The unique identifier for the user
     * @param {string} username.path.required - The username of the user
     * @param {string} email.path.required - The email of the user
     * @returns {User} 200 - The user object
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     */
    routes.get(
        '/users/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('username').optional({ nullable: false, values: 'falsy' }),
            varChar('email').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserInfoController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/users
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /users
     * @group Users - Operations about users
     * @param {string} username.path.required - The username of the user
     * @param {string} password.path.required - The password of the user
     * @param {string} email.path.required - The email of the user
     * @param {string} fk_role.path.required - The role of the user
     * @param {string} uuid.path.required - The unique identifier for the user
     * @returns {SuccessResponse} 200 - User created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     */
    routes.post(
        '/users',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users')(req, res, next, config),
        [
            varChar('username'),
            varChar('password'),
            varChar('email').optional({ nullable: true, values: 'falsy' }),
            varChar('fk_role').optional({ nullable: false, values: 'falsy' })

        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postUserController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/users/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route PUT /users/{uuid}
     * @group Users - Operations about users
     * @param {string} uuid.path.required - The unique identifier for the user
     * @param {string} username.path.required - The username of the user
     * @param {string} email.path.required - The email of the user
     * @param {string} fk_role.path.required - The role of the user
     * @param {string} password.path.required - The password of the user
     * @returns {SuccessResponse} 200 - User updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     */
    routes.put(
        '/users/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('username').optional({ nullable: false, values: 'falsy' }),
            varChar('email').optional({ nullable: true, values: 'falsy' }),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putUserController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name delete/users/:uuid 
     * @function 
     * @inner
     * @memberof placeRouter
     * @route DELETE /users/{uuid}
     * @group Users - Operations about users
     * @param {string} uuid.path.required - The unique identifier for the user
     * @returns {SuccessResponse} 204 - User deleted successfully. No content
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.delete(
        '/users/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteUserController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    /**
        * @name GET/roles
        * @function
        * @inner
        * @memberof placeRouter
        * @route GET /roles
        * @group Roles - Operations about roles
        * @param {string} uuid.path.required - The unique identifier for the role
        * @param {string} name.path.required - The name of the role
        * @returns {SuccessResponse} 200 - The role object
        * @returns {ErrorResponse} 404 - Role not found
        * @returns {ErrorResponse} 422 - Unprocessable entity
        * @returns {ErrorResponse} 500 - Internal server error
        * @returns {ErrorResponse} 403 - Forbidden
        * @returns {ErrorResponse} 401 - Unauthorized
        * @returns {ErrorResponse} 400 - Bad request
     */
    routes.get(
        '/roles',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles')(req, res, next, config),
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/roles/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /roles/{uuid}
     * @group Roles - Operations about roles
     * @param {string} uuid.path.required - The unique identifier for the role
     * @param {string} name.path.required - The name of the role
     * @returns {SuccessResponse} 200 - The role object
     * @returns {ErrorResponse} 404 - Role not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * @returns {ErrorResponse} 400 - Bad request
     */
    routes.get(
        '/roles/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getRoleInfoController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/roles
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /roles
     * @group Roles - Operations about roles
     * @param {string} name.path.required - The name of the role
     * @param {string} uuid.path.required - The unique identifier for the role
     * @returns {SuccessResponse} 200 - Role created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Role not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     */
    routes.post(
        '/roles',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles')(req, res, next, config),
        [
            varChar('name')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/roles/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route PUT /roles/{uuid}
     * @group Roles - Operations about roles
     * @param {string} uuid.path.required - The unique identifier for the role
     * @param {string} name.path.required - The name of the role
     * @param {string} fk_permission.path.required - The permission of the role
     * @returns {SuccessResponse} 200 - Role updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Role not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     */
    routes.put(
        '/roles/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/roles/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route DELETE /roles/{uuid}
     * @group Roles - Operations about roles
     * @param {string} uuid.path.required - The unique identifier for the role
     * @param {string} name.path.required - The name of the role
     * @returns {SuccessResponse} 204 - Role deleted successfully. No content
     * @returns {ErrorResponse} 404 - Role not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * @returns {ErrorResponse} 400 - Bad request
     */
    routes.delete(
        '/roles/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => deleteRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // Permission Routes
    /**
     * @name GET/permissions
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /permissions
     * @group Permissions - Operations about permissions
     * @param {string} uuid.path.required - The unique identifier for the permission
     * @param {string} name.path.required - The name of the permission
     * @returns {SuccessResponse} 200 - The permission object
     * @returns {ErrorResponse} 404 - Permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * */
    routes.get(
        '/permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/permissions/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /permissions/{uuid}
     * @group Permissions - Operations about permissions
     * @param {string} uuid.path.required - The unique identifier for the permission
     * @param {string} name.path.required - The name of the permission
     * @returns {SuccessResponse} 200 - The permission object
     * @returns {ErrorResponse} 404 - Permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * */
    routes.get(
        '/permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getPermissionByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.post(
        '/permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions')(req, res, next, config),
        [
            varChar('action'),
            varChar('endpoint')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/permissions/:uuid 
     * @function
     * @inner
     * @memberof placeRouter
     * @route PUT /permissions/{uuid}
     * @group Permissions - Operations about permissions
     * @param {string} uuid.path.required - The unique identifier for the permission
     * @param {string} action.path - The name of the action/http method for the request
     * @param {string} endpoint.path - The name of the permission
     * @returns {SuccessResponse} 200 - Permission updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * */
    routes.put(
        '/permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('action').optional({ nullable: false, values: 'falsy' }),
            varChar('endpoint').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/permissions/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route DELETE /permissions/{uuid}
     * @group Permissions - Operations about permissions
     * @param {string} uuid.path.required - The unique identifier for the permission
     * @param {string} name.path.required - The name of the permission
     * @returns {SuccessResponse} 200 - Permission deleted successfully
     * @returns {ErrorResponse} 404 - Permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.delete(
        '/permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid')

        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeletePermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    //Endpoints
    /**
     * @name GET/endpoints
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /endpoints
     * @group Endpoints - Operations about endpoints
     * @param {string} uuid.path.required - The unique identifier for the endpoint
     * @param {string} route.path.required - The name of the endpoint
     * @returns {SuccessResponse} 200 - The endpoint object
     * @returns {ErrorResponse} 404 - Endpoint not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.get(
        '/endpoints',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('route').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/endpoints/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /endpoints/{uuid}
     * @group Endpoints - Operations about endpoints
     * @param {string} uuid.path.required - The unique identifier for the endpoint
     * @param {string} route.path.required - The name of the endpoint
     * @returns {SuccessResponse} 200 - The endpoint object
     * @returns {ErrorResponse} 404 - Endpoint not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.get(
        '/endpoints/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getEndpointsByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/endpoints
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /endpoints
     * @group Endpoints - Operations about endpoints
     * @param {string} route.path.required - The name of the endpoint
     * @returns {SuccessResponse} 200 - Endpoint created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Endpoint not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/endpoints',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints')(req, res, next, config),
        [
            varChar('route')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/endpoints/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route PUT /endpoints/{uuid}
     * @group Endpoints - Operations about endpoints
     * @param {string} uuid.path.required - The unique identifier for the endpoint
     * @param {string} route.path.required - The name of the endpoint
     * @returns {SuccessResponse} 200 - Endpoint updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Endpoint not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.put(
        '/endpoints/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('route').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/endpoints/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route DELETE /endpoints/{uuid}
     * @group Endpoints - Operations about endpoints
     * @param {string} uuid.path.required - The unique identifier for the endpoint
     * @param {string} route.path.required - The name of the endpoint
     * @returns {SuccessResponse} 200 - Endpoint deleted successfully. No content
     * @returns {ErrorResponse} 404 - Endpoint not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.delete(
        '/endpoints/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    //roles_has_permissions routes
    /**
     * @name GET/roles_has_permissions
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /roles_has_permissions
     * @group Roles Permissions - Operations about roles permissions
     * @param {string} uuid.path.required - The unique identifier for the role permission
     * @param {string} fk_role.path.required - The unique identifier for the role
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - The role permission object
     * @returns {ErrorResponse} 404 - Role permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.get(
        '/roles_has_permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/roles_has_permissions/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /roles_has_permissions/{uuid}
     * @group Roles Permissions - Operations about roles permissions
     * @param {string} uuid.path.required - The unique identifier for the role permission
     * @param {string} fk_role.path.required - The unique identifier for the role
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - The role permission object
     * @returns {ErrorResponse} 404 - Role permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.get(
        '/roles_has_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getRolesHasPermissionsByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/roles_has_permissions
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /roles_has_permissions
     * @group Roles Permissions - Operations about roles permissions
     * @param {string} fk_role.path.required - The unique identifier for the role
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - Role permission created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Role permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/roles_has_permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions')(req, res, next, config),
        [
            uuid('fk_role'),
            uuid('fk_permission')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/roles_has_permissions/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route PUT /roles_has_permissions/{uuid}
     * @group Roles Permissions - Operations about roles permissions
     * @param {string} uuid.path.required - The unique identifier for the role permission
     * @param {string} fk_role.path.required - The unique identifier for the role
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - Role permission updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Role permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.put(
        '/roles_has_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/roles_has_permissions/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route DELETE /roles_has_permissions/{uuid}
     * @group Roles Permissions - Operations about roles permissions
     * @param {string} uuid.path.required - The unique identifier for the role permission
     * @param {string} fk_role.path.required - The unique identifier for the role
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - Role permission deleted successfully. No content
     * @returns {ErrorResponse} 404 - Role permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.delete(
        '/roles_has_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // Places Routes
    /**
     * @name GET/places
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /places
     * @group Places - Operations about places
     * @param {string} uuid.path.required - The unique identifier for the place
     * @param {string} name.path.required - The name of the place
     * @param {string} address.path.required - The address of the place
     * @param {string} fk_coordinate.path.required - The unique identifier for the coordinate
     * @returns {SuccessResponse} 200 - The place object
     * @returns {ErrorResponse} 404 - Place not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.get(
        '/places',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/places')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('name').optional({ nullable: false, values: 'falsy' }),
            varChar('address').optional({ nullable: true, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            uuid('fk_coordinate').optional({ nullable: false, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getPlaceListController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/places/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /places/{uuid}
     * @group Places - Operations about places
     * @param {string} uuid.path.required - The unique identifier for the place
     * @param {string} name.path.required - The name of the place
     * @param {string} address.path.required - The address of the place
     * @param {string} fk_coordinate.path.required - The unique identifier for the coordinate
     * @returns {SuccessResponse} 200 - The place object
     * @returns {ErrorResponse} 404 - Place not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.get(
        '/places/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/places/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' }),
            varChar('address').optional({ nullable: true, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            uuid('fk_coordinate').optional({ nullable: false, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getPlaceByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/places
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /places
     * @group Places - Operations about places
     * @param {string} name.path.required - The name of the place
     * @param {string} address.path.required - The address of the place
     * @param {string} fk_coordinate.path.required - The unique identifier for the coordinate
     * @returns {SuccessResponse} 200 - Place created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Place not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/places',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/places')(req, res, next, config),
        [
            varChar('name'),
            varChar('address').optional({ nullable: true, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            uuid('fk_coordinate')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => insertPlaceController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/places/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route PUT /places/{uuid}
     * @group Places - Operations about places
     * @param {string} uuid.path.required - The unique identifier for the place
     * @param {string} name.path.required - The name of the place
     * @param {string} address.path.required - The address of the place
     * @param {string} fk_coordinate.path.required - The unique identifier for the coordinate
     * @returns {SuccessResponse} 200 - Place updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Place not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.put(
        '/places/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/places/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' }),
            varChar('address').optional({ nullable: true, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            uuid('fk_coordinate').optional({ nullable: false, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => modifyPlaceController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/places/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route DELETE /places/{uuid}
     * @group Places - Operations about places
     * @param {string} uuid.path.required - The unique identifier for the place
     * @returns {SuccessResponse} 200 - Place deleted successfully. No content
     * @returns {ErrorResponse} 404 - Place not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.delete(
        '/places/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/places/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => deletePlaceController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // Coordinates Routes
    /**
     * @name GET/coordinates
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /coordinates
     * @group Coordinates - Operations about coordinates
     * @param {string} uuid.path.required - The unique identifier for the coordinate
     * @param {string} latitude.path.required - The latitude of the coordinate
     * @param {string} longitude.path.required - The longitude of the coordinate
     * @returns {SuccessResponse} 200 - The coordinate object
     * @returns {ErrorResponse} 404 - Coordinate not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.get(
        '/coordinates',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/coordinates')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('latitude').optional({ nullable: false, values: 'falsy' }),
            varChar('longitude').optional({ nullable: false, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getCoordinatesListController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/coordinates/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /coordinates/{uuid}
     * @group Coordinates - Operations about coordinates
     * @param {string} uuid.path.required - The unique identifier for the coordinate
     * @param {string} latitude.path.required - The latitude of the coordinate
     * @param {string} longitude.path.required - The longitude of the coordinate
     * @returns {SuccessResponse} 200 - The coordinate object
     * @returns {ErrorResponse} 404 - Coordinate not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.get(
        '/coordinates/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/coordinates/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('latitude').optional({ nullable: false, values: 'falsy' }),
            varChar('longitude').optional({ nullable: false, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getCoordinatesByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/coordinates
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /coordinates
     * @group Coordinates - Operations about coordinates
     * @param {string} latitude.path.required - The latitude of the coordinate
     * @param {string} longitude.path.required - The longitude of the coordinate
     * @returns {SuccessResponse} 200 - Coordinate created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Coordinate not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/coordinates',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/coordinates')(req, res, next, config),
        [
            varChar('latitude'),
            varChar('longitude')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postCoordinatesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/coordinates/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route PUT /coordinates/{uuid}
     * @group Coordinates - Operations about coordinates
     * @param {string} uuid.path.required - The unique identifier for the coordinate
     * @param {string} latitude.path.required - The latitude of the coordinate
     * @param {string} longitude.path.required - The longitude of the coordinate
     * @returns {SuccessResponse} 200 - Coordinate updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Coordinate not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.put(
        '/coordinates/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/coordinates/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('latitude').optional({ nullable: false, values: 'falsy' }),
            varChar('longitude').optional({ nullable: false, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putCoordinatesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/coordinates/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route DELETE /coordinates/{uuid}
     * @group Coordinates - Operations about coordinates
     * @param {string} uuid.path.required - The unique identifier for the coordinate
     * @returns {SuccessResponse} 200 - Coordinate deleted successfully. No content
     * @returns {ErrorResponse} 404 - Coordinate not found  
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.delete(
        '/coordinates/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/coordinates/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => deleteCoordinatesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    //Reports routes
    /**
     * @name GET/users_has_places
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /reports
     * @group Reports - Operations about reports
     * @param {string} uuid.path.required - The unique identifier for the report
     * @param {string} fk_place.path.required - The unique identifier for the place
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @returns {SuccessResponse} 200 - The report object
     * @returns {ErrorResponse} 404 - Report not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * @returns {ErrorResponse} 400 - Bad request
    */
    routes.get(
        '/reports',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/reports')(req, res, next, config),
        [
            uuid('uuid'),
            uuid('uuidPlace').optional({ nullable: false, values: 'falsy' }),
            uuid('uuidUser').optional({ nullable: false, values: 'falsy' }),
            uuid('uuidReportType').optional({ nullable: false, values: 'falsy' }),
            integerRange('rating', {min: 1, max: 3}).optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserHasPlacesListController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );
    /**
     * @name GET/reports/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /reports/{uuid}
     * @group Reports - Operations about reports
     * @param {string} uuid.path.required - The unique identifier for the report
     * @param {string} fk_place.path.required - The unique identifier for the place
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @returns {SuccessResponse} 200 - The report object
     * @returns {ErrorResponse} 404 - Report not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * @returns {ErrorResponse} 400 - Bad request
    */
    routes.get(
        '/reports/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/reports/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            uuid('uuidPlace').optional({ nullable: false, values: 'falsy' }),
            uuid('uuidUser').optional({ nullable: false, values: 'falsy' }),
            uuid('uuidReportType').optional({ nullable: false, values: 'falsy' }),
            integerRange('rating', {min: 1, max: 3}).optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserHasPlacesByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/reports
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /reports
     * @group Reports - Operations about reports
     * @param {string} fk_place.path.required - The unique identifier for the place
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_report_type.path.required - The unique identifier for the report type
     * @param {string} description.path.required - The description of the report
     * @returns {SuccessResponse} 200 - Report created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Report not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/reports',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/reports')(req, res, next, config),
        [
            uuid('uuidPlace'),
            uuid('uuidUser'),
            uuid('uuidReportType'),
            integerRange('rating', {min: 1, max: 3}),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postUserHasPlacesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/reports/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route PUT /reports/{uuid}
     * @group Reports - Operations about reports
     * @param {string} uuid.path.required - The unique identifier for the report
     * @param {string} fk_place.path.required - The unique identifier for the place
     * @param {string} fk_user.path.required - The unique identifier for the user   
     * @param {string} fk_report_type.path.required - The unique identifier for the report type
     * @param {string} description.path.required - The description of the report
     * @returns {SuccessResponse} 200 - Report updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Report not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.put(
        '/reports/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/reports/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            uuid('uuidPlace').optional({ nullable: false, values: 'falsy' }),
            uuid('uuidUser').optional({ nullable: false, values: 'falsy' }),
            uuid('uuidReportType').optional({ nullable: false, values: 'falsy' }),
            integerRange('rating', {min: 1, max: 3}).optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putUserHasPlacesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/reports/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route DELETE /reports/{uuid}
     * @group Reports - Operations about reports
     * @param {string} uuid.path.required - The unique identifier for the report
     * @returns {SuccessResponse} 200 - Report deleted successfully. No content
     * @returns {ErrorResponse} 404 - Report not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.delete(
        '/reports/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/reports/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => deleteUserHasPlacesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // Report Types Repository
    /**
     * @name GET/report_types
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /report_types
     * @group Report Types - Operations about report types
     * @param {string} uuid.path.required - The unique identifier for the report type
     * @param {string} name.path.required - The name of the report type
     * @returns {SuccessResponse} 200 - The report type object
     * @returns {ErrorResponse} 404 - Report type not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.get(
        '/report_types',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/report_types')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('name').optional({ nullable: false, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getReportTypesListController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/report_types/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route GET /report_types/{uuid}
     * @group Report Types - Operations about report types
     * @param {string} uuid.path.required - The unique identifier for the report type
     * @param {string} name.path.required - The name of the report type
     * @returns {SuccessResponse} 200 - The report type object
     * @returns {ErrorResponse} 404 - Report type not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.get(
        '/report_types/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/report_types/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getReportTypesByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );
    /**
     * @name POST/report_types
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /report_types
     * @group Report Types - Operations about report types
     * @param {string} name.path.required - The name of the report type
     * @returns {SuccessResponse} 200 - Report type created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Report type not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/report_types',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/report_types')(req, res, next, config),
        [
            varChar('name')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postReportTypesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/report_types/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route PUT /report_types/{uuid}
     * @group Report Types - Operations about report types
     * @param {string} uuid.path.required - The unique identifier for the report type
     * @param {string} name.path.required - The name of the report type
     * @returns {SuccessResponse} 200 - Report type updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Report type not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.put(
        '/report_types/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/report_types/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' }),
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putReportTypesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/report_types/:uuid
     * @function
     * @inner
     * @memberof placeRouter
     * @route DELETE /report_types/{uuid}
     * @group Report Types - Operations about report types
     * @param {string} uuid.path.required - The unique identifier for the report type
     * @returns {SuccessResponse} 200 - Report type deleted successfully. No content
     * @returns {ErrorResponse} 404 - Report type not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.delete(
        '/report_types/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/report_types/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteReportTypesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // Login Endpoint
    /**
     * @name POST/login
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /login
     * @group Login - Operations about login
     * @param {string} username.path.required - The username of the user
     * @param {string} password.path.required - The password of the user
     * @returns {SuccessResponse} 200 - User logged in successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * @returns {ErrorResponse} 409 - Conflict
    */
    routes.post(
        '/login',
        [
            varChar('username'),
            varChar('password')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postLoginController(req, res, next, config),
        (result, req, res, next) => setToken(result, req, res, next),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendLoginSuccessfullResponse(result, req, res)
    );

    /**
     * @name POST/refresh_token
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /refresh_token
     * @group Login - Operations about login
     * @param {string} refresh_token.path.required - The refresh token of the user
     * @returns {SuccessResponse} 200 - User logged in successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/refresh_token', //header contains refresh_token
        [
            text('refresh_token')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => refreshAuthenticate(req, res, next, config),
        (req, res, next) => postRefreshTokenController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendLoginSuccessfullResponse(result, req, res)
    );

    /**
     * @name POST/signin
     * @function
     * @inner
     * @memberof placeRouter
     * @route POST /signin
     * @group Login - Operations about login
     * @param {string} username.path.required - The username of the user
     * @param {string} password.path.required - The password of the user
     * @param {string} email.path.required - The email of the user
     * @param {string} fk_role.path.required - The role of the user
     * @returns {SuccessResponse} 200 - User logged in successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/signin',
        [
            varChar('username'),
            varChar('password'),
            varChar('email').optional({ nullable: true, values: 'falsy' }),
            varChar('fk_role')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postRegisterController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    return routes;
}