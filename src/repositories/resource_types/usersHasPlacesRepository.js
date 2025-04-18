import { pagination } from "../../utils/pagination.js";
//reports repository
const _userHasPlacesSelectQuery = (_pagination = '') => ({ count }) => ({ uuid, uuidUser, uuidPlace, uuidReportType, rating }) => {
    const uuidCondition = uuid ? 'AND up.uuid = :uuid ' : '';
    const uuidUserCondition = uuidUser ? 'AND up.fk_user = (SELECT id FROM dbmaster.users WHERE uuid = :uuidUser)' : '';
    const uuidPlaceCondition = uuidPlace ? 'AND up.fk_place = (SELECT id FROM dbmaster.places WHERE uuid = :uuidPlace)' : '';
    const uuidReportTypeCondition = uuidReportType ? 'AND up.fk_report_type = (SELECT id FROM dbmaster.report_types WHERE uuid = :uuidReportType)' : '';
    const ratingCondition = rating ? 'AND up.rating = :rating' : '';
    return `
        SELECT ${count ||
            `up.*,
            u.username AS user_username,
            u.uuid AS user_uuid,
            p.name AS place_name,
            p.uuid AS place_uuid,
            rt.name AS report_type_name,
            rt.uuid AS report_type_uuid`}
        FROM dbmaster.users_has_places AS up
        JOIN dbmaster.users AS u ON up.fk_user = u.id
        JOIN dbmaster.places AS p ON up.fk_place = p.id
        JOIN dbmaster.report_types AS rt ON up.fk_report_type = rt.id
        WHERE up.created <= :now
        AND (up.deleted > :now OR up.deleted IS NULL)
        AND u.deleted IS NULL
        AND p.deleted IS NULL
        AND rt.deleted IS NULL
        AND true
        ${uuidCondition}
        ${uuidUserCondition}
        ${uuidPlaceCondition}
        ${uuidReportTypeCondition}
        ${ratingCondition}
        ${_pagination}
    `;
}

const getUserHasPlacesListQuery = ({ limit, page, ...rest }) =>
    _userHasPlacesSelectQuery(pagination({ limit, page }))({ count: false })(rest);

const countUserHasPlacesListQuery = rest =>
    _userHasPlacesSelectQuery()({ count: 'COUNT(DISTINCT(up.uuid)) AS count' })(rest);

const insertUserHasPlacesQuery = ({ uuidUser, uuidPlace, createdBy, uuidReportType }) => {
    const uuidUserCondition = uuidUser ? '(SELECT id FROM dbmaster.users WHERE uuid = :uuidUser),' : null;
    const uuidPlaceCondition = uuidPlace ? '(SELECT id FROM dbmaster.places WHERE uuid = :uuidPlace),' : null;
    const createdByCondition = createdBy ? 'createdBy = :createdBy,' : null;
    const reportTypeCondition = uuidReportType ? '(SELECT id FROM dbmaster.report_types WHERE uuid = :reportType),' : null;
    
    return `
        INSERT INTO dbmaster.users_has_places (
            uuid,
            fk_user,
            fk_place,
            fk_report_type,
            rating,
            createdBy,
            created
        )
        VALUES (
            :uuid
            ${uuidUserCondition}
            ${uuidPlaceCondition}
            ${reportTypeCondition}
            :rating,
            ${createdByCondition}
            :now
        );
        SELECT * FROM dbmaster.users_has_places WHERE uuid = :uuid;
    `
}

const modifyUserHasPlacesQuery = (uuidUser, uuidPlace, uuidReportType, rating) => {
    const uuidUserCondition = uuidUser ? 'fk_user = (SELECT id FROM dbmaster.users WHERE uuid = :uuidUser),' : ``;
    const uuidPlaceCondition = uuidPlace ? 'fk_place = (SELECT id FROM dbmaster.places WHERE uuid = :uuidPlace),' : ``;
    const uuidReportTypeCondition = uuidReportType ? 'fk_report_type = (SELECT id FROM dbmaster.report_types WHERE uuid = :uuidReportType),' : ``;
    const ratingCondition = rating ? 'rating = :rating,' : ``;
    return `
        UPDATE dbmaster.users_has_places
        SET 
            ${uuidUserCondition}
            ${uuidPlaceCondition}
            ${uuidReportTypeCondition}
            ${ratingCondition}
            uuid = :uuid
        WHERE
            users_has_places.uuid = :uuid
        AND 
            users_has_places.deleted IS NULL;
        SELECT * FROM dbmaster.users_has_places WHERE uuid = :uuid;
    `
}

const softDeleteUserHasPlacesQuery = () => {
    return `
        UPDATE 
            dbmaster.users_has_places
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