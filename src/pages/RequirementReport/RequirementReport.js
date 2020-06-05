import React from 'react';
import { connect } from 'dva/index';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Input,
  Typography,
  Tabs,
  Pagination,
  Icon,
  DatePicker,
} from 'antd';
import StatisticsModal from './StatisticsModal';
import classes from './RequirementReport.less';
import PersonData from './PersonCard';
import CompareResumesModal from '../RequirementDetail/CompareResumesModal';

const { Text } = Typography;
@Form.create()
@connect(({ requirementManagement, loading }) => ({
  loading: loading.effects['requirementManagement/getPersonDataList'],

  personData: requirementManagement.personData,
  items: requirementManagement.items,
  statistics_data: requirementManagement.statistics_data,
  offer_data_list: requirementManagement.offer_data_list, // resumes of the offer
}))
class RequirementReport extends React.PureComponent {
  state = {
    activeItems: [],
    current_page: 1,
    per_page_nums: 5,

    name: '',
    age: '',
    identity_number: '',
    current_position: '',
    current_salary: '',
    duty_time: '',
    email: '',
    birthday: '',
    nation: '',
    current_unit: '',
    work_space: '',
    current_separation_working_status: '',
    phone: '',
    current_location: '',
    english_level: '',
    industry: '',
    expected_salary: '',
    expected_work_space: '',
    gender: '',
    residence_location: '',
    computer_skill: '',
    working_status: '',
    expected_industry: '',
    recommend_time: '',
    problem_score: '',
    written_rank: '',
    interview_quality_score: '',
    written_score: '',
    design_problem_score: '',
    interview_score: '',
    interview_rank: '',
    written_num: '',
    written_time: '',
    interview_num: '',
    single_choice_score: '',
    residence_location1: '',
    interview_skill_score: '',
    school_start_time: '',
    graduation_type: '',
    gpa_results: '',
    end_time: '',
    major: '',
    graduation_time: '',
    education: '',
    graduated_school: '',
    edu_recruit: '',
    job_start_time: '',
    company_description: '',
    nature_work: '',
    job_duration: '',
    job_end_time: '',
    job_industry: '',
    number_subordinates: '',
    ability_to_work: '',
    job_company: '',
    job_position: '',
    report_to: '',
    work_content: '',
    department: '',
    job_residence_location: '',
    reason_for_leaving: '',
    pro_start_time: '',
    pro_take_position_as: '',
    pro_end_time: '',
    project_description: '',
    project_name: '',
    project_responsibilities: '',
    pro_company: '',
    skill_name: '',
    skill_level: '',
    skill_use_time: '',
    language_name: '',
    language: '',
    lang_skill_level: '',
    certificate_name: '',
    literacy: '',
    grade: '',
    listening_speaking_skill: '',

    selectedResumes: [],
    totalItems: [],
    sendtimes: 0,

    searchSelectedItems: [],
    isSearched: false,
  };

  async componentWillMount() {
    this.getProjects();
    this.getList();
    const { items } = this.props;
    this.setState({ totalItems: items }, this.listInit(1));
  }

  componentWillReceiveProps = () => {
    const { isSearched } = this.state;

    if (!isSearched) {
      const { searchSelectedItems } = this.state;
      const { items } = this.props;
      if (typeof items === 'undefined') {
        const { sendtimes } = this.state;
        if (sendtimes < 2) {
          this.setState({ sendtimes: sendtimes + 1 });
          this.componentWillMount();
        }
      }
      this.setState({ totalItems: items }, this.listInit(1));
    }
  };

  getProjects = () => {
    const urlParams = new URL(window.location.href);
    const path = urlParams.pathname;
    const array = path.split('/');
    const id = array[array.length - 1];

    const { dispatch } = this.props;

    dispatch({
      type: 'requirementManagement/getDetail',
      payload: {
        id,
        schema: 'OfferDetailSchema',
      },
    });
  };

  // 获取列表
  getList = () => {
    const urlParams = new URL(window.location.href);
    const path = urlParams.pathname;
    const array = path.split('/');
    const id = array[array.length - 1];

    const { dispatch } = this.props;
    dispatch({
      type: 'requirementManagement/getPersonDataList', // setting
      payload: {
        id,
      },
    });
  };

  listInit = current_page => {
    let startPoint = (current_page - 1) * this.state.per_page_nums - 1;
    let endPoint = startPoint + this.state.per_page_nums;

    const { totalItems } = this.state;
    if (typeof totalItems === 'undefined') {
      return;
    }
    let activeItems = totalItems.filter((item, idx) => idx > startPoint && idx <= endPoint);
    this.setState({
      current_page: current_page,
      activeItems: activeItems,
    });
  };

  filterByKey = () => {
    const { items } = this.props;
    if (typeof items === 'undefined') {
      return;
    }

    document.querySelectorAll('span.ant-form-item-children > span').forEach(element => {
      element.style.display = 'inline-block';
    });

    const { personData } = this.props;

    const elementName = document.getElementById('name');
    const elementEmail = document.getElementById('email');
    const elementComputerSkill = document.getElementById('computer_skill');
    const elementCurrentSalary = document.getElementById('current_salary');
    const elementCurrentSeparationWorkingStatus = document.getElementById(
      'current_separation_working_status'
    );
    const elementPhone = document.getElementById('phone');
    const elementResidenceLocation = document.getElementById('current_location');
    const elementCurrentPosition = document.getElementById('current_position');
    const elementWorkSpace = document.getElementById('work_space');
    const elementGender = document.getElementById('gender');
    const elementIdentityNumber = document.getElementById('identity_number');
    const elementCurrentUnit = document.getElementById('current_unit');
    const elementExpectedSalary = document.getElementById('expected_salary');
    const elementAge = document.getElementById('age');
    const elementNation = document.getElementById('nation');
    const elementIndustry = document.getElementById('industry');
    const elementExpectedIndustry = document.getElementById('expected_industry');
    const elementBirthday = document.getElementById('birthday');
    const elementEnglishLevel = document.getElementById('english_level');
    const elementWorkingStatus = document.getElementById('working_status');
    const elementDutyTime = document.getElementById('duty_time');
    const elementSingleChoiceScore = document.getElementById('single_choice_score');
    const elementWrittenRank = document.getElementById('written_rank');
    const elementInterviewRank = document.getElementById('interview_rank');
    const elementProblemScore = document.getElementById('problem_score');
    const elementInterviewScore = document.getElementById('interview_score');
    const elementInterviewTime = document.getElementById('interview_time');
    const elementRecommendTime = document.getElementById('recommend_time');
    const elementDesignProblemScore = document.getElementById('design_problem_score');
    const elementInterviewNum = document.getElementById('interview_num');
    const elementWrittenScore = document.getElementById('written_score');
    const elementWrittenTime = document.getElementById('written_time');
    const elementInterviewSkillScore = document.getElementById('interview_skill_score');
    const elementWrittenNum = document.getElementById('written_num');
    const elementInterviewQualityScore = document.getElementById('interview_quality_score');
    const elementSchoolStartTime = document.getElementById('school_start_time');
    const elementGpaResults = document.getElementById('gpa_results');
    const elementEndTime = document.getElementById('end_time');
    const elementMajor = document.getElementById('major');
    const elementEducation = document.getElementById('education');
    const elementEduRecruit = document.getElementById('edu_recruit');
    const elementGraduatedSchool = document.getElementById('graduated_school');
    const elementJobStartTime = document.getElementById('job_start_time');
    const elementNatureWork = document.getElementById('nature_work');
    const elementJobDuration = document.getElementById('job_duration');
    const elementJobEndTime = document.getElementById('job_end_time');
    const elementJobIndustry = document.getElementById('job_industry');
    const elementNumberSubordinates = document.getElementById('number_subordinates');
    const elementAbilityToWork = document.getElementById('ability_to_work');
    const elementJobCompany = document.getElementById('job_company');
    const elementJobPosition = document.getElementById('job_position');
    const elementReportTo = document.getElementById('report_to');
    const elementWorkContent = document.getElementById('work_content');
    const elementDepartment = document.getElementById('department');
    const elementJobResidenceLocation = document.getElementById('job_residence_location');
    const elementReasonForLeaving = document.getElementById('reason_for_leaving');
    const elementPro = document.getElementById('pro_start_time');
    const elementProTakePositionAs = document.getElementById('pro_take_position_as');
    const elementProEndTime = document.getElementById('pro_end_time');
    const elementProjectDescription = document.getElementById('project_description');
    const elementProjectName = document.getElementById('project_name');
    const elementProjectResponsibilities = document.getElementById('project_responsibilities');
    const elementProCompanyName = document.getElementById('pro_company_name');
    const elementSkillName = document.getElementById('skill_name');
    const elementSkillLevel = document.getElementById('skill_level');
    const elementSkillUseTime = document.getElementById('skill_use_time');
    const elementLanguageName = document.getElementById('language_name');
    const elementLanguage = document.getElementById('language');
    const elementLangSkillLevel = document.getElementById('lang_skill_level');
    const elementCertificateName = document.getElementById('certificate_name');
    const elementLiteracy = document.getElementById('literacy');
    const elementGrade = document.getElementById('grade');
    const elementListeningSpeakingSkill = document.getElementById('listening_speaking_skill');

    var filterName = '';
    if (typeof elementName.value !== 'undefined') {
      filterName = elementName.value;
    }
    if (filterName == '') {
      this.removeSearchSelectedItem('nameSI', 1);
    }
    let activeItems = items.filter((item, idx) => personData[item - 1].name.includes(filterName));

    var filterEmail = '';
    if (typeof elementEmail.value !== 'undefined') {
      filterEmail = elementEmail.value;
    }
    if (filterEmail == '') {
      this.removeSearchSelectedItem('emailSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].email.includes(filterEmail)
    );

    var filterComputerSkill = '';
    if (typeof elementComputerSkill.value !== 'undefined') {
      filterComputerSkill = elementComputerSkill.value;
    }
    if (filterComputerSkill == '') {
      this.removeSearchSelectedItem('computer_skillSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].computer_level.includes(filterComputerSkill)
    );

    var filterCurrentSalary = '';
    if (typeof elementCurrentSalary.value !== 'undefined') {
      filterCurrentSalary = elementCurrentSalary.value;
    }
    if (filterCurrentSalary == '') {
      this.removeSearchSelectedItem('current_salarySI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].work_salary.includes(filterCurrentSalary)
    );

    var filterCurrentSeparationWorkingStatus = '';
    if (typeof elementCurrentSeparationWorkingStatus.value !== 'undefined') {
      filterCurrentSeparationWorkingStatus = elementCurrentSeparationWorkingStatus.value;
    }
    if (filterCurrentSeparationWorkingStatus == '') {
      this.removeSearchSelectedItem('current_separation_working_statusSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].expect_jstatus.includes(filterCurrentSeparationWorkingStatus)
    );

    var filterPhone = '';
    if (typeof elementPhone.value !== 'undefined') {
      filterPhone = elementPhone.value;
    }
    if (filterPhone == '') {
      this.removeSearchSelectedItem('phoneSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].phone.includes(filterPhone)
    );

    var filterHukouAddress = '';
    if (typeof elementResidenceLocation.value !== 'undefined') {
      filterHukouAddress = elementResidenceLocation.value;
    }
    if (filterHukouAddress == '') {
      this.removeSearchSelectedItem('current_locationSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].hukou_address.includes(filterHukouAddress)
    );

    var filterCurrentPosition = '';
    if (typeof elementCurrentPosition.value !== 'undefined') {
      filterCurrentPosition = elementCurrentPosition.value;
    }
    if (filterCurrentPosition == '') {
      this.removeSearchSelectedItem('current_positionSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].work_position.includes(filterCurrentPosition)
    );

    var filterWorkSpace = '';
    if (typeof elementWorkSpace.value !== 'undefined') {
      filterWorkSpace = elementWorkSpace.value;
    }
    if (filterWorkSpace == '') {
      this.removeSearchSelectedItem('work_spaceSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].work_location.includes(filterWorkSpace)
    );

    var filterGender = '';
    if (typeof elementGender.value !== 'undefined') {
      filterGender = elementGender.value;
    }
    if (filterGender == '') {
      this.removeSearchSelectedItem('genderSI', 1);
    }
    if (filterGender == '男') {
      activeItems = activeItems.filter((item, idx) => personData[item - 1].gender == 1);
    } else if (filterGender == '女') {
      activeItems = activeItems.filter((item, idx) => personData[item - 1].gender == 0);
    }

    var filterIdentityNumber = '';
    if (typeof elementIdentityNumber.value !== 'undefined') {
      filterIdentityNumber = elementIdentityNumber.value;
    }
    if (filterIdentityNumber == '') {
      this.removeSearchSelectedItem('identity_numberSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].id_card.includes(filterIdentityNumber)
    );

    var filterCurrentUnit = '';
    if (typeof elementCurrentUnit.value !== 'undefined') {
      filterCurrentUnit = elementCurrentUnit.value;
    }
    if (filterCurrentUnit == '') {
      this.removeSearchSelectedItem('current_unitSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].work_company.includes(filterCurrentUnit)
    );

    var filterExpectedSalary = '';
    if (typeof elementExpectedSalary.value !== 'undefined') {
      filterExpectedSalary = elementExpectedSalary.value;
    }
    if (filterExpectedSalary == '') {
      this.removeSearchSelectedItem('expected_salarySI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].expect_salary.includes(filterExpectedSalary)
    );

    var filterAge = '';
    if (typeof elementAge.value !== 'undefined') {
      filterAge = elementAge.value;
    }
    if (filterAge == '') {
      this.removeSearchSelectedItem('ageSI', 1);
    }
    if (filterAge != '') {
      activeItems = activeItems.filter((item, idx) => personData[item - 1].age == filterAge);
    }

    var filterNation = '';
    if (typeof elementNation.value !== 'undefined') {
      filterNation = elementNation.value;
    }
    if (filterNation == '') {
      this.removeSearchSelectedItem('nationSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].race.includes(filterNation)
    );

    var filterWorkIndustry = '';
    if (elementIndustry != null && typeof elementIndustry.value !== 'undefined') {
      filterWorkIndustry = elementIndustry.value;
    }
    if (filterWorkIndustry == '') {
      this.removeSearchSelectedItem('industrySI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].work_industry.includes(filterWorkIndustry)
    );

    var filterExpectedIndustry = '';
    if (typeof elementExpectedIndustry.value !== 'undefined') {
      filterExpectedIndustry = elementExpectedIndustry.value;
    }
    if (filterExpectedIndustry == '') {
      this.removeSearchSelectedItem('expected_industrySI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].expect_industry.includes(filterExpectedIndustry)
    );

    var filterBirthday = '';
    if (typeof elementBirthday.value !== 'undefined') {
      filterBirthday = elementBirthday.value;
    }
    if (filterBirthday == '') {
      this.removeSearchSelectedItem('birthdaySI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].birthday.includes(filterBirthday)
    );

    var filterEnglishLevel = '';
    if (typeof elementEnglishLevel.value !== 'undefined') {
      filterEnglishLevel = elementEnglishLevel.value;
    }
    if (filterEnglishLevel == '') {
      this.removeSearchSelectedItem('english_levelSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].english_level.includes(filterEnglishLevel)
    );

    var filterWorkingStatus = '';
    if (typeof elementWorkingStatus.value !== 'undefined') {
      filterWorkingStatus = elementWorkingStatus.value;
    }
    if (filterWorkingStatus == '') {
      this.removeSearchSelectedItem('working_statusSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].work_status.includes(filterWorkingStatus)
    );

    var filterDutyTime = '';
    if (typeof elementDutyTime.value !== 'undefined') {
      filterDutyTime = elementDutyTime.value;
    }
    if (filterDutyTime == '') {
      this.removeSearchSelectedItem('duty_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].expect_time.includes(filterDutyTime)
    );

    var filterSingleChoiceScore = '';
    if (elementSingleChoiceScore != null && typeof elementSingleChoiceScore.value !== 'undefined') {
      filterSingleChoiceScore = elementSingleChoiceScore.value;
    }
    if (filterSingleChoiceScore == '') {
      this.removeSearchSelectedItem('single_choice_scoreSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].single_choice_score.includes(filterSingleChoiceScore)
    );

    var filterWrittenRank = '';
    if (elementWrittenRank != null && typeof elementWrittenRank.value !== 'undefined') {
      filterWrittenRank = elementWrittenRank.value;
    }
    if (filterWrittenRank == '') {
      this.removeSearchSelectedItem('written_rankSI', 1);
    }
    if (filterWrittenRank != '') {
      activeItems = activeItems.filter(
        (item, idx) => personData[item - 1].written_rank == filterWrittenRank
      );
    }

    var filterInterviewRank = '';
    if (elementInterviewRank != null && typeof elementInterviewRank.value !== 'undefined') {
      filterInterviewRank = elementInterviewRank.value;
    }
    if (filterInterviewRank == '') {
      this.removeSearchSelectedItem('interview_rankSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].interview_rank.includes(filterInterviewRank)
    );

    var filterProblemScore = '';
    if (elementProblemScore != null && typeof elementProblemScore.value !== 'undefined') {
      filterProblemScore = elementProblemScore.value;
    }
    if (filterProblemScore == '') {
      this.removeSearchSelectedItem('problem_scoreSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].problem_score.includes(filterProblemScore)
    );

    var filterInterviewScore = '';
    if (elementInterviewScore != null && typeof elementInterviewScore.value !== 'undefined') {
      filterInterviewScore = elementInterviewScore.value;
    }
    if (filterInterviewScore == '') {
      this.removeSearchSelectedItem('interview_scoreSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].interview_score.includes(filterInterviewScore)
    );

    var filterInterviewTime = '';
    if (elementInterviewTime != null && typeof elementInterviewTime.value !== 'undefined') {
      filterInterviewTime = elementInterviewTime.value;
    }
    if (filterInterviewTime == '') {
      this.removeSearchSelectedItem('interview_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].interview_time.includes(filterInterviewTime)
    );

    var filterRecommendTime = '';
    if (elementRecommendTime != null && typeof elementRecommendTime.value !== 'undefined') {
      filterRecommendTime = elementRecommendTime.value;
    }
    if (filterRecommendTime == '') {
      this.removeSearchSelectedItem('recommend_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].recommend_time.includes(filterRecommendTime)
    );

    var filterDesignProblemScore = '';
    if (
      elementDesignProblemScore != null &&
      typeof elementDesignProblemScore.value !== 'undefined'
    ) {
      filterDesignProblemScore = elementDesignProblemScore.value;
    }
    if (filterDesignProblemScore == '') {
      this.removeSearchSelectedItem('design_problem_scoreSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].design_problem_score.includes(filterDesignProblemScore)
    );

    var filterInterviewNum = '';
    if (elementInterviewNum != null && typeof elementInterviewNum.value !== 'undefined') {
      filterInterviewNum = elementInterviewNum.value;
    }
    if (filterInterviewNum == '') {
      this.removeSearchSelectedItem('interview_numSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].interview_num.includes(filterInterviewNum)
    );

    var filterWrittenScore = '';
    if (elementWrittenScore != null && typeof elementWrittenScore.value !== 'undefined') {
      filterWrittenScore = elementWrittenScore.value;
    }
    if (filterWrittenScore == '') {
      this.removeSearchSelectedItem('written_scoreSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].written_score.includes(filterWrittenScore)
    );

    var filterWrittenTime = '';
    if (elementWrittenTime != null && typeof elementWrittenTime.value !== 'undefined') {
      filterWrittenTime = elementWrittenTime.value;
    }
    if (filterWrittenTime == '') {
      this.removeSearchSelectedItem('written_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].written_time.includes(filterWrittenTime)
    );

    var filterInterviewSkillScore = '';
    if (
      elementInterviewSkillScore != null &&
      typeof elementInterviewSkillScore.value !== 'undefined'
    ) {
      filterInterviewSkillScore = elementInterviewSkillScore.value;
    }
    if (filterInterviewSkillScore == '') {
      this.removeSearchSelectedItem('interview_skill_scoreSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].interview_skill_score.includes(filterInterviewSkillScore)
    );

    var filterWrittenNum = '';
    if (elementWrittenNum != null && typeof elementWrittenNum.value !== 'undefined') {
      filterWrittenNum = elementWrittenNum.value;
    }
    if (filterWrittenNum == '') {
      this.removeSearchSelectedItem('written_numSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].written_num.includes(filterWrittenNum)
    );

    var filterInterviewQualityScore = '';
    if (
      elementInterviewQualityScore != null &&
      typeof elementInterviewQualityScore.value !== 'undefined'
    ) {
      filterInterviewQualityScore = elementInterviewQualityScore.value;
    }
    if (filterInterviewQualityScore == '') {
      this.removeSearchSelectedItem('interview_quality_scoreSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].interview_quality_score.includes(filterInterviewQualityScore)
    );

    var filterSchoolStartTime = '';
    if (elementSchoolStartTime != null && typeof elementSchoolStartTime.value !== 'undefined') {
      filterSchoolStartTime = elementSchoolStartTime.value;
    }
    if (filterSchoolStartTime == '') {
      this.removeSearchSelectedItem('school_start_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].education_start.includes(filterSchoolStartTime)
    );

    var filterGpaResults = '';
    if (elementGpaResults != null && typeof elementGpaResults.value !== 'undefined') {
      filterGpaResults = elementGpaResults.value;
    }
    if (filterGpaResults == '') {
      this.removeSearchSelectedItem('gpa_resultsSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].edu_gpa.includes(filterGpaResults)
    );

    var filterEntTime = '';
    if (elementEndTime != null && typeof elementEndTime.value !== 'undefined') {
      filterEntTime = elementEndTime.value;
    }
    if (filterEntTime == '') {
      this.removeSearchSelectedItem('end_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].education_end.includes(filterEntTime)
    );

    var filterMajor = '';
    if (elementMajor != null && typeof elementMajor.value !== 'undefined') {
      filterMajor = elementMajor.value;
    }
    if (filterMajor == '') {
      this.removeSearchSelectedItem('majorSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].education_major.includes(filterMajor)
    );

    var filterEducation = '';
    if (elementEducation != null && typeof elementEducation.value !== 'undefined') {
      filterEducation = elementEducation.value;
    }
    if (filterEducation == '') {
      this.removeSearchSelectedItem('educationSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].education_degree.includes(filterEducation)
    );

    var filterEduRecruit = '';
    if (elementEduRecruit != null && typeof elementEduRecruit.value !== 'undefined') {
      filterEduRecruit = elementEduRecruit.value;
    }
    if (filterEduRecruit == '') {
      this.removeSearchSelectedItem('edu_recruitSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].edu_recruit.includes(filterEduRecruit)
    );

    var filterGraduatedSchool = '';
    if (elementGraduatedSchool != null && typeof elementGraduatedSchool.value !== 'undefined') {
      filterGraduatedSchool = elementGraduatedSchool.value;
    }
    if (filterGraduatedSchool == '') {
      this.removeSearchSelectedItem('graduated_schoolSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].education_school.includes(filterGraduatedSchool)
    );

    var filterJobStartTime = '';
    if (elementJobStartTime != null && typeof elementJobStartTime.value !== 'undefined') {
      filterJobStartTime = elementJobStartTime.value;
    }
    if (filterJobStartTime == '') {
      this.removeSearchSelectedItem('job_start_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].start_date.includes(filterJobStartTime)
    );

    var filterNatureWork = '';
    if (elementNatureWork != null && typeof elementNatureWork.value !== 'undefined') {
      filterNatureWork = elementNatureWork.value;
    }
    if (filterNatureWork == '') {
      this.removeSearchSelectedItem('nature_workSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].company_nature.includes(filterNatureWork)
    );

    var filterJobDuration = '';
    if (elementJobDuration != null && typeof elementJobDuration.value !== 'undefined') {
      filterJobDuration = elementJobDuration.value;
    }
    if (filterJobDuration == '') {
      this.removeSearchSelectedItem('job_durationSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].duaration.includes(filterJobDuration)
    );

    var filterJobEndTime = '';
    if (elementJobEndTime != null && typeof elementJobEndTime.value !== 'undefined') {
      filterJobEndTime = elementJobEndTime.value;
    }
    if (filterJobEndTime == '') {
      this.removeSearchSelectedItem('job_end_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].end_date.includes(filterJobEndTime)
    );

    var filterJobIndustry = '';
    if (elementJobIndustry != null && typeof elementJobIndustry.value !== 'undefined') {
      filterJobIndustry = elementJobIndustry.value;
    }
    if (filterJobIndustry == '') {
      this.removeSearchSelectedItem('job_industrySI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].work_industry.includes(filterJobIndustry)
    );

    var filterNumberSubordinates = '';
    if (
      elementNumberSubordinates != null &&
      typeof elementNumberSubordinates.value !== 'undefined'
    ) {
      filterNumberSubordinates = elementNumberSubordinates.value;
    }
    if (filterNumberSubordinates == '') {
      this.removeSearchSelectedItem('number_subordinatesSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].staff.includes(filterNumberSubordinates)
    );

    var filterAbilityToWork = '';
    if (elementAbilityToWork != null && typeof elementAbilityToWork.value !== 'undefined') {
      filterAbilityToWork = elementAbilityToWork.value;
    }
    if (filterAbilityToWork == '') {
      this.removeSearchSelectedItem('ability_to_workSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].capacity.includes(filterAbilityToWork)
    );

    var filterJobCompany = '';
    if (elementJobCompany != null && typeof elementJobCompany.value !== 'undefined') {
      filterJobCompany = elementJobCompany.value;
    }
    if (filterJobCompany == '') {
      this.removeSearchSelectedItem('job_companySI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].company_name.includes(filterJobCompany)
    );

    var filterJobPosition = '';
    if (elementJobPosition != null && typeof elementJobPosition.value !== 'undefined') {
      filterJobPosition = elementJobPosition.value;
    }
    if (filterJobPosition == '') {
      this.removeSearchSelectedItem('job_positionSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].position.includes(filterJobPosition)
    );

    var filterReportTo = '';
    if (elementReportTo != null && typeof elementReportTo.value !== 'undefined') {
      filterReportTo = elementReportTo.value;
    }
    if (filterReportTo == '') {
      this.removeSearchSelectedItem('report_toSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].report_to.includes(filterReportTo)
    );

    var filterWorkContent = '';
    if (elementWorkContent != null && typeof elementWorkContent.value !== 'undefined') {
      filterWorkContent = elementWorkContent.value;
    }
    if (filterWorkContent == '') {
      this.removeSearchSelectedItem('work_contentSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].content.includes(filterWorkContent)
    );

    var filterDepartment = '';
    if (elementDepartment != null && typeof elementDepartment.value !== 'undefined') {
      filterDepartment = elementDepartment.value;
    }
    if (filterDepartment == '') {
      this.removeSearchSelectedItem('departmentSI', 1);
    }
    if (filterDepartment != '') {
      activeItems = activeItems.filter((item, idx) => {
        if (personData[item - 1].company_size != '') {
          if (personData[item - 1].company_size == parseInt(filterDepartment)) return true;
          else return false;
        }
      });
    }

    var filterJobResidenceLocation = '';
    if (
      elementJobResidenceLocation != null &&
      typeof elementJobResidenceLocation.value !== 'undefined'
    ) {
      filterJobResidenceLocation = elementJobResidenceLocation.value;
    }
    if (filterJobResidenceLocation == '') {
      this.removeSearchSelectedItem('job_residence_locationSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].dept.includes(filterJobResidenceLocation)
    );

    var filterReasonForLeaving = '';
    if (elementReasonForLeaving != null && typeof elementReasonForLeaving.value !== 'undefined') {
      filterReasonForLeaving = elementReasonForLeaving.value;
    }
    if (filterReasonForLeaving == '') {
      this.removeSearchSelectedItem('reason_for_leavingSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].why_leave.includes(filterReasonForLeaving)
    );

    var filterPro = '';
    if (elementPro != null && typeof elementPro.value !== 'undefined') {
      filterPro = elementPro.value;
    }
    if (filterPro == '') {
      this.removeSearchSelectedItem('pro_start_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].pro_start_date.includes(filterPro)
    );

    var filterProTakePositionAs = '';
    if (elementProTakePositionAs != null && typeof elementProTakePositionAs.value !== 'undefined') {
      filterProTakePositionAs = elementProTakePositionAs.value;
    }
    if (filterProTakePositionAs == '') {
      this.removeSearchSelectedItem('pro_take_position_asSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].pro_position.includes(filterProTakePositionAs)
    );

    var filterProEndTime = '';
    if (elementProEndTime != null && typeof elementProEndTime.value !== 'undefined') {
      filterProEndTime = elementProTakePositionAs.value;
    }
    if (filterProEndTime == '') {
      this.removeSearchSelectedItem('pro_end_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].pro_end_date.includes(filterProEndTime)
    );

    var filterProjectDescription = '';
    if (
      elementProjectDescription != null &&
      typeof elementProjectDescription.value !== 'undefined'
    ) {
      filterProjectDescription = elementProjectDescription.value;
    }
    if (filterProjectDescription == '') {
      this.removeSearchSelectedItem('project_descriptionSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].pro_content.includes(filterProjectDescription)
    );

    var filterProjectName = '';
    if (elementProjectName != null && typeof elementProjectName.value !== 'undefined') {
      filterProjectName = elementProjectName.value;
    }
    if (filterProjectName == '') {
      this.removeSearchSelectedItem('project_nameSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].pro_name.includes(filterProjectName)
    );

    var filterProjectResponsibilities = '';
    if (
      elementProjectResponsibilities != null &&
      typeof elementProjectResponsibilities.value !== 'undefined'
    ) {
      filterProjectResponsibilities = elementProjectResponsibilities.value;
    }
    if (filterProjectResponsibilities == '') {
      this.removeSearchSelectedItem('project_responsibilitiesSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].pro_resp.includes(filterProjectResponsibilities)
    );

    var filterProCompanyName = '';
    if (elementProCompanyName != null && typeof elementProCompanyName.value !== 'undefined') {
      filterProCompanyName = elementProCompanyName.value;
    }
    if (filterProCompanyName == '') {
      this.removeSearchSelectedItem('pro_companySI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].pro_company_name.includes(filterProCompanyName)
    );

    var filterSkillName = '';
    if (elementSkillName != null && typeof elementSkillName.value !== 'undefined') {
      filterSkillName = elementSkillName.value;
    }
    if (filterSkillName == '') {
      this.removeSearchSelectedItem('skill_nameSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].skill_name.includes(filterSkillName)
    );

    var filterSkillLevel = '';
    if (elementSkillLevel != null && typeof elementSkillLevel.value !== 'undefined') {
      filterSkillLevel = elementSkillLevel.value;
    }
    if (filterSkillLevel == '') {
      this.removeSearchSelectedItem('skill_levelSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].skill_level.includes(filterSkillLevel)
    );

    var filterSkillUseTime = '';
    if (elementSkillUseTime != null && typeof elementSkillUseTime.value !== 'undefined') {
      filterSkillUseTime = elementSkillUseTime.value;
    }
    if (filterSkillUseTime == '') {
      this.removeSearchSelectedItem('skill_use_timeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].skill_time.includes(filterSkillUseTime)
    );

    var filterLanguageName = '';
    if (elementLanguageName != null && typeof elementLanguageName.value !== 'undefined') {
      filterLanguageName = elementLanguageName.value;
    }
    if (filterLanguageName == '') {
      this.removeSearchSelectedItem('language_nameSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].lang_name.includes(filterLanguageName)
    );

    var filterLanguage = '';
    if (elementLanguage != null && typeof elementLanguage.value !== 'undefined') {
      filterLanguage = elementLanguage.value;
    }
    if (filterLanguage == '') {
      this.removeSearchSelectedItem('languageSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].lang.includes(filterLanguage)
    );

    var filterLangSkillLevel = '';
    if (elementLangSkillLevel != null && typeof elementLangSkillLevel.value !== 'undefined') {
      filterLangSkillLevel = elementLangSkillLevel.value;
    }
    if (filterLangSkillLevel == '') {
      this.removeSearchSelectedItem('lang_skill_levelSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].lang_level.includes(filterLangSkillLevel)
    );

    var filterCertificateName = '';
    if (elementCertificateName != null && typeof elementCertificateName.value !== 'undefined') {
      filterCertificateName = elementCertificateName.value;
    }
    if (filterCertificateName == '') {
      this.removeSearchSelectedItem('certificate_nameSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].langcert_name.includes(filterCertificateName)
    );

    var filterLiteracy = '';
    if (elementLiteracy != null && typeof elementLiteracy.value !== 'undefined') {
      filterLiteracy = elementLiteracy.value;
    }
    if (filterLiteracy == '') {
      this.removeSearchSelectedItem('literacySI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].lang_read_write.includes(filterLiteracy)
    );

    var filterLangSkillLevel = '';
    if (elementGrade != null && typeof elementGrade.value !== 'undefined') {
      filterLangSkillLevel = elementGrade.value;
    }
    if (filterLangSkillLevel == '') {
      this.removeSearchSelectedItem('gradeSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].langcert_score.includes(filterLangSkillLevel)
    );

    var filterListeningSpeakingSkill = '';
    if (
      elementListeningSpeakingSkill != null &&
      typeof elementListeningSpeakingSkill.value !== 'undefined'
    ) {
      filterListeningSpeakingSkill = elementListeningSpeakingSkill.value;
    }
    if (filterListeningSpeakingSkill == '') {
      this.removeSearchSelectedItem('listening_speaking_skillSI', 1);
    }
    activeItems = activeItems.filter((item, idx) =>
      personData[item - 1].lang_listen_speak.includes(filterListeningSpeakingSkill)
    );

    this.setState(
      {
        totalItems: activeItems,
      },
      this.pageInit
    );

    this.setState({ isSearched: true });
    console.log('---------', this.state.searchSelectedItems);
  };

  clearFilter = () => {
    this.clearSearchInputs();
    this.filterByKey();

    this.setState({ isSearched: false });
  };

  addItemToSearchStatus = (e, id, name) => {
    e.preventDefault();
    let inputId = id.slice(0, id.length - 2);
    // if (document.getElementById(inputId).value == '') {
    //   return;
    // }
    if (id == 'nameSI') this.setState({ name: document.getElementById(inputId).value });
    if (id == 'ageSI') this.setState({ age: document.getElementById(inputId).value });
    if (id == 'identity_numberSI')
      this.setState({ identity_number: document.getElementById(inputId).value });
    if (id == 'current_positionSI')
      this.setState({ current_position: document.getElementById(inputId).value });
    if (id == 'current_salarySI')
      this.setState({ current_salary: document.getElementById(inputId).value });
    if (id == 'duty_timeSI') this.setState({ duty_time: document.getElementById(inputId).value });
    if (id == 'emailSI') this.setState({ email: document.getElementById(inputId).value });
    if (id == 'birthdaySI') this.setState({ birthday: document.getElementById(inputId).value });
    if (id == 'nationSI') this.setState({ nation: document.getElementById(inputId).value });
    if (id == 'current_unitSI')
      this.setState({ current_unit: document.getElementById(inputId).value });
    if (id == 'work_spaceSI') this.setState({ work_space: document.getElementById(inputId).value });
    if (id == 'current_separation_working_statusSI')
      this.setState({ current_separation_working_status: document.getElementById(inputId).value });
    if (id == 'phoneSI') this.setState({ phone: document.getElementById(inputId).value });
    if (id == 'current_locationSI')
      this.setState({ current_location: document.getElementById(inputId).value });
    if (id == 'english_levelSI')
      this.setState({ english_level: document.getElementById(inputId).value });
    if (id == 'industrySI') this.setState({ industry: document.getElementById(inputId).value });
    if (id == 'expected_salarySI')
      this.setState({ expected_salary: document.getElementById(inputId).value });
    if (id == 'expected_work_spaceSI')
      this.setState({ expected_work_space: document.getElementById(inputId).value });
    if (id == 'genderSI') this.setState({ gender: document.getElementById(inputId).value });
    if (id == 'residence_locationSI')
      this.setState({ residence_location: document.getElementById(inputId).value });
    if (id == 'computer_skillSI')
      this.setState({ computer_skill: document.getElementById(inputId).value });
    if (id == 'working_statusSI')
      this.setState({ working_status: document.getElementById(inputId).value });
    if (id == 'expected_industrySI')
      this.setState({ expected_industry: document.getElementById(inputId).value });
    if (id == 'recommend_timeSI')
      this.setState({ recommend_time: document.getElementById(inputId).value });
    if (id == 'problem_scoreSI')
      this.setState({ problem_score: document.getElementById(inputId).value });
    if (id == 'written_rankSI')
      this.setState({ written_rank: document.getElementById(inputId).value });
    if (id == 'interview_quality_scoreSI')
      this.setState({ interview_quality_score: document.getElementById(inputId).value });
    if (id == 'written_scoreSI')
      this.setState({ written_score: document.getElementById(inputId).value });
    if (id == 'design_problem_scoreSI')
      this.setState({ design_problem_score: document.getElementById(inputId).value });
    if (id == 'interview_scoreSI')
      this.setState({ interview_score: document.getElementById(inputId).value });
    if (id == 'interview_rankSI')
      this.setState({ interview_rank: document.getElementById(inputId).value });
    if (id == 'written_numSI')
      this.setState({ written_num: document.getElementById(inputId).value });
    if (id == 'written_timeSI')
      this.setState({ written_time: document.getElementById(inputId).value });
    if (id == 'interview_numSI')
      this.setState({ interview_num: document.getElementById(inputId).value });
    if (id == 'interview_timeSI')
      this.setState({ interview_time: document.getElementById(inputId).value });
    if (id == 'single_choice_scoreSI')
      this.setState({ single_choice_score: document.getElementById(inputId).value });
    if (id == 'residence_location1SI')
      this.setState({ residence_location1: document.getElementById(inputId).value });
    if (id == 'interview_skill_scoreSI')
      this.setState({ interview_skill_score: document.getElementById(inputId).value });
    if (id == 'school_start_timeSI')
      this.setState({ school_start_time: document.getElementById(inputId).value });
    if (id == 'graduation_typeSI')
      this.setState({ graduation_type: document.getElementById(inputId).value });
    if (id == 'gpa_resultsSI')
      this.setState({ gpa_results: document.getElementById(inputId).value });
    if (id == 'end_timeSI') this.setState({ end_time: document.getElementById(inputId).value });
    if (id == 'majorSI') this.setState({ major: document.getElementById(inputId).value });
    if (id == 'graduation_timeSI')
      this.setState({ graduation_time: document.getElementById(inputId).value });
    if (id == 'educationSI') this.setState({ education: document.getElementById(inputId).value });
    if (id == 'graduated_schoolSI')
      this.setState({ graduated_school: document.getElementById(inputId).value });
    if (id == 'edu_recruitSI')
      this.setState({ edu_recruit: document.getElementById(inputId).value });
    if (id == 'job_start_timeSI')
      this.setState({ job_start_time: document.getElementById(inputId).value });
    if (id == 'company_descriptionSI')
      this.setState({ company_description: document.getElementById(inputId).value });
    if (id == 'nature_workSI')
      this.setState({ nature_work: document.getElementById(inputId).value });
    if (id == 'job_durationSI')
      this.setState({ job_duration: document.getElementById(inputId).value });
    if (id == 'job_end_timeSI')
      this.setState({ job_end_time: document.getElementById(inputId).value });
    if (id == 'job_industrySI')
      this.setState({ job_industry: document.getElementById(inputId).value });
    if (id == 'number_subordinatesSI')
      this.setState({ number_subordinates: document.getElementById(inputId).value });
    if (id == 'ability_to_workSI')
      this.setState({ ability_to_work: document.getElementById(inputId).value });
    if (id == 'job_companySI')
      this.setState({ job_company: document.getElementById(inputId).value });
    if (id == 'job_positionSI')
      this.setState({ job_position: document.getElementById(inputId).value });
    if (id == 'report_toSI') this.setState({ report_to: document.getElementById(inputId).value });
    if (id == 'work_contentSI')
      this.setState({ work_content: document.getElementById(inputId).value });
    if (id == 'departmentSI') this.setState({ department: document.getElementById(inputId).value });
    if (id == 'job_residence_locationSI')
      this.setState({ job_residence_location: document.getElementById(inputId).value });
    if (id == 'reason_for_leavingSI')
      this.setState({ reason_for_leaving: document.getElementById(inputId).value });
    if (id == 'pro_start_timeSI')
      this.setState({ pro_start_time: document.getElementById(inputId).value });
    if (id == 'pro_take_position_asSI')
      this.setState({ pro_take_position_as: document.getElementById(inputId).value });
    if (id == 'pro_end_timeSI')
      this.setState({ pro_end_time: document.getElementById(inputId).value });
    if (id == 'project_descriptionSI')
      this.setState({ project_description: document.getElementById(inputId).value });
    if (id == 'project_nameSI')
      this.setState({ project_name: document.getElementById(inputId).value });
    if (id == 'project_responsibilitiesSI')
      this.setState({ project_responsibilities: document.getElementById(inputId).value });
    if (id == 'pro_companySI')
      this.setState({ pro_company: document.getElementById(inputId).value });
    if (id == 'skill_nameSI') this.setState({ skill_name: document.getElementById(inputId).value });
    if (id == 'skill_levelSI')
      this.setState({ skill_level: document.getElementById(inputId).value });
    if (id == 'skill_use_timeSI')
      this.setState({ skill_use_time: document.getElementById(inputId).value });
    if (id == 'language_nameSI')
      this.setState({ language_name: document.getElementById(inputId).value });
    if (id == 'languageSI') this.setState({ language: document.getElementById(inputId).value });
    if (id == 'lang_skill_levelSI')
      this.setState({ lang_skill_level: document.getElementById(inputId).value });
    if (id == 'certificate_nameSI')
      this.setState({ certificate_name: document.getElementById(inputId).value });
    if (id == 'literacySI') this.setState({ literacy: document.getElementById(inputId).value });
    if (id == 'gradeSI') this.setState({ grade: document.getElementById(inputId).value });
    if (id == 'listening_speaking_skillSI')
      this.setState({ listening_speaking_skill: document.getElementById(inputId).value });

    const { searchSelectedItems } = this.state;
    if (document.getElementById(inputId).value != '') {
      if (!this.checkExistArray(id)) {
        searchSelectedItems.push({ id: id, name: name });

        this.setState({
          searchSelectedItems: searchSelectedItems,
        });

        if (document.getElementById(id)) {
          document.getElementById(id).style.display = 'none';
        }
      }
    }
  };

  checkExistArray(id) {
    let result = false;
    const { searchSelectedItems } = this.state;
    searchSelectedItems.forEach(element => {
      if (element.id == id) {
        result = true;
      }
    });
    return result;
  }

  removeSearchSelectedItem(id, mode = 0) {
    const { searchSelectedItems } = this.state;
    for (let index = 0; index < searchSelectedItems.length; index++) {
      const element = searchSelectedItems[index];
      if (element.id == id) {
        searchSelectedItems.splice(index, 1);
      }
    }

    let inputId = id.slice(0, id.length - 2);

    if (id == 'nameSI') this.setState({ name: '' }, this.props.form.resetFields);
    if (id == 'ageSI') this.setState({ age: '' }, this.props.form.resetFields);
    if (id == 'identity_numberSI')
      this.setState({ identity_number: '' }, this.props.form.resetFields);
    if (id == 'current_positionSI')
      this.setState({ current_position: '' }, this.props.form.resetFields);
    if (id == 'current_salarySI')
      this.setState({ current_salary: '' }, this.props.form.resetFields);
    if (id == 'duty_timeSI') this.setState({ duty_time: '' }, this.props.form.resetFields);
    if (id == 'emailSI') this.setState({ email: '' }, this.props.form.resetFields);
    if (id == 'birthdaySI') this.setState({ birthday: '' }, this.props.form.resetFields);
    if (id == 'nationSI') this.setState({ nation: '' }, this.props.form.resetFields);
    if (id == 'current_unitSI') this.setState({ current_unit: '' }, this.props.form.resetFields);
    if (id == 'work_spaceSI') this.setState({ work_space: '' }, this.props.form.resetFields);
    if (id == 'current_separation_working_statusSI')
      this.setState({ current_separation_working_status: '' }, this.props.form.resetFields);
    if (id == 'phoneSI') this.setState({ phone: '' }, this.props.form.resetFields);
    if (id == 'current_locationSI')
      this.setState({ current_location: '' }, this.props.form.resetFields);
    if (id == 'english_levelSI') this.setState({ english_level: '' }, this.props.form.resetFields);
    if (id == 'industrySI') this.setState({ industry: '' }, this.props.form.resetFields);
    if (id == 'expected_salarySI')
      this.setState({ expected_salary: '' }, this.props.form.resetFields);
    if (id == 'expected_work_spaceSI')
      this.setState({ expected_work_space: '' }, this.props.form.resetFields);
    if (id == 'genderSI') this.setState({ gender: '' }, this.props.form.resetFields);
    if (id == 'residence_locationSI')
      this.setState({ residence_location: '' }, this.props.form.resetFields);
    if (id == 'computer_skillSI')
      this.setState({ computer_skill: '' }, this.props.form.resetFields);
    if (id == 'working_statusSI')
      this.setState({ working_status: '' }, this.props.form.resetFields);
    if (id == 'expected_industrySI')
      this.setState({ expected_industry: '' }, this.props.form.resetFields);
    if (id == 'recommend_timeSI')
      this.setState({ recommend_time: '' }, this.props.form.resetFields);
    if (id == 'problem_scoreSI') this.setState({ problem_score: '' }, this.props.form.resetFields);
    if (id == 'written_rankSI') this.setState({ written_rank: '' }, this.props.form.resetFields);
    if (id == 'interview_quality_scoreSI')
      this.setState({ interview_quality_score: '' }, this.props.form.resetFields);
    if (id == 'written_scoreSI') this.setState({ written_score: '' }, this.props.form.resetFields);
    if (id == 'design_problem_scoreSI')
      this.setState({ design_problem_score: '' }, this.props.form.resetFields);
    if (id == 'interview_scoreSI')
      this.setState({ interview_score: '' }, this.props.form.resetFields);
    if (id == 'interview_rankSI')
      this.setState({ interview_rank: '' }, this.props.form.resetFields);
    if (id == 'written_numSI') this.setState({ written_num: '' }, this.props.form.resetFields);
    if (id == 'written_timeSI') this.setState({ written_time: '' }, this.props.form.resetFields);
    if (id == 'interview_numSI') this.setState({ interview_num: '' }, this.props.form.resetFields);
    if (id == 'interview_timeSI')
      this.setState({ interview_time: '' }, this.props.form.resetFields);
    if (id == 'single_choice_scoreSI')
      this.setState({ single_choice_score: '' }, this.props.form.resetFields);
    if (id == 'residence_location1SI')
      this.setState({ residence_location1: '' }, this.props.form.resetFields);
    if (id == 'interview_skill_scoreSI')
      this.setState({ interview_skill_score: '' }, this.props.form.resetFields);
    if (id == 'school_start_timeSI')
      this.setState({ school_start_time: '' }, this.props.form.resetFields);
    if (id == 'graduation_typeSI')
      this.setState({ graduation_type: '' }, this.props.form.resetFields);
    if (id == 'gpa_resultsSI') this.setState({ gpa_results: '' }, this.props.form.resetFields);
    if (id == 'end_timeSI') this.setState({ end_time: '' }, this.props.form.resetFields);
    if (id == 'majorSI') this.setState({ major: '' }, this.props.form.resetFields);
    if (id == 'graduation_timeSI')
      this.setState({ graduation_time: '' }, this.props.form.resetFields);
    if (id == 'educationSI') this.setState({ education: '' }, this.props.form.resetFields);
    if (id == 'graduated_schoolSI')
      this.setState({ graduated_school: '' }, this.props.form.resetFields);
    if (id == 'edu_recruitSI') this.setState({ edu_recruit: '' }, this.props.form.resetFields);
    if (id == 'job_start_timeSI')
      this.setState({ job_start_time: '' }, this.props.form.resetFields);
    if (id == 'company_descriptionSI')
      this.setState({ company_description: '' }, this.props.form.resetFields);
    if (id == 'nature_workSI') this.setState({ nature_work: '' }, this.props.form.resetFields);
    if (id == 'job_durationSI') this.setState({ job_duration: '' }, this.props.form.resetFields);
    if (id == 'job_end_timeSI') this.setState({ job_end_time: '' }, this.props.form.resetFields);
    if (id == 'job_industrySI') this.setState({ job_industry: '' }, this.props.form.resetFields);
    if (id == 'number_subordinatesSI')
      this.setState({ number_subordinates: '' }, this.props.form.resetFields);
    if (id == 'ability_to_workSI')
      this.setState({ ability_to_work: '' }, this.props.form.resetFields);
    if (id == 'job_companySI') this.setState({ job_company: '' }, this.props.form.resetFields);
    if (id == 'job_positionSI') this.setState({ job_position: '' }, this.props.form.resetFields);
    if (id == 'report_toSI') this.setState({ report_to: '' }, this.props.form.resetFields);
    if (id == 'work_contentSI') this.setState({ work_content: '' }, this.props.form.resetFields);
    if (id == 'departmentSI') this.setState({ department: '' }, this.props.form.resetFields);
    if (id == 'job_residence_locationSI')
      this.setState({ job_residence_location: '' }, this.props.form.resetFields);
    if (id == 'reason_for_leavingSI')
      this.setState({ reason_for_leaving: '' }, this.props.form.resetFields);
    if (id == 'pro_start_timeSI')
      this.setState({ pro_start_time: '' }, this.props.form.resetFields);
    if (id == 'pro_take_position_asSI')
      this.setState({ pro_take_position_as: '' }, this.props.form.resetFields);
    if (id == 'pro_end_timeSI') this.setState({ pro_end_time: '' }, this.props.form.resetFields);
    if (id == 'project_descriptionSI')
      this.setState({ project_description: '' }, this.props.form.resetFields);
    if (id == 'project_nameSI') this.setState({ project_name: '' }, this.props.form.resetFields);
    if (id == 'project_responsibilitiesSI')
      this.setState({ project_responsibilities: '' }, this.props.form.resetFields);
    if (id == 'pro_companySI') this.setState({ pro_company: '' }, this.props.form.resetFields);
    if (id == 'skill_nameSI') this.setState({ skill_name: '' }, this.props.form.resetFields);
    if (id == 'skill_levelSI') this.setState({ skill_level: '' }, this.props.form.resetFields);
    if (id == 'skill_use_timeSI')
      this.setState({ skill_use_time: '' }, this.props.form.resetFields);
    if (id == 'language_nameSI') this.setState({ language_name: '' }, this.props.form.resetFields);
    if (id == 'languageSI') this.setState({ language: '' }, this.props.form.resetFields);
    if (id == 'lang_skill_levelSI')
      this.setState({ lang_skill_level: '' }, this.props.form.resetFields);
    if (id == 'certificate_nameSI')
      this.setState({ certificate_name: '' }, this.props.form.resetFields);
    if (id == 'literacySI') this.setState({ literacy: '' }, this.props.form.resetFields);
    if (id == 'gradeSI') this.setState({ grade: '' }, this.props.form.resetFields);
    if (id == 'listening_speaking_skillSI')
      this.setState({ listening_speaking_skill: '' }, this.props.form.resetFields);

    if (mode == 0) {
      setTimeout(() => {
        this.filterByKey();
      }, 500);
    }
  }

  clearSearchInputs = () => {
    this.setState(
      {
        name: '',
        age: '',
        identity_number: '',
        current_position: '',
        current_salary: '',
        duty_time: '',
        email: '',
        birthday: '',
        nation: '',
        current_unit: '',
        work_space: '',
        current_separation_working_status: '',
        phone: '',
        current_location: '',
        english_level: '',
        industry: '',
        expected_salary: '',
        expected_work_space: '',
        gender: '',
        residence_location: '',
        computer_skill: '',
        working_status: '',
        expected_industry: '',
        recommend_time: '',
        problem_score: '',
        written_rank: '',
        interview_quality_score: '',
        written_score: '',
        design_problem_score: '',
        interview_score: '',
        interview_rank: '',
        written_num: '',
        written_time: '',
        interview_num: '',
        single_choice_score: '',
        residence_location1: '',
        interview_skill_score: '',
        school_start_time: '',
        graduation_type: '',
        gpa_results: '',
        end_time: '',
        major: '',
        graduation_time: '',
        education: '',
        graduated_school: '',
        edu_recruit: '',
        job_start_time: '',
        company_description: '',
        nature_work: '',
        job_duration: '',
        job_end_time: '',
        job_industry: '',
        number_subordinates: '',
        ability_to_work: '',
        job_company: '',
        job_position: '',
        report_to: '',
        work_content: '',
        department: '',
        job_residence_location: '',
        reason_for_leaving: '',
        pro_start_time: '',
        pro_take_position_as: '',
        pro_end_time: '',
        project_description: '',
        project_name: '',
        project_responsibilities: '',
        pro_company: '',
        skill_name: '',
        skill_level: '',
        skill_use_time: '',
        language_name: '',
        language: '',
        lang_skill_level: '',
        certificate_name: '',
        literacy: '',
        grade: '',
        listening_speaking_skill: '',

        selectedResumes: [],
        totalItems: [],
        sendtimes: 0,

        searchSelectedItems: [],
      },
      this.props.form.resetFields()
    );
  };

  pageInit = () => {
    this.listInit(1);
  };

  paginationChange = page_number => {
    this.listInit(page_number);
  };

  // customize
  resumeCheckHandle = (resumeId, status) => {
    let idx = this.state.selectedResumes.findIndex(resume => resume.id === resumeId);
    let selectedResumes = this.state.selectedResumes.map(resume => resume);
    if (idx === -1 && status) {
      selectedResumes.push({
        id: resumeId,
      });
    } else if (idx !== -1 && !status) {
      selectedResumes.splice(idx, 1);
    }
    this.setState({
      selectedResumes: selectedResumes,
    });
  };

  render() {
    const urlParams = new URL(window.location.href);
    const path = urlParams.pathname;
    const array = path.split('/');
    const id = array[array.length - 1];

    const short_form_group = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 18 },
      },
    };
    const medium_form_group = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        md: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 14 },
      },
    };
    const long_form_group = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        md: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 16 },
      },
    };
    const extra_form_group = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 14 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const { items } = this.props;
    const { personData } = this.props;
    const { statistics_data } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { selectedResumes } = this.state;
    const { offer_data_list } = this.props;
    const { totalItems } = this.state;

    const { searchSelectedItems } = this.state;

    if (
      typeof items === 'undefined' ||
      typeof personData === 'undefined' ||
      personData.length < 1 ||
      typeof totalItems === 'undefined'
    ) {
      return <></>;
    }

    return (
      <React.Fragment>
        <Text>
          <a style={{ color: '#2979ff' }} href="/requirementManagement">
            需求列表
          </a>{' '}
          /{' '}
          <a style={{ color: '#2979ff' }} href={'/requirementManagement/' + id}>
            需求详情
          </a>{' '}
          / 更多简历
        </Text>
        <Card style={{ marginTop: 15, marginBottom: 20 }}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={<Button>基本信息</Button>} key="1">
              <Row gutter={{ md: 24 }}>
                <Col md={6}>
                  <Form.Item label="姓名" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('name', {
                      initialValue: this.state.name,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'nameSI', '姓名');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="年龄" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('age', {
                      initialValue: this.state.age,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'ageSI', '年龄');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="身份证号" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('identity_number', {
                      initialValue: this.state.identity_number,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'identity_numberSI', '身份证号');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="当前职位" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('current_position', {
                      initialValue: this.state.current_position,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'current_positionSI', '当前职位');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="当前薪资" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('current_salary', {
                      initialValue: this.state.current_salary,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'current_salarySI', '当前薪资');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="到岗时间" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('duty_time', {
                      initialValue: this.state.duty_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'duty_timeSI', '到岗时间');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="邮箱" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('email', {
                      initialValue: this.state.email,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'emailSI', '邮箱');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="出生时间" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('birthday', {
                      initialValue: this.state.birthday,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'birthdaySI', '出生时间');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="民族" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('nation', {
                      initialValue: this.state.nation,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'nationSI', '民族');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="当前单位" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('current_unit', {
                      initialValue: this.state.current_unit,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'current_unitSI', '当前单位');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="工作地点" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('work_space', {
                      initialValue: this.state.work_space,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'work_spaceSI', '工作地点');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="当前离职/在职状态"
                    {...extra_form_group}
                    style={{ marginBottom: 5 }}
                  >
                    {getFieldDecorator('current_separation_working_status', {
                      initialValue: this.state.current_separation_working_status,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(
                            e,
                            'current_separation_working_statusSI',
                            '当前离职/在职状态'
                          );
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="电话" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('phone', {
                      initialValue: this.state.phone,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'phoneSI', '电话');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="当前所在地" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('current_location', {
                      initialValue: this.state.current_location,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'current_locationSI', '当前所在地');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="英语水平" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('english_level', {
                      initialValue: this.state.english_level,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'english_levelSI', '英语水平');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="所处行业" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('industry', {
                      initialValue: this.state.industry,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'industrySI', '所处行业');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="期望薪资" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('expected_salary', {
                      initialValue: this.state.expected_salary,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'expected_salarySI', '期望薪资');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="期望工作地点"
                    {...medium_form_group}
                    style={{ marginBottom: 5 }}
                  >
                    {getFieldDecorator('expected_work_space', {
                      initialValue: this.state.expected_work_space,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'expected_work_spaceSI', '期望工作地点');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="性别" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('gender', {
                      initialValue: this.state.gender,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'genderSI', '性别');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="户口所在地" {...medium_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('residence_location', {
                      initialValue: this.state.residence_location,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'residence_locationSI', '户口所在地');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="计算机水平" {...medium_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('computer_skill', {
                      initialValue: this.state.computer_skill,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'computer_skillSI', '计算机水平');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="在职状态" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('working_status', {
                      initialValue: this.state.working_status,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'working_statusSI', '在职状态');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="期望行业" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('expected_industry', {
                      initialValue: this.state.expected_industry,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'expected_industrySI', '期望行业');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Button>笔面试信息</Button>} key="2">
              <Row gutter={{ md: 24 }}>
                <Col md={6}>
                  <Form.Item
                    label="推荐时间"
                    {...long_form_group}
                    style={{ marginBottom: 5, paddingRight: 1 }}
                  >
                    {getFieldDecorator('recommend_time', {
                      initialValue: this.state.recommend_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'recommend_timeSI', '推荐时间');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="应用题得分" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('problem_score', {
                      initialValue: this.state.problem_score,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'problem_scoreSI', '应用题得分');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="笔试成绩排名"
                    {...medium_form_group}
                    style={{ marginBottom: 5 }}
                  >
                    {getFieldDecorator('written_rank', {
                      initialValue: this.state.written_rank,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'written_rankSI', '笔试成绩排名');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="面试素质题得分"
                    {...extra_form_group}
                    style={{ marginBottom: 5, textAlign: 'left' }}
                  >
                    {getFieldDecorator('interview_quality_score', {
                      initialValue: this.state.interview_quality_score,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(
                            e,
                            'interview_quality_scoreSI',
                            '面试素质题得分'
                          );
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="笔试成绩" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('written_score', {
                      initialValue: this.state.written_score,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'written_scoreSI', '笔试成绩');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="设计与应用题得分"
                    {...extra_form_group}
                    style={{ marginBottom: 5 }}
                  >
                    {getFieldDecorator('design_problem_score', {
                      initialValue: this.state.design_problem_score,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(
                            e,
                            'design_problem_scoreSI',
                            '设计与应用题得分'
                          );
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="面试成绩" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('interview_score', {
                      initialValue: this.state.interview_score,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'interview_scoreSI', '面试成绩');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="面试成绩排名"
                    {...medium_form_group}
                    style={{ marginBottom: 5 }}
                  >
                    {getFieldDecorator('interview_rank', {
                      initialValue: this.state.interview_rank,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'interview_rankSI', '面试成绩排名');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="笔试答题数" {...medium_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('written_num', {
                      initialValue: this.state.written_num,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'written_numSI', '笔试答题数');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="笔试题答卷时长"
                    {...extra_form_group}
                    style={{ marginBottom: 5, textAlign: 'left' }}
                  >
                    {getFieldDecorator('written_time', {
                      initialValue: this.state.written_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'written_timeSI', '笔试题答卷时长');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="面试题目数" {...medium_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('interview_num', {
                      initialValue: this.state.interview_num,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'interview_numSI', '面试题目数');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="面试时长" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('interview_time', {
                      initialValue: this.state.interview_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'interview_timeSI', '面试时长');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="单选题得分" {...medium_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('single_choice_score', {
                      initialValue: this.state.single_choice_score,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'single_choice_scoreSI', '单选题得分');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="笔试题卷切换次数"
                    {...extra_form_group}
                    style={{ marginBottom: 5, textAlign: 'left' }}
                  >
                    {getFieldDecorator('residence_location1', {
                      initialValue: this.state.residence_location1,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(
                            e,
                            'residence_location1SI',
                            '笔试题卷切换次数'
                          );
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="面试技术题得分"
                    {...extra_form_group}
                    style={{ marginBottom: 5, textAlign: 'left' }}
                  >
                    {getFieldDecorator('interview_skill_score', {
                      initialValue: this.state.interview_skill_score,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(
                            e,
                            'interview_skill_scoreSI',
                            '面试技术题得分'
                          );
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Button>教育经历</Button>} key="3">
              <Row gutter={{ md: 24 }}>
                <Col md={6}>
                  <Form.Item label="开始时间" {...long_form_group} style={{ marginBottom: 5 }}>
                    {/* <DatePicker /> */}
                    {getFieldDecorator('school_start_time', {
                      initialValue: this.state.school_start_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'school_start_timeSI', '开始时间');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="毕业学校类型"
                    {...medium_form_group}
                    style={{ marginBottom: 5 }}
                  >
                    {getFieldDecorator('graduation_type', {
                      initialValue: this.state.graduation_type,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'graduation_typeSI', '毕业学校类型');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="gpa成绩" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('gpa_results', {
                      initialValue: this.state.gpa_results,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'gpa_resultsSI', 'gpa成绩');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="结束时间" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('end_time', {
                      initialValue: this.state.end_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'end_timeSI', '结束时间');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="所学专业" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('major', {
                      initialValue: this.state.major,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'majorSI', '所学专业');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="毕业时间" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('graduation_time', {
                      initialValue: this.state.graduation_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'graduation_timeSI', '毕业时间');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="学历" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('education', {
                      initialValue: this.state.education,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'educationSI', '学历');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="毕业学校" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('graduated_school', {
                      initialValue: this.state.graduated_school,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'graduated_schoolSI', '毕业学校');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="是否统招" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('edu_recruit', {
                      initialValue: this.state.edu_recruit,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'edu_recruitSI', '是否统招');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Button>工作经历</Button>} key="4">
              <Row gutter={{ md: 24 }}>
                <Col md={6}>
                  <Form.Item label="开始时间" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('job_start_time', {
                      initialValue: this.state.job_start_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'job_start_timeSI', '开始时间');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="公司描述" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('company_description', {
                      initialValue: this.state.company_description,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'company_descriptionSI', '公司描述');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="工作性质" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('nature_work', {
                      initialValue: this.state.nature_work,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'nature_workSI', '工作性质');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="持续时间" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('job_duration', {
                      initialValue: this.state.duration,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'job_durationSI', '持续时间');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="结束时间" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('job_end_time', {
                      initialValue: this.state.end_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'job_end_timeSI', '结束时间');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="行业" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('job_industry', {
                      initialValue: this.state.industry,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'job_industrySI', '行业');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="下属人数" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('number_subordinates', {
                      initialValue: this.state.number_subordinates,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'number_subordinatesSI', '下属人数');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="工作能力" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('ability_to_work', {
                      initialValue: this.state.ability_to_work,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'ability_to_workSI', '工作能力');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="公司" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('job_company', {
                      initialValue: this.state.company,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'job_companySI', 'job_company');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="职位" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('job_position', {
                      initialValue: this.state.position,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'job_positionSI', '职位');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="汇报对象" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('report_to', {
                      initialValue: this.state.report_to,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'report_toSI', '汇报对象');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="工作内容" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('work_content', {
                      initialValue: this.state.work_content,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'work_contentSI', '工作内容');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="公司规模" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('department', {
                      initialValue: this.state.department,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'departmentSI', '公司规模');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="所在部门" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('job_residence_location', {
                      initialValue: this.state.residence_location,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'job_residence_locationSI', '所在部门');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="离职原因" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('reason_for_leaving', {
                      initialValue: this.state.reason_for_leaving,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'reason_for_leavingSI', '离职原因');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Button>项目经历</Button>} key="5">
              <Row gutter={{ md: 24 }}>
                <Col md={6}>
                  <Form.Item label="开始时间" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('pro_start_time', {
                      initialValue: this.state.start_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'pro_start_timeSI', '开始时间');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="担任职位" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('pro_take_position_as', {
                      initialValue: this.state.take_position_as,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'pro_take_position_asSI', '担任职位');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="结束时间" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('pro_end_time', {
                      initialValue: this.state.end_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'pro_end_timeSI', '结束时间');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="项目内容" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('project_description', {
                      initialValue: this.state.project_description,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'project_descriptionSI', '项目内容');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="项目名称" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('project_name', {
                      initialValue: this.state.project_name,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'project_nameSI', '项目名称');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="项目职责" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('project_responsibilities', {
                      initialValue: this.state.project_responsibilities,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'project_responsibilitiesSI', '项目职责');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="所在公司" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('pro_company', {
                      initialValue: this.state.company,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'pro_companySI', '所在公司');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Button>技能信息</Button>} key="6">
              <Row gutter={{ md: 24 }}>
                <Col md={6}>
                  <Form.Item label="技能名称" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('skill_name', {
                      initialValue: this.state.skill_name,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'skill_nameSI', '技能名称');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="熟练程度" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('skill_level', {
                      initialValue: this.state.skill_level,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'skill_levelSI', '熟练程度');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item
                    label="技能使用时间"
                    {...medium_form_group}
                    style={{ marginBottom: 5 }}
                  >
                    {getFieldDecorator('skill_use_time', {
                      initialValue: this.state.skill_use_time,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'skill_use_timeSI', '技能使用时间');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6} />
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Button>语言技能</Button>} key="7">
              <Row gutter={{ md: 24 }}>
                <Col md={6}>
                  <Form.Item label="语言名称" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('language_name', {
                      initialValue: this.state.language_name,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'language_nameSI', '语言名称');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="语言" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('language', {
                      initialValue: this.state.language,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'languageSI', '语言');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="熟练程度" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('lang_skill_level', {
                      initialValue: this.state.skill_level,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'lang_skill_levelSI', '熟练程度');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="证书名称" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('certificate_name', {
                      initialValue: this.state.certificate_name,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'certificate_nameSI', '证书名称');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="读写能力" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('literacy', {
                      initialValue: this.state.literacy,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'literacySI', '读写能力');
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="成绩" {...short_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('grade', {
                      initialValue: this.state.grade,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'gradeSI', '成绩');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label="听说能力" {...long_form_group} style={{ marginBottom: 5 }}>
                    {getFieldDecorator('listening_speaking_skill', {
                      initialValue: this.state.listening_speaking_skill,
                    })(
                      <Input
                        type="text"
                        onChange={e => {
                          this.addItemToSearchStatus(e, 'listening_speaking_skillSI', '听说能力');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item label="已筛选" {...short_form_group} style={{ marginBottom: 5 }}>
                  {searchSelectedItems.map(element => (
                    <span style={{ display: 'none', marginLeft: '20px' }}>
                      <a
                        className={classes.reportCloseBtn}
                        id={element.id}
                        style={{ display: 'block' }}
                      >
                        <Text className={classes.reportCloseBtn}>{element.name}</Text>
                        <Icon
                          type="close-circle"
                          style={{ verticalAlign: 'super' }}
                          onClick={() => {
                            this.removeSearchSelectedItem(element.id);
                          }}
                        />
                      </a>
                    </span>
                  ))}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                  <Button style={{ marginRight: 20 }} onClick={this.clearFilter}>
                    重置
                  </Button>
                  <Button type="primary" onClick={this.filterByKey}>
                    筛选
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
          <div>
            <Text>排序：</Text>
            <Button type="primary" style={{ marginRight: 20 }}>
              更新时间
            </Button>
            <Button style={{ marginRight: 20 }}>总成绩排名</Button>
            <Button style={{ marginRight: 20 }}>笔试成绩排名</Button>
            <Button>面试成绩排名</Button>
          </div>
          <div>
            <CompareResumesModal
              activedResumeNums={selectedResumes.length}
              selectedResumes={selectedResumes}
              resumes={offer_data_list}
              reportMethod
            />
            <Button type="primary" style={{ marginRight: 20 }}>
              导出数据表
            </Button>
            <StatisticsModal statistics_data={statistics_data} />
          </div>
        </div>
        {this.state.activeItems.map((______item, idx) => (
          <PersonData
            idx={idx}
            personData={personData[______item - 1]}
            resumeCheckHandle={this.resumeCheckHandle}
            num={______item - 1}
            selectedResumes={selectedResumes}
          />
        ))}
        <div style={{ textAlign: 'center' }}>
          <Pagination
            defaultCurrent={this.state.current_page}
            total={totalItems.length}
            pageSize={this.state.per_page_nums}
            onChange={e => this.paginationChange(e)}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default RequirementReport;
