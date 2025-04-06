import { 
    getPlaceListQuery,
    countPlaceListQuery,
    insertPlaceQuery,
    updatePlaceQuery,
    deletePlaceQuery
} from "../../repositories/resource_types/placesRepository";
import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'

const getPlaceListModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(getPlaceListQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countPlaceListModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(countPlaceListQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertPlaceModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    return mysql
        .execute(insertPlaceQuery({...params, uuid, now}), conn, {...params, uuid, now})
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const modifyPlaceModel = ({conn, ...params}) => {
    return mysql
        .execute(updatePlaceQuery(params), conn, params)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);
   
            if (deletedItem) {
                throw error404()
            }
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const deletePlaceModel = ({uuid, deleted, deletedBy, conn}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const params = {uuid, deletedBy, deleted: deletedData}
    return mysql
        .execute(deletePlaceQuery(params), conn, params)
}

export {
    getPlaceListModel,
    countPlaceListModel,
    getPlaceByUuidModel,
    insertPlaceModel,
    modifyPlaceModel,
    deletePlaceModel
}