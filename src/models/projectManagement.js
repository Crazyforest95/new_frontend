import { getList, add, username, getDetail, update, deletePM } from '@/services/projectManagement';

export default {
  namespace: 'projectManagement',

  state: {
    list: { data: [], page_info: {} },
    detail: {},
    username: '',
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
    // 添加
    *add({ payload, callback }, { call }) {
      const response = yield call(add, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    // 修改
    *update({ payload, callback }, { call }) {
      const response = yield call(update, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    // 删除
    *delete({ payload, callback }, { call }) {
      const response = yield call(deletePM, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    // 获取用户名
    *username({ payload }, { call, put }) {
      const response = yield call(username, { ...payload });
      yield put({
        type: 'saveUsername',
        payload: response,
      });
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
    saveUsername(state, action) {
      return {
        ...state,
        username: action.payload,
      };
    },
    restList(state) {
      return {
        ...state,
        list: { data: [], page_info: {} },
      };
    },
  },
};
