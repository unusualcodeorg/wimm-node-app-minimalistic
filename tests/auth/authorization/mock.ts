// all dependent mock should be on the top
import { USER_ID, ACCESS_TOKEN } from '../authentication/mock';

import { Types } from 'mongoose';
import User from '../../../src/database/model/User';
import Role, { RoleCode } from '../../../src/database/model/Role';
import { BadTokenError } from '../../../src/core/ApiError';
import JWT, { JwtPayload } from '../../../src/core/JWT';
import { tokenInfo } from '../../../src/config';

export const VIEWER_ROLE_ID = new Types.ObjectId(); // random id
export const MANAGER_ROLE_ID = new Types.ObjectId(); // random id
export const ADMIN_ROLE_ID = new Types.ObjectId(); // random id

export const USER_ID_MANAGER = new Types.ObjectId(); // random id
export const USER_ID_ADMIN = new Types.ObjectId(); // random id

export const MANAGER_ACCESS_TOKEN = 'def';
export const ADMIN_ACCESS_TOKEN = 'ghi';

export const mockUserFindById = jest.fn(async (id: Types.ObjectId) => {
  if (USER_ID.equals(id))
    return {
      _id: USER_ID,
      roles: [{ _id: VIEWER_ROLE_ID, code: RoleCode.VIEWER } as Role],
    } as User;
  if (USER_ID_MANAGER.equals(id))
    return {
      _id: USER_ID_MANAGER,
      roles: [
        { _id: VIEWER_ROLE_ID, code: RoleCode.VIEWER } as Role,
        { _id: MANAGER_ROLE_ID, code: RoleCode.MANAGER } as Role,
      ],
    } as User;
  if (USER_ID_ADMIN.equals(id))
    return {
      _id: USER_ID_ADMIN,
      roles: [
        { _id: VIEWER_ROLE_ID, code: RoleCode.VIEWER } as Role,
        { _id: MANAGER_ROLE_ID, code: RoleCode.MANAGER } as Role,
        { _id: ADMIN_ROLE_ID, code: RoleCode.ADMIN } as Role,
      ],
    } as User;
  else return null;
});

export const mockRoleRepoFindByCodes = jest.fn(
  async (codes: string[]): Promise<Role[]> => {
    const results: Role[] = [];
    for (const code of codes) {
      switch (code) {
        case RoleCode.MANAGER:
          results.push({
            _id: MANAGER_ROLE_ID,
            code: RoleCode.MANAGER,
            status: true,
          } as Role);
          break;
        case RoleCode.ADMIN:
          results.push({
            _id: ADMIN_ROLE_ID,
            code: RoleCode.ADMIN,
            status: true,
          } as Role);
          break;
        case RoleCode.VIEWER:
          results.push({
            _id: VIEWER_ROLE_ID,
            code: RoleCode.VIEWER,
            status: true,
          } as Role);
          break;
      }
    }

    return results;
  },
);

export const mockJwtValidate = jest.fn(
  async (token: string): Promise<JwtPayload> => {
    let subject: null | string = null;
    switch (token) {
      case ACCESS_TOKEN:
        subject = USER_ID.toHexString();
        break;
      case MANAGER_ACCESS_TOKEN:
        subject = USER_ID_MANAGER.toHexString();
        break;
      case ADMIN_ACCESS_TOKEN:
        subject = USER_ID_ADMIN.toHexString();
        break;
    }
    if (subject)
      return {
        iss: tokenInfo.issuer,
        aud: tokenInfo.audience,
        sub: subject,
        iat: 1,
        exp: 2,
        prm: 'abcdef',
      } as JwtPayload;
    throw new BadTokenError();
  },
);

jest.mock('../../../src/database/repository/UserRepo', () => ({
  findById: mockUserFindById,
}));

jest.mock('../../../src/database/repository/RoleRepo', () => ({
  findByCodes: mockRoleRepoFindByCodes,
}));

JWT.validate = mockJwtValidate;
