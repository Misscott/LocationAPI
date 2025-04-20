import { pagination } from '../../utils/pagination.js'

const _favoritesQuery = (_pagination = '') => ({count}) => ({uuid, place_uuid, user_uuid, roleName}) => {
    const uuidCondition = uuid ? 'AND r.uuid = :uuid' : '';
    const placeUuidCondition = place_uuid ? 'AND fk_place = (SELECT id from dbmaster.places WHERE uuid = :place_uuid)' : '';
    const userUuidCondition = user_uuid ? 'AND fk_user = (SELECT id from dbmaster.users WHERE uuid = :user_uuid)' : '';
    return `
      SELECT
        ${count || 
            `r.*, 
            place.uuid as place_uuid, 
            p.uuid as user_uuid, 
            place.name as place_name,
            place.address as place_address,
            place.latitude as place_latitude,
            place.longitude as place_longitude,
            place.description as place_description
            p.username as user_username`}
      FROM
        dbmaster.favorites as r
      JOIN 
        dbmaster.places as place ON r.fk_place = place.id 
        AND place.created <= :now
        AND (place.deleted > :now OR place.deleted IS NULL)
      JOIN 
        dbmaster.users as p ON r.fk_user = p.id
        AND p.created <= :now
        AND (p.deleted > :now OR p.deleted IS NULL)
      WHERE
        r.created <= :now
      AND
        (r.created > :now OR r.deleted IS NULL)
      AND
        true
        ${uuidCondition}
        ${userUuidCondition}
        ${placeUuidCondition}
        ${_pagination}
    `;
    }

const getFavoritesQuery = ({ limit, page, ...rest }) =>
    _favoritesQuery(pagination({ limit, page }))({ count: false })(rest);
const countFavoritesQuery = rest =>
    _favoritesQuery()({ count: 'COUNT(*) AS count' })(rest);

const insertFavoritesQuery = () => {
    return `
    INSERT INTO dbmaster.favorites (
      uuid,
      fk_place,
      fk_user,
      created,
      createdBy
    )
    VALUES (
      :uuid,
      (SELECT id FROM dbmaster.places WHERE uuid = :place_uuid),
      (SELECT id FROM dbmaster.users WHERE uuid = :user_uuid),
      :now,
      :createdBy
    );
    SELECT f.*,
    users.uuid as user_uuid,
    places.uuid as place_uuid,
    places.name as role_name
    FROM dbmaster.favorites as f
    LEFT JOIN dbmaster.users as users ON f.fk_user = users.id
    LEFT JOIN dbmaster.places as places ON f.fk_place = places.id
    WHERE f.uuid = :uuid;
    `
}

const modifyFavoritesQuery = ({new_place_uuid, new_user_uuid}) => {
  const placeUuidCondition = new_place_uuid ? 'fk_place = (SELECT id from dbmaster.places WHERE uuid = :new_place_uuid),' : '';
  const showNewPlaceCondition = new_place_uuid ? 'AND dbmaster.places.uuid = :new_place_uuid' : ''
  const userUuidCondition = new_user_uuid ? 'fk_user = (SELECT id from dbmaster.users WHERE uuid = :new_user_uuid),' : '';
  const showNewUserCondition = new_user_uuid? 'AND dbmaster.users.uuid = :new_user_uuid' : ''
  return `
    UPDATE 
        dbmaster.favorites as favorites
    SET 
        ${placeUuidCondition}
        ${userUuidCondition}
        favorites.created = favorites.created
    WHERE
        favorites.fk_place = (SELECT id from dbmaster.places WHERE uuid = :place_uuid)
        AND favorites.fk_user = (SELECT id from dbmaster.users WHERE uuid = :user_uuid)
    AND 
        favorites.deleted IS NULL; 
        
    SELECT f.*,
    users.uuid as user_uuid,
    places.uuid as place_uuid,
    places.name as place_name
    FROM dbmaster.favorites as f
    LEFT JOIN dbmaster.users as users ON f.fk_user = users.id
    LEFT JOIN dbmaster.places as places ON f.fk_place = places.id
    WHERE 
    true
    ${showNewUserCondition}
    ${showNewPlaceCondition};
  `
}

const softDeleteFavoritesQuery = ({place_uuid}) => {
  const placeUuidCondition = place_uuid ? 'AND favorites.fk_place = (SELECT id from dbmaster.places WHERE uuid = :place_uuid)' : '';
  return `
    UPDATE 
        dbmaster.favorites as favorites
    SET 
        deleted = :deleted, deletedBy = :deletedBy
    WHERE
        favorites.fk_user = (SELECT id from dbmaster.users WHERE uuid = :user_uuid)
        ${placeUuidCondition}
    AND
        favorites.deleted IS NULL    
  `
}

export{
    getFavoritesQuery,
    insertFavoritesQuery,
    countFavoritesQuery,
    softDeleteFavoritesQuery,
    modifyFavoritesQuery
}