import { Button, Image, List, Transition, Form } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import FroalaEditor from 'react-froala-wysiwyg';
import $ from 'jquery'
const r = ReactRethinkdb.r;

const Question = createReactClass({
    config: {
        placeholderText: 'Edit your question',
        charCounterCount: false,
        toolbarVisibleWithoutSelection: true,
        toolbarInline: true,
        toolbarButtons: ['undo', 'redo', '|', 'insertImage', 'insertFile', 'insertTable', 'insertLink', 'fullscreen', 'html'],
        imageDefaultDisplay: 'inline',
        imageDefaultAlign: 'left',
        imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
        imageInsertButtons: ['imageUpload', 'imageByURL'],
        imageUploadURL: 'http://localhost:3001/fileUpload',
        imageManagerLoadURL: "http://localhost:3001/uploadimages",
        events: {
            'froalaEditor.image.uploaded': async (e, editor, response) => {
                console.log('upload!')

                response = JSON.parse(response)
                //console.dir(e)
                console.log(response)

                //   editor.image.insert('http://localhost:8082/api/story/uploadImage', true, null, editor.image.get(),(e)=>{console.log(e)} );
                //   // const data = await axios({
                //   //   method:'POST',
                //   //   url:'http://localhost:8082/api/story/uploadImage',
                //   //   data: {
                //   //     url: response.link
                //   //   }
                //   //   })
                //   //   console.log(data)
                //   }
            },
            'froalaEditor.image.error': (e, editor, error, response) => {
                console.log("err", error)
            },
            'froalaEditor.imageManager.error': (e, editor, error, response) => {
                console.log("err2", error)
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

    handleEditQuestion(model) {
        let query = r.table('questions').get(this.props.questionId).update({
            htmlCode: model
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    async handleGetMethod() {
        console.log("yupuu")
        const response = await fetch('http://localhost:3001/uploadimages')
        const json = await response.json()
        console.log("j",json)
    },

    render() {
        return (
            this.data.question.value() == true
                ?
                <div>Loading</div>
                :
                <div className="document-question-content">
    <button onClick={() => this.handleGetMethod()}>rr</button>
                    <div id={this.data.question.value().id} className="document-question" class="uk-card uk-card-default uk-card-body">
                        {
                            <FroalaEditor
                                tag='textarea'
                                config={this.config}
                                model={('html.set', this.data.question.value().htmlCode)}
                                onModelChange={this.handleEditQuestion}
                            />
                            
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