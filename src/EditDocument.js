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
    editing: null,

    componentDidMount() {
        $(document).on('moved', '.uk-sortable', (e) => this.changeOrder(e));
    },

    getInitialState() {
        return {
            sort: false,
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
            htmlcode: "",
            editor: ""
        })
        ReactRethinkdb.DefaultSession.runQuery(query, { return_changes: true }).then(res => {
            console.log("gen", res.generated_keys[0])
            let query = r.table('documents').get(this.props.match.params.id).update({
                questions: r.row('questions').append(res.generated_keys[0])
            })
            ReactRethinkdb.DefaultSession.runQuery(query)
        })
    },

    async handleChangeEdit(question) {
        //console.log("something")
        let currentUser = sessionStorage.getItem('user_id')
        console.log("curr", currentUser)
        if (this.editing && this.editing != question) {
            let query = r.table('questions').get(this.editing).update({
                editor: ""
            })
            await ReactRethinkdb.DefaultSession.runQuery(query)
            console.log("1" + currentUser)
        }
        if (this.editing != question) {
            this.editing = question
            let query = r.table('questions').get(question).update({
                editor: currentUser
            })
            await ReactRethinkdb.DefaultSession.runQuery(query)
            console.log("editing", question)
            console.log("2"+ currentUser)
        }
       

        // let user = this.data.document.value().collaborators.find(collaborator => collaborator.user == "e0bf8fcd-7048-4fdd-8751-e71f7562cdd4")
        // console.log("gggg", user)
        // if (user && user.question != question) {
        //     let removeQuery = r.table('documents').get(this.props.match.params.id).update({
        //         collaborators: r.row('collaborators').difference([{ user: "e0bf8fcd-7048-4fdd-8751-e71f7562cdd4", question: user.question }])
        //     })
        //     ReactRethinkdb.DefaultSession.runQuery(removeQuery).then(res => {
        //         let documentQuery = r.table('documents').get(this.props.match.params.id).update({
        //             collaborators: r.row('collaborators').append({ user: "e0bf8fcd-7048-4fdd-8751-e71f7562cdd4", question: question })
        //         })
        //         ReactRethinkdb.DefaultSession.runQuery(documentQuery)
        //     })
        //     console.log("nope")
        // }
    },

    async handleSortQuestion() {
        // $('#parent').sortable({ disabled: true });
        // await this.setState({ sort: !this.state.sort })
        // if ($('#parent').sortable("option", "disabled"))
        //     $('#parent').sortable("enable");
        // else
        //     $('#parent').sortable('disable');
        // if (this.state.sort) {
        //     console.log("sorting")
        //     //$("#parent").sortable({
        //     //    update: e => {
        //     //        this.changeOrder(e)
        //     //    }
        //     //});
        //     //$("#parent").sortable( "option", "disabled", false );
        // }
        // else {
        //     console.log("sorting disabled")
        //     //$("parent").sortable("destroy");
        // }
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

                    <div className="document-questions-view"  uk-sortable="handle: .uk-card">
                        {
                            this.data.document.value().questions.map( (question, index) => 
                                <Question questionId={question} key={index} />
                            )
                        }
                    </div>
                </div>
        )
    },
});

export default EditDocument;