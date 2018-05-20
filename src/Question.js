import { Button, Image, List, Transition, Form } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import FroalaEditor from 'react-froala-wysiwyg';
import $ from 'jquery'
import * as FroalaConfiguration from './FroalaConfiguration'
const r = ReactRethinkdb.r;

const Question = createReactClass({
    config: {
        placeholderText: 'Edit your question',
        charCounterCount: false,
        toolbarVisibleWithoutSelection: true,
        toolbarInline: true,
        toolbarButtons: ['undo', 'redo', '|', 'insertImage', 'insertFile', 'insertTable', 'insertLink', 'html'],
        //imageDefaultDisplay: 'inline',
        imageDefaultAlign: 'left',
        imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
        imageInsertButtons: ['imageUpload', 'imageByURL'],
        imageUploadURL: 'http://localhost:3001/fileUpload',
        fileUploadURL: 'http://localhost:3001/fileUploadLink',
        //linkAlwaysBlank: true,
        events: {
            'froalaEditor.image.uploaded': async (e, editor, response) => {
                response = JSON.parse(response)
                console.log(response)
                editor.image.insert(response.link, true, null, editor.image.get(), (e) => { console.log(e) });
            },
            'froalaEditor.image.error': (e, editor, error, response) => {
                console.log("err", error)
            },
            'froalaEditor.imageManager.error': (e, editor, error, response) => {
                console.log("err2", error)
            },
            'froalaEditor.file.uploaded': (e, editor, response) => {
                response = JSON.parse(response)
                console.log(response)

                //editor.link.insert(response.link, true, null, editor.image.get(), (e) => { console.log(e) });
            },
            'froalaEditor.file.error': (e, editor, error, response) => {
                console.log("file error", error)
            }
        }
    },

    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {

        };
    },

    componentDidMount() {

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
    },

    handleEditQuestion(model) {
        let query = r.table('questions').get(this.props.questionId).update({
            question: model
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    handleEditAnswer(model) {
        let query = r.table('questions').get(this.props.questionId).update({
            answer: model
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    render() {
        return (
            this.data.question.value() == true
                ?
                <div>Loading</div>
                :
                <div className="document-question-content" id={this.data.question.value().id}>
                    <div id={this.data.question.value().id} className="document-question" class="uk-card uk-card-default uk-card-body" onClick={()=>this.props.handleChangeEdit(this.props.questionId)}>
                        {
                            <div>
                                <FroalaEditor
                                    id="title"
                                    tag='textarea'
                                    config={FroalaConfiguration.Title}
                                    model={('html.set', this.data.question.value().title)}
                                    onModelChange={this.handleEditTitle}
                                />
                                <br/>
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
                            </div>

                            //     <div className="document-question-header">
                            //         <p className="document-question-name">{this.data.question.value().question}</p>
                            //     </div>
                            //     {
                            //         this.data.question.value().choices.length !== 0
                            //         &&
                            //         <ol type="a" className="document-question-choices">
                            //             {
                            //                 this.data.question.value().choices.map((choice, index) =>
                            //                     <li key={index}>{choice}</li>
                            //                 )
                            //             }
                            //         </ol>
                            //     }
                            //     <p className="document-question-answer">A. {this.data.question.value().answer}</p>
                        }
                    </div>
                </div>
        )
    },
});

export default Question;