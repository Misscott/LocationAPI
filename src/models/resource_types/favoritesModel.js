import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import { 
    getFavoritesQuery,
    countFavoritesQuery,
    insertFavoritesQuery,
    softDeleteFavoritesQuery,
    modifyFavoritesQuery
} from '../../repositories/resource_types/favoritesRepository.js'
import { error404 } from '../../utils/errors.js'

const getFavoritesModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
	const paramsToSearch = { ...rest, now }

    return mysql    
        .execute(getFavoritesQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results.map(({id, fk_user, fk_place, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countFavoritesModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
	const paramsToSearch = { ...rest, now }

    return mysql
        .execute(countFavoritesQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertFavoritesModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    const paramsToInsert = { ...rest, uuid, now }

    return mysql
        .execute(insertFavoritesQuery(paramsToInsert), conn, paramsToInsert)
        .then(results => results[1].map(({id, fk_user, fk_place, created, deleted, createdBy, deletedBy, ...rest}) => ({...rest})))
}

const modifyFavoritesModel = ({conn, ...params}) => {
    return mysql
        .execute(modifyFavoritesQuery(params), conn, params)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);
  
            if (deletedItem) {
                throw error404()
            }
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const softDeleteFavoritesModel = ({conn, deleted, deletedBy, ...rest}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
	const params = { ...rest, deleted: deletedData, deletedBy }

	return mysql
		.execute(softDeleteFavoritesQuery(params), conn, params)
}

export {
    getFavoritesModel,
    countFavoritesModel,
    insertFavoritesModel,
    softDeleteFavoritesModel,
    modifyFavoritesModel
}