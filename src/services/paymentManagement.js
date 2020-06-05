import { stringify } from 'qs';
import request from '@/utils/request';
import API from '@/api';

export default async function getList(params) {
  return request(`${API.paymentManagement.paid}?${stringify(params)}`);
}
