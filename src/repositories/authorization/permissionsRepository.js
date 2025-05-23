import { pagination } from '../../utils/pagination.js'

const _permissionsQuery = (_pagination = '') => ({count}) => ({uuid, action, endpoint}) => {
    const uuidCondition = uuid ? 'AND uuid = :uuid ' : '';
    const actionCondition = action ? 'AND action = :action ' : '';
    const endpointCondition = endpoint ? 'AND fk_endpoint = (SELECT id from dbmaster.endpoints WHERE route = :endpoint)' : '';
    return `
      SELECT
        ${count || 
            `*`}
      FROM
        dbmaster.permissions as p
      LEFT JOIN
        dbmaster.endpoints as e ON p.fk_endpoint = e.id 
      WHERE
         e.created <= :now
        AND (e.deleted > :now OR e.deleted IS NULL)
      AND
        p.created <= :now
      AND
        (p.deleted > :now OR p.deleted IS NULL)
      AND
        true
        ${uuidCondition}
        ${actionCondition}
        ${endpointCondition}
        ${_pagination}
    `;
}

const getPermissionsQuery = ({ limit, page, ...rest }) =>
    _permissionsQuery(pagination({ limit, page }))({ count: false })(rest);
const countPermissionsQuery = rest => 
    _permissionsQuery()({ count: 'COUNT(*) AS count' })(rest);

const insertPermissionsQuery = (createdBy) => {
  const createdByCondition = createdBy ? ':createdBy' : null;
  return `
    INSERT INTO dbmaster.permissions (
      uuid,
      action,
      fk_endpoint,
      created,
      createdBy
    )
    VALUES (
      :uuid,
      :action,
      (SELECT id FROM dbmaster.endpoints WHERE route = :endpoint),
      :now,
      ${createdByCondition}
    );
    SELECT * FROM dbmaster.permissions WHERE uuid = :uuid;
  `
}

const modifyPermissionsQuery = (action, endpoint) => {
  const actionCondition = action ? 'action = :action,' : '';
  const endpointCondition = endpoint ? 'fk_endpoint = (SELECT id from dbmaster.endpoints WHERE route = :endpoint),' : '';
  return `
  UPDATE dbmaster.permissions AS permissions
  SET 
      ${actionCondition}
      ${endpointCondition}
      uuid = :uuid
  WHERE
      permissions.uuid = :uuid
  AND 
      permissions.deleted IS NULL;
  SELECT * FROM dbmaster.permissions WHERE uuid = :uuid;
  `
}

const softDeletePermissionsQuery = () => {
    return `
    UPDATE 
        dbmaster.permissions AS permissions
    SET 
        deleted = :now, deletedBy = :deletedBy
    WHERE
        permissions.uuid = :uuid
    AND 
        permissions.deleted IS NULL;
    SELECT * FROM dbmaster.permissions WHERE uuid = :uuid;
    `
}

export {
    getPermissionsQuery,
    countPermissionsQuery,
    insertPermissionsQuery,
    modifyPermissionsQuery,
    softDeletePermissionsQuery
}