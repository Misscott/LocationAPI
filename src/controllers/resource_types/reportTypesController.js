import mysql from "../../adapters/mysql.js";
import { errorHandler } from "../../utils/errors.js";
import { error404 } from "../../utils/errors.js";
import { sendResponseNotFound } from "../../utils/responses.js";
import { noResults } from "../../validators/result-validators.js";
import {
    getReportTypesListModel,
    countReportTypesListModel,
    insertReportTypesModel,
    modifyReportTypesModel,
    softDeleteReportTypesModel
} from "../../models/resource_types/reportTypesModel.js";

const getReportTypesListController = (req, res, next, config) => {
    const conn = mysql.start(config);

    Promise.all([
        getReportTypesListModel({ ...req.query, conn }),
        countReportTypesListModel({ ...req.query, conn })
    ])
        .then(([getResults, countResults]) => {
            next({
                _data: { report_types: getResults },
                _page: {
                    totalElements: countResults,
                    limit: req.query.limit || 100,
                    page: req.query.page || (countResults && 1) || 0
                }
            });
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment);
            return res.status(error.code).json(error);
        })
        .finally(() => {
            mysql.end(conn);
        });
}

const getReportTypesByUuidController = (req, res, next, config) => {
    const uuid_report_type = req.params.uuid;
    const conn = mysql.start(config);

    getReportTypesListModel({ uuid: uuid_report_type, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404();
                const error = errorHandler(err, config.environment);
                return sendResponseNotFound(res, error);
            }

            const result = {
                _data: {
                    report_types: response
                }
            }
            next(result);
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment);
            return res.status(error.code).json(error);
        })
        .finally(() => {
            mysql.end(conn);
        });
}

const postReportTypesController = (req, res, next, config) => {
    const conn = mysql.start(config);
    const created_by = req.auth.user || null

    insertReportTypesModel({ ...req.body, created_by, conn })
        .then((response) => {
            const result = {
                _data: {
                    report_types: response
                }
            }
            next(result);
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment);
            return res.status(error.code).json(error);
        })
        .finally(() => {
            mysql.end(conn);
        });
}

const putReportTypesController = (req, res, next, config) => {
    const conn = mysql.start(config);
    const uuid_report_type = req.params.uuid;

    modifyReportTypesModel({ ...req.body, uuid: uuid_report_type, conn })
        .then((response) => {
            const result = {
                _data: {
                    report_types: response
                }
            }
            next(result);
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment);
            res.status(error.code).json(error);
        })
        .finally(() => {
            mysql.end(conn);
        });
}

const softDeleteReportTypesController = (req, res, next, config) => {
    const conn = mysql.start(config);
    const uuid_report_type = req.params.uuid;
    const deleted_by = req.auth.user || null

    softDeleteReportTypesModel({ uuid: uuid_report_type, deleted_by, conn })
        .then(() => {
            const result = {}
            next(result);
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment);
            res.status(error.code).json(error);
        })
        .finally(() => {
            mysql.end(conn);
        });
}

export {
    getReportTypesListController,
    getReportTypesByUuidController,
    postReportTypesController,
    putReportTypesController,
    softDeleteReportTypesController
}