import { Button, Image, List, Transition, Form } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import $ from 'jquery'
const r = ReactRethinkdb.r;

const EditDocument = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    componentDidMount() {
        $(document).on('moved', '.uk-sortable', (e) => this.changeOrder(e));
    },

    getInitialState() {
        return {

        };
    },

    changeOrder(e) {
        const id = e.originalEvent.detail[1].id
        console.log("id", id)
        const order = Array.from(e.target.childNodes).map((item) => { return item.id })
        console.log("order", order)
        let currentQuestions = r.table('documents').get(this.props.match.params.id)('questions')
        // let query = r.table('documents').get(this.props.match.params.id).update({
        //     questions: newValue
        // })
        // ReactRethinkdb.DefaultSession.runQuery(query)
    },

    observe(props, state) {
        return {
            document: new ReactRethinkdb.QueryRequest({
                // query: r.table('documents').get(this.props.match.params.id),
                // changes: true,
                // initial: true,
                query: r.db('capstone').table('documents').get('bd1b22a3-0f54-44e0-acb3-44a37d2ac71a')('questions').map(question => {
                    console.log("GGGGGG")
                    return "1"
                })
               
            })
        };

    },

    handleSelectType(eventKey) {
        this.handleEditField(eventKey, 'type')
    },

    handleEditField(newValue, fieldName) {
        let query = r.table('documents').get(this.props.match.params.id).update({
            [fieldName]: newValue
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    render() {
        return (
            this.data.document.value() == true
                ?
                <div>Loading</div>
                :
                <div>
                    {/* <div className="document-create-header">
                        <BS.DropdownButton style={{ margin: 15 }} id="type" title={this.data.document.value().type} onSelect={this.handleSelectType}>
                            <BS.MenuItem key="Quiz" eventKey="Quiz" value="Quiz">Quiz</BS.MenuItem>
                            <BS.MenuItem key="Exam" eventKey="Exam" value="Exam">Exam</BS.MenuItem>
                            <BS.MenuItem key="Assignment" eventKey="Assignment" value="Assignment">Assignment</BS.MenuItem>
                            <BS.MenuItem key="Lab" eventKey="Lab" value="Labs">Lab</BS.MenuItem>
                        </BS.DropdownButton>
                        <BS.FormControl type="text" value={this.data.document.value().name} placeholder="Enter Name" onChange={(e) => this.handleEditField(e.target.value, 'name')} />
                        <BS.FormControl type="datetime-local" value={this.data.document.value().startDate} placeholder="Enter Start Date" onChange={(e) => this.setState({ startDate: e.target.value })} />
                        <BS.FormControl type="datetime-local" value={this.data.document.value().dueDate} placeholder="Enter Due Date" onChange={(e) => this.setState({ dueDate: e.target.value })} />
                        <BS.FormControl type="datetime-local" value={this.data.document.value().endDate} placeholder="Enter End Date" onChange={(e) => this.setState({ endDate: e.target.value })} />

                    </div>

                    <div className="document-questions-view"> */}
                        {/* <div className="document-question-numbers">
                        {
                            this.state.questions.map((question, index) =>
                                <p key={index + 1}>
                                    Q{index + 1}.
                                </p>
                            )
                        }
                    </div> */}
                        {/* <div className="document-question-content" uk-sortable="handle: .uk-card">
                            { */}
                                {/* this.data.document.value().questions.map((question, index) =>
                                    <div key={index} id={question} className="document-question" class="uk-card uk-card-default uk-card-body"> */}

                                        {/* <div className="document-question-header">
                                            <p className="document-question-name">{question.question}</p>
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
                                        <p className="document-question-answer">A. {question.answer}</p> */}
                                    {/* </div>

                                )
                            }
                        </div>
                    </div> */}
                </div>
        )
    },
});

export default EditDocument;