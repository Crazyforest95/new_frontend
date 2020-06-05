import { getDetail } from '@/services/company';

export default {
  namespace: 'company',

  state: {
    detail: {},
  },

  effects: {
    // 详情
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, { ...payload });
      if (response) {
        yield put({
          type: 'saveDetail',
          payload: response,
        });
        if (callback) {
          callback(response);
        }
      }
    },
  },

  reducers: {
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
  },
};
