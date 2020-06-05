import { getList, add, deleteProject, update, getDetail, changePm } from '@/services/projects';

export default {
  namespace: 'projects',

  state: {
    list: { data: [], page_info: {} },
    detail: {},
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
      const response = yield call(deleteProject, { ...payload });
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
    // 更换项目经理
    *changePm({ payload, callback }, { call }) {
      console.log(payload);
      const response = yield call(changePm, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
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
    restList(state) {
      return {
        ...state,
        list: { data: [], page_info: {} },
      };
    },
  },
};
