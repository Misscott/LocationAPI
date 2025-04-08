import { 
    getCoordinatesListModel,
    countCoordinatesListModel,
    insertCoordinatesModel,
    modifyCoordinatesModel,
    softDeleteCoordinatesModel
} from "../../models/resource_types/coordinatesModel";
import { error404 } from "../../utils/errors";
import { sendResponseNotFound } from "../../utils/responses";
import { noResults } from "../../validators/result-validators";
import mysql from "../../adapters/mysql.js";
import { errorHandler } from "../../utils/errors";

const getCoordinatesListController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getCoordinatesListModel({...req.query, conn}),
        countCoordinatesListModel({...req.query, conn})
    ])
        .then(([getResults, countResults]) => {
            next({
                _data: {coordinates: getResults},
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

const getCoordinatesByUuidController = (req, res, next, config) => {
    const uuid_coordinates = req.params.uuid
    const conn = mysql.start(config)

    getCoordinatesListModel({ uuid_coordinates, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    coordinates: response
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

const postCoordinatesController = (req, res, next, config) => {
    const conn = mysql.start(config)

    insertCoordinatesModel({ ...req.body, conn })
        .then((response) => {
            const result = {
                _data: {
                    coordinates: response
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

const putCoordinatesController = (req, res, next, config) => {
    const uuid_coordinates = req.params.uuid
    const conn = mysql.start(config)

    modifyCoordinatesModel({ ...req.body, uuid: uuid_coordinates, conn })
        .then((response) => {
            const result = {
                _data: {
                    coordinates: response
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

const deleteCoordinatesController = (req, res, next, config) => {
    const uuid_coordinates = req.params.uuid
    const conn = mysql.start(config)

    softDeleteCoordinatesModel({ uuid: uuid_coordinates, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    coordinates: response
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

export {
    getCoordinatesListController,
    getCoordinatesByUuidController,
    postCoordinatesController,
    putCoordinatesController,
    deleteCoordinatesController
}
