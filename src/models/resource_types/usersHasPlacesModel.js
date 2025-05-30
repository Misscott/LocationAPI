import { getUserHasPlacesListQuery, countUserHasPlacesListQuery, insertUserHasPlacesQuery, modifyUserHasPlacesQuery, softDeleteUserHasPlacesQuery
} from "../../repositories/resource_types/usersHasPlacesRepository.js";
import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import { error404 } from '../../utils/errors.js'

const getUserHasPlacesListModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(getUserHasPlacesListQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, fk_user, fk_place, fk_report_type, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countUserHasPlacesListModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(countUserHasPlacesListQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertUserHasPlacesModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    return mysql
        .execute(insertUserHasPlacesQuery({...params, uuid, now}), conn, {...params, uuid, now})
        .then(queryResult => queryResult[2].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const modifyUserHasPlacesModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    return mysql
        .execute(modifyUserHasPlacesQuery({...params, now}), conn, {...params, now})
        .then(queryResult => {
            /*const deletedItem = queryResult[1].find(item => item.deleted !== null);
   
            if (deletedItem) {
                throw error404()
            }*/
            return queryResult[2].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const softDeleteUserHasPlacesModel = ({uuid, deleted, deletedBy, conn}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const params = {uuid, deletedBy, deleted: deletedData}
    return mysql
        .execute(softDeleteUserHasPlacesQuery(params), conn, params)
}

export {
    getUserHasPlacesListModel,
    countUserHasPlacesListModel,
    insertUserHasPlacesModel,
    modifyUserHasPlacesModel,
    softDeleteUserHasPlacesModel
}


