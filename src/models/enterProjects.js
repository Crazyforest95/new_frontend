import getList, { statistic, add, getEngineerOrder, getEntryFileTemplate } from '@/services/enterProjects';

export default {
  namespace: 'enterProjects',

  state: {
    list: { data: [], page_info: {} },
    statistic: {},
    engineerOrder: {
      daily_logs: [],
      statistics: {},
    },
  },

  effects: {
    // 列表
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, { ...payload });
      if (response) {
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },
    // 统计详情
    *statistic({ payload }, { call, put }) {
      const response = yield call(statistic, { ...payload });
      if (response) {
        yield put({
          type: 'saveStatistic',
          payload: response,
        });
      }
    },
    // 确认入项
    *add({ payload, callback }, { call }) {
      const response = yield call(add, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    // 获取订单日志
    *getEngineerOrder({ payload }, { call, put }) {
      const response = yield call(getEngineerOrder, { ...payload });
      if (response) {
        yield put({
          type: 'saveEngineerOrder',
          payload: response,
        });
      }
    },
    *getEntryFileTemplate({ callback }, { call }) {
      const response = yield call(getEntryFileTemplate);
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
    saveStatistic(state, action) {
      return {
        ...state,
        statistic: action.payload,
      };
    },
    saveEngineerOrder(state, action) {
      return {
        ...state,
        engineerOrder: action.payload,
      };
    },
    clearEngineerOrder(state) {
      return {
        ...state,
        engineerOrder: {
          daily_logs: [],
          statistics: {},
        },
      };
    },
  },
};
