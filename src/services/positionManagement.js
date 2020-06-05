import { stringify } from 'qs';
import pick from 'lodash/pick';
import request from '@/utils/request';
import API from '@/api';

export async function getList(params) {
  return request(`${API.position.list}?${stringify(params)}`);
}

export async function add(params) {
  return request(API.position.add, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deletePosition(params) {
  return request(`${API.position.delete}?${stringify(params)}`, {
    method: 'DELETE',
  });
}
export async function update(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['name']);
  return request(`${API.position.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}
