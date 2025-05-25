import mysql from '../../adapters/mysql.js'
import { 
    getFavoritesModel,
    countFavoritesModel,
    insertFavoritesModel,
    modifyFavoritesModel,
    softDeleteFavoritesModel
} from '../../models/resource_types/favoritesModel.js'
import { errorHandler } from '../../utils/errors.js'
import { noResults } from '../../validators/result-validators.js'
import { error404 } from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'

const getFavoritesController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuidList = req.query.uuidList && req.query.uuidList.split(',')
    Promise.all([
        getFavoritesModel({...req.query, ...req.params, uuidList, conn}),
        countFavoritesModel({...req.query, uuidList, conn})
    ])
        .then(([getResults, countResults]) => {
            next({
                _data: {favorites: getResults},
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

const getFavoritesByUuidController = (req, res, next, config) => {
    const uuid = req.params.uuid
    const conn = mysql.start(config)
    getFavoritesModel({ uuid, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    favorites: response
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

const postFavoritesController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const createdBy = req.auth.user || null

    insertFavoritesModel({...req.body, ...req.params, createdBy, conn})
        .then((favorites) => {
            const result = {
                _data: favorites
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

const restoreFavoritesController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const user_uuid = req.auth.user || null

    modifyFavoritesModel({ ...req.params, user_uuid, deleted: false, conn })
        .then((favorites) => {
            const result = {
                _data: favorites
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

const putFavoritesController = (req, res, next, config) => {
    const conn = mysql.start(config)

    modifyFavoritesModel({ ...req.body, ...req.params, conn })
        .then((favorites) => {
            if (noResults(favorites)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }
            const result = {
                _data: favorites
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

const softDeleteFavoritesController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const { deleted } = req.body
	const deletedby = req.auth.user || null

    softDeleteFavoritesModel({ ...req.params, deleted, deletedby, conn })
        .then(() => {
            const result = {}
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

export {
    getFavoritesController,
    getFavoritesByUuidController,
    postFavoritesController,
    softDeleteFavoritesController,
    putFavoritesController,
    restoreFavoritesController
}