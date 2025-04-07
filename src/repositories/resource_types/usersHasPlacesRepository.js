import { pagination } from "../../utils/pagination";
//reports repository
const _userHasPlacesSelectQuery = (_pagination = '') => ({ count }) => ({ uuid, uuidUser, uuidPlace, uuidReportType }) => {
    const uuidCondition = uuid ? 'AND up.uuid = :uuid ' : '';
    const uuidUserCondition = uuidUser ? 'AND up.fk_user = (SELECT id FROM acloc.users WHERE uuid = :uuidUser)' : '';
    const uuidPlaceCondition = uuidPlace ? 'AND up.fk_place = (SELECT id FROM acloc.places WHERE uuid = :uuidPlace)' : '';
    const uuidReportTypeCondition = uuidReportType ? 'AND up.fk_report_type = (SELECT id FROM acloc.report_types WHERE uuid = :uuidReportType)' : '';

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
            p.uuid AS place_uuid,
            rt.name AS report_type_name,
            rt.uuid AS report_type_uuid
        FROM acloc.users_has_places AS up
        JOIN acloc.users AS u ON up.fk_user = u.id
        JOIN acloc.places AS p ON up.fk_place = p.id
        JOIN acloc.report_types AS rt ON up.fk_report_type = rt.id
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
        ${_pagination}
    `;
}

const getUserHasPlacesListQuery = ({ limit, page, ...rest }) =>
    _userHasPlacesSelectQuery(pagination({ limit, page }))({ count: false })(rest);

const countUserHasPlacesListQuery = rest =>
    _userHasPlacesSelectQuery()({ count: 'COUNT(DISTINCT(up.uuid)) AS count' })(rest);

const insertUserHasPlacesQuery = ({ uuidUser, uuidPlace, createdBy, uuidReportType }) => {
    const uuidUserCondition = uuidUser ? '(SELECT id FROM acloc.users WHERE uuid = :uuidUser),' : null;
    const uuidPlaceCondition = uuidPlace ? '(SELECT id FROM acloc.places WHERE uuid = :uuidPlace),' : null;
    const createdByCondition = createdBy ? 'createdBy = :createdBy' : null;
    const reportTypeCondition = uuidReportType ? '(SELECT id FROM acloc.report_types WHERE uuid = :reportType),' : null;
    return `
        INSERT INTO acloc.users_has_places (
            uuid,
            fk_user,
            fk_place,
            fk_report_type,
            created,
            createdBy
        )
        VALUES (
            :uuid
            ${uuidUserCondition}
            ${uuidPlaceCondition}
            ${reportTypeCondition}
            :now,
            ${createdByCondition}
        );
        SELECT * FROM acloc.users_has_places WHERE uuid = :uuid;
    `
}

const modifyUserHasPlacesQuery = (uuidUser, uuidPlace, uuidReportType) => {
    const uuidUserCondition = uuidUser ? 'fk_user = (SELECT id FROM acloc.users WHERE uuid = :uuidUser)' : ``;
    const uuidPlaceCondition = uuidPlace ? 'fk_place = (SELECT id FROM acloc.places WHERE uuid = :uuidPlace)' : ``;
    const uuidReportTypeCondition = uuidReportType ? 'fk_report_type = (SELECT id FROM acloc.report_types WHERE uuid = :uuidReportType)' : ``;
    return `
        UPDATE acloc.users_has_places
        SET 
            ${uuidUserCondition}
            ${uuidPlaceCondition}
            ${uuidReportTypeCondition}
            uuid = :uuid
        WHERE
            users_has_places.uuid = :uuid
        AND 
            users_has_places.deleted IS NULL;
        SELECT * FROM acloc.users_has_places WHERE uuid = :uuid;
    `
}

const softDeleteUserHasPlacesQuery = () => {
    return `
        UPDATE 
            acloc.users_has_places
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