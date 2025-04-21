import { 
    getUserHasPlacesListModel, 
    countUserHasPlacesListModel, 
    insertUserHasPlacesModel, 
    modifyUserHasPlacesModel, 
    softDeleteUserHasPlacesModel
} from "../../models/resource_types/usersHasPlacesModel.js";
import { error404 } from "../../utils/errors.js"
import { sendResponseNotFound } from "../../utils/responses.js"
import { noResults } from "../../validators/result-validators.js"
import mysql from "../../adapters/mysql.js"
import { errorHandler } from "../../utils/errors.js"

const getUserHasPlacesListController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getUserHasPlacesListModel({...req.query, ...req.body, ...req.params, conn}),
        countUserHasPlacesListModel({...req.query, ...req.body, ...req.params, conn})
    ])
        .then(([getResults, countResults]) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }
            next({
                _data: {reports: getResults},
                _page: {
                    totalElements: countResults,
                    limit: req.query.limit || 100,
                    page: req.query.page || (countResults && 1) || 0
                }
            })
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const getUserHasPlacesByUuidController = (req, res, next, config) => {
    const uuid_user_has_places = req.params.uuid
    const conn = mysql.start(config)

    getUserHasPlacesListModel({ uuid: uuid_user_has_places, ...req.params, ...req.body, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    reports: response
                }
            }
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const getUserHasPlacesByUserUuidController = (req, res, next, config) => {
    const uuid_user = req.params.uuid
    const conn = mysql.start(config)

    getUserHasPlacesListModel({ user_uuid: uuid_user, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    reports: response
                }
            }
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const getUserHasPlacesByPlaceUuidController = (req, res, next, config) => {
    const uuid_place = req.params.uuid
    const conn = mysql.start(config)

    getUserHasPlacesListModel({ place_uuid: uuid_place, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    reports: response
                }
            }
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const postUserHasPlacesController = (req, res, next, config) => {
    const conn = mysql.start(config)

    insertUserHasPlacesModel({...req.body, conn})
        .then((response) => {
            const result = {
                _data: {
                    reports: response
                }
            }
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const putUserHasPlacesController = (req, res, next, config) => {
    const conn = mysql.start(config)

    modifyUserHasPlacesModel({...req.body, conn})
        .then((response) => {
            const result = {
                _data: {
                    reports: response
                }
            }
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const deleteUserHasPlacesController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid_user_has_places = req.params.uuid
    const deletedBy = req.auth.user || null

    softDeleteUserHasPlacesModel({uuid: uuid_user_has_places, deletedBy, conn})
        .then(() => {
            next({})
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const deleteUserHasPlacesByUserUuidController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid_user = req.params.uuid
    const deletedBy = req.auth.user || null

    softDeleteUserHasPlacesModel({user_uuid: uuid_user, deletedBy, conn})
        .then(() => {
            next({})
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const deleteUserHasPlacesByPlaceUuidController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid_place = req.params.uuid
    const deletedBy = req.auth.user || null

    softDeleteUserHasPlacesModel({place_uuid: uuid_place, deletedBy, conn})
        .then(() => {
            next({})
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

export {
    getUserHasPlacesListController,
    getUserHasPlacesByUuidController,
    getUserHasPlacesByUserUuidController,
    getUserHasPlacesByPlaceUuidController,
    postUserHasPlacesController,
    putUserHasPlacesController,
    deleteUserHasPlacesController,
    deleteUserHasPlacesByUserUuidController,
    deleteUserHasPlacesByPlaceUuidController
}