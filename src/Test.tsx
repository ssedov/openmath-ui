import React from "react";
import axios from "axios";
import Question, {QuestionState} from "./Question";
import Config from "./Config";

type TestId = {
    test_id: string,
    data?: TestData,
}

type TestData = {
    questions: Map<string, QuestionState>,
    title: string | null,
    status: string,
    submission_id: string,
}

export default class Test extends React.Component<TestId, TestData> {
    state: TestData = {
        questions: new Map<string, any>(),
        title: null,
        status: '',
        submission_id: ''
    };

    private answers: any = {};
    private dataLoaded = false;

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
        if (!Config.API)
            return;
        axios.get(`${Config.API}/test/${this.props.test_id}`).then(
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
        const form = new FormData();
        form.set('foo', 'bar');
        axios.post('/api/submit/' + this.props.test_id, this.answers).then(
            r => {
                if (r.status === 200 && r.data.status === 'success') {
                    const state = this.state;
                    state.status = r.data.status;
                    state.submission_id = r.data.submission_id || 'N/A';
                    this.setState(state);
                }
            }
        );
    }

    public handleAnswer(questionId: string, answerNumber: number, value: boolean | string): void {
        const q = this.state.questions.get(questionId);
        if (!q)
            throw Error('Question not found')

        if (q.type === 'single')
            this.answers[questionId] = answerNumber;
        if (q.type === 'multi') {
            this.answers[questionId] = this.answers[questionId] || {};
            this.answers[questionId][answerNumber.toString()] = !value;
        }
        if (q.type === 'free' || q.type === 'text') {
            value = (typeof value === 'string' ? value : '');
            this.answers[questionId] = value;
        }
    }

    public render() {
        if (this.state.status === 'success') {
            return (
                <div><h3>Ваши результаты приняты, спасибо за отправку.</h3>
                    <p>Идентификатор отправки: {this.state.submission_id}</p>
                </div>
            );
        }
        const listItems: any = [];
        this.state.questions.forEach((question, question_id) => {
            listItems.push(<li key={question_id}><Question question_id={question_id} parent={this}/></li>);
        });
        const title = this.state.title || 'Loading...';
        return (
            <div className='testWrapper'>
                <h3 className='testTitle'>{title}</h3>
                <form onSubmit={() => {this.submitForm();}}>
                    <ol>{listItems}</ol>
                    <div className='submit'>
                        <input type='button' value='Отправить' onClick={() => {this.submitForm();}}/>
                    </div>
                </form>
            </div>);
    }
}