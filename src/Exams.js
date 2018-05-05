import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';

let r = ReactRethinkdb.r;

export const Details = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            question: "",
            answer: ""
        };
    },

    observe(props, state) {
        return {
            exam: new ReactRethinkdb.QueryRequest({
                query: r.table('exams').get(this.props.match.params.id),
                changes: true,
                initial: true,
            }),
        };

    },

    handleAddQuestion() {
        let query = r.table('exams').get(this.props.match.params.id).update({
            questions: r.row('questions').append(
                { question: this.state.question, answer: this.state.answer }
            )
        })
        ReactRethinkdb.DefaultSession.runQuery(query);
        this.setState({ question: '', answer: '' })
    },

    handleDeleteQuestion(question) {
        let query = r.table('exams').get(this.props.match.params.id).update({
            questions: r.row('questions').difference([{ question: question.question, answer: question.answer }])
        })
        ReactRethinkdb.DefaultSession.runQuery(query);
    },

    handleEditQuestion(question) {
        let query = r.table('exams').get(this.props.match.params.id).update({
            questions: r.row('questions').difference([{ question: question.question, answer: question.answer }])
        })
        ReactRethinkdb.DefaultSession.runQuery(query);
    },

    render() {
        return (
            this.data.exam.value() == true
                ?
                <div>Loading</div>
                :
                <div>
                    Exam: {this.props.match.params.id}
                    <div className="exam">
                        {
                            this.data.exam.value().questions.map((question, index) =>
                                <div key={index} className="question">
                                    <p>Q{index + 1}. {question.question} ({question.marks}m)</p>
                                    <p>A. {question.answer}</p>
                                    <button onClick={() => this.handleDeleteQuestion(question)}>Delete</button>
                                    <button onClick={() => this.handleEditQuestion(question)}>Edit</button>
                                    <br /><br />
                                </div>
                            )
                        }
                    </div>
                    <input type="text" name="question" placeholder="Question" value={this.state.question} onChange={e =>
                        this.setState({ question: e.target.value })} />
                    <input type="text" name="answer" placeholder="Answer" value={this.state.answer} onChange={e =>
                        this.setState({ answer: e.target.value })} />
                    <button onClick={() => this.handleAddQuestion()}>Add Question</button>
                </div>

        )

    },
});
