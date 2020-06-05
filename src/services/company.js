import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { stringify } from 'qs';
import request from '@/utils/request';
import API from '@/api';

export async function getList(params) {
  const sendParam = {
    schema: params.schema,
  };
  return request(`${API.company.list}?${stringify(sendParam)}`);
}

export async function getDetail(params) {
  return request(`${API.company.detail}?${stringify(params)}`);
}

export async function add(params) {
  return request(API.company.add, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function contract(params) {
  return request(`${API.company.contract}?${stringify(params)}`, { download: true });
}

export async function update(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = omit(params, ['id', 'schema']);
  return request(`${API.company.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function deleteCompany(params) {
  return request(`${API.company.delete}?${stringify(params)}`, {
    method: 'DELETE',
  });
}
