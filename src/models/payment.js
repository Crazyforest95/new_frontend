import paymentsList, { paymentsDetail, paymentsTotal } from '@/services/payment';

export default {
  namespace: 'payment',

  state: {
    list: [],
    monthPay: '',
    total: {}
  },

  effects: {
    // 列表
    *getList({ payload }, { call, put }) {
      const response = yield call(paymentsList, { ...payload });
      if (response) {
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },
    *getDetail({ payload }, { call, put }) {
      const response = yield call(paymentsDetail, { ...payload });
      if (response) {
        yield put({
          type: 'saveDetail',
          payload: response,
        });
      }
    },

    *getTotal({ payload }, { call, put }) {
      const response = yield call(paymentsTotal,{ ...payload });
      if(response) {
        yield put({
          type: 'saveTotal',
          payload: response
        })
      }
    }
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload
      }
    },
    saveTotal(state, action) {
      return {
        ...state,
        total: action.payload
      }
    }
  },
};
