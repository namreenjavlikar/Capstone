import { Button, Image, List, Transition, Form } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import FroalaEditor from 'react-froala-wysiwyg';
import cheerio from 'cheerio';
import $ from 'jquery'
const r = ReactRethinkdb.r;

const CheerioTest = createReactClass({
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
        events: {
            'froalaEditor.image.uploaded': async (e, editor, response) => {
                console.log('upload!')

                response = JSON.parse(response)
                console.log(response)

                editor.image.insert(response.link, true, null, editor.image.get(), (e) => { console.log(e) });
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
            htmlcode: ""
        };
    },

    componentDidMount() {

    },

    observe(props, state) {
        return {
            // question: new ReactRethinkdb.QueryRequest({
            //     query: r.table('questions').get(this.props.questionId),
            //     changes: true,
            //     initial: true,
            // })
        };

    },

    handleEdit(model) {
        const $ = cheerio.load(model);
        $('p').addClass('title')
        //$.html()
        console.log("m", $.html())
    },

    render() {
        return (
            <div className="document-question-content">
                <div className="document-question" class="uk-card uk-card-default uk-card-body">
                    {
                        <FroalaEditor
                            tag='textarea'
                            config={this.config}
                            onModelChange={this.handleEdit}
                        />

                    }
                </div>
            </div>
        )
    },
});

export default CheerioTest;