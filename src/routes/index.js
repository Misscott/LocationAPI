/**
 * @fileoverview This file contains the route definitions for the user-related endpoints.
 */
import {Router} from 'express'             
import { getDeviceController, getDeviceByUuidController, postDeviceController, putDeviceController, deleteDeviceController, getDeviceswithMinimumStockController, getDeviceBySerialNumberController, getDeviceByModelController, getDeviceByBrandController } from '../controllers/resource_types/deviceController.js'
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
import { integer, uuid, varChar} from '../validators/expressValidator/customValidators.js'
import {payloadExpressValidator} from '../validators/expressValidator/payloadExpressValidator.js'
import { error422, errorHandler } from '../utils/errors.js'
import { authorizePermission, setToken, authenticateToken} from '../middlewares/auth.js'
import { postRegisterController } from '../controllers/authorization/registerController.js'
import { postRefreshTokenController } from '../controllers/authorization/refreshTokenController.js'
import { 
    getEndpointsByRouteController, 
    getEndpointsController,
    getEndpointsByUuidController,
    postEndpointsController,
    putEndpointsController,
    deleteEndpointsController,
    softDeleteEndpointsController
} from '../controllers/authorization/endpointsController.js'
import { 
    getRolesHasPermissionsController, 
    postRolesHasPermissionsController, 
    putRolesHasPermissionsController, 
    softDeleteRolesHasPermissionsController,
 } from '../controllers/authorization/roles_has_permissionsController.js'
import { 
    getUsersHasDevicesController,
    postUsersHasDevicesController, 
    putUsersHasDevicesController, 
    softDeleteUsersHasDevicesController,
 } from '../controllers/resource_types/usersHasDevicesController.js'
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
    * @namespace deviceRouter
    */
    const routes = Router()
    const hasAddLinks = config.environment !== 'production'

    /**
    * Gets message from data object result from index controller to check if server is up.
    * Ideally, if server is working correctly it should return message
    * @name get/
    * @function
    * @inner
    * @memberof deviceRouter
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
     * @memberof deviceRouter
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
            uuid('uuid')
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
     * @memberof deviceRouter
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
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('username').optional({ nullable: false, values: 'falsy' }),
            varChar('password').optional({ nullable: false, values: 'falsy' }),
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
     * @memberof deviceRouter
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
     * @memberof deviceRouter
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
        * @memberof deviceRouter
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
     * @memberof deviceRouter
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
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
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
     * @memberof deviceRouter
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
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('name').optional({nullable: false, values: 'falsy'})
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
     * @memberof deviceRouter
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
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
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
     * @memberof deviceRouter
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
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('name').optional({ nullable: false, values: 'falsy' })
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
     * @memberof deviceRouter
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
        (req, res, next) => getPermissionListController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/permissions/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
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
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getPermissionListController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.post(
        '/permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('name').optional({ nullable: false, values: 'falsy' })
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
     * @memberof deviceRouter
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
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
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
     * @memberof deviceRouter
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
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),

        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeletePermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // User Permission Routes
    /**
     * @name GET/user_permissions
     * @function
     * @inner
     * @memberof deviceRouter
     * @route GET /user_permissions
     * @group User Permissions - Operations about user permissions
     * @param {string} uuid.path.required - The unique identifier for the user permission
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - The user permission object
     * @returns {ErrorResponse} 404 - User permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.get(
        '/user_permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/user_permissions')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/user_permissions/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route GET /user_permissions/{uuid}
     * @group User Permissions - Operations about user permissions
     * @param {string} uuid.path.required - The unique identifier for the user permission
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - The user permission object
     * @returns {ErrorResponse} 404 - User permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.get(
        '/user_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/user_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/user_permissions
     * @function
     * @inner
     * @memberof deviceRouter
     * @route POST /user_permissions
     * @group User Permissions - Operations about user permissions
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - User permission created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/user_permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/user_permissions')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postUserPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/user_permissions/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route PUT /user_permissions/{uuid}
     * @group User Permissions - Operations about user permissions
     * @param {string} uuid.path.required - The unique identifier for the user permission
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - User permission updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.put(
        '/user_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/user_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putUserPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/user_permissions/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route DELETE /user_permissions/{uuid}
     * @group User Permissions - Operations about user permissions
     * @param {string} uuid.path.required - The unique identifier for the user permission
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - User permission deleted successfully
     * @returns {ErrorResponse} 404 - User permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * @returns {ErrorResponse} 400 - Bad request
     */
    routes.delete(
        '/user_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/user_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteUserPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    //Endpoints
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

    routes.get(
        '/endpoints/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.post(
        '/endpoints',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('route').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.put(
        '/endpoints/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('route').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.delete(
        '/endpoints/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('route').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    //roles_has_permissions routes
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

    routes.get(
        '/roles_has_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions/:uuid')(req, res, next, config),
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

    routes.post(
        '/roles_has_permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.put(
        '/roles_has_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.delete(
        '/roles_has_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // Login Endpoint

    /**
     * @name POST/login
     * @function
     * @inner
     * @memberof deviceRouter
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

    routes.post(
        '/refresh_token', //header contains refresh_token
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => postRefreshTokenController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendLoginSuccessfullResponse(result, req, res)
    );

    routes.post(
        '/signin',
        [
            varChar('username').optional({ nullable: false, values: 'falsy' }),
            varChar('password').optional({ nullable: false, values: 'falsy' }),
            varChar('email').optional({ nullable: true, values: 'falsy' }),
            varChar('fk_role').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postRegisterController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    return routes;
}