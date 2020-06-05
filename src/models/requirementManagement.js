import {
  getList,
  add,
  getDetail,
  update,
  deleteOffer,
  close,
  fileupload,
} from '@/services/requirementManagement';

export default {
  namespace: 'requirementManagement',

  state: {
    list: { data: [], page_info: {}, statistics: {} },
    detail: { statistics: {} },
  },

  effects: {
    // 列表
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, {
        ...payload,
        schema: 'OfferDefaultSchemaWithStatistics',
      });
      if (response) {
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },

    // cobra-55555 -20-04-20
    *getPersonDataList({ payload }, { call, put }) {
      const response = yield call(getList, {
        ...payload,
        schema: 'OfferPersonData',
      });
      if (response) {
        yield put({
          type: 'savePersonData',
          payload: response,
        });
      }
    },
    // // // // //

    // 统计
    *statistics({ payload, callback }, { call }) {
      const response = yield call(getList, {
        ...payload,
        schema: 'OfferDefaultSchemaWithStatistics',
      });
      if (response) {
        if (callback) {
          callback(response.statistics);
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

    // cobra-55555 -20-04-24
    *getDetailLog({ payload, callback }, { call }) {
      const response = yield call(getDetail, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    // // // // //
    
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
      const response = yield call(deleteOffer, { ...payload });
      if (response) {
        if (callback) {
          callback(response);
        }
      }
    },
    // 关闭
    *close({ payload, callback }, { call }) {
      const response = yield call(close, { ...payload });
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
        // cobra-55555 -20-04-17 !!! important  --- setting state values
        project_detail: action.payload.data,   // detail information of the offer
        offer_data_list: action.payload.offer_data_list,   // data list of resume cards
        count_tracks: action.payload.count_tracks,  // count tracks data
        dailyTotalDataRe: action.payload.chat_data.total_data.re,  // chat data of total resume collection
        dailyTotalDataWp: action.payload.chat_data.total_data.wp,  // chat data of total written pass num
        dailyTotalDataIp: action.payload.chat_data.total_data.ip,  // chat data of total interview pass num
        dailyTotalDataOp: action.payload.chat_data.total_data.op,  // chat data of total offer pass num
        dailyPerDataRe: action.payload.chat_data.per_data.re,      // chat data of resume collection per date 
        dailyPerDataWp: action.payload.chat_data.per_data.wp,      // chat data of written pass num per date 
        dailyPerDataIp: action.payload.chat_data.per_data.ip,      // chat data of interview pass num per date 
        dailyPerDataOp: action.payload.chat_data.per_data.op,      // chat data of offer pass num per date 
        interviewTableData: action.payload.it_data,  // data for interview table
        todayDate: action.payload.today, 
        interNum: action.payload.it_data_num,
        // // // // //
      };
    },
    savePersonData(state, action) {
      return {
        ...state,
        personData: action.payload.data,
        items: action.payload.items,
        statistics_data: action.payload.statistics
      }
    }
  },
};
