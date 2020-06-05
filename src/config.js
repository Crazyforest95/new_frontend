const APP_CONFIG = {
  APP_HOST: window.APP_CONFIG.devURL,
};
if (process.env.NODE_ENV === 'development') {
  console.log('开发环境');
  // console.log(process.env.NO_PROXY);
  // 本机模式
  // 本地模式，公司内网
  // 公网测试环境
  // 公网正式环境
  APP_CONFIG.APP_HOST = window.APP_CONFIG.devURL;
  // APP_CONFIG.APP_HOST = 'http://192.168.1.109:5001/api/';
  // APP_CONFIG.APP_HOST = 'http://192.168.8.66:8080/api/';
} else if (process.env.NODE_ENV === 'test') {
  console.log('测试环境');
  APP_CONFIG.APP_HOST = window.APP_CONFIG.devURL;
} else if (process.env.NODE_ENV === 'production') {
  console.log('生产环境');
  APP_CONFIG.APP_HOST = window.APP_CONFIG.URL;
}

export default APP_CONFIG;
