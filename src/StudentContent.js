import React, { Component } from 'react'
import userpic from './Images/cat.jpg'
import userpic1 from './Images/flower.jpg'
import logo from './Images/logo.png'
import ReactRethinkdb from 'react-rethinkdb'
import * as BS from 'react-bootstrap'
import { Header, Input, Radio, Select, TextArea, Accordion, Icon, Segment, Form, Button, Image, List, Transition, Dropdown, Menu, TransitionablePortal } from 'semantic-ui-react'
import { Table, Checkbox, FormControl, InputGroup, Col, ControlLabel, FormGroup } from 'react-bootstrap'
import createReactClass from 'create-react-class'
import _ from 'lodash'
import { Rating } from 'semantic-ui-react'
import NavStudent from './NavStudent'
import Chat from './Chat'
import StudentExam from './StudentExam'
import './App.css';

let r = ReactRethinkdb.r

const Instructor = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    observe(props, state) {
        return {
            user: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(sessionStorage.getItem("user_id")),
                changes: true,
                initial: null,
            }),
            submissions: new ReactRethinkdb.QueryRequest({
                query: r.table('submissions'),
                changes: true,
                initial: null,
            }),
        };
    },

    getInitialState() {
        return {
            rightButton: 'chat-button',
            leftButton: 'nav-button',
            screen: window.innerWidth,
            activeIndex: 0,
            open: false,
            changeClass: window.innerWidth >= 500 ? "container-instructor-full" : "container-instructor-both",
            expandRight: false,
            iconRight: false ? "icon: chevron-right; ratio: 2.5" : "icon: chevron-left; ratio: 2.5",
            expandLeft: false,
            iconLeft: false ? "icon: chevron-left; ratio: 2.5" : "icon: chevron-right; ratio: 2.5",
            cal: 0,
            contentid: null,
            listofdocs: [],
            documentid: null,
            coursename: null,
            submissionid: null
        }
    },



    handleRemove() {
        this.setState({ items: this.state.items.slice(0, -1) })
    },

    handleClick(e, titleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    },

    toggleVisibility() {
        this.setState({ visible: !this.state.visible })
    },

    handleChange(e, { value }) {
        this.setState({ value })
    },

    handleSize() {
        window.innerWidth <= 800 ?
            this.setState(
                {
                    screen: window.innerWidth,
                    changeClass: "container-instructor-full",
                    expandRight: false,
                    expandLeft: false,
                    rightButton: 'chat-button',
                    leftButton: 'nav-button',
                    cal: window.innerWidth + 305
                }
            )
            : null
    },

    handleExpandRight() {
        let right = !this.state.expandRight
        this.setState(
            {
                changeClass:
                    this.state.expandLeft && right ?
                        "container-instructor-both" :
                        !this.state.expandLeft && !right ?
                            "container-instructor-full" :
                            !this.state.expandLeft && right ?
                                "container-instructor-right" :
                                this.state.expandLeft && !right ?
                                    "container-instructor-left" :
                                    "container-instructor-both2",
                rightButton:
                    this.state.expandLeft && right ?
                        "chat-button-open" :
                        !this.state.expandLeft && !right ?
                            "chat-button" :
                            !this.state.expandLeft && right ?
                                "chat-button-open" :
                                this.state.expandLeft && !right ?
                                    "chat-button" :
                                    "chat-button",

                leftButton:
                    this.state.expandLeft && right ?
                        "nav-button-open" :
                        !this.state.expandLeft && !right ?
                            "nav-button" :
                            this.state.expandLeft && !right ?
                                "nav-button-open" :
                                !this.state.expandLeft && right ?
                                    "nav-button" :
                                    "nav-button",
                expandRight: right,
                iconRight: !this.state.expandRight ? "icon: chevron-right; ratio: 2.5" : "icon: chevron-left; ratio: 2.5"
            }
        )
    },

    handleExpandLeft() {
        let left = !this.state.expandLeft
        this.setState(
            {
                changeClass:
                    left && this.state.expandRight ?
                        "container-instructor-both" :
                        !left && !this.state.expandRight ?
                            "container-instructor-full" :
                            left && !this.state.expandRight ?
                                "container-instructor-left" :
                                !left && this.state.expandRight ?
                                    "container-instructor-right" :
                                    "container-instructor-both2",
                rightButton:
                    left && this.state.expandRight ?
                        "chat-button-open" :
                        !left && !this.state.expandRight ?
                            "chat-button" :
                            left && !this.state.expandRight ?
                                "chat-button" :
                                !left && this.state.expandRight ?
                                    "chat-button-open" :
                                    "chat-button",
                leftButton:
                    left && this.state.expandRight ?
                        "nav-button-open" :
                        !left && !this.state.expandRight ?
                            "nav-button" :
                            left && !this.state.expandRight ?
                                "nav-button-open" :
                                !left && this.state.expandRight ?
                                    "nav-button" :
                                    "nav-button",
                expandLeft: left,
                iconLeft: !this.state.expandLeft ? "icon: chevron-left; ratio: 2.5" : "icon: chevron-right; ratio: 2.5"
            }
        )
    },

    handleClose() {
        this.setState({ open: false })
    },
    async handleSaveContentId(id) {
        await this.setState({ contentid: null })
        await this.setState({ contentid: id, listofdocs: [] })
    },
    async handleSaveDocumentId(id, coursename) {
        await this.setState({ documentid: null })
        await this.setState({ documentid: id, coursename })
    },

    async handleSaveSubmissionId(id) {
        await this.setState({ submissionid: null })
        await this.setState({ submissionid: id })
    },


    async handleNextWork() {
        if (this.state.listofdocs.length > 0) {
            let index = this.state.listofdocs.findIndex(docid => docid === this.state.contentid)
            index -= 1
            if (index < 0) {
                index = this.state.listofdocs.length - 1
            }
            await this.setState({ contentid: null })
            await this.setState({ contentid: this.state.listofdocs[index] })

            let allrows = document.querySelectorAll(".selectedrow")
            if (allrows) {
                for (let i = 0; i < allrows.length; i++)
                    allrows[i].classList.remove("selectedrow")
            }
            document.getElementById(this.state.listofdocs[index]).classList.add("selectedrow")
        }
    },

    async handlePreviousWork() {
        if (this.state.listofdocs.length > 0) {

            let index = this.state.listofdocs.findIndex(docid => docid === this.state.contentid)
            index += 1
            if (index > this.state.listofdocs.length - 1) {
                index = 0
            }
            await this.setState({ contentid: null })
            await this.setState({ contentid: this.state.listofdocs[index] })

            let allrows = document.querySelectorAll(".selectedrow")
            if (allrows) {
                for (let i = 0; i < allrows.length; i++)
                    allrows[i].classList.remove("selectedrow")
            }
            document.getElementById(this.state.listofdocs[index]).classList.add("selectedrow")
        }
    },

    handleAddDocument(docid) {
        if (!this.state.listofdocs.find(id => docid === id)) {
            this.setState({ listofdocs: [...this.state.listofdocs, docid] })
        }
    },

    handleNewSubmission() {

        let query = r.table("submissions").insert({ studentid: this.data.user.value().collegeId, answers: [] })
        let submissionid = null
        ReactRethinkdb.DefaultSession.runQuery(query, { return_changes: true }).then(res => {
            let insertedSubmissionId = res.generated_keys[0]
            this.setState({
                submissionid: res.generated_keys[0]
            })
            let query2 = r.table('contents').get(this.state.contentid).update({
                submissions: r.row('submissions').append(insertedSubmissionId)
            })
            ReactRethinkdb.DefaultSession.runQuery(query2);

            //get document questionids
            let allquestions = r.table('documents').get(this.state.documentid)('questions')
            ReactRethinkdb.DefaultSession.runQuery(allquestions).then(
                res => {
                    res.map(question => {
                        let addanswerquery = r.table("answers").insert({ questionid: question, answer: "", feedback: "", grade: "" })
                        ReactRethinkdb.DefaultSession.runQuery(addanswerquery, { return_changes: true }).then(result => {
                            let insertedAnswerId = result.generated_keys[0]
                            let studentanswer = r.table('submissions').get(insertedSubmissionId).update({
                                answers: r.row('answers').append(insertedAnswerId)
                            })
                            ReactRethinkdb.DefaultSession.runQuery(studentanswer);
                        })

                    }
                    )
                }

            )
        })

    },
    render() {

        const { items, value, activeIndex, visible, open } = this.state
        return (
            <div className="container">
                <div class="main USD ">
                    <div class="uk-section-default USD">
                        <ul uk-accordion="multiple: true " className='simplemargin5'>
                            <li class="uk-open ">
                                <div class="navcss">
                                    <a href="#" uk-icon="chevron-left"></a>
                                    <a href="#" uk-icon="chevron-right"></a>
                                </div>
                                <a class="uk-accordion-title checkbx " href="#" ><strong>Course Works </strong>  </a>

                                <div class="uk-accordion-content" >
                                    <div>
                                        <table className="scroll " >
                                            <thead>
                                                <tr>
                                                    <th>Course</th>
                                                    <th>Type</th>
                                                    <th>Work</th>
                                                    <th>Start</th>
                                                    <th>Due</th>
                                                    <th>End</th>
                                                    <th>Submitted</th>
                                                    <th>New</th>
                                                </tr>
                                            </thead>
                                            <tbody class='tbodystyle'>
                                                {
                                                    this.props.selectedcourses
                                                    &&
                                                    this.props.selectedcourses.map(
                                                        (course) =>
                                                            <Course
                                                                id={course}
                                                                handleAddDocument={this.handleAddDocument}
                                                                handleSaveContentId={(id) => this.handleSaveContentId(id)}
                                                                handleSaveDocumentId={(id, coursename) => this.handleSaveDocumentId(id, coursename)}
                                                            />
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </li>
                            <li class="uk-open">
                                <div class="navcss">
                                    <a href="#" onClick={() => this.handlePreviousWork()} uk-icon="chevron-left" ></a>
                                    <a href="#" onClick={() => this.handleNextWork()} uk-icon="chevron-right"></a>
                                </div>
                                <a class="uk-accordion-title checkbx simplemargin4" href="#" ><strong>Work Submitted  </strong>  </a>

                                <div class="uk-accordion-content">

                                    <table className="scroll" >
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Time</th>
                                                <th>Files</th>
                                                <th>Work Grade</th>
                                                <th>Course Grade</th>
                                                <th >GPA </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.contentid && this.data.user.value()
                                                &&
                                                <ContentShowSub
                                                    id={this.state.contentid}
                                                    sections={this.props.selectedsections}
                                                    studentid={this.data.user.value().collegeId}
                                                    handleSaveSubmissionId={(id) => this.handleSaveSubmissionId(id)}
                                                />
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        this.state.contentid
                                        &&
                                        <BS.Button onClick={() => this.handleNewSubmission()}> New Submission</BS.Button >
                                    }

                                </div>
                            </li>
                        </ul>
                        {
                            this.state.documentid && this.state.coursename && this.state.submissionid
                            &&
                            <StudentExam
                                id={this.state.documentid}
                                contentid={this.state.contentid}
                                coursename={this.state.coursename}
                                studentid={this.data.user.value().collegeId}
                                submissionid={this.state.submissionid}
                            />
                        }
                    </div >
                </div >




            </div>


        );
    }
})

const Course = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],
    observe(props, state) {
        return {
            course: new ReactRethinkdb.QueryRequest({
                query: r.table('courses').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    getInitialState() {
        return {
            filteredContent: [],
            list: false
        };
    },

    handleSelectedCourse() {
        let checked = document.getElementById(this.data.course.value().id).checked
        this.setState({ list: checked })
    },



    render() {
        console.log("SEEE ", this.props.selectedcourses)
        return (
            this.data.course.value()
            &&
            this.data.course.value().contents.map(
                (content) =>
                    <Content
                        id={content}
                        coursename={this.data.course.value().name}
                        handleAddDocument={this.props.handleAddDocument}
                        handleSaveContentId={(id) => this.props.handleSaveContentId(id)}
                        handleSaveDocumentId={(id, coursename) => this.props.handleSaveDocumentId(id, coursename)}
                    />
            )
        )
    },
});

const Content = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    observe(props, state) {
        console.log("SDF", this.props.id)

        return {
            content: new ReactRethinkdb.QueryRequest({
                query: r.table('contents').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    getInitialState() {
        return {
            filteredsubmissions: [],
            list: false
        };
    },

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.props.handleAddDocument(prevProps.id)
    },

    handleSelectedDocument() {
        this.props.handleSaveContentId(this.data.content.value().id)
        this.props.handleSaveDocumentId(this.data.content.value().docid, this.props.coursename)
        let allrows = document.querySelectorAll(".selectedrow")
        for (let i = 0; i < allrows.length; i++)
            allrows[i].classList.remove("selectedrow")
        document.getElementById(this.data.content.value().id).classList.add("selectedrow")

    },

    render() {
        return (
            this.data.content.value()
            &&
            <tr id={this.data.content.value().id} onClick={() => this.handleSelectedDocument()}>
                <Document id={this.data.content.value().docid} coursename={this.props.coursename} />
            </tr>
        )
    },
});

const Document = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],
    observe(props, state) {
        return {
            document: new ReactRethinkdb.QueryRequest({
                query: r.table('documents').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    render() {
        return (
            this.data.document.value()
            &&
            this.data.document.value().status == "Publish"
            &&
            <span>
                <td>{this.props.coursename}</td>
                <td>{this.data.document.value().name}</td>
                <td>A</td>
                <td>A</td>
                <td>{this.data.document.value().dueDate}</td>
                <td>{this.data.document.value().endDate}</td>
                <td>A</td>
                <td>A</td>
            </span>

        )
    },
});
const ContentShowSub = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    observe(props, state) {
        console.log("SFFFDF BF", this.props.id)

        return {
            content: new ReactRethinkdb.QueryRequest({
                query: r.table('contents').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    render() {
        console.log("Contentsssss", this.data.content.value())
        return (
            this.data.content.value()
                &&
                this.data.content.value().submissions.length
                ?
                this.data.content.value().submissions.map(
                    (submission) =>
                        <Submission id={submission} studentid={this.props.studentid} handleSaveSubmissionId={(id) => this.props.handleSaveSubmissionId(id)} />
                )
                :
                <h3>No submissions</h3>

        )
    },
});





const Submission = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],
    observe(props, state) {
        return {
            submissions: new ReactRethinkdb.QueryRequest({
                query: r.table('submissions').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    handleSelectedSubmission() {
        this.props.handleSaveSubmissionId(this.data.submissions.value().id)
        let allrows = document.querySelectorAll(".selectedrow1")
        for (let i = 0; i < allrows.length; i++)
            allrows[i].classList.remove("selectedrow1")
        document.getElementById(this.data.submissions.value().id).classList.add("selectedrow1")
    },

    render() {
        console.log("SHOW", this.props.studentid)
        return (

            this.data.submissions.value()
            &&
            this.data.submissions.value().studentid == this.props.studentid
            &&
            <tr id={this.data.submissions.value().id} onClick={() => this.handleSelectedSubmission()}>
                <td>{this.data.submissions.value().studentid} </td>
                <td>B</td>
                <td>B</td>
                <td>B</td>
                <td>B</td>
                <td>B</td>
                <td>B</td>
            </tr>
        )
    },
});

export default Instructor
