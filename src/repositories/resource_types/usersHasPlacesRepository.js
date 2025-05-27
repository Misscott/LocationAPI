import { pagination } from "../../utils/pagination.js";

const _userHasPlacesSelectQuery = (_pagination = '') => ({ count }) => ({ uuid, user_uuid, place_uuid, report_type_uuid, rating, description }) => {
    const uuidCondition = uuid ? 'AND up.uuid = :uuid ' : '';
    const user_uuidCondition = user_uuid ? 'AND up.fk_user = (SELECT id FROM dbmaster.users WHERE uuid = :user_uuid)' : '';
    const place_uuidCondition = place_uuid ? 'AND up.fk_place = (SELECT id FROM dbmaster.places WHERE uuid = :place_uuid)' : '';
    const ratingCondition = rating ? 'AND up.rating = :rating' : '';
    const descriptionCondition = description ? `AND up.description LIKE CONCAT('%',:description,'%')` : '';

    // For filter type, we do EXISTS with intermediate table
    const reportTypeCondition = report_type_uuid ? `
        AND EXISTS (
            SELECT 1 FROM dbmaster.report_report_type rrt
            WHERE rrt.report_uuid = up.uuid AND rrt.report_type_uuid = :report_type_uuid
        )
    ` : '';

    return `
        SELECT ${count || `up.*,
            u.username AS user_username,
            u.uuid AS user_uuid,
            p.name AS place_name,
            p.uuid AS place_uuid,
            GROUP_CONCAT(rt.uuid) AS report_type_uuids,
            GROUP_CONCAT(rt.name) AS report_type_names`
        }
        FROM dbmaster.users_has_places AS up
        LEFT JOIN dbmaster.users AS u ON up.fk_user = u.id
        LEFT JOIN dbmaster.places AS p ON up.fk_place = p.id
        LEFT JOIN dbmaster.report_report_type AS rrt ON rrt.report_uuid = up.uuid
        LEFT JOIN dbmaster.report_types AS rt ON rt.uuid = rrt.report_type_uuid
        WHERE up.created <= :now
        AND (up.deleted > :now OR up.deleted IS NULL)
        AND u.deleted IS NULL
        AND p.deleted IS NULL
        ${uuidCondition}
        ${user_uuidCondition}
        ${place_uuidCondition}
        ${reportTypeCondition}
        ${ratingCondition}
        ${descriptionCondition}
        GROUP BY up.uuid
        ${_pagination}
    `;
}


const getUserHasPlacesListQuery = ({ limit, page, ...rest }) =>
    _userHasPlacesSelectQuery(pagination({ limit, page }))({ count: false })(rest);

const countUserHasPlacesListQuery = rest =>
    _userHasPlacesSelectQuery()({ count: 'COUNT(DISTINCT(up.uuid)) AS count' })(rest);

const insertUserHasPlacesQuery = ({ user_uuid, place_uuid, description, createdBy, report_type_uuid, images }) => {
    const report_type_uuidStatements = report_type_uuid && report_type_uuid.length > 0 
        ? report_type_uuid.map(rt => 
            `INSERT INTO dbmaster.report_report_type (report_uuid, report_type_uuid) VALUES (:uuid, '${rt}');`
          ).join('\n        ')
        : '';

    const user_uuidCondition = user_uuid ? '(SELECT id FROM dbmaster.users WHERE uuid = :user_uuid)' : 'NULL';
    const place_uuidCondition = place_uuid ? '(SELECT id FROM dbmaster.places WHERE uuid = :place_uuid)' : 'NULL';
    const createdByCondition = createdBy ? ':createdBy' : 'NULL';
    const descriptionCondition = description ? ':description' : 'NULL';
    const imagesCondition = images ? ':images' : 'NULL';

    return `
        INSERT INTO dbmaster.users_has_places (
            uuid,
            fk_user,
            fk_place,
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
            :rating,
            ${imagesCondition},
            ${descriptionCondition},
            ${createdByCondition},
            :now
        );
        
        ${report_type_uuidStatements}
        
        SELECT 
            up.*,
            u.username AS user_username,
            u.uuid AS user_uuid,
            p.name AS place_name,
            p.uuid AS place_uuid,
            GROUP_CONCAT(rt.uuid) AS report_type_uuids,
            GROUP_CONCAT(rt.name) AS report_type_names
        FROM dbmaster.users_has_places AS up
        LEFT JOIN dbmaster.users AS u ON up.fk_user = u.id
        LEFT JOIN dbmaster.places AS p ON up.fk_place = p.id
        LEFT JOIN dbmaster.report_report_type AS rrt ON rrt.report_uuid = up.uuid
        LEFT JOIN dbmaster.report_types AS rt ON rt.uuid = rrt.report_type_uuid
        WHERE up.created <= :now
        AND (up.deleted > :now OR up.deleted IS NULL)
        AND u.deleted IS NULL
        AND p.deleted IS NULL
        GROUP BY up.uuid;
    `;
}

const modifyUserHasPlacesQuery = ({user_uuid, place_uuid, report_type_uuid, rating, images, description}) => {
    const user_uuidCondition = user_uuid ? 'fk_user = (SELECT id FROM dbmaster.users WHERE uuid = :user_uuid),' : '';
    const place_uuidCondition = place_uuid ? 'fk_place = (SELECT id FROM dbmaster.places WHERE uuid = :place_uuid),' : '';
    const report_type_uuidCondition = report_type_uuid ? `DELETE FROM dbmaster.report_report_type WHERE report_uuid = :uuid; ${report_type_uuid.map(rt => `INSERT INTO dbmaster.report_report_type (report_uuid, report_type_uuid) VALUES (:uuid, '${rt}');`).join(' ')}` : '';
    const ratingCondition = rating ? 'rating = :rating,' : '';
    const imagesCondition = images ? 'images = :images,' : '';
    const descriptionCondition = description ? 'description = :description,' : '';
    
    return `
        ${report_type_uuidCondition}
        UPDATE dbmaster.users_has_places
        SET 
            ${user_uuidCondition}
            ${place_uuidCondition}
            ${ratingCondition}
            ${imagesCondition}
            ${descriptionCondition}
            uuid = :uuid
        WHERE uuid = :uuid AND deleted IS NULL;
        
        SELECT 
            up.*,
            u.username AS user_username,
            u.uuid AS user_uuid,
            p.name AS place_name,
            p.uuid AS place_uuid,
            GROUP_CONCAT(rt.uuid) AS report_type_uuids,
            GROUP_CONCAT(rt.name) AS report_type_names
        FROM dbmaster.users_has_places AS up
        LEFT JOIN dbmaster.users AS u ON up.fk_user = u.id
        LEFT JOIN dbmaster.places AS p ON up.fk_place = p.id
        LEFT JOIN dbmaster.report_report_type AS rrt ON rrt.report_uuid = up.uuid
        LEFT JOIN dbmaster.report_types AS rt ON rt.uuid = rrt.report_type_uuid
        WHERE up.uuid = :uuid
        AND (up.deleted > :now OR up.deleted IS NULL)
        AND u.deleted IS NULL
        AND p.deleted IS NULL
        GROUP BY up.uuid;
    `;
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