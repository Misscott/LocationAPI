import { pagination } from "../../utils/pagination";

const _userHasPlacesSelectQuery = (_pagination = '') => ({ count }) => ({ uuid, uuidUser, uuidPlace }) => {
    const uuidCondition = uuid ? 'AND up.uuid = :uuid ' : '';
    const uuidUserCondition = uuidUser ? 'AND up.fk_user = (SELECT id FROM mydb.users WHERE uuid = :uuidUser)' : '';
    const uuidPlaceCondition = uuidPlace ? 'AND up.fk_place = (SELECT id FROM mydb.places WHERE uuid = :uuidPlace)' : '';

    return `
        SELECT
            up.uuid,
            up.fk_user,
            up.fk_place,
            up.created,
            up.createdby,
            u.username AS user_username,
            u.uuid AS user_uuid,
            p.name AS place_name,
            p.uuid AS place_uuid
        FROM mydb.users_has_places AS up
        JOIN mydb.users AS u ON up.fk_user = u.id
        JOIN mydb.places AS p ON up.fk_place = p.id
        WHERE up.created <= :now
        AND (up.deleted > :now OR up.deleted IS NULL)
        AND u.deleted IS NULL
        AND up.created <= :now
        AND (up.deleted > :now OR up.deleted IS NULL)
        AND true
        ${uuidCondition}
        ${uuidUserCondition}
        ${uuidPlaceCondition}
        ${_pagination}
    `;
}

const getUserHasPlacesListQuery = ({ limit, page, ...rest }) =>
    _userHasPlacesSelectQuery(pagination({ limit, page }))({ count: false })(rest);

const countUserHasPlacesListQuery = rest =>
    _userHasPlacesSelectQuery()({ count: 'COUNT(DISTINCT(up.uuid)) AS count' })(rest);

const insertUserHasPlacesQuery = ({ uuidUser, uuidPlace, createdBy }) => {
    const uuidUserCondition = uuidUser ? '(SELECT id FROM mydb.users WHERE uuid = :uuidUser),' : null;
    const uuidPlaceCondition = uuidPlace ? '(SELECT id FROM mydb.places WHERE uuid = :uuidPlace),' : null;
    const createdByCondition = createdBy ? 'createdBy = :createdBy' : null;
    return `
        INSERT INTO mydb.users_has_places (
            uuid,
            fk_user,
            fk_place,
            created,
            createdBy
        )
        VALUES (
            :uuid
            ${uuidUserCondition}
            ${uuidPlaceCondition}
            :now,
            ${createdByCondition}
        );
        SELECT * FROM mydb.users_has_places WHERE uuid = UUID();
    `
}

const modifyUserHasPlacesQuery = () => {
    const uuidUserCondition = uuidUser ? 'fk_user = (SELECT id FROM mydb.users WHERE uuid = :uuidUser)' : ``;
    const uuidPlaceCondition = uuidPlace ? 'fk_place = (SELECT id FROM mydb.places WHERE uuid = :uuidPlace)' : ``;
    return `
        UPDATE mydb.users_has_places
        SET 
            ${uuidUserCondition}
            ${uuidPlaceCondition}
            uuid = :uuid
        WHERE
            users_has_places.uuid = :uuid
        AND 
            users_has_places.deleted IS NULL;
        SELECT * FROM mydb.users_has_places WHERE uuid = :uuid;
    `
}

const softDeleteUserHasPlacesQuery = () => {
    return `
        UPDATE 
            mydb.users_has_places
        SET 
            deleted = :deleted, deletedBy = :deletedBy
        WHERE
            users_has_places.uuid = :uuid
        AND 
            users_has_places.deleted IS NULL;
    `
}

export {
    getUserHasPlacesListQuery,
    countUserHasPlacesListQuery,
    insertUserHasPlacesQuery,
    modifyUserHasPlacesQuery,
    softDeleteUserHasPlacesQuery
};