import '../../database/mock';
import { addAuthHeaders } from '../authentication/mock';

// import the mock for the current test after all other mock imports
// this will prevent the different implementations for same function by the other mocks
import {
  mockRoleRepoFindByCodes,
  mockUserFindById,
  ADMIN_ACCESS_TOKEN,
} from './mock';

import app from '../../../src/app';
import supertest from 'supertest';
import { RoleCode } from '../../../src/database/model/Role';

describe('authentication validation for admin', () => {
  const endpoint = '/mentor/admin/test';
  const request = supertest(app);

  beforeEach(() => {
    mockRoleRepoFindByCodes.mockClear();
    mockUserFindById.mockClear();
  });

  it('Should response with 401 if user do not have admin role', async () => {
    const response = await addAuthHeaders(request.get(endpoint));
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/denied/);
    expect(mockRoleRepoFindByCodes).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledTimes(1);
    expect(mockRoleRepoFindByCodes).toHaveBeenCalledWith([RoleCode.ADMIN]);
  });
});

describe('authentication validation for admin', () => {
  const endpoint = '/mentor/admin/test';
  const request = supertest(app);

  beforeEach(() => {
    mockRoleRepoFindByCodes.mockClear();
    mockUserFindById.mockClear();
  });

  it('Should response with 404 if user have admin role', async () => {
    const response = await addAuthHeaders(
      request.get(endpoint),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(404);
    expect(mockRoleRepoFindByCodes).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledTimes(1);
    expect(mockRoleRepoFindByCodes).toHaveBeenCalledWith([RoleCode.ADMIN]);
  });
});
