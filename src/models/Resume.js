import resumeDetails from '@/services/resume';

export default {
  namespace: 'resume',

  state: {
    list: [
      {
        number: '222222',
        name: 'JAVA-中级-智能AI',
        pm: '马云',
        phone: '18709888888',
        email: '8888@email.com',
        count: 20,
      },
    ],
    detailList: {},
  },

  effects: {
    *getResumeDetails({ payload, callback }, { call, put }) {
      const response = yield call(resumeDetails, { ...payload });
      if (response) {
        response.blob().then(blob => {
          // var a = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          console.log(url);
          // var filename = 'myfile.pdf';
          // a.href = url;
          // a.download = filename;
          // a.click();
          // window.URL.revokeObjectURL(url);
          if (callback) {
            callback(url);
          }
        });
        yield put({
          type: 'saveContract',
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
        detailList: action.payload,
      };
    },
  },
};
