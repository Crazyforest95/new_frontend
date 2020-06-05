import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { stringify } from 'qs';
import request from '@/utils/request';
import API from '@/api';

export async function getList(params) {
  return request(`${API.projectManagement.list}?${stringify(params)}`);
}

export async function username(params) {
  return request(API.projectManagement.username, {
    method: 'POST',
    text: true,
    body: {
      ...params,
    },
  });
}

export async function getDetail(params) {
  return request(`${API.projectManagement.detail}?${stringify(params)}`);
}

export async function add(params) {
  return request(API.projectManagement.add, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function update(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = omit(params, ['id', 'schema']);
  return request(`${API.projectManagement.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function deletePM(params) {
  return request(`${API.projectManagement.delete}?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function active(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['activate']);
  return request(`${API.projectManagement.active}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}
