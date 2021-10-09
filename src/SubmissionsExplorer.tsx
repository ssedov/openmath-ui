import React from "react";
import axios from "axios";
import Config from "./Config";
import Test from "./Test"
import './SubmissionExplorer.css';

function SelectSubmission(elem: SubmissionExplorer, data: any) {
    console.log(data);
    data.parent.testRenderer?.setSubmission(data);
}

function SubmissionHeader(data: any): JSX.Element {
    console.log("SubmissionHeader: ", data);
    return (
        <div className={'submissionHeader'} onClick={() => SelectSubmission(data.parent, data.data)}>
            {data.data.meta_name || 'Аноним'} ({data.data.meta_group}) {data.data.ts}
        </div>
    )
}

export default class SubmissionExplorer extends React.Component<any, any> {
    public state: any = {
        submissions: [],
    }

    public testRenderer: Test | undefined = undefined;

    public componentDidMount() {
        axios.get(`${Config.API()}/submissions/${this.props.test_id}`).then(
            (req) => {
                const submissions: any[] = req.data.submissions.map((each: any) => {return each});
                this.setState(() => ({submissions: submissions}))
            });
    }

    public render() {
        return (
            <div className={'submissionExplorer'}>
                <div className={'submissionList'}>
                    {this.state.submissions.map((each: any) => {
                        each.parent = this;
                        return <SubmissionHeader data={each}/>
                    })}
                </div>
                <Test test_id={this.props.test_id} read_only={true} callback={(test: Test) => {this.testRenderer = test}}/>
            </div>)
    }
}