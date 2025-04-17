import { pagination } from "../../utils/pagination.js";

const _placeSelectQuery = (_pagination = '') => ({ count }) => ({ uuid, name, description, address, latitude, longitude }) => {
    const uuidCondition = uuid ? 'AND p.uuid = :uuid ' : '';
    const nameCondition = name ? `AND p.name LIKE CONCAT('%',:name,'%')` : '';
    const descriptionCondition = description ? `AND p.description LIKE CONCAT('%',:description,'%')` : '';
    const addressCondition = address ? `AND p.address LIKE CONCAT('%',:address,'%')` : '';
    const latitudeCondition = latitude ? `AND p.latitude = :latitude` : '';
    const longitudeCondition = longitude ? `AND p.longitude = :longitude` : '';
    return `
        SELECT ${count ||
            `p.uuid,
            p.name,
            p.description,
            p.address,
            p.latitude,
            p.longitude,
            p.created`}
        FROM dbmaster.places AS p
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

const insertPlaceQuery = ({ description, address, createdBy }) => {
    const descriptionCondition = description ? ':description' : null;
    const addressCondition = address ? ':address' : null;
    const createdByCondition = createdBy ? 'createdBy = :createdBy' : null;
    return `
        INSERT INTO dbmaster.places (
            uuid,
            name,
            description,
            address,
            longitude,
            latitude
            created,
            createdBy
        )
        VALUES (
            :uuid,
            :name,
            ${descriptionCondition},
            ${addressCondition},
            :longitude
            :latitude,
            :now,
            ${createdByCondition}
        )
    `;
}

const updatePlaceQuery = ({ name, description, address, latitude, longitude }) => {
    const nameCondition = name ? 'name = :name,' : '';
    const descriptionCondition = description ? 'description = :description,' : '';
    const addressCondition = address ? 'address = :address' : '';
    const longitudeCondition = longitude ? 'longitude = :longitude' : '';
    const latitudeCondition = latitude ? 'latitude = :latitude' : '';

    return `
        UPDATE dbmaster.places AS p
        SET
            ${nameCondition}
            ${descriptionCondition}
            ${addressCondition}
            ${longitudeCondition}
            ${latitudeCondition}
        WHERE 
            p.uuid = :uuid
        AND p.deleted IS NULL   
        AND p.created <= NOW()
        AND (p.deleted > NOW() OR p.deleted IS NULL)
    `;
}

const deletePlaceQuery = () => {
    return `
        UPDATE dbmaster.places AS p
        SET
            deleted = :deleted, deletedby = :deletedBy
        WHERE 
            p.uuid = :uuid
        AND p.deleted IS NULL
        AND p.created <= NOW()
        AND (p.deleted > NOW() OR p.deleted IS NULL)
    `;
}

export {
    getPlaceListQuery,
    countPlaceListQuery,
    insertPlaceQuery,
    updatePlaceQuery,
    deletePlaceQuery
};
