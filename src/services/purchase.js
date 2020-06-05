import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { stringify } from 'qs';
import request from '@/utils/request';
import API from '@/api';

export async function getList(params) {
  return request(`${API.purchase.list}?${stringify(params)}`);
}

export async function username(params) {
  return request(API.purchase.username, {
    method: 'POST',
    text: true,
    body: {
      ...params,
    },
  });
}

export async function getDetail(params) {
  return request(`${API.purchase.detail}?${stringify(params)}`);
}

export async function add(params) {
  return request(API.purchase.add, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function update(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = omit(params, ['id', 'schema']);
  return request(`${API.purchase.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function active(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['activate']);
  return request(`${API.purchase.active}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function deletePurchase(params) {
  return request(`${API.purchase.delete}?${stringify(params)}`, {
    method: 'DELETE',
  });
}
