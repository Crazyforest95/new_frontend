import { stringify } from 'qs';
import request from '@/utils/request';
import API from '@/api';

export default async function dailyLogsList(params) {
  return request(`${API.dailyLogs.list}?${stringify(params)}`);
}

export async function getDetail(params) {
  return request(`${API.workReports.detail}?${stringify(params)}`);
}
