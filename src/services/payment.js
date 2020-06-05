import { stringify } from 'qs';
import request from '@/utils/request';
import API from '@/api';

export default async function paymentsList(params) {
  return request(`${API.payments.list}?${stringify(params)}`, {
    method: 'PUT',
    body: {},
  });
}

export async function paymentsDetail(params) {
  return request(`${API.payments.detail}?${stringify(params)}`)
}

export async function paymentsTotal(params) {
  return request(`${API.payments.total}?${stringify(params)}`)
}