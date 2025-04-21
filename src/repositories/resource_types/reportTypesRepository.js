import { pagination } from "../../utils/pagination.js";

const _coordinatesSelectQuery = (_pagination = '') => ({ count }) => ({ uuid, name }) => {
    const uuidCondition = uuid ? 'AND rt.uuid = :uuid ' : '';
    const nameCondition = name ? `AND rt.name LIKE CONCAT('%',:name,'%')` : '';
    return `
        SELECT ${count ||
            `*`}
        FROM dbmaster.report_types AS rt
        WHERE rt.created <= :now
        AND (rt.deleted > :now OR rt.deleted IS NULL)
        AND true
        ${uuidCondition}
        ${nameCondition}
        ${_pagination}
    `;
}

const getReportTypesListQuery = ({ limit, page, ...rest }) =>
    _coordinatesSelectQuery(pagination({ limit, page }))({ count: false })(rest);

const countReportTypesListQuery = rest =>
    _coordinatesSelectQuery()({ count: 'COUNT(DISTINCT(rt.uuid)) AS count' })(rest);

const insertReportTypesQuery = (createdBy) => {
    const createdByCondition = createdBy ? ', :createdBy' : null;
    return `
        INSERT INTO dbmaster.report_types (
            uuid,
            name,
            created,
            createdBy
        )
        VALUES (
            :uuid,
            :name,
            :now
            ${createdByCondition}
        );
        SELECT * FROM dbmaster.report_types WHERE uuid = :uuid;
    `
}

const updateReportTypesQuery = (name) => {
    const nameCondition = name ? 'name = :name,' : '';
    return `
        UPDATE dbmaster.report_types
        SET
            ${nameCondition}
            uuid = :uuid
        WHERE uuid = :uuid
        AND deleted IS NULL;
        SELECT * FROM dbmaster.report_types WHERE uuid = :uuid;
    `
}

const softDeleteReportTypesQuery = () => {
    return `
        UPDATE 
            dbmaster.report_types
        SET
            deleted = :deleted,
            deletedBy = :deletedBy
        WHERE uuid = :uuid
        AND deleted IS NULL;
        SELECT * FROM dbmaster.report_types WHERE uuid = :uuid;
    `
}

export {
    getReportTypesListQuery,
    countReportTypesListQuery,
    insertReportTypesQuery,
    updateReportTypesQuery,
    softDeleteReportTypesQuery
}