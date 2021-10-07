import React from "react";
import axios from "axios";
import Question, {QuestionState} from "./Question";
import Config from "./Config";
import './Test.css';

type TestId = {
    test_id: string,
    data?: TestData,
}

type TestData = {
    questions: Map<string, QuestionState>,
    title?: string,
    status?: string,
    submission_id?: string,
    uploads?: number,
}

export default class Test extends React.Component<TestId, TestData> {
    state: TestData = {
        questions: new Map<string, any>(),
    };

    private answers: any = {};
    private dataLoaded = false;
    private uploads = 0;

    public getQuestionData(questionId: string): QuestionState {
        const qs = this.state.questions.get(questionId);
        if (qs)
            return qs;
        throw Error('question not found');
    }

    public constructor(id: TestId) {
        super(id);
        if (id.data) {
            this.state = id.data;
            this.dataLoaded = true;
        }
    }

    public componentDidMount() {
        this.loadData();
    }

    private loadData() {
        if (this.dataLoaded)
            return;
        if (!Config.API() || Config.API() === 'foo')
            return;
        axios.get(`${Config.API()}/test/${this.props.test_id}`).then(
            (req) => {
                this.dataLoaded = true;
                const newQuestions = new Map<string, any>();
                for (let q_id in req.data.questions) {
                    const qq = req.data.questions[q_id];
                    const qid: string = qq.question_id;
                    newQuestions.set(qid, qq);
                }
                let title = req.data.title;

                this.setState(state => ({title: title, questions: newQuestions}))
            });
    }

    public submitForm() {
        //ToDo: validations
        console.log('Submit');
        console.log(this.answers);

        axios.get(`${Config.API()}/submit`).then(
            resp => {
                this.answers.submission_id = resp.data.submission_id;
                const config = {headers: {SubmissionId: resp.data.submission_id}};
                this.state.questions.forEach((q, key) => {
                    const form = new FormData();
                    if (q.type === 'file' && this.answers[key]) {
                        this.uploads += 1;
                        form.append(key, this.answers[key][0]);
                        axios.put(`${Config.API()}/upload`, form, config).then(
                            resp => {
                                this.uploads -= resp.status === 200 ? 1 : 0;
                                this.setState(state => state);
                            }
                        );
                    }
                });


                axios.post(`${Config.API()}/submit/${this.props.test_id}`, this.answers, config).then(
                    r => {
                        if (r.status === 200 && r.data.status === 'success') {
                            const state = this.state;
                            state.status = r.data.status;
                            state.submission_id = r.data.submission_id || 'N/A';
                            this.setState(state);
                        }
                    }
                );
            })
    }

    public handleAnswer(questionId: string, answerNumber: number, value: boolean | string | FileList): void {
        const q = this.state.questions.get(questionId);
        if (!q)
            throw Error('Question not found')

        if (q.type === 'single')
            this.answers[questionId] = answerNumber;
        else if (q.type === 'multi') {
            this.answers[questionId] = this.answers[questionId] || {};
            this.answers[questionId][answerNumber.toString()] = !value;
        }
        else if (q.type === 'free' || q.type === 'text') {
            value = (typeof value === 'string' ? value : '');
            this.answers[questionId] = value;
        }
        else if (q.type === 'file') {
            this.answers[questionId] = value;
        }
        console.log(this.answers);
    }

    public render() {
        if (this.state.status === 'success') {
            if (this.uploads === 0) return (
                <div><h3>Ваши результаты приняты, спасибо за отправку.</h3>
                    <p>Идентификатор отправки: {this.state.submission_id}</p>
                </div>
            );
            return (
                <div><h3>Ваши результаты приняты, идёт загрузка файлов ({this.uploads}).</h3>
                    <p>Идентификатор отправки: {this.state.submission_id}</p>
                </div>
            );

        }
        const listItems: any = [];
        this.state.questions.forEach((question, question_id) => {
            listItems.push(<li key={question_id}><Question question_id={question_id} parent={this}/></li>);
        });
        const title = this.state.title || 'Загрузка...';
        return (
            <div className='testWrapper'>
                <div className='testTitle'><h2 className='testTitle'>{title}</h2></div>
                <form onSubmit={() => {this.submitForm();}}>
                    <ol>{listItems}</ol>
                    { this.dataLoaded && (
                    <div className='submit'>
                        <input type='button' className='submitTest' value='Отправить' onClick={() => {this.submitForm();}}/>
                    </div> ) }
                </form>
            </div>);
    }
}