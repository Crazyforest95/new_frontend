import { stringify } from 'qs';
import pick from 'lodash/pick';
import request from '@/utils/request';
import API from '@/api';

export async function getList(params) {
  return request(`${API.interview.list}?${stringify(params)}`);
}

export async function add(params) {
  return request(API.interview.add, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteInterview(params) {
  return request(`${API.interview.delete}?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getDetail(params) {
  return request(`${API.interview.detail}?${stringify(params)}`);
}

export async function update(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['status', 'appoint_time']);
  return request(`${API.interview.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function entryTime(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['date']);
  return request(`${API.interview.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}
