import { Button, Image, List, Transition, Form, Segment } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import StudentAnswer from './StudentAnswer'
import FroalaEditor from 'react-froala-wysiwyg';
import $ from 'jquery'
import * as FroalaConfiguration from './FroalaConfiguration';
require('jquery-ui');
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui/ui/disable-selection');
const r = ReactRethinkdb.r;


const StudentExam = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],
    editing: null,

    getInitialState() {
        return {
            sort: false,
            submissionid: null
        };
    },
    observe(props, state) {
        return {
            submission: new ReactRethinkdb.QueryRequest({
                query: r.table('submissions').get(this.props.submissionid),
                changes: true,
                initial: true,
            })
        };

    },

    handleSelectType(eventKey) {
        this.handleEditField(eventKey, 'type')
    },

    handleSelectStatus(eventKey) {
        this.handleEditField(eventKey, 'status')
    },

    handleEditField(newValue, fieldName) {
        let query = r.table('documents').get(this.props.id).update({
            [fieldName]: newValue
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    onBlur(e) {
        console.log("gggggg")
    },

    render() {
        console.log("SUBMISSION ID ", this.props.submissionid)

        return (
            this.data.submission.value() == true
                ?
                <div>Loading</div>
                :
                <div>
                    <div className="document-create-header">
                        <div class='togglestyle' >
                            <div class="ui dividing header ">
                                <div><Form.Group inline >
                                    <div>
                                        <label class='formlabelstyle2'> {this.props.coursename}</label>
                                        &nbsp;&nbsp;
                                                <label class='formlabelstyle2'>  {this.data.submission.value().name}</label>
                                        <br />
                                        <i class="calendar alternate icon"></i>
                                        <label className="lbl-green">Start Date </label>
                                        <label class="lbl">{this.data.submission.value().startDate}</label>
                                        <i class="calendar alternate icon"></i>
                                        <label class="lbl-red">Due Date </label>
                                        <label class="lbl">{this.data.submission.value().dueDate}</label>

                                    </div>
                                </Form.Group>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="document-questions-view" id="parent">
                        {
                            this.data.submission.value().answers.map((answer, index) =>
                                <StudentAnswer
                                    results={this.data.submission.value().results}
                                    submitted={this.data.submission.value().submitted}
                                    answer={answer}
                                    key={index}
                                    document={this.props.id}
                                    content={this.props.contentid}
                                    student={this.props.studentid}
                                />
                            )
                        }
                    </div>
                    {
                        this.data.submission.value().feedback
                        &&
                        this.data.submission.value().results
                        &&
                        <div style={{ margin: 20 }}>
                            <strong>Submission Feedback</strong>
                            < FroalaEditor
                                id="feedback"
                                tag='textarea'
                                config={FroalaConfiguration.StudentQuestion}
                                model={('html.set', this.data.submission.value().feedback)}
                            />
                        </div>
                    }
                </div>
        )
    },
});

export default StudentExam;