// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('niuka-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('niuka-authority', JSON.stringify(proAuthority));
}

export function setShowCompanyMenu(showCompanyMenu) {
  return localStorage.setItem('niuka-showCompanyMenu', showCompanyMenu);
}

export function getShowCompanyMenu() {
  const authority = localStorage.getItem('niuka-showCompanyMenu');
  return JSON.parse(authority);
}

export function setResumeMenu(showCompanyMenu) {
  return localStorage.setItem('niuka-resumeMenu', showCompanyMenu);
}

export function getResumeMenu() {
  const authority = localStorage.getItem('niuka-resumeMenu');
  return JSON.parse(authority);
}
export function setToken(token) {
  return localStorage.setItem('niuka-token', token);
}

export function getToken() {
  const authority = localStorage.getItem('niuka-token');
  return authority;
}
// 设置点击公司ID
export function setCompanyId(token) {
  return localStorage.setItem('niuka-company-id', token);
}
// 获取点击公司ID
export function getCompanyId() {
  const authority = localStorage.getItem('niuka-company-id');
  return authority;
}

// 设置点击公司Name
export function setCompanyName(token) {
  return localStorage.setItem('niuka-company-name', token);
}
// 获取点击公司Name
export function getCompanyName() {
  const authority = localStorage.getItem('niuka-company-name');
  return authority;
}
