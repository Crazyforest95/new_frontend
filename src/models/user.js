import {
  query as queryUsers,
  queryCurrent,
  changePassword,
  update,
  changeStatus,
} from '@/services/user';

import { setCompanyName, setAuthority } from '@/utils/authority';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: { name: 'Serati Ma' },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *changePassword({ payload, callback }, { call }) {
      const response = yield call(changePassword, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
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
    *changeStatus({ payload, callback }, { call }) {
      const response = yield call(changeStatus, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      setCompanyName(action.payload.company.name);
      setAuthority(action.payload.role);
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
