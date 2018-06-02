import { Button, Image, List, Transition, Form, Segment } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import Question from './Question'
import $ from 'jquery'
// import ReactSummernote from 'react-summernote';
// import 'react-summernote/dist/react-summernote.css';
// // import 'bootstrap/dist/js/bootstrap.min';
// import 'bootstrap/js/modal';
// import 'bootstrap/js/dropdown';
// import 'bootstrap/js/tooltip';
// import 'bootstrap/dist/css/bootstrap.css';
require('jquery-ui');
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui/ui/disable-selection');
const r = ReactRethinkdb.r;

const EditDocument = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],
    editing: null,

    componentDidMount() {
    },

    getInitialState() {
        return {
            sort: false
        };
    },

    changeOrder(e) {
        const order = Array.from(e.target.childNodes).map((item) => { return item.id })
        console.log("order", order)
        let query = r.table('documents').get(this.props.match.params.id).update({
            questions: order
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
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

    handleSelectStatus(eventKey) {
        this.handleEditField(eventKey, 'status')
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
            console.log("2" + currentUser)
        }


    },


    async handleSortQuestion() {

    },

    onBlur(e) {
        console.log("gggggg")
    },

    render() {
        return (
            this.data.document.value() == true
                ?
                <div>Loading</div>
                :
                <div>
                    {/* <ReactSummernote
                        value="Default value"
                        options={{
                            height: 350,
                            dialogsInBody: true,
                            toolbar: [
                                ['style', ['style']],
                                ['font', ['bold', 'underline', 'clear']],
                                ['fontname', ['fontname']],
                                ['para', ['ul', 'ol', 'paragraph']],
                                ['table', ['table']],
                                ['insert', ['link', 'picture', 'video']],
                                ['view', ['fullscreen', 'codeview']]
                            ]
                        }}
                        onChange={this.onChange}
                    /> */}
                </div>
            // <div>
            //     <div className="document-create-header">
            //         <BS.DropdownButton style={{ margin: 15 }} id="type" title={this.data.document.value().type} onSelect={this.handleSelectType}>
            //             <BS.MenuItem key="Quiz" eventKey="Quiz" value="Quiz">Quiz</BS.MenuItem>
            //             <BS.MenuItem key="Exam" eventKey="Exam" value="Exam">Exam</BS.MenuItem>
            //             <BS.MenuItem key="Assignment" eventKey="Assignment" value="Assignment">Assignment</BS.MenuItem>
            //             <BS.MenuItem key="Lab" eventKey="Lab" value="Labs">Lab</BS.MenuItem>
            //         </BS.DropdownButton>
            //         <BS.FormControl type="text" value={this.data.document.value().name} placeholder="Enter Name" onChange={(e) => this.handleEditField(e.target.value, 'name')} />
            //         <BS.FormControl type="datetime-local" value={this.data.document.value().startDate} placeholder="Enter Start Date" onChange={(e) => this.setState({ startDate: e.target.value })} />
            //         <BS.FormControl type="datetime-local" value={this.data.document.value().dueDate} placeholder="Enter Due Date" onChange={(e) => this.setState({ dueDate: e.target.value })} />
            //         <BS.FormControl type="datetime-local" value={this.data.document.value().endDate} placeholder="Enter End Date" onChange={(e) => this.setState({ endDate: e.target.value })} />
            //         <BS.DropdownButton style={{ margin: 15 }} id="status" title={this.data.document.value().status} onSelect={this.handleSelectStatus}>
            //             <BS.MenuItem key="Draft" eventKey="Draft" value="Draft">Draft</BS.MenuItem>
            //             <BS.MenuItem key="Publish" eventKey="Publish" value="Publish">Publish</BS.MenuItem>
            //         </BS.DropdownButton>
            //         <BS.Button bsStyle="primary" onClick={() => this.handleNewQuestion()}>New Question</BS.Button>
            //         <BS.Button bsStyle="primary" onClick={() => this.handleSortQuestion()}>{this.state.sort ? "Finish Sort" : "Sort Questions"}</BS.Button>
            //     </div>

            //     <div className="document-questions-view" id="parent">
            //         {
            //             this.data.document.value().questions.map((question, index) =>
            //                 <Question questionId={question} key={index} document={this.props.match.params.id} handleChangeEdit={this.handleChangeEdit} />
            //             )
            //         }
            //     </div>

            //     <div className="document-questions-create">
            //         <BS.FormControl componentClass="textarea" placeholder="Add new questions" value={this.state.content} onChange={(e) => this.setState({ content: e.target.value })} />
            //     </div>
            //     {this.state.editing}
            // </div>
        )
    },
});

export default EditDocument;