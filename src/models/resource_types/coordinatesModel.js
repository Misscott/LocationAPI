import { 
    getCoordinatesListQuery,
    countCoordinatesListQuery,
    insertCoordinatesQuery,
    updateCoordinatesQuery,
    softDeleteCoordinatesQuery
} from "../../repositories/resource_types/coordinatesRepository.js";
import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import { error404 } from '../../utils/errors.js'

const getCoordinatesListModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(getCoordinatesListQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countCoordinatesListModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(countCoordinatesListQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertCoordinatesModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    return mysql
        .execute(insertCoordinatesQuery({...params, uuid, now}), conn, {...params, uuid, now})
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const modifyCoordinatesModel = ({conn, ...params}) => {
    return mysql
        .execute(updateCoordinatesQuery(params), conn, params)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);
   
            if (deletedItem) {
                throw error404()
            }
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const softDeleteCoordinatesModel = ({uuid, deleted, deletedBy, conn}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const params = {uuid, deletedBy, deleted: deletedData}
    return mysql
        .execute(softDeleteCoordinatesQuery(params), conn, params)
}

export {
    getCoordinatesListModel,
    countCoordinatesListModel,
    insertCoordinatesModel,
    modifyCoordinatesModel,
    softDeleteCoordinatesModel
}
