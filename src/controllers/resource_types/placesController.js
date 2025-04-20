import { 
    getPlaceListModel,
    countPlaceListModel,
    insertPlaceModel,
    modifyPlaceModel,
    deletePlaceModel
} from "../../models/resource_types/placesModel.js";
import { error404 } from "../../utils/errors.js"
import { noResults } from "../../validators/result-validators.js"
import mysql from "../../adapters/mysql.js"
import { errorHandler } from "../../utils/errors.js"
import { sendResponseNotFound } from "../../utils/responses.js"

const getPlaceListController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getPlaceListModel({...req.query, conn}),
        countPlaceListModel({...req.query, conn})
    ])
        .then(([getResults, countResults]) => {
            next({
                _data: {places: getResults},
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

const getPlaceByUuidController = (req, res, next, config) => {
    const uuid_place = req.params.uuid
    const conn = mysql.start(config)

    getPlaceListModel({ uuid: uuid_place, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    places: response
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

const getPlaceByAddressController = (req, res, next, config) => {
    const address = req.params.address
    const conn = mysql.start(config)

    getPlaceListModel({ address, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    places: response
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

const getPlaceByNameController = (req, res, next, config) => {
    const name = req.params.name
    const conn = mysql.start(config)

    getPlaceListModel({ name, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    places: response
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

const getPlaceByLatLongController = (req, res, next, config) => {
    const latitude = req.params.latitude
    const longitude = req.params.longitude
    const conn = mysql.start(config)

    getPlaceListModel({ latitude, longitude, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    places: response
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

const insertPlaceController = (req, res, next, config) => {
    const conn = mysql.start(config)

    insertPlaceModel({ ...req.body, conn })
        .then((response) => {
            const result = {
                _data: {
                    places: response
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

const modifyPlaceController = (req, res, next, config) => {
    const conn = mysql.start(config)

    modifyPlaceModel({  ...req.params, ...req.body, conn })
        .then((response) => {
            const result = {
                _data: {
                    places: response
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

const deletePlaceController = (req, res, next, config) => {
    const conn = mysql.start(config)

    deletePlaceModel({ ...req.params, ...req.body, conn })
        .then((response) => {
            const result = {
                _data: {
                    places: response
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

export {
    getPlaceListController,
    getPlaceByUuidController,
    insertPlaceController,
    modifyPlaceController,
    deletePlaceController,
    getPlaceByAddressController,
    getPlaceByNameController,
    getPlaceByLatLongController
}