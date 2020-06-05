import { stringify } from 'qs';
import request from '@/utils/request';
import API from '@/api';

export default async function resumeDetails(params) {
  return request(`${API.company.contract}?${stringify(params)}`, { download: true });
}
