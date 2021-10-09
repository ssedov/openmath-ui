import {MathJax} from "better-react-mathjax";
import MathJaxContext from "better-react-mathjax/MathJaxContext";
import React from "react";
import Test from "./Test";
import './Question.css';
import Config from "./Config";

export type QuestionState = {
    selection: string | number | null
    text: string,
    image?: string,
    answers?: string[],
    type?: 'free' | 'single' | 'multi' | 'file' | 'text',
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
        let answerBlock: JSX.Element | undefined;
        if (this.state.type === 'single' || this.state.type === 'multi') {
            answerBlock = this.answerBlockClosed(this.state.answers || []);
        } else if (this.state.type === 'free') {
            answerBlock = (<div className='answerBlock'>
                <input type={this.inputType()} className={this.state.type} name={this.props.question_id}
                       id={this.props.question_id + 'i'}
                       readOnly={this.props.parent.props.read_only}
                       defaultValue={this.props.parent.getAnswer(this.props.question_id)}
                       onInput={(e) =>
                           this.props.parent.handleAnswer(e.currentTarget.name, 0, e.currentTarget.value)}
                />
            </div>);
        } else if (this.state.type === 'text') {
            answerBlock = (
                <div className='answerBlock'>
                    <textarea className={this.state.type} name={this.props.question_id}
                              id={this.props.question_id + 'i'}
                              readOnly={this.props.parent.props.read_only}
                              defaultValue={this.props.parent.getAnswer(this.props.question_id)}
                              onInput={(e) =>
                                  this.props.parent.handleAnswer(e.currentTarget.name, 0, e.currentTarget.value)}
                    />
                </div>);
        } else if (this.state.type === 'file') {
            const t = this.state.type || ''; // TS linting
            answerBlock = (<div className='answerBlock'>
                        <input type='file' className={t} name={this.props.question_id}
                               id={this.props.question_id + 'i'}
                               readOnly={this.props.parent.props.read_only}
                               onInput={(e) =>
                                   this.props.parent.handleAnswer(e.currentTarget.name, 0, e.currentTarget.files || '')}
                        />
            </div>);
        }
        let image: JSX.Element | undefined;
        if (this.state.image)
            image = (
                <img className='questionImage' src={`${Config.API()}/image/${this.state.image}`}
                     alt={this.props.question_id}/>
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

    private inputType() {
        switch (this.state.type) {
            case 'single':
                return 'radio';
            case 'multi':
                return 'checkbox';
            case 'free':
                return 'text';
            case 'text':
                return 'multiline';
        }
    }

    private answerBlockClosed(answers: any[]): JSX.Element {
        return (
            <div className='answerBlock'>
                {answers.map((answer, index) => (
                    <div className={'answer'}>
                        <input type={this.inputType()} value={index}
                               disabled={this.props.parent.props.read_only}
                               defaultChecked={this.props.parent.isAnswerSelected(this.props.question_id, index)}
                               name={this.props.question_id}
                               id={this.props.question_id + index}
                               onInput={(e) => {
                                   this.props.parent.handleAnswer(e.currentTarget.name, index, '')
                               }
                               }
                        />
                        <label>{this.renderText(answer)}</label>
                    </div>))
                }
            </div>
        );
    }

    private submitForm() {
        //ToDo: validations

        this.props.parent.submitForm();
    }

    private renderText(x: string) {
        return <MathJax inline={true}>{x}</MathJax>;
    }
}