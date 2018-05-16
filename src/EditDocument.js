import { Button, Image, List, Transition, Form } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import $ from 'jquery'
import Question from './Question'
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
        console.log("id", e)
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
                query: r.table('documents').get(this.props.match.params.id),
                changes: true,
                initial: true,
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

    handleNewQuestion() {
        let query = r.table('questions').insert({
            answer: "",
            choices: [],
            question: "",
            title: "",
            htmlcode: ""
        })
        ReactRethinkdb.DefaultSession.runQuery(query, { return_changes: true }).then(res => {
            console.log("gen", res.generated_keys[0])
            let query = r.table('documents').get(this.props.match.params.id).update({
                questions: r.row('questions').append(res.generated_keys[0])
            })
            ReactRethinkdb.DefaultSession.runQuery(query)
        })
    },

    render() {
        return (
            this.data.document.value() == true
                ?
                <div>Loading</div>
                :
                <div>
                    <div className="document-create-header">
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

                    <div className="document-questions-view">
                        {
                            this.data.document.value().questions.map((question, index) =>
                                <Question questionId={question} key={index} />
                            )
                        }
                        <BS.Button bsStyle="primary" onClick={() => this.handleNewQuestion()}>New Question</BS.Button>
                    </div>

                    <div className="document-questions-create">
                        <BS.FormControl componentClass="textarea" placeholder="Add new questions" value={this.state.content} onChange={(e) => this.setState({ content: e.target.value })} />
                    </div>
                </div>
        )
    },
});

export default EditDocument;