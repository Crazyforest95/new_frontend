const API = {
  user: {
    login: 'v1/auth/token', // 登录接口
    current: 'v1/self', // 当前用户信息
    update: 'v1/self', // 更改个人信息
    changePassword: 'v1/auth/change_password', // 修改密码
    user: 'v1/user', // 开关账户状态
  },
  company: {
    list: 'v1/companies', // 公司列表
    add: 'v1/company', // 新建公司
    contract: 'v1/contract', // 展示合同
    detail: 'v1/company', // 公司详情
    update: 'v1/company', // 更新详情
    delete: 'v1/company', // 删除公司
  },
  upload: {
    contract: 'v1/contract', // 上传合同
  },
  entryFileTemplate: {
    upload: 'v1/entry_file_template', // 上传入项材料模板
    detail: 'v1/entry_file_template', // 获取入项材料模板
  },
  projectManagement: {
    list: 'v1/pms', // 项目经理列表
    username: 'v1/pre_username', // 新建系统命名
    add: 'v1/pm', // 新建项目经理
    detail: 'v1/pm', // 项目经理详情
    update: 'v1/pm', // 项目经理更新
    delete: 'v1/pm', // 删除公司
    active: 'v1/pm', // 启用禁用
  },
  requirementManagement: {
    list: 'v1/offers', // 需求列表
    add: 'v1/offer', // 新建需求
    detail: 'v1/offer', // 需求详情
    update: 'v1/offer', // 更新需求
    delete: 'v1/offer', // 删除需求
    close: 'v1/offer', // 关闭需求
    // fileupload: 'v1/offer',
  },
  position: {
    list: 'v1/positions', // 职位列表
    add: 'v1/position', // 新建职位
    delete: 'v1/position', // 删除职位
    update: 'v1/position', // 修改职位
  },
  positionLevels: {
    list: 'v1/position_levels', // 级别列表
    add: 'v1/position_level', // 新建级别
    update: 'v1/position_level', // 修改级别
    delete: 'v1/position_level', // 删除级别
  },
  projects: {
    list: 'v1/projects', // 项目列表
    add: 'v1/project', // 新建项目
    setPm: 'v1/project', // 绑定项目经理
    update: 'v1/project', // 修改项目
    delete: 'v1/project', // 删除项目
    detail: 'v1/project', // 项目详情
    changePm: 'v1/project', // 更换项目经理
  },
  quotesManagement: {
    list: 'v1/offer_sheets', // 需求列表
    add: 'v1/offer_sheet', // 新建公司
    detail: 'v1/offer_sheet', // 公司详情
    update: 'v1/offer_sheet', // 更新详情
    delete: 'v1/offer_sheet', // 删除
  },
  engineer: {
    list: 'v1/engineers', // 工程师列表
    listRequirement: 'v1/cvs', // 推荐工程师列表
    add: 'v1/engineer', // 新建工程师
    detail: 'v1/engineer', // 工程师详情
    update: 'v1/engineer', // 更新详情
    updateResume: 'v1/engineer', // 更新简历
    resignation: 'v1/resign', // 离职
    delete: 'v1/engineer', // 删除
    renewOrder: 'v1/engineer', // 续签合同
  },
  interview: {
    list: 'v1/interviews', // 需求列表
    detail: 'v1/interviews', // 需求详情
    add: 'v1/interview', // 推荐简历
    update: 'v1/interview', // 约面试
    entryTime: 'v1/interview', // 入职时间
    delete: 'v1/interview', // 未通过删除
  },
  purchase: {
    list: 'v1/purchases', // 项目经理列表
    add: 'v1/purchase', // 新建采购
    detail: 'v1/purchase', // 采购详情
    update: 'v1/purchase', // 采购更新
    delete: 'v1/purchase', // 删除采购
    active: 'v1/purchase', // 启用禁用
  },
  careers: {
    list: 'v1/careers', // 入职经历
  },
  career: {
    list: 'v1/career', // 续签合同
  },
  workReports: {
    list: 'v1/work_reports', // 工作报告列表
    detail: 'v1/work_report', // 工作报告详情
    monthlyBill: 'v1/monthly_bill', // 发出月结算
  },
  dailyLogs: {
    list: 'v1/daily_logs', // 工时列表
  },
  payments: {
    list: 'v1/company', // 待结算列表
    detail:'v1/engineer/details',  // 人员详情
    total:'v1/company'   // 费率信息
  },
  paymentManagement: {
    paid: 'v1/monthly_bills', // 已结算列表
  },
  enterProjects: {
    list: 'v1/enter_projects', // 结算列表
    detail: 'v1/enter_project', // 详情
    add: 'v1/enter_project', // 确认入项
    rejectInto: 'v1/enter_project', // 拒绝入项
    confirmEntryMessage: 'v1/enter_project', // 确认入项信息
    statistic: 'v1/purchase/enter_project_statistic', // 入项信息统计
    materialsApprove: 'v1/enter_project', // 审批入项材料
    directEnterProject: 'v1/purchase/direct_enter_project', // 直接入项
    engineerCompanyOrders: 'v1/engineer_company_orders', // 入项信息统计
    engineerCompanyOrder: 'v1/engineer_company_order', // 工时信息
    entryFiles: 'v1/entry_files', // 入项材料
  },
};

export default API;
