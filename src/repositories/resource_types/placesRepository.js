import { pagination } from "../../utils/pagination.js";

const _placeSelectQuery = (_pagination = '') => ({ count }) => ({ uuid, name, description, address, latitude, longitude }) => {
    const uuidCondition = uuid ? 'AND p.uuid = :uuid ' : '';
    const nameCondition = name ? `AND p.name LIKE CONCAT('%',:name,'%')` : '';
    const descriptionCondition = description ? `AND p.description LIKE CONCAT('%',:description,'%')` : '';
    const addressCondition = address ? `AND p.address LIKE CONCAT('%',:address,'%')` : '';
    const fk_coordinateCondition = latitude && longitude ? 'AND fk_coordinate = (SELECT id FROM acloc.coordinates WHERE latitude = :latitude AND longitude = :longitude)' : '';
    return `
        SELECT
            p.uuid,
            p.name,
            p.description,
            p.address,
            c.latitude,
            c.longitude,
            p.created,
            p.createdby
        FROM acloc.places AS p
        JOIN acloc.coordinates AS c ON p.fk_coordinate = c.id
        WHERE p.deleted IS NULL
        AND p.created <= :now
        AND (p.deleted > :now OR p.deleted IS NULL)
        AND true
        ${uuidCondition}
        ${nameCondition}
        ${descriptionCondition}
        ${addressCondition}
        ${fk_coordinateCondition}
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
        INSERT INTO acloc.places (
            uuid,
            name,
            description,
            address,
            fk_coordinates,
            created,
            createdBy
        )
        VALUES (
            :uuid,
            :name,
            ${descriptionCondition},
            ${addressCondition},
            (SELECT id FROM acloc.coordinates WHERE latitude = :latitude AND longitude = :longitude),
            :now,
            ${createdByCondition}
        )
    `;
}

const updatePlaceQuery = ({ name, description, address, latitude, longitude }) => {
    const nameCondition = name ? 'name = :name,' : '';
    const descriptionCondition = description ? 'description = :description,' : '';
    const addressCondition = address ? 'address = :address' : '';
    const fk_coordinateCondition = latitude && longitude ? 'fk_coordinate = (SELECT id FROM acloc.coordinates WHERE latitude = :latitude AND longitude = :longitude),' : '';

    return `
        UPDATE acloc.places AS p
        SET
            ${nameCondition}
            ${descriptionCondition}
            ${addressCondition}
            ${fk_coordinateCondition}
        WHERE 
            p.uuid = :uuid
        AND p.deleted IS NULL   
        AND p.created <= NOW()
        AND (p.deleted > NOW() OR p.deleted IS NULL)
    `;
}

const deletePlaceQuery = () => {
    return `
        UPDATE acloc.places AS p
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
