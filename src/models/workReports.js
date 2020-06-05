import workReportsList, { getDetail, sendBill } from '@/services/workReports';

export default {
  namespace: 'workReports',

  state: {
    list: { data: [], page_info: {} },
    detail: {},
  },

  effects: {
    // 列表
    *getList({ payload }, { call, put }) {
      const response = yield call(workReportsList, { ...payload });
      if (response) {
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },

    // 详情
    *getDetail({ payload }, { call, put }) {
      const response = yield call(getDetail, { ...payload });
      if (response) {
        yield put({
          type: 'saveDetail',
          payload: response,
        });
      }
    },

    *sendBill({ payload, callback }, { call }) {
      const response = yield call(sendBill, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
  },
};
