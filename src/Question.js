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

const Question = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],
    timeoutID: null,

    componentDidMount() {
        console.log("gggggggg", this.props.questionId)
    },

    getInitialState() {
        return {
            isManagingFocus: false,
        };
    },

    observe(props, state) {
        return {
            question: new ReactRethinkdb.QueryRequest({
                query: r.table('questions').get(this.props.questionId),
                changes: true,
                initial: true,
            })
        };

    },

    componentWillReceiveProps() {
        console.log("hello")
        this.onFocus()
        this.onBlur()
    },

    handleEditTitle(model) {
        let query = r.table('questions').get(this.props.questionId).update({
            title: model,
            //editor: sessionStorage.getItem('user_id')
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    handleEditQuestion(model) {
        let query = r.table('questions').get(this.props.questionId).update({
            question: model,
            //editor: sessionStorage.getItem('user_id')
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    handleEditAnswer(model) {
        let query = r.table('questions').get(this.props.questionId).update({
            answer: model,
            //editor: sessionStorage.getItem('user_id')
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    onBlur() {
        this.timeoutID = setTimeout(() => {
            if (this.state.isManagingFocus) {
                this.setState({
                    isManagingFocus: false,
                });
                let query = r.table('questions').get(this.props.questionId).update({
                    editor: ""
                })
                ReactRethinkdb.DefaultSession.runQuery(query)
            }
        }, 0);
    },

    onFocus() {
        clearTimeout(this.timeoutID);
        if (!this.state.isManagingFocus) {
            this.setState({
                isManagingFocus: true,
            });
        }
    },

    render() {
        return (
            this.data.question.value() == true
                ?
                <div>Loading</div>
                :
                <div onBlur={this.onBlur} onFocus={this.onFocus} className="document-question-content" id={this.data.question.value().id}>
                    <div id={this.data.question.value().id} className="document-question"
                        style={{ backgroundColor: this.data.question.value().editor ? '#D5F5E3' : 'white' }}
                        class="uk-card uk-card-default uk-card-body">
                        <div>
                            <FroalaEditor
                                id="title"
                                tag='textarea'
                                config={FroalaConfiguration.Title}
                                model={('html.set', this.data.question.value().title)}
                                //onModelChange={this.handleEditTitle}
                            />
                            <br />
                            <FroalaEditor
                                id="question"
                                tag='textarea'
                                config={FroalaConfiguration.Question}
                                model={('html.set', this.data.question.value().question)}
                                //onModelChange={this.handleEditQuestion}
                            />
                            <br />
                            <FroalaEditor
                                id="answer"
                                tag='textarea'
                                config={FroalaConfiguration.Answer}
                                model={('html.set', this.data.question.value().answer)}
                                //onModelChange={this.handleEditAnswer}
                            />

                            <Rail attached internal position='right' style={{ margin: 30, height: 40, width: 70 }}>
                                {
                                    this.data.question.value().editor
                                    &&
                                    <Utils.UserPopup userId={this.data.question.value().editor} />
                                }
                                <button onClick={() => this.props.handleDelete(this.props.questionId)} uk-icon="close" className="document-question-button"></button>
                            </Rail>
                        </div>
                    </div>
                    <div className="document-add" onClick={() => this.props.handleAdd(this.props.questionId)}></div>
                </div>
        )
    },
});

export default Question;