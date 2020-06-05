import { getList, add, deletePosition, update } from '@/services/levelManagement';

export default {
  namespace: 'levelManagement',

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
      const response = yield call(deletePosition, { ...payload });
      if (callback) {
        callback(response);
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
  },
};
