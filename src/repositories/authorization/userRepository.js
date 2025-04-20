import { pagination } from "../../utils/pagination.js";

/**
 * Generic select query that may or may not include counting rows
 * @param {Object} _pagination
 * @param {Object} count If true, query is of type SELECT COUNT
 * @param {Object} rest Rest of params involved on query
 * @returns {String} SELECT query
 */
const _userListSelectQuery = (_pagination = '') => 
    ({ count }) =>
      ({ uuid, username, loginUsername, uuidList, email, role, roleName }) => {
        const uuidCondition = uuid ? 'AND users.uuid = :uuid ' : '';
        //for uuidList, we use IN clause to check if the uuid is in the list of uuids passed
        const uuidListCondition = uuidList ? 'AND users.uuid in(:uuidList)' : ''
		    const loginUsernameCondition = loginUsername ? ' AND users.username = :loginUsername ' : ''
        const usernameCondition = username ? `AND users.username LIKE CONCAT('%',:username,'%')` : '';
        const emailCondition = email ? 'AND users.email = :email ' : '';
        const roleCondition = role ? 'AND users.fk_role = :role ' : '';  
        const roleNameCondition = roleName ? 'AND users.fk_role = (SELECT id FROM dbmaster.roles WHERE name = :roleName)' : '';
        return `
          SELECT
            ${count || `users.*, r.name AS role`}  
          FROM
            dbmaster.users as users
            LEFT JOIN dbmaster.roles as r ON users.fk_role = r.id
          WHERE
            users.created <= :now
          AND
            (users.deleted > :now OR users.deleted IS NULL)
          AND
            true
            ${uuidCondition}
            ${uuidListCondition}
            ${usernameCondition}
            ${emailCondition}
            ${roleCondition}
            ${loginUsernameCondition}
            ${roleNameCondition}
            ${_pagination}
        `;
      };
  

/**
 * Uses generic select query to return a simple query
 * @returns {String} simple select query
 */
const getUserListQuery = ({ limit, page, ...rest }) => 
  _userListSelectQuery(pagination({ limit, page }))({ count: false })(rest);

/**
 * Uses generic select query to return a select count type of query
 * @returns {String} SELECT COUNT(*) query
 */
const countUserListQuery = rest => 
  _userListSelectQuery()({ count: 'COUNT(DISTINCT(users.uuid)) AS count' })(rest);

/**
 * Insert query using parameters passed in request
 * @returns {String} INSERT query
 */
const insertUserQuery = ({email, fk_role, createdBy}) => {
    const emailCondition = email ? ':email' : null;
    const roleCondition = fk_role ? '(SELECT id FROM dbmaster.roles WHERE name = :fk_role),' : `(SELECT id FROM dbmaster.roles WHERE name = 'viewer'),`;
    const createdByCondition = createdBy ? ':createdBy' : null;
    return `
    INSERT INTO dbmaster.users (
      uuid,
      username,
      password,
      email,
      fk_role,
      createdBy,
      created
    )
    VALUES (
      :uuid,
      :username,
      :password,
      ${emailCondition},
      ${roleCondition}
      ${createdByCondition},
      :now
    );
    SELECT * FROM dbmaster.users WHERE uuid = :uuid;
    `
};

/**
 * @param {Object} params All params involved in query to be modified in certain object matching uuid passed as req param
 * @returns {String} UPDATE query
 */
const modifyUserQuery = ({ username, password, email, role }) => {
  const usernameCondition = username ? `username = :username, ` : ``;
  const passwordCondition = password ? `password = :password, ` : ``;
  const emailCondition = email ? `email = :email, ` : ``;
  const roleCondition = role ? `fk_role = (SELECT id FROM dbmaster.roles WHERE name = :role),` : ``;

  return `
    UPDATE
      dbmaster.users
    SET
      ${usernameCondition}
      ${passwordCondition}
      ${emailCondition}
      ${roleCondition}
      uuid = :uuid
    WHERE
      users.uuid = :uuid
    AND
      users.deleted IS NULL; 
    SELECT dbmaster.users.*
    FROM dbmaster.users
    WHERE users.uuid = :uuid
  `;
};

/**
 * @returns {String} DELETE query
 */
const deleteUserQuery = () => {
  return `
    DELETE FROM dbmaster.users
    WHERE users.uuid = :uuid
  `;
};

/**
 * 
 * @returns {String} SOFT DELETE query
 */
const softDeleteUserQuery = () => {
    return `
    UPDATE
        dbmaster.users
    SET
        deleted = :deleted, deletedby = :deletedBy
    WHERE
        users.uuid = :uuid
    AND
        deleted is null`
}

export { 
    getUserListQuery, 
    countUserListQuery, 
    insertUserQuery, 
    modifyUserQuery, 
    deleteUserQuery, 
    softDeleteUserQuery
};