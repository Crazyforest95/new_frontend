import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { stringify } from 'qs';
import request from '@/utils/request';
import API from '@/api';

export async function getList(params) {
  return request(`${API.requirementManagement.list}?${stringify(params)}`);
}

export async function getDetail(params) {
  return request(`${API.requirementManagement.detail}?${stringify(params)}`);
}

export async function add(params) {
  return request(API.requirementManagement.add, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function update(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = omit(params, ['id', 'schema']);

  return request(`${API.requirementManagement.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function deleteOffer(params) {
  return request(`${API.requirementManagement.delete}?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function close(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = omit(params, ['id', 'schema']);
  return request(`${API.requirementManagement.close}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}
