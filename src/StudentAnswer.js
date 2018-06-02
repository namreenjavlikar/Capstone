import { Button, Image, List, Transition, Form, Rail, Segment, Popup } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import FroalaEditor from 'react-froala-wysiwyg';
import $ from 'jquery'
import * as FroalaConfiguration from './FroalaConfiguration'
import * as Utils from './Utils'
import profile from './profile.png';
const r = ReactRethinkdb.r;

const StudentQuestion = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],
    timeoutID: null,

    getInitialState() {
        return {
            isManagingFocus: false,
        };
    },

    observe(props, state) {
        return {
            answer: new ReactRethinkdb.QueryRequest({
                query: r.table('answers').get(this.props.answer),
                changes: true,
                initial: true,
            }),
        };
    },
    handleEditAnswer(model) {
        let query = r.table('answers').get(this.props.answer).update({
            answer: model,
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },
    render() {

        return (
            this.data.answer.value() == true
                ?
                <div>Loading</div>
                :
                <div onBlur={this.onBlur} onFocus={this.onFocus} className="document-question-content" id={this.data.answer.value().id}>
                    <div id={this.data.answer.value().id} className="document-question"
                        class="uk-card uk-card-default uk-card-body">
                        {
                            <div>
                                <ExamQuestion id={this.data.answer.value().questionid} />
                                <br />
                                <FroalaEditor
                                    id="answer"
                                    tag='textarea'
                                    config={this.props.submitted ? FroalaConfiguration.StudentQuestion : FroalaConfiguration.StudentAnswer}
                                    model={('html.set', this.data.answer.value().answer)}
                                    onModelChange={this.handleEditAnswer}
                                />
                                {
                                    this.data.answer.value().feedback
                                    &&
                                    this.props.results
                                    &&
                                    <div style={{marginTop: 8, marginBottom: 0}}>
                                        <strong>Feedback</strong>
                                        < FroalaEditor
                                            id="feedback"
                                            tag='textarea'
                                            config={FroalaConfiguration.StudentQuestion}
                                            model={('html.set', this.data.answer.value().feedback)}
                                        />
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
        )
    },
});
const ExamQuestion = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],
    observe(props, state) {
        return {
            question: new ReactRethinkdb.QueryRequest({
                query: r.table('questions').get(this.props.id),
                changes: true,
                initial: null,
            }),

        };

    },
    render() {
        return (
            this.data.question.value()
            &&
            <FroalaEditor
                id="question"
                tag='textarea'
                config={FroalaConfiguration.StudentQuestion}
                model={('html.set', this.data.question.value().question)}
            />
        )
    },
});

export default StudentQuestion;

