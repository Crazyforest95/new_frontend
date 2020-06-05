import { getList, add, getDetail, update, entryTime, deleteInterview } from '@/services/interview';

export default {
  namespace: 'interview',

  state: {
    list: { data: [], page_info: {} },
    detail: {
      cv_new: [],
      cv_pass: [],
      entry: [],
      interview_new: [],
      interview_pass: [],
      reject: [],
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
    // 添加
    *add({ payload, callback }, { call }) {
      const response = yield call(add, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    // 删除
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteInterview, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    *getDetail({ payload }, { call, put }) {
      const response = yield call(getDetail, { ...payload });
      if (response) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(update, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    *entryTime({ payload, callback }, { call }) {
      const response = yield call(entryTime, { ...payload });
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
