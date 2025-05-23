import { pagination } from "../../utils/pagination.js";

const _endpointsQuery = (_pagination = '') => ({ count }) => ({ uuid, route, method }) => {
    const uuidCondition = uuid ? "AND uuid = :uuid " : "";
    const routeCondition = route ? "AND route = :route " : "";
    const methodCondition = method ? "AND method = :method " : "";
    return `
            SELECT
            ${count || `*`}
            FROM
            dbmaster.endpoints as e
            WHERE
            e.created <= :now
            AND
            (e.deleted > :now OR e.deleted IS NULL)
            AND
            true
            ${uuidCondition}
            ${routeCondition}
            ${methodCondition}
            ${_pagination}
        `;
}

const getEndpointsQuery = ({ limit, page, ...rest }) =>
    _endpointsQuery(pagination({ limit, page }))({ count: false })(rest);
const countEndpointsQuery = rest =>
    _endpointsQuery()({ count: "COUNT(*) AS count" })(rest);

const insertEndpointsQuery = () => {
    return `
    INSERT INTO dbmaster.endpoints (
      uuid,
      route,
      created,
      createdBy
    )
    VALUES (
      :uuid,
      :route,
      :now,
      :createdBy
    );
    SELECT * FROM dbmaster.endpoints WHERE uuid = :uuid;
    `
}

const updateEndpointsQuery = (route) => {
    const routeCondition = route ? 'route = :route,' : '';
    return `
    UPDATE dbmaster.endpoints
    SET
        ${routeCondition}
        uuid = :uuid
    WHERE uuid = :uuid
    AND deleted IS NULL;
    SELECT * FROM dbmaster.endpoints WHERE uuid = :uuid;
    `
}

const softDeleteEndpointsQuery = () => {
    return `
    UPDATE dbmaster.endpoints
    SET deleted = :deleted, deletedBy = :deletedBy
    WHERE uuid = :uuid
    AND deleted IS NULL
    `
}

const deleteEndpointsQuery = () => {
    return `
    DELETE FROM dbmaster.endpoints
    WHERE uuid = :uuid;
    SELECT * FROM dbmaster.endpoints WHERE uuid = :uuid;
    `
}

export {
    getEndpointsQuery,
    countEndpointsQuery,
    insertEndpointsQuery,
    updateEndpointsQuery,
    softDeleteEndpointsQuery,
    deleteEndpointsQuery
};