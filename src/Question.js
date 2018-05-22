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

    getInitialState() {
        return {

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

    handleEditTitle(model) {
        let query = r.table('questions').get(this.props.questionId).update({
            title: model
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
        this.props.handleChangeEdit(this.props.questionId)
    },

    handleEditQuestion(model) {
        let query = r.table('questions').get(this.props.questionId).update({
            question: model,
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
        this.props.handleChangeEdit(this.props.questionId)
        
        
        // let user = this.data.document.value().collaborators.filter(collaborator => collaborator == "e0bf8fcd-7048-4fdd-8751-e71f7562cdd4")
        // console.log("gggg", user)
        // if (user) {
        //     let removeQuery = r.table('documents').get(this.props.document).update({
        //         collaborators: r.row('collaborators').difference([{ name: "e0bf8fcd-7048-4fdd-8751-e71f7562cdd4", question: user.question }])
        //     })
        //     ReactRethinkdb.DefaultSession.runQuery(removeQuery)
        // }
        // let documentQuery = r.table('documents').get(this.props.document).update({
        //     collaborators: r.row('collaborators').append({ name: "e0bf8fcd-7048-4fdd-8751-e71f7562cdd4", question: this.props.questionId })
        // })
        // ReactRethinkdb.DefaultSession.runQuery(documentQuery)
    },

    handleEditAnswer(model) {
        let query = r.table('questions').get(this.props.questionId).update({
            answer: model
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
        this.props.handleChangeEdit(this.props.questionId)
        
    },

    render() {
        return (
            this.data.question.value() == true
                ?
                <div>Loading</div>
                :
                <div className="document-question-content" id={this.data.question.value().id}>
                    <div id={this.data.question.value().id} className="document-question"
                        style={{ backgroundColor: this.data.question.value().editor ? '#D5F5E3' : 'white' }}
                        class="uk-card uk-card-default uk-card-body">
                        {
                            <div>
                                <FroalaEditor
                                    id="title"
                                    tag='textarea'
                                    config={FroalaConfiguration.Title}
                                    model={('html.set', this.data.question.value().title)}
                                    onModelChange={this.handleEditTitle}
                                />
                                <br />
                                <FroalaEditor
                                    id="question"
                                    tag='textarea'
                                    config={FroalaConfiguration.Question}
                                    model={('html.set', this.data.question.value().question)}
                                    onModelChange={this.handleEditQuestion}
                                />
                                <br />
                                <FroalaEditor
                                    id="answer"
                                    tag='textarea'
                                    config={FroalaConfiguration.Answer}
                                    model={('html.set', this.data.question.value().answer)}
                                    onModelChange={this.handleEditAnswer}
                                />
                                {
                                    this.data.question.value().editor
                                    &&
                                    <Rail attached internal position='right' style={{ width: 50, margin: 20 }}>
                                        <Utils.UserPopup userId={this.data.question.value().editor} />
                                    </Rail>
                                }
                            </div>
                        }
                    </div>
                </div>
        )
    },
});

export default Question;