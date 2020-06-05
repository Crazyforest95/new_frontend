import { stringify } from 'qs';
import pick from 'lodash/pick';
import request from '@/utils/request';
import API from '@/api';

export default async function careersList(params) {
  return request(`${API.careers.list}?${stringify(params)}`);
}

/**
 * 修改合同续签方式
 * @param {Object} params
 * @param {Number} params.id
 * @param {String} params.schema
 * @param {Number} params.auto_renew
 * @param {Number} params.renew_cycle
 * @returns {*}
 */
export async function update(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, ['auto_renew', 'renew_cycle']);
  return request(`${API.career.list}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}
