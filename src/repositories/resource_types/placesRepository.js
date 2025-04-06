import { pagination } from "../../utils/pagination.js";

const _placeSelectQuery = (_pagination = '') => ({ count }) => ({ uuid, name, description, address, latitude, longitude }) => {
    const uuidCondition = uuid ? 'AND p.uuid = :uuid ' : '';
    const nameCondition = name ? `AND p.name LIKE CONCAT('%',:name,'%')` : '';
    const descriptionCondition = description ? `AND p.description LIKE CONCAT('%',:description,'%')` : '';
    const addressCondition = address ? `AND p.address LIKE CONCAT('%',:address,'%')` : '';
    const latitudeCondition = latitude ? 'AND p.latitude = :latitude ' : '';
    const longitudeCondition = longitude ? 'AND p.longitude = :longitude ' : '';
    return `
        SELECT
            p.uuid,
            p.name,
            p.description,
            p.address,
            p.latitude,
            p.longitude,
            p.created,
            p.createdby
        WHERE p.deleted IS NULL
        AND p.created <= :now
        AND (p.deleted > :now OR p.deleted IS NULL)
        AND true
        ${uuidCondition}
        ${nameCondition}
        ${descriptionCondition}
        ${addressCondition}
        ${latitudeCondition}
        ${longitudeCondition}
        ${_pagination}
    `;
}

const getPlaceListQuery = ({ limit, page, ...rest }) =>
    _placeSelectQuery(pagination({ limit, page }))({ count: false })(rest);

const countPlaceListQuery = rest =>
    _placeSelectQuery()({ count: 'COUNT(DISTINCT(p.uuid)) AS count' })(rest);

const insertPlaceQuery = ({ name, description, address, latitude, longitude, createdBy }) => {
    const nameCondition = name ? ':name' : null;
    const descriptionCondition = description ? ':description' : null;
    const addressCondition = address ? ':address' : null;
    const latitudeCondition = latitude ? ':latitude' : null;
    const longitudeCondition = longitude ? ':longitude' : null;
    const createdByCondition = createdBy ? 'createdBy = :createdBy' : null;
    return `
        INSERT INTO mydb.places (
            uuid,
            name,
            description,
            address,
            latitude,
            longitude,
            created,
            createdBy
        )
        VALUES (
            UUID(),
            ${nameCondition},
            ${descriptionCondition},
            ${addressCondition},
            ${latitudeCondition},
            ${longitudeCondition},
            NOW(),
            ${createdByCondition}
        )
    `;
}

const updatePlaceQuery = ({ uuid, name, description, address, latitude, longitude, updatedBy }) => {
    const uuidCondition = uuid ? 'AND p.uuid = :uuid ' : '';
    const nameCondition = name ? ':name' : null;
    const descriptionCondition = description ? ':description' : null;
    const addressCondition = address ? ':address' : null;
    const latitudeCondition = latitude ? ':latitude' : null;
    const longitudeCondition = longitude ? ':longitude' : null;
    const updatedByCondition = updatedBy ? 'updatedBy = :updatedBy' : null;
    return `
        UPDATE mydb.places AS p
        SET
            name = ${nameCondition},
            description = ${descriptionCondition},
            address = ${addressCondition},
            latitude = ${latitudeCondition},
            longitude = ${longitudeCondition},
            updated = NOW(),
            ${updatedByCondition}
        WHERE p.deleted IS NULL
        AND p.created <= NOW()
        AND (p.deleted > NOW() OR p.deleted IS NULL)
        ${uuidCondition}
    `;
}

const deletePlaceQuery = ({ uuid, deletedBy }) => {
    const uuidCondition = uuid ? 'AND p.uuid = :uuid ' : '';
    const deletedByCondition = deletedBy ? 'deletedBy = :deletedBy' : null;
    return `
        UPDATE mydb.places AS p
        SET
            deleted = NOW(),
            ${deletedByCondition}
        WHERE p.deleted IS NULL
        AND p.created <= NOW()
        AND (p.deleted > NOW() OR p.deleted IS NULL)
        ${uuidCondition}
    `;
}

export {
    getPlaceListQuery,
    countPlaceListQuery,
    insertPlaceQuery,
    updatePlaceQuery,
    deletePlaceQuery
};
