import dailyLogsList, { getDetail } from '@/services/dailyLogs';

export default {
  namespace: 'dailyLogs',

  state: {
    list: { data: [], page_info: {} },
    detail: {},
  },

  effects: {
    // 列表
    *getList({ payload }, { call, put }) {
      const response = yield call(dailyLogsList, { ...payload });
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
    clearDailyLogsList(state) {
      return {
        ...state,
        list: { data: [], page_info: {} },
      };
    },
    clearDailyLogsDetails(state) {
      return {
        ...state,
        detail: {},
      };
    },
  },
};
