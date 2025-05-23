import { pagination } from "../../utils/pagination.js";

const _userHasPlacesSelectQuery = (_pagination = '') => ({ count }) => ({ uuid, user_uuid, place_uuid, report_type_uuid, rating, description }) => {
    const uuidCondition = uuid ? 'AND up.uuid = :uuid ' : '';
    const user_uuidCondition = user_uuid ? 'AND up.fk_user = (SELECT id FROM dbmaster.users WHERE uuid = :user_uuid)' : '';
    const place_uuidCondition = place_uuid ? 'AND up.fk_place = (SELECT id FROM dbmaster.places WHERE uuid = :place_uuid)' : '';
    const report_type_uuidCondition = report_type_uuid ? 'AND up.fk_report_type = (SELECT id FROM dbmaster.report_types WHERE uuid = :report_type_uuid)' : '';
    const ratingCondition = rating ? 'AND up.rating = :rating' : '';
    const descriptionCondition = description ? `AND up.description LIKE CONCAT('%',:description,'%')` : '';
    
    // Conditional fields and joins for the report type
    const reportTypeFields = report_type_uuid ? `, rt.name AS report_type_name,
        rt.uuid AS report_type_uuid` : '';
    
    const reportTypeJoin =  report_type_uuid ? 'LEFT JOIN dbmaster.report_types AS rt ON up.fk_report_type = rt.id' : '';
    
    const reportTypeDeletedCondition = report_type_uuid ? 'AND rt.deleted IS NULL' : '';
    
    return `
        SELECT ${count ||
            `up.*,
            u.username AS user_username,
            u.uuid AS user_uuid,
            p.name AS place_name,
            p.uuid AS place_uuid${reportTypeFields}`}
        FROM dbmaster.users_has_places AS up
        LEFT JOIN dbmaster.users AS u ON up.fk_user = u.id
        LEFT JOIN dbmaster.places AS p ON up.fk_place = p.id
        ${reportTypeJoin}
        WHERE up.created <= :now
        AND (up.deleted > :now OR up.deleted IS NULL)
        AND u.deleted IS NULL
        AND p.deleted IS NULL
        ${reportTypeDeletedCondition}
        ${uuidCondition}
        ${user_uuidCondition}
        ${place_uuidCondition}
        ${report_type_uuidCondition}
        ${ratingCondition}
        ${descriptionCondition}
        ${_pagination}
    `;
}

const getUserHasPlacesListQuery = ({ limit, page, ...rest }) =>
    _userHasPlacesSelectQuery(pagination({ limit, page }))({ count: false })(rest);

const countUserHasPlacesListQuery = rest =>
    _userHasPlacesSelectQuery()({ count: 'COUNT(DISTINCT(up.uuid)) AS count' })(rest);

const insertUserHasPlacesQuery = ({ user_uuid, place_uuid, description, createdBy, report_type_uuid, images}) => {
    const user_uuidCondition = user_uuid ? '(SELECT id FROM dbmaster.users WHERE uuid = :user_uuid)' : null;
    const place_uuidCondition = place_uuid ? '(SELECT id FROM dbmaster.places WHERE uuid = :place_uuid)' : null;
    const createdByCondition = createdBy ? ':createdBy' : null;
    const descriptionCondition = description ? ':description' : null;
    const reportTypeCondition = report_type_uuid ? `(SELECT id FROM dbmaster.report_types WHERE uuid = :report_type_uuid)` : null;
    const imagesCondition = images ? ':images' : null;
    
    return `
        INSERT INTO dbmaster.users_has_places (
            uuid,
            fk_user,
            fk_place,
            fk_report_type,
            rating,
            images,
            description,
            createdBy,
            created
        )
        VALUES (
            :uuid,
            ${user_uuidCondition},
            ${place_uuidCondition},
            ${reportTypeCondition},
            :rating,
            ${imagesCondition},
            ${descriptionCondition},
            ${createdByCondition},
            :now
        );
        SELECT * FROM dbmaster.users_has_places WHERE uuid = :uuid;
    `
}

const modifyUserHasPlacesQuery = ({user_uuid, place_uuid, report_type_uuid, rating, images, description}) => {
    const user_uuidCondition = user_uuid ? 'fk_user = (SELECT id FROM dbmaster.users WHERE uuid = :user_uuid),' : ``;
    const place_uuidCondition = place_uuid ? 'fk_place = (SELECT id FROM dbmaster.places WHERE uuid = :place_uuid),' : ``;
    const report_type_uuidCondition = report_type_uuid ? 'fk_report_type = (SELECT id FROM dbmaster.report_types WHERE uuid = :report_type_uuid),' : ``;
    const ratingCondition = rating ? 'rating = :rating,' : ``;
    const imagesCondition = images ? `images = :images,` : '';
    const descriptionCondition = description ? `description = :description,` : ``;
    return `
        UPDATE dbmaster.users_has_places
        SET 
            ${user_uuidCondition}
            ${place_uuidCondition}
            ${report_type_uuidCondition}
            ${ratingCondition}
            ${imagesCondition}
            ${descriptionCondition}
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