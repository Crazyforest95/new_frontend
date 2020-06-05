import pick from 'lodash/pick';
import { stringify } from 'qs';
import request from '@/utils/request';
import API from '@/api';

export async function getList(params) {
  return request(`${API.quotesManagement.list}?${stringify(params)}`);
}

export async function getDetail(params) {
  const bodyParams = pick(params, ['position_id', 'position_level_id']);
  return request(`${API.quotesManagement.detail}?${stringify(bodyParams)}`);
}

export async function add(params) {
  const bodyParams = pick(params, [
    'position_id',
    'money',
    'position_level_id',
    'company_id',
    'schema',
  ]);
  return request(API.quotesManagement.add, {
    method: 'POST',
    body: {
      ...bodyParams,
    },
  });
}

export async function update(params) {
  const headerParams = pick(params, ['position_id', 'schema', 'position_level_id']);
  const bodyParams = pick(params, ['money']);
  return request(`${API.quotesManagement.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function deleteQuotes(params) {
  const headerParams = pick(params, ['position_id', 'position_level_id']);
  return request(`${API.quotesManagement.delete}?${stringify(headerParams)}`, {
    method: 'delete',
    body: {},
  });
}
