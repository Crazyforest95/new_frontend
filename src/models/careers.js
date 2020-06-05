import careersList from '@/services/careers';

export default {
  namespace: 'careers',

  state: {
    list: { data: [], page_info: {} },
  },

  effects: {
    // 列表
    *getList({ payload }, { call, put }) {
      const response = yield call(careersList, { ...payload });
      if (response) {
        yield put({
          type: 'saveList',
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
  },
};
