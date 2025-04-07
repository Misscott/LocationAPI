import mysql from '../../adapters/mysql.js'
import { 
    getRoleModel,
    countRoleModel,
    insertRoleModel,
    modifyRoleModel,
    softDeleteRoleModel
 } from '../../models/authorization/roleModel.js'
import { error404, errorHandler } from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'
import { noResults } from '../../validators/result-validators.js'

const getRoleController = (req, res, next, config) => {
    // Parse and validate pagination parameters with defaults
    const limit = parseInt(req.query.limit, 10) || 100;
    const page = parseInt(req.query.page, 10) || 1;
    
    // Create sanitized query object
    const queryParams = { 
        ...req.query,
        limit,
        page
    };
    
    const conn = mysql.start(config)

    Promise.all([
        getRoleModel({ ...queryParams, conn }),
        countRoleModel({ ...queryParams, conn })
    ])
        .then(([getResults, countResults]) => {
            next({
                _data: {roles: getResults},
                _page: {
                    totalElements: countResults,
                    limit: req.query.limit || 100,
                    page: req.query.page || (countResults && 1) || 0
                }
            })
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            return res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const getRoleInfoController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const uuid = req.params.uuid

	getRoleModel({ uuid, conn })
		.then((RoleInformation) => {
			if (noResults(RoleInformation)) {
				const err = error404()
				const error = errorHandler(err, config.environment)
				return sendResponseNotFound(res, error)
			}

			const result = {
				_data: {
					roles: RoleInformation
				}
			}
			next(result)
		})
		.catch((err) => {
			const error = errorHandler(err, config.environment)
			return res.status(error.code).json(error)
		})
		.finally(() => {
			mysql.end(conn)
		})
}

const postRoleController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const createdBy = req.auth.user || null

	insertRoleModel({ ...req.body, createdBy, conn })
		.then((RoleInformation) => {
			const result = {
				_data: { roles: RoleInformation }
			}

			next(result)
		})
		.catch((err) => {
			const error = errorHandler(err, config.environment)
			return res.status(error.code).json(error)
		})
		.finally(() => {
			mysql.end(conn)
		})
}

const putRoleController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const uuid = req.params.uuid

	modifyRoleModel({ ...req.body, uuid, conn })
		.then((RoleInformation) => {
			const result = {
				_data: {
					message: 'Role modified',
					roles: RoleInformation
				}
			}
			next(result)
		})
		.catch((err) => {
			const error = errorHandler(err, config.environment)
			return res.status(error.code).json(error)
		})
		.finally(() => {
			mysql.end(conn)
		})
}

const deleteRoleController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const uuid = req.params.uuid
	const deletedby = req.auth.user || null

	softDeleteRoleModel({ uuid, deletedby, conn })
		.then(() => {
			const result = {}
			next(result)
		})
		.catch((err) => {
			const error = errorHandler(err, config.environment)
			return res.status(error.code).json(error)
		})
		.finally(() => {
			mysql.end(conn)
		})
}

export {
	deleteRoleController,
	getRoleController,
	getRoleInfoController,
	postRoleController,
	putRoleController
}