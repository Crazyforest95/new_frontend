import { stringify } from 'qs';
import pick from 'lodash/pick';
import request from '@/utils/request';
import API from '@/api';

export default async function getList(params) {
  return request(`${API.enterProjects.list}?${stringify(params)}`);
}

/**
 * 获取入项材料模板
 * @returns {*}
 */
export async function getEntryFileTemplate() {
  return request(`${API.entryFileTemplate.detail}`, { text: true });
}

export async function statistic() {
  return request(`${API.enterProjects.statistic}`);
}

/**
 * 详情
 * @param {Object} params
 * @param {Number} params.id
 * @returns {*}
 */

export async function detail(params) {
  return request(`${API.enterProjects.detail}?${stringify(params)}`);
}

/**
 * 订单查询
 * @param {Object} params
 * @param {Number} params.engineer_id
 * @param {Number} params.sort_id
 * @returns {*}
 */

export async function engineerCompanyOrders(params) {
  return request(`${API.enterProjects.engineerCompanyOrders}?${stringify(params)}`);
}

/**
 * 确认入项并生成订单
 * @param {Object} params
 * @param {Number} params.id
 * @param {String} params.schema
 * @param {String} params.work_content
 * @param {String} params.service_type
 * @param {Number} params.auth_renew
 * @param {Number} params.renew_cycle
 * @param {Number} params.yes_or_no 1
 * @returns {*}
 */

export async function add(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = pick(params, [
    'work_content',
    'service_type',
    'auto_renew',
    'renew_cycle',
    'yes_or_no',
  ]);
  return request(`${API.enterProjects.add}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

/**
 * 查询订单日志
 * @param {Object} params
 * @param {Number} params.id
 * @param {String} params.schema
 * @returns {*}
 */

export async function getEngineerOrder(params) {
  const headerParams = pick(params, ['id', 'schema']);
  const bodyParams = {};
  return request(`${API.enterProjects.engineerCompanyOrder}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {
      ...bodyParams,
    },
  });
}

/**
 * 拒绝入项
 * @param {Object} params
 * @param {Number} params.id
 * @param {String} params.schema
 * @returns {*}
 */

export async function rejectInto(params) {
  const headerParams = pick(params, ['id', 'schema']);
  return request(`${API.enterProjects.rejectInto}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {},
  });
}

/**
 * 直接入项
 * @param {Object} params
 * @returns {*}
 */

export async function directEnterProject(params) {
  return request(`${API.enterProjects.directEnterProject}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 拒绝入项
 * @param {Object} params
 * @param {Number} params.id
 * @param {String} params.schema
 * @returns {*}
 */

export async function confirmEntryMessage(params) {
  const headerParams = pick(params, ['id', 'schema']);
  return request(`${API.enterProjects.confirmEntryMessage}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: {},
  });
}

/**
 * 审核入项材料
 * @param {Object} params
 * @param {Number} params.id
 * @param {String} params.schema - EnterProjectCompanyFileAuditSchema
 * @param {Number} params.ware_fare
 * @param {String} params.comment
 * @param {String} params.yes_or_no - 0:拒绝 1:同意
 * @returns {*}
 */

export async function materialsApprove(params) {
  const headerParams = pick(params, ['engineer_id', 'schema']);
  const bodyParams = pick(params, ['comment', 'yes_or_no']);
  return request(`${API.enterProjects.materialsApprove}?${stringify(headerParams)}`, {
    method: 'PUT',
    body: { ...bodyParams },
  });
}
/**
 * 查看入项材料
 * @param {Object} params
 * @param {Number} params.engineer_id
 * @returns {*}
 */

export async function entryFiles(params) {
  return request(`${API.enterProjects.entryFiles}?${stringify(params)}`, { text: true });
}
