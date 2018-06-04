import { Button, Image, List, Transition, Form, Segment, Rail } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import Question from './Question'
import $ from 'jquery'
import FroalaEditor from 'react-froala-wysiwyg';
import * as FroalaConfiguration from './FroalaConfiguration'
require('jquery-ui');
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui/ui/disable-selection');
const r = ReactRethinkdb.r;

const EditDocument = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],
    editing: null,

    componentDidMount() {
        // $(document).on('moved', '.uk-sortable', (e) => this.changeOrder(e));
    },

    getInitialState() {
        return {
            sort: false,
            searchTitle: "",
            searchResults: []
        };
    },

    changeOrder(e) {
        const order = Array.from(e.target.childNodes).map((item) => { return item.id })
        console.log("order", order)
        let query = r.table('documents').get(this.props.id).update({
            questions: order
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    observe(props, state) {
        return {
            document: new ReactRethinkdb.QueryRequest({
                query: r.table('documents').get(this.props.id),
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
        console.log("HERE", newValue)
        let query = r.table('documents').get(this.props.id).update({
            [fieldName]: newValue
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    handleSearchTitle(title) {
        this.setState({ searchTitle: title })
        // let query = r.table('questions').filter((question) => {
        //     return question('title').contains(title)
        // })
        let query = r.table('questions').filter({ title: '<p>' + title + '</p>' })
        ReactRethinkdb.DefaultSession.runQuery(query).then(res => {
            res.toArray((err, result) => {
                this.setState({ searchResults: result })
            })
        })

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
            let query = r.table('documents').get(this.props.id).update({
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
            console.log("2" + currentUser)
        }


        // let user = this.data.document.value().collaborators.find(collaborator => collaborator.user == "e0bf8fcd-7048-4fdd-8751-e71f7562cdd4")
        // console.log("gggg", user)
        // if (user && user.question != question) {
        //     let removeQuery = r.table('documents').get(this.props.id).update({
        //         collaborators: r.row('collaborators').difference([{ user: "e0bf8fcd-7048-4fdd-8751-e71f7562cdd4", question: user.question }])
        //     })
        //     ReactRethinkdb.DefaultSession.runQuery(removeQuery).then(res => {
        //         let documentQuery = r.table('documents').get(this.props.id).update({
        //             collaborators: r.row('collaborators').append({ user: "e0bf8fcd-7048-4fdd-8751-e71f7562cdd4", question: question })
        //         })
        //         ReactRethinkdb.DefaultSession.runQuery(documentQuery)
        //     })
        //     console.log("nope")
        // }
    },

    async handleSortQuestion() {
        //$('#parent').sortable({ disabled: true });
        await this.setState({ sort: !this.state.sort })
        console.log("sort state", this.state.sort)
        if (this.state.sort) {
            document.getElementById('parent').classList.add('ui-sortable')
            document.getElementById('parent').classList.add('sortable')
        }
        else {
            document.getElementById('parent').classList.remove('ui-sortable')
            document.getElementById('parent').classList.remove('sortable')
        }
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

    handleAddSearch(questionId) {
        let query = r.table('documents').get(this.props.id).update({
            questions: r.row('questions').append(questionId)
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    handleAddQuestionAtPosition(questionId) {
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
            let currentQuestion = this.data.document.value().questions.findIndex(question => question == questionId)
            let query = r.table('documents').get(this.props.id).update({
                questions: r.row('questions').insertAt(currentQuestion + 1, res.generated_keys[0])
            })
            ReactRethinkdb.DefaultSession.runQuery(query)
        })
    },

    handleDeleteQuestionAtPosition(questionId) {
        let questionIndex = this.data.document.value().questions.findIndex(question => question == questionId)
        let query = r.table('documents').get(this.props.id).update({
            questions: r.row('questions').deleteAt(questionIndex)
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },


    render() {
        // $(() => {
        //     $("#parent").sortable({
        //         update: e => {
        //             this.changeOrder(e)
        //         }
        //     });
        //     // $("#parent").disableSelection();
        // });
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
                        <BS.FormControl type="text" value={this.data.document.value().startDate} placeholder="Enter Start Date" onChange={(e) => this.handleEditField(e.target.value, 'startDate')} />
                        <BS.FormControl type="text" value={this.data.document.value().dueDate} placeholder="Enter Due Date" onChange={(e) => this.handleEditField(e.target.value, 'dueDate')} />
                        <BS.FormControl type="text" value={this.data.document.value().endDate} placeholder="Enter End Date" onChange={(e) => this.handleEditField(e.target.value, 'endDate')} />
                        <BS.DropdownButton style={{ margin: 15 }} id="status" title={this.data.document.value().status} onSelect={this.handleSelectStatus}>
                            <BS.MenuItem key="Draft" eventKey="Draft" value="Draft">Draft</BS.MenuItem>
                            <BS.MenuItem key="Publish" eventKey="Publish" value="Publish">Publish</BS.MenuItem>
                        </BS.DropdownButton>
                        {/* <BS.Button bsStyle="primary" onClick={() => this.handleNewQuestion()}>New Question</BS.Button> */}
                        <BS.Button bsStyle="primary" style={{ marginLeft: 13 }}onClick={() => this.handleSortQuestion()}>
                            {this.state.sort ? "Finish Sort" : "Sort Questions"}
                        </BS.Button>
                    </div>

                    <div className="document-questions-search-div">
                        <BS.FormControl type="text" value={this.state.searchTitle} placeholder="Search Title" onChange={(e) => this.handleSearchTitle(e.target.value)} />
                        <br />
                        <div>
                            {
                                this.state.searchResults.length != 0
                                &&
                                this.state.searchResults.map((result, index) =>
                                    <div key={index}>
                                        <div className="document-search-question" class="uk-card uk-card-default" style={{ padding: 25 }}>
                                            <FroalaEditor
                                                id="search-question"
                                                tag='textarea'
                                                config={FroalaConfiguration.SearchQuestion}
                                                model={('html.set', result.question)}
                                            />
                                            <Rail attached internal position='right' style={{ padding: 20, margin: 0, width: 10, height: 10 }}>
                                                <button uk-icon="plus-circle" onClick={() => this.handleAddSearch(result.id)}></button>
                                            </Rail>
                                        </div>

                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className="document-questions-view" id="parent">
                        {
                            this.data.document.value().questions.map((question, index) =>
                                <Question
                                    questionId={question}
                                    key={index}
                                    document={this.props.id}
                                    questionsList={this.data.document.value().questions}
                                    handleAdd={this.handleAddQuestionAtPosition}
                                    handleDelete={this.handleDeleteQuestionAtPosition}
                                />
                            )
                        }
                    </div>

                    {/* <div className="document-questions-create">
                        <BS.FormControl componentClass="textarea" placeholder="Add new questions" value={this.state.content} onChange={(e) => this.setState({ content: e.target.value })} />
                    </div> */}
                </div>
        )
    },
});

export default EditDocument;