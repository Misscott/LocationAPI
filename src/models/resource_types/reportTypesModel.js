import { 
    getReportTypesListQuery,
    countReportTypesListQuery,
    insertReportTypesQuery,
    updateReportTypesQuery,
    softDeleteReportTypesQuery,
} from "../../repositories/resource_types/reportTypesRepository.js";
import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import { error404 } from '../../utils/errors.js'

const getReportTypesListModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(getReportTypesListQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countReportTypesListModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(countReportTypesListQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertReportTypesModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    return mysql
        .execute(insertReportTypesQuery({...params, uuid, now}), conn, {...params, uuid, now})
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const modifyReportTypesModel = ({conn, ...params}) => {
    return mysql
        .execute(updateReportTypesQuery(params), conn, params)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);
   
            if (deletedItem) {
                throw error404()
            }
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const softDeleteReportTypesModel = ({uuid, deleted, deletedBy, conn}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const params = {uuid, deletedBy, deleted: deletedData}
    return mysql
        .execute(softDeleteReportTypesQuery(params), conn, params)
}

export {
    getReportTypesListModel,
    countReportTypesListModel,
    insertReportTypesModel,
    modifyReportTypesModel,
    softDeleteReportTypesModel
}