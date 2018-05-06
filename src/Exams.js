import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import showdown from 'showdown';
import ReactMarkdown from 'react-markdown'

let r = ReactRethinkdb.r;
let converter = new showdown.Converter();

export const Details = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            question: "",
            answer: "",
            content: "",
            htmlcode: ""
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
        let lines = this.state.content.split('\n')
        console.log("lines", lines)

        let questions = []
        let question = null
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] !== "") {
                if (lines[i].startsWith('Title:')) {
                    question != null && questions.push(question)
                    question = {}
                    question.title = lines[i].split(":")[1].trim()
                }
                else if (question.title && !question.question) {
                    question.question = lines[i]
                    question.choices = []
                }
                else if (question.title && question.question) {
                    if (lines[i].startsWith("*")) {
                        if (lines[i].includes(")")) {
                            question.answer = lines[i].split(")")[1].trim()
                        }
                        else {
                            question.answer = lines[i].substring(1)
                        }
                    }
                    if (lines[i].includes(")")) {
                        question.choices.push(lines[i].split(")")[1].trim())
                    }
                }
            }
        }

        question != null && questions.push(question)
        console.log("questions", questions)

        questions.map((question) => {
            let query = r.table('exams').get(this.props.match.params.id).update({
                questions: r.row('questions').append(question)
            })
            ReactRethinkdb.DefaultSession.runQuery(query);
        })

        // let query = r.table('exams').get(this.props.match.params.id).update({
        //     questions: r.row('questions').append(
        //         { question: this.state.question, answer: this.state.answer }
        //     )
        // })

    },

    handleDeleteQuestion(question) {
        let query = r.table('exams').get(this.props.match.params.id).update({
            questions: r.row('questions').difference([{ question: question.question, answer: question.answer }])
        })
        ReactRethinkdb.DefaultSession.runQuery(query);
    },

    handleEditQuestion(question) {
        //let query = r.table('exams').get(this.props.match.params.id).update({
        //    questions: r.row('questions').difference([{ question: question.question, answer: question.answer }])
        //})
        //ReactRethinkdb.DefaultSession.runQuery(query);
        this.setState({ question: question.question, answer: question.answer })

    },

    async handleMarkdown(e) {
        await this.setState({ content: e.target.value })
        let html = converter.makeHtml(this.state.content)
        await this.setState({ htmlcode: html })
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
                                    {/* <p>Title: {question.title}</p> */}
                                    <p>Q{index + 1}. {question.question} ({question.marks}m)</p>
                                    {
                                        question.choices.length !== 0
                                        &&
                                        <ol type="a">
                                            {
                                                question.choices.map((choice, index) =>
                                                    <li key={index}>{choice}</li>
                                                )
                                            }
                                        </ol>
                                    }
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
                    <br />
                    <textarea value={this.state.content} style={{ width: 800, height: 250 }} placeholder="Enter Markdown" onChange={(e) => this.handleMarkdown(e)} />
                    <br />
                    {/* <br/>
                    <textarea value={this.state.htmlcode} style={{ width: 800, height: 250 }} placeholder="Enter HTML" />
                    <br/>
                    <div dangerouslySetInnerHTML={{ __html: this.state.htmlcode}}></div>
                    <ReactMarkdown source={this.state.content} /> */}
                    <button onClick={() => this.handleAddQuestion()}>Add Question</button>
                </div>

        )

    },
});
