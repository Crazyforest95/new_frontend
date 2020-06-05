import omit from 'lodash/omit';
import getList from '@/services/paymentManagement';

const shiftData = item => {
  return {
    payments: item.payments,
    statistic: omit(item, ['payments']),
    year_month: item.year_month_date_format,
    created: item.created,
  };
};

export default {
  namespace: 'paymentManagement',

  state: {
    list: { data: [], page_info: {} },
  },

  effects: {
    // 列表
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, { ...payload });
      if (response) {
        const paid = response.data.map(shiftData);

        yield put({
          type: 'saveList',
          payload: { ...response, data: paid },
        });
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    resetList() {
      return {
        list: [],
      };
    },
  },
};
