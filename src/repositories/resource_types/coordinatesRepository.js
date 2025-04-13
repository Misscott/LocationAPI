import { pagination } from "../../utils/pagination.js";

const _coordinatesSelectQuery = (_pagination = '') => ({ count }) => ({ uuid, latitude, longitude }) => {
    const uuidCondition = uuid ? 'AND c.uuid = :uuid ' : '';
    const latitudeCondition = latitude ? 'AND c.latitude = :latitude ' : '';
    const longitudeCondition = longitude ? 'AND c.longitude = :longitude ' : '';

    return `
        SELECT ${count ||
            `c.uuid,
            c.created,
            c.createdby,
            c.latitude,
            c.longitude`}
        FROM acloc.coordinates AS c
        WHERE c.created <= :now
        AND (c.deleted > :now OR c.deleted IS NULL)
        AND true
        ${uuidCondition}
        ${latitudeCondition}
        ${longitudeCondition}
        ${_pagination}
    `;
}

const getCoordinatesListQuery = ({ limit, page, ...rest }) =>
    _coordinatesSelectQuery(pagination({ limit, page }))({ count: false })(rest);

const countCoordinatesListQuery = rest =>
    _coordinatesSelectQuery()({ count: 'COUNT(DISTINCT(c.uuid)) AS count' })(rest);

const insertCoordinatesQuery = () => {
    return `
        INSERT INTO acloc.coordinates (
            uuid,
            latitude,
            longitude,
            created,
            createdBy
        )
        VALUES (
            :uuid,
            :latitude,
            :longitude,
            :now,
            :createdBy
        );
        SELECT * FROM acloc.coordinates WHERE uuid = :uuid;
    `
}

const updateCoordinatesQuery = (latitude, longitude) => {
    const latitudeCondition = latitude ? 'latitude = :latitude,' : '';
    const longitudeCondition = longitude ? 'longitude = :longitude,' : '';
    return `
        UPDATE acloc.coordinates
        SET
            ${latitudeCondition}
            ${longitudeCondition}
            uuid = :uuid
        WHERE uuid = :uuid
        AND deleted IS NULL;
        SELECT * FROM acloc.coordinates WHERE uuid = :uuid;
    `
}

const softDeleteCoordinatesQuery = () => {
    return `
        UPDATE 
            acloc.coordinates
        SET
            deleted = :deleted, deletedby = :deletedBy
        WHERE uuid = :uuid
        AND deleted IS NULL;
    `
}

export {
    getCoordinatesListQuery,
    countCoordinatesListQuery,
    insertCoordinatesQuery,
    updateCoordinatesQuery,
    softDeleteCoordinatesQuery
}