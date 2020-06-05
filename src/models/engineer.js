import {
  getList,
  add,
  deleteEngineer,
  getDetail,
  update,
  updateResume,
  resignation,
  getListRequirement,
  renewOrder,
} from '@/services/engineer';

export default {
  namespace: 'engineer',

  state: {
    list: { data: [], page_info: {} },
    detail: { now_career: { offer: { pm: {} } } },
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
    // 推荐简历列表
    *getListRequirement({ payload }, { call, put }) {
      const response = yield call(getListRequirement, { ...payload });
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
    // 离职
    *resignation({ payload, callback }, { call }) {
      const response = yield call(resignation, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    // 删除
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteEngineer, { ...payload });
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
          payload: response,
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
    *updateResume({ payload, callback }, { call }) {
      const response = yield call(updateResume, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    // 须签订单
    *renewOrder({ payload, callback }, { call }) {
      const response = yield call(renewOrder, { ...payload });
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
