import React from 'react';
import { Modal, Button, Switch } from 'antd';
import classes from './RequirementDetail.less';


export default class CompareResumesModal extends React.PureComponent {
    state = {
        visible: false,
        resumes: [],
    }

    // cobra-55555 -20-04-24
    componentWillMount = () => {
        this.initComponent();
    }

    componentWillReceiveProps = () => {
        this.initComponent();
    }

    initComponent = () => {
        this.initResumes();
        this.showAllItems();
    }
    // // // // //

    initResumes = () => {
        const { resumes } = this.props;
        this.setState({resumes: resumes});
    }

    showThisModal = () => {
        const {selectedResumes} = this.props;
        if (selectedResumes.length > 1) {
            this.setState({visible: true});
        }
    }

    showConvertShow = () => {
        if(this.state.isShowAllItem) {
            this.hideEquaItems();
        }
        else {
            this.showAllItems();
        }
    }

    hideEquaItems = () => {
        const { resumes } = this.props;
        const {selectedResumes} = this.props;

        this.setState({isShowAllItem: false});
        this.setState({
            showTotalResult: false,
            showWrittenResult: false,
            showInterviewResult: false,
            showSalery: false,
            showEntryTimeRange: false,
            showRelatedWorkExperience: false,
            showEducation: false,
            showGraduatedSchool: false,
            showProfession: false,
            showRecommend: false,
        });
        
        const totalmark0 = resumes[0].totalmark;
        const written_result0 = resumes[0].written_result;
        const interview_result0 = resumes[0].interview_result;
        const salery0 = resumes[0].salery;
        const education0 = resumes[0].education;

        
        for(var i=1;i<selectedResumes.length;i++) {
            
            if(resumes[i].totalmark !== totalmark0) {
                this.setState({showTotalResult: true});
            }
            
            if(resumes[i].salery !== salery0) {
                this.setState({showSalery: true});
            }

            if(resumes[i].written_result !== written_result0) {
                this.setState({showWrittenResult: true});
            }

            if(resumes[i].interview_result !== interview_result0) {
                this.setState({showInterviewResult: true});
            }

            if(resumes[i].education !== education0) {
                this.setState({showEducation: true});
            }
        }
    }

    showAllItems = () => {
        this.setState({
            showTotalResult: true,
            showWrittenResult: true,
            showInterviewResult: true,
            showSalery: true,
            showEntryTimeRange: true,
            showRelatedWorkExperience: true,
            showEducation: true,
            showGraduatedSchool: true,
            showProfession: true,
            showRecommend: true,
            isShowAllItem: true,
        });
    }

    render() {
        const { activedResumeNums } = this.props;
        // const { visible, selectedResumes } = this.state;
        const { visible } = this.state;

        const {selectedResumes} = this.props;
        // const {resumes} = this.props;
        const {resumes} = this.state;

        const {reportMethod} = this.props;

        // cobra-55555 -20-04-24
        if ( typeof resumes === 'undefined' || typeof selectedResumes === 'undefined' || resumes.length < 1) {
          if (reportMethod) {
            return (
              <Button type="primary" style={{ marginRight: 20 }}>
                人员对比
              </Button>
            );
          }
          return (
            <React.Fragment>
              <Button type="danger" onClick={this.showThisModal} block style={{ marginTop: '10px'}}>一键对比({activedResumeNums}/5)</Button>
            </React.Fragment>
          );
        }

        return (
          <React.Fragment>
            {reportMethod === true ? 
              <Button type="primary" style={{ marginRight: 20 }} onClick={this.showThisModal}>
                人员对比
              </Button>
              :
              <Button type="danger" onClick={this.showThisModal} block>一键对比({activedResumeNums}/5)</Button>
            }

            <Modal 
              title="人员对比"
              width={900}
              footer={null}
              visible={visible}
              onCancel={() => this.setState({visible: false})}
            >
              <div style={{overflowX: 'auto'}}>
                <table className={classes.compareTable}>
                  <thead>
                    <tr>
                      <th>隐藏相同信息<Switch size="small" style={{marginTop: -3}} onChange={this.showConvertShow} /></th>
                      {selectedResumes.map((resume, idx) => <th key={idx}>{resumes[resume.id].name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.showTotalResult ?
                      <tr>
                        <td>总成绩</td>
                        {selectedResumes.map((resume, idx) => <td key={idx}>{resumes[resume.id].totalmark}</td>)}
                      </tr>
                      :
                      <></>
                    }

                    { this.state.showWrittenResult ? 
                      <tr>
                        <td>笔试成绩</td>
                        {selectedResumes.map((resume, idx) => <td key={idx}>{resumes[resume.id].written_result}</td>)}
                      </tr>
                      :
                      <></>
                    }

                    { this.state.showInterviewResult ?
                      <tr>
                        <td>面试成绩</td>
                        {selectedResumes.map((resume, idx) => <td key={idx}>{resumes[resume.id].interview_result}</td>)}
                      </tr>
                      :
                      <></>
                    }

                    { this.state.showSalery ? 
                      <tr>
                        <td>期望薪资(K)</td>
                        {selectedResumes.map((resume, idx) => <td key={idx}>{resumes[resume.id].salery}</td>)}
                      </tr>
                      : <></>
                    }

                    { this.state.showEntryTimeRange ?   
                      <tr>
                        <td>入项时间范围</td>
                        {/* cobra-55555 -20-04-22 need setting */}
                        {selectedResumes.map((resume, idx) => <td key={idx}>{resume.entryTimeRange}</td>)}
                      </tr>:
                      <></>
                    }

                    { this.state.showRelatedWorkExperience ?
                      <tr>
                        <td>相关工作经验(年）</td>
                        {/* cobra-55555 -20-04-22 need setting */}
                        {selectedResumes.map((resume, idx) => <td key={idx}>{resume.relatedWorkExperience}</td>)}
                      </tr>
                      :
                      <></>
                    }

                    { this.state.showEducation ? 
                      <tr>
                        <td>学历</td>
                        {selectedResumes.map((resume, idx) => <td key={idx}>{resumes[resume.id].education}</td>)}
                      </tr>
                      :
                      <></>
                    }

                    { this.state.showGraduatedSchool ?
                      <tr>
                        <td>毕业院校</td>
                        {/* cobra-55555 -20-04-22 need setting */}
                        {selectedResumes.map((resume, idx) => <td key={idx}>{resume.graduatedSchool}</td>)}
                      </tr>
                      :
                      <></>
                    }

                    { this.state.showProfession ?
                      <tr>
                        <td>专业</td>
                        {/* cobra-55555 -20-04-22 need setting */}
                        {selectedResumes.map((resume, idx) => <td key={idx}>{resume.profession}</td>)}
                      </tr>
                      :
                      <></>
                    }

                    { this.state.showRecommend ?
                      <tr>
                        <td>是否推荐</td>
                        {/* cobra-55555 -20-04-22 need setting */}
                        {selectedResumes.map((resume, idx) => <td key={idx}>{resume.recommend}</td>)}
                      </tr>
                      :
                      <></>
                    }

                  </tbody>
                </table>
              </div>
            </Modal>
          </React.Fragment>
        )
    }
}