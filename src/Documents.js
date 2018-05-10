import _ from 'lodash'
import { Button, Image, List, Transition, Form } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import $ from 'jquery'
let r = ReactRethinkdb.r;

export const Create = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    componentDidMount() {
        $(document).on('moved', '.uk-sortable', (e) => this.changeOrder(e));
    },

    getInitialState() {
        return {
            questions: [],
            order: [],
            type: "Quiz",
            name: "",
            startDate: "",
            endDate: "",
            dueDate: "",
            content: "",
        };
    },

    observe(props, state) {
        return {

        };
    },

    async changeOrder(e) {
        let id = e.originalEvent.detail[1].id
        console.log("id", id)
        let order = []
        for (let i = 0; i < e.target.childNodes.length; i++) {
            order.push(e.target.childNodes[i].id)
        }
        console.log("order", order)
        await this.setState({ order })
    },

    async handleAddQuestion() {
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

        let newQuestions = this.state.questions;
        let newOrder = this.state.order
        questions.map((question) => {
            newQuestions.push(question)
            newOrder.push(newOrder.length + "");
        })

        await this.setState({ questions: newQuestions, content: "", order: newOrder })
        console.log("newOrder", this.state.order)
    },

    async handleDeleteQuestion(question) {
        let newQuestions = this.state.questions;
        let newOrder = this.state.order
        let id = newQuestions.findIndex((item) => item == question)
        newOrder.splice(newOrder.findIndex((item) => item == id), 1)
        newQuestions.splice(newQuestions.findIndex((item) => item == question), 1)
        await this.setState({ questions: newQuestions, order: newOrder })
        console.log("newOrder", this.state.order)
    },

    handleSelectType(eventKey) {
        this.setState({ type: eventKey })
    },

    handleSelectQuestion(question) {
        let content = ""
        if (question.choices.length == 0) {
            content = "Title: " + question.title + "\n" +
                question.question + "\n" +
                "*" + question.answer
        }
        else {
            content = "Title: " + question.title + "\n" +
                question.question + "\n"
            question.choices.map((choice, index) => {
                if (choice == question.answer) {
                    content += "*" + (index + 1) + ") " + choice + "\n"
                }
                else {
                    content += (index + 1) + ") " + choice + "\n"
                }
            })
        }

        this.setState({ content })
    },

    handleEditQuestion() {

    },

    async uploadFile() {

    },

    handleFileUpload() {

    },

    async handleCreate() {
        let newQuestions = []
        this.state.order.map((item) => {
            newQuestions.push(this.state.questions[parseInt(item)])
        })

        let questionIds = []
        for (let i =0; i < newQuestions.length; i++) {
            let query = r.table('questions').insert({
                title: newQuestions[i].title,
                question: newQuestions[i].question,
                answer: newQuestions[i].answer,
                choices: newQuestions[i].choices
            })
            await ReactRethinkdb.DefaultSession.runQuery(query, { return_changes: true }).then(res => {
                questionIds.push(res.generated_keys[0])
                console.log("gen", res.generated_keys[0])
            })
        }

        console.log("questions id", questionIds)

        let query = r.table('documents').insert({
            type: this.state.type,
            name: this.state.name,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            dueDate: this.state.dueDate,
            questions: questionIds
        })
        ReactRethinkdb.DefaultSession.runQuery(query);
    },

    async getQuestionIds(newQuestions) {
        let questionIds = []
        newQuestions.map( (question) => {
            let query = r.table('questions').insert({
                title: question.title,
                question: question.question,
                answer: question.answer,
                choices: question.choices
            })
            ReactRethinkdb.DefaultSession.runQuery(query, { return_changes: true }).then(res => {
                questionIds.push(res.generated_keys[0])
                console.log("gen", res.generated_keys[0])
                //console.log("questions id", questionIds)
            })
        })
        return questionIds
    },

    render() {
        return (
            <div>
                <div className="document-create-header">
                    <BS.DropdownButton style={{ margin: 15 }} id="type" title={this.state.type} onSelect={this.handleSelectType}>
                        <BS.MenuItem key="Quiz" eventKey="Quiz" value="Quiz">Quiz</BS.MenuItem>
                        <BS.MenuItem key="Exam" eventKey="Exam" value="Exam">Exam</BS.MenuItem>
                        <BS.MenuItem key="Assignment" eventKey="Assignment" value="Assignment">Assignment</BS.MenuItem>
                        <BS.MenuItem key="Lab" eventKey="Lab" value="Labs">Lab</BS.MenuItem>
                    </BS.DropdownButton>
                    <BS.FormControl type="text" value={this.state.name} placeholder="Enter Name" onChange={(e) => this.setState({ name: e.target.value })} />
                    <BS.FormControl type="datetime-local" value={this.state.startDate} placeholder="Enter Start Date" onChange={(e) => this.setState({ startDate: e.target.value })} />
                    <BS.FormControl type="datetime-local" value={this.state.dueDate} placeholder="Enter Due Date" onChange={(e) => this.setState({ dueDate: e.target.value })} />
                    <BS.FormControl type="datetime-local" value={this.state.endDate} placeholder="Enter End Date" onChange={(e) => this.setState({ endDate: e.target.value })} />
                </div>

                <div className="document-questions-view">
                    {/* <div className="document-question-numbers">
                        {
                            this.state.questions.map((question, index) =>
                                <p key={index + 1}>
                                    Q{index + 1}.
                                </p>
                            )
                        }
                    </div> */}
                    <div className="document-question-content" uk-sortable="handle: .uk-card">
                        {
                            this.state.questions.map((question, index) =>
                                <div key={index} id={index} className="document-question" class="uk-card uk-card-default uk-card-body">
                                    <div className="document-question-header">
                                        <p className="document-question-name">{question.question}</p>
                                        <div className="document-question-options">
                                            <button onClick={() => this.handleSelectQuestion(question)} uk-icon="pencil" className="document-question-button"></button>
                                            <button onClick={() => this.handleDeleteQuestion(question)} uk-icon="close" className="document-question-button"></button>
                                        </div>
                                    </div>
                                    {
                                        question.choices.length !== 0
                                        &&
                                        <ol type="a" className="document-question-choices">
                                            {
                                                question.choices.map((choice, index) =>
                                                    <li key={index}>{choice}</li>
                                                )
                                            }
                                        </ol>
                                    }
                                    <p className="document-question-answer">A. {question.answer}</p>
                                </div>

                            )
                        }
                    </div>
                </div>
                <div className="document-questions-create">
                    <BS.FormControl componentClass="textarea" placeholder="Enter Questions" value={this.state.content} onChange={(e) => this.setState({ content: e.target.value })} />
                    <BS.Button bsStyle="primary" onClick={() => this.handleCreate()}>Done</BS.Button>
                    <BS.Button bsStyle="primary">Upload</BS.Button>
                    <BS.Button bsStyle="primary" onClick={() => this.handleAddQuestion()}>Add Question</BS.Button>
                    <BS.Button bsStyle="primary" onClick={() => this.handleEditQuestion()}>Edit Question</BS.Button>
                </div>
            </div>
        )
    },
});
