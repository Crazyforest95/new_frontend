import { stringify } from 'qs';
import pick from 'lodash/pick';
import request from '@/utils/request';
import API from '@/api';

export async function getList(params) {
  return request(`${API.projects.list}?${stringify(params)}`);
}

export async function add(params) {
  return request(API.projects.add, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteProject(params) {
  return request(`${API.projects.delete}?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function setPm(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['pm_id']);
  return request(`${API.projects.setPm}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function update(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['name']);
  return request(`${API.projects.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function changePm(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['new_pm_id', 'old_pm_id']);
  return request(`${API.projects.changePm}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function removePm(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['pm_id']);
  return request(`${API.projects.changePm}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}
export async function getDetail(params) {
  const bodyParams = pick(params, ['id', 'schema']);
  return request(`${API.projects.detail}?${stringify(bodyParams)}`);
}
