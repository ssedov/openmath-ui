import React from "react";
import axios from "axios";
import Config from "./Config";
import Test from "./Test"
import './SubmissionExplorer.css';

type SubmissionHeaderProps = {
    submission: any,
    callback: any,
}
class SubmissionHeader extends React.Component<SubmissionHeaderProps, any> {
    public state: any = {}
    render() {
        return (
            <div className={'submissionHeader'} onClick={() => this.props.callback(this.props.submission)}>
                {this.props.submission.meta_name || 'Аноним'} ({this.props.submission.meta_group_number}) {this.props.submission.ts}
            </div>
    )}
}

type Submission = any;

type SubmissionExplorerState = {
    submissions?: Map<string, Submission>,
    submissionsOrdered?: string[],
    selectedSubmissionId?: string,
    test?: any
}

export default class SubmissionExplorer extends React.Component<any, SubmissionExplorerState> {
    public state: any = {
        submissions: new Map<string, Submission>(),
        submissionsOrdered: [],
        selectedSubmissionId: undefined,
        test: undefined,
    }

    public testRenderer: Test | undefined = undefined;

    public componentDidMount() {
        axios.get(`${Config.API()}/submissions/${this.props.test_id}`).then(
            (response) => {
                this.setState(() => {
                    let state: any = {};
                    state.submissions = new Map<string, Submission>();
                    state.submissionsOrdered = [];
                    const submissions = response.data.submissions;
                    for (let i in submissions) {
                        let sid = submissions[i].submission_id;
                        state.submissions.set(sid, submissions[i]);
                        state.submissionsOrdered.push(sid);
                    }
                    state.test = response.data.test;
                    return state;
                });
            });
    }

    private SelectSubmission(sid: string) {
        // data.parent.testRenderer?.setSubmission(data);
        if (this.state.selectedSubmissionId === sid)
            this.setState({selectedSubmissionId: undefined});
        else
            this.setState({selectedSubmissionId: sid});
    }

    public render() {
        if (!this.state.submissions) return (<h1>Загрузка...</h1>)
        console.log(this.state.test)
        console.log(this.state.selectedSubmissionId)
        return (
            <div className={'submissionExplorer'}>
                <div className={'submissionList'}>
                    {this.state.submissionsOrdered.map((each: any) => {
                        const sub = this.state.submissions.get(each);
                        return <SubmissionHeader submission={sub} callback={(data: any) => {console.log('Callback: ', data); this.SelectSubmission(data.submission_id);}}/>
                    })}
                </div>
                {this.state.selectedSubmissionId ? (
                    <Test test_id={this.props.test_id}
                          read_only={true}
                          preloaded={this.state.test}
                          submission={this.state.submissions.get(this.state.selectedSubmissionId)}
                    />)
                    : <div/>}
            </div>)
    }
}