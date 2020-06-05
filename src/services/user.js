import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { stringify } from 'qs';
import request from '@/utils/request';
import API from '@/api';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(`${API.user.current}`, {
    method: 'GET',
  });
}

export async function changePassword(params) {
  const headerParams = pick(params, ['user_id']);
  const bodyParams = pick(params, ['new_password']);
  return request(`${API.user.changePassword}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function update(params) {
  const headerParams = pick(params, ['schema']);
  const bodyParams = omit(params, ['schema']);
  return request(`${API.user.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function changeStatus(params) {
  const headerParams = pick(params, ['schema', 'id']);
  const bodyParams = pick(params, ['activate']);
  return request(`${API.user.user}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}
