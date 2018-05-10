import _ from 'lodash'
import { Button, Image, List, Transition, Form } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import showdown from 'showdown';
import ReactMarkdown from 'react-markdown'
import $ from 'jquery'
require('jquery-ui');
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui/ui/disable-selection');
let r = ReactRethinkdb.r;
let converter = new showdown.Converter();

export const Create = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    componentDidMount() {
        // $(document).on('moved', '.uk-sortable', function (e) {
        //     let id = e.originalEvent.detail[1].id
        //     let order = []
        //     for (let i = 0; i < e.target.childNodes.length; i++) {
        //         order.push(e.target.childNodes[i].id)
        //     }
        //     console.log("order", order)

        //     this.changeOrder(id);
        // });

        // $(document).on('click', '.uk-card', function (e) {
        //     $(this).attr('id')
        //     console.log("index", $(this).attr('id'))
        // });

        // $(document).on('moved', '.uk-sortable', (e) => this.changeOrder(e));

        $( () => {
            $( "#sortable" ).sortable({
                update: e => {
                    this.changeOrder(e)
                }
            });
            $( "#sortable" ).disableSelection();
          } );
    },

    getInitialState() {
        return {
            questions: [],
            type: "",
            question: "",
            answer: "",
            content: "",
        };
    },

    observe(props, state) {
        return {

        };
    },

    async changeOrder(e) {
        console.log("original", e)
        let id = e.originalEvent.detail
        console.log("id", id)
        let order = []
        for (let i = 0; i < e.target.childNodes.length; i++) {
            order.push(e.target.childNodes[i].id)
        }
        console.log("order", order)

        let newQuestions = [] //this.state.questions;
        this.state.questions.map((question) => {
            newQuestions.push(question)
        })
        let question = newQuestions.splice(id, 1)[0]
        let index = order.findIndex((item) => item == id);
        newQuestions.splice(index, 0, question)
        await this.setState({ questions: newQuestions })
        console.log("new1", newQuestions)
        console.log("new", this.state.questions)
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
        questions.map((question) => {
            newQuestions.push(question)
        })

        await this.setState({ questions: newQuestions, content: "" })
    },

    async handleDeleteQuestion(question) {
        let newQuestions = this.state.questions;
        newQuestions.splice(newQuestions.findIndex((item) => item == question), 1)
        await this.setState({ questions: newQuestions })
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

        // let content = "Title: " + question.title + "\n" +
        //               question.question + "\n" +
        //               "*" + question.answer
        // this.setState({ content })
    },

    async uploadFile(_id, password) {
        const response = await fetch(
            'http://localhost:3001/fileUpload',
            {
                method: 'POST',
                body: FormData,
                headers: null,
                files: document.getElementById('file-to-upload').files[0]
            }
        )
        const json = await response.json()
        return json
    },

    handleFileUpload() {

    },

    render() {
        let displayQuestions = []
        this.state.questions.map( (question) => {
            displayQuestions.push(question)
        })
        return (
            <div>
                <div className="document-create-header">
                    <BS.FormControl type="text" id="hello" value={this.state.type} placeholder="Enter Type" onChange={(e) => this.setState({ type: e.target.value })} />
                    <BS.FormControl type="text" value={this.state.name} placeholder="Enter Name" onChange={(e) => this.setState({ name: e.target.value })} />
                    <BS.FormControl type="datetime-local" value={this.state.startDate} placeholder="Enter Start Date" onChange={(e) => this.setState({ startDate: e.target.value })} />
                    <BS.FormControl type="datetime-local" value={this.state.dueDate} placeholder="Enter Due Date" onChange={(e) => this.setState({ dueDate: e.target.value })} />
                    <BS.FormControl type="datetime-local" value={this.state.endDate} placeholder="Enter End Date" onChange={(e) => this.setState({ endDate: e.target.value })} />
                </div>

                <div className="document-questions-view" id="sortable">
                    {
                        displayQuestions.map((question, index) =>
                            <div key={index} id={index} className="document-question" class="uk-card uk-card-default uk-card-body">
                                <div className="document-question-header">
                                    <p className="document-question-name">Q{index + 1}. {question.question}</p>
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
                    {/* <div className="document-question" class="uk-card uk-card-default uk-card-body">
                        <div className="document-question-header">
                            <p className="document-question-name">Q1. What is HTML?</p>
                            <div className="document-question-options">
                                <button uk-icon="pencil" className="document-question-button"></button>
                                <button uk-icon="close" className="document-question-button"></button>
                            </div>
                        </div>
                        <ol type="a" className="document-question-choices">
                            <li>Hyper Text Markup Language</li>
                            <li>Hyper Text Markup Language</li>
                            <li>Hyper Text Markup Language</li>
                            <li>Hyper Text Markup Language</li>
                        </ol>
                        <p className="document-question-answer">A. Hyper Text Markup Language</p>
                    </div>
                    <div className="document-question" class="uk-card uk-card-default uk-card-body">
                        <div className="document-question-header">
                            <p className="document-question-name">Q2. What is HTML?</p>
                            <div className="document-question-options">
                                <button uk-icon="pencil" className="document-question-button"></button>
                                <button uk-icon="close" className="document-question-button"></button>
                            </div>
                        </div>
                        <ol type="a" className="document-question-choices">
                            <li>Hyper Text Markup Language</li>
                            <li>Hyper Text Markup Language</li>
                            <li>Hyper Text Markup Language</li>
                            <li>Hyper Text Markup Language</li>
                        </ol>
                        <p className="document-question-answer">A. Hyper Text Markup Language</p>
                    </div>
                    <div className="document-question" class="uk-card uk-card-default uk-card-body">
                        <div className="document-question-header">
                            <p className="document-question-name">Q3. What is HTML?</p>
                            <div className="document-question-options">
                                <button uk-icon="pencil" className="document-question-button"></button>
                                <button uk-icon="close" className="document-question-button"></button>
                            </div>
                        </div>
                        <ol type="a" className="document-question-choices">
                            <li>Hyper Text Markup Language</li>
                            <li>Hyper Text Markup Language</li>
                            <li>Hyper Text Markup Language</li>
                            <li>Hyper Text Markup Language</li>
                        </ol>
                        <p className="document-question-answer">A. Hyper Text Markup Language</p>
                    </div> */}
                </div>

                <div className="document-questions-create">
                    <BS.FormControl componentClass="textarea" placeholder="Enter Questions" value={this.state.content} onChange={(e) => this.setState({ content: e.target.value })} />
                    <BS.Button bsStyle="primary">Done</BS.Button>
                    <BS.Button bsStyle="primary">Upload</BS.Button>
                    <BS.Button bsStyle="primary" onClick={() => this.handleAddQuestion()}>Add Question</BS.Button>
                    <BS.Button bsStyle="primary" onClick={() => this.handleEditQuestion()}>Edit Question</BS.Button>
                </div>

                <div>
                    {
                        this.state.questions.map( (question, index) => 
                            <p key={index}>{question.question}</p>
                        )
                    }
                </div>
            </div>
        )
    },
});
