const authority = {
  purchase: 'purchase',
  companyOm: 'company_om',
};

export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'home',
        component: './Dashboard/Workplace',
      },
      // forms
      {
        path: '/resume',
        icon: 'form',
        name: 'resume',
        component: './Resume/Resume',
        hideInMenu: true,
      },
      {
        path: '/addResume',
        icon: 'form',
        name: 'resume',
        component: './AddResume/AddResume',
        hideInMenu: true,
      },
      {
        path: '/resumeDetails',
        icon: 'form',
        name: 'resumeDetails',
        component: './ResumeDetails/ResumeDetails',
        hideInMenu: true,
      },
      // list
      {
        name: 'requirementManagement',
        icon: 'user',
        path: '/requirementManagement',
        component: './RequirementManagement/RequirementManagementList',
      },
      {
        name: 'requirementDetail',
        path: '/requirementManagement/:id',
        component: './RequirementDetail/RequirementDetail',
        hideInMenu: true
      },
      {
        name: 'requirementReport',
        path: '/requirementReport/:id',
        component: './RequirementReport/RequirementReport',
        hideInMenu: true
      },
      {
        name: 'entryManagement',
        icon: 'user',
        path: '/entryManagement',
        component: './EntryManagement/EntryManagement',
      },
      {
        path: '/accountManagement',
        name: 'accountManagement',
        icon: 'dashboard',
        component: './AccountManagement/AccountManagement',
      },
      {
        path: '/projectManager',
        name: 'project',
        icon: 'dashboard',
        component: './Project/Project',
      },
      {
        name: 'peopleManagement',
        icon: 'team',
        path: '/peopleManagement',
        component: './PeopleManagement/PeopleManagement',
      },
      {
        name: 'personalSetting',
        icon: 'dashboard',
        path: '/personalSetting',
        component: './PersonalSetting/PersonalSetting',
        hideInMenu: true,
      },
      {
        name: 'paymentManagement',
        icon: 'customer-service',
        path: '/paymentManagement',
        routes: [
          {
            path: '/paymentManagement/unpaid',
            name: 'unpaid',
            icon: 'dashboard',
            component: './PaymentManagement/Unpaid',
          },
          {
            path: '/paymentManagement/paid',
            name: 'paid',
            icon: 'dashboard',
            component: './PaymentManagement/Paid',
          },
        ],
      },
      {
        name: 'personalSetting',
        icon: 'dashboard',
        path: '/projectManager/projectDetail/:id',
        component: './projectDetail/projectDetail',
        hideInMenu: true,
      },
      {
        name: 'basicInformation',
        icon: 'dollar',
        path: '/basicInformation',
        component: './PriceListManagement/PriceListManagement',
      },
      {
        component: '404',
      },
    ],
  },
];
