import { stringify } from 'qs';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import API from '@/api';
import request from '@/utils/request';

export async function getList(params) {
  const sendParams = omit(params, ['rules']);

  return request(`${API.engineer.list}?${stringify(sendParams)}`);
}

export async function getListRequirement(params) {
  const sendParams = omit(params, ['rules']);

  return request(`${API.engineer.listRequirement}?${stringify(sendParams)}`);
}

export async function add(params) {
  return request(API.engineer.add, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteEngineer(params) {
  return request(`${API.engineer.delete}?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getDetail(params) {
  return request(`${API.engineer.detail}?${stringify(params)}`);
}

export async function update(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = omit(params, ['id', 'schema']);
  return request(`${API.engineer.update}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function updateResume(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['cv_upload_result']);
  return request(`${API.engineer.updateResume}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

export async function resignation(params) {
  return request(API.engineer.resignation, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 须签订单
 * @param {Object} params
 * @param {Number} params.id
 * @param {String} params.schema --EngineerRenewOrderSchema
 * @param {String} params.work_content
 * @param {String} params.service_type
 * @param {Number} params.auth_renew
 * @param {Number} params.renew_cycle
 * @returns {*}
 */

export async function renewOrder(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['work_content', 'service_type', 'renew_cycle']);
  return request(`${API.engineer.renewOrder}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}
