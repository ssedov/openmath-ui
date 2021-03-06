import {MathJax} from "better-react-mathjax";
import MathJaxContext from "better-react-mathjax/MathJaxContext";
import React from "react";
import Test from "./Test";
import './Question.css';
import Config from "./Config";

type MarkupPiece = {
    type: 'plain' | 'itex' | 'tex',
    value: string,
}

export type QuestionState = {
    selection: string | number | null
    text: string | MarkupPiece[],
    image?: string,
    answers: string[] | MarkupPiece[][] | undefined,
    type: 'free' | 'single' | 'multi' | 'file' | 'text' | undefined
}

type QuestionData = {
    question_id: string,
    parent: Test,
    marker?: string,
};

export default class Question extends React.Component<QuestionData, QuestionState> {

    state: QuestionState = {
        text: '',
        answers: [],
        selection: null,
        type: undefined,
    }

    public componentDidMount() {
        this.setState(state => this.props.parent.getQuestionData(this.props.question_id));
    }

    public render() {
        let answerBlock: JSX.Element | undefined = undefined;
        const inputType = {single: 'radio', multi: 'checkbox', free: 'text', text: 'multiline'};
        if (this.state.type === 'single' || this.state.type === 'multi') {
            const t = this.state.type || ''; // TS linting
            const answers = this.state.answers || [];
            console.log(answers);
            answerBlock = (<div className='answerBlock'>
                <div>
                    {answers.map((answer, index) => (
                        <div>
                            <input type={inputType[t]} value={index} name={this.props.question_id}
                                   id={this.props.question_id + index}
                                   onInput={(e) =>
                                       this.props.parent.handleAnswer(e.currentTarget.name, index, '')}
                            />
                            <label>{this.renderText(answer)}</label>
                        </div>))
                    }
                </div>
            </div>);
        }
        else if (this.state.type === 'free') {
            const t = this.state.type || ''; // TS linting
            answerBlock = (<div className='answerBlock'>
                <div>
                    <div>
                        <input type={inputType[t]} className={t} name={this.props.question_id}
                               id={this.props.question_id + 'i'}
                               onInput={(e) =>
                                   this.props.parent.handleAnswer(e.currentTarget.name, 0, e.currentTarget.value)}
                        />
                    </div>
                </div>
            </div>);
        }
        else if (this.state.type === 'text') {
            const t = this.state.type || ''; // TS linting
            answerBlock = (<div className='answerBlock'>
                <div>
                    <div>
                        <textarea className={t} name={this.props.question_id}
                               id={this.props.question_id + 'i'}
                               onInput={(e) =>
                                   this.props.parent.handleAnswer(e.currentTarget.name, 0, e.currentTarget.value)}
                        />
                    </div>
                </div>
            </div>);
        }
        else if (this.state.type === 'file') {
            const t = this.state.type || ''; // TS linting
            answerBlock = (<div className='answerBlock'>
                <div>
                    <div>
                        <input type='file' className={t} name={this.props.question_id}
                               id={this.props.question_id + 'i'}
                               onInput={(e) =>
                                   this.props.parent.handleAnswer(e.currentTarget.name, 0, e.currentTarget.files || '')}
                        />
                    </div>
                </div>
            </div>);
        }
        let image: JSX.Element | undefined;
        if (this.state.image)
            image = (
                <img className='questionImage' src={`${Config.API()}/image/${this.state.image}`} alt={this.props.question_id}/>
            );
        return (<MathJaxContext>
                <div className={image ? "questionContainerImg" : "questionContainer"}>
                    <div className={'questionMarker'}>{this.props.marker}.</div>
                    {image}
                    <div className='questionText'><p>{this.renderText(this.state.text)}</p></div>
                    <div>{answerBlock}</div>
                </div>
            </MathJaxContext>
        )
    }

    private submitForm() {
        //ToDo: validations

        this.props.parent.submitForm();
    }

    private renderText(x: string | MarkupPiece[]): JSX.Element[] | JSX.Element {
        return <MathJax inline={true}>{x}</MathJax>;
    }
}