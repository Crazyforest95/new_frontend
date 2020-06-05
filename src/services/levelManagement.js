import { stringify } from 'qs';
import pick from 'lodash/pick';
import request from '@/utils/request';
import API from '@/api';

export async function getList(params) {
  return request(`${API.positionLevels.list}?${stringify(params)}`);
}

export async function add(params) {
  console.log(params);

  return request(API.positionLevels.add, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function update(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['name', 'money']);
  return request(`${API.positionLevels.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function deletePosition(params) {
  return request(`${API.positionLevels.delete}?${stringify(params)}`, {
    method: 'DELETE',
  });
}
