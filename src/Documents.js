import _ from 'lodash'
import { Button, Image, List, Transition, Form } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import showdown from 'showdown';
import ReactMarkdown from 'react-markdown'
let r = ReactRethinkdb.r;
let converter = new showdown.Converter();

export const Create = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            type: ""
        };
    },

    observe(props, state) {
        return {
            // exam: new ReactRethinkdb.QueryRequest({
            //     query: r.table('exams').get(this.props.match.params.id),
            //     changes: true,
            //     initial: true,
            // }),
        };
    },

    render() {
        return (
            <div>
                <div className="document-create-header">
                    <BS.FormControl type="text" value={this.state.type} placeholder="Enter Type" onChange={(e) => this.setState({ type: e.target.value })} />
                    <BS.FormControl type="text" value={this.state.name} placeholder="Enter Name" onChange={(e) => this.setState({ name: e.target.value })} />
                    <BS.FormControl type="datetime-local" value={this.state.startDate} placeholder="Enter Start Date" onChange={(e) => this.setState({ startDate: e.target.value })} />
                    <BS.FormControl type="datetime-local" value={this.state.dueDate} placeholder="Enter Due Date" onChange={(e) => this.setState({ dueDate: e.target.value })} />
                    <BS.FormControl type="datetime-local" value={this.state.endDate} placeholder="Enter End Date" onChange={(e) => this.setState({ endDate: e.target.value })} />
                </div>

                <div className="document-questions-view">
                    <div className="document-question">
                        <div className="document-question-header">
                            <p className="document-question-name">Q1. What is HTML?</p>
                            <div className="document-question-options">
                                <a href="" uk-icon="pencil"></a>
                                <a href="" uk-icon="close"></a>
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
                    <hr />
                    <div className="document-question">
                        <div className="document-question-header">
                            <p className="document-question-name">Q1. What is HTML?</p>
                            <div className="document-question-options">
                                <a href="" uk-icon="pencil"></a>
                                <a href="" uk-icon="close"></a>
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
                    <hr />
                    <div className="document-question">
                        <div className="document-question-header">
                            <p className="document-question-name">Q1. What is HTML?</p>
                            <div className="document-question-options">
                                <a href="" uk-icon="pencil"></a>
                                <a href="" uk-icon="close"></a>
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
                </div>

                <div className="document-questions-create">
                    <BS.FormControl componentClass="textarea" placeholder="Enter Questions" />
                    <BS.Button bsStyle="primary">Done</BS.Button>
                    <BS.Button bsStyle="primary">Upload</BS.Button>
                </div>
            </div>
        )
    },
});
