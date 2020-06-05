import { stringify } from 'qs';
import pick from 'lodash/pick';
import request from '@/utils/request';
import API from '@/api';

export default async function workReportsList(params) {
  return request(`${API.workReports.list}?${stringify(params)}`);
}

export async function getDetail(params) {
  return request(`${API.workReports.detail}?${stringify(params)}`);
}

export async function sendBill(params) {
  const headerParams = {};
  const bodyParams = pick(params, ['year_month']);
  return request(`${API.workReports.monthlyBill}?${stringify(headerParams)}`, {
    method: 'POST',
    body: {
      ...bodyParams,
    },
  });
}
