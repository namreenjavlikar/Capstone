import React, { Component } from 'react'
import userpic from './Images/cat.jpg'
import userpic1 from './Images/flower.jpg'
import logo from './Images/logo.png'
import ReactRethinkdb from 'react-rethinkdb'
import FroalaEditor from 'react-froala-wysiwyg'
import $ from 'jquery'
import * as FroalaConfiguration from './FroalaConfiguration'
import * as Utils from './Utils'
import profile from './profile.png';
import * as BS from 'react-bootstrap'
import { Header, Input, Radio, Select, TextArea, Accordion, Icon, Segment, Form, Button, Image, List, Transition, Dropdown, Menu, TransitionablePortal } from 'semantic-ui-react'
import { Table, Checkbox, FormControl, InputGroup, Col, ControlLabel, FormGroup } from 'react-bootstrap'
import createReactClass from 'create-react-class'
import _ from 'lodash'
import { Rating } from 'semantic-ui-react'
import NavInstructor2 from './NavInstructor2'
import Chat from './Chat'
import './App.css'

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
            // items: users.slice(0, 3),
            changeClass: window.innerWidth >= 500 ? "container-instructor-full" : "container-instructor-both",
            expandRight: false,
            iconRight: false ? "icon: chevron-right; ratio: 2.5" : "icon: chevron-left; ratio: 2.5",
            expandLeft: false,
            iconLeft: false ? "icon: chevron-left; ratio: 2.5" : "icon: chevron-right; ratio: 2.5",
            cal: 0,
            contentid: null,
            listofdocs: [],
            courseName: "",
            submissionId: null,
            listofsubmissions: [],
            course: null,
            students: [],
            allStudents: false
        }
    },

    handleAdd() {
        // this.setState({ items: users.slice(0, this.state.items.length + 1) })
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
        // ////console.log('resize',window.innerWidth)
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
        ////console.log('right:', right, this.state.expandLeft, this.state.expandRight)
        this.setState(
            {
                changeClass:
                    // this.state.expandLeft &&this.state.expandRight?"container-instructor-both": !this.state.expandLeft &&!this.state.expandRight?"container-instructor-full":!this.state.expandLeft &&this.state.expandRight?"container-instructor-right":"container-instructor-left",
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
                // this.state.expandLeft?"container-instructor-both":!this.state.expandRight ? "container-instructor-right" : this.state.expandLeft?"container-instructor-left":"container-instructor-full",
                iconRight: !this.state.expandRight ? "icon: chevron-right; ratio: 2.5" : "icon: chevron-left; ratio: 2.5"
            }
        )
    },

    handleExpandLeft() {
        let left = !this.state.expandLeft

        ////console.log('left:', left, this.state.expandLeft, this.state.expandRight)
        ////console.log('left:', left)
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
                // this.state.expandLeft &&this.state.expandRight?"container-instructor-both": !this.state.expandLeft &&!this.state.expandRight?"container-instructor-full":this.state.expandLeft && !this.state.expandRight?"container-instructor-right":"container-instructor-left",
                // this.state.expandRight?"container-instructor-both": !this.state.expandLeft ? "container-instructor-left" : this.state.expandRight?"container-instructor-right":"container-instructor-full",
                iconLeft: !this.state.expandLeft ? "icon: chevron-left; ratio: 2.5" : "icon: chevron-right; ratio: 2.5"
            }
        )
    },
    // handleClick2 = () => this.setState({ open: !this.state.open })

    handleClose() {
        this.setState({ open: false })
    },
    // contentid : null,
    async handleSaveContentId(id) {
        await this.setState({ contentid: null })
        await this.setState({ contentid: id, listofdocs: [], submissionId: null, listofsubmissions: [] })
    },

    async handleNextWork() {
        if (this.state.listofdocs.length > 0) {
            let index = this.state.listofdocs.findIndex(docid => docid === this.state.contentid)
            index -= 1
            if (index < 0) {
                index = this.state.listofdocs.length - 1
            }
            await this.setState({ contentid: null })
            await this.setState({ contentid: this.state.listofdocs[index], submissionId: null })

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
            await this.setState({ contentid: this.state.listofdocs[index], submissionId: null })

            let allrows = document.querySelectorAll(".selectedrow")
            if (allrows) {
                for (let i = 0; i < allrows.length; i++)
                    allrows[i].classList.remove("selectedrow")
            }
            document.getElementById(this.state.listofdocs[index]).classList.add("selectedrow")
        }
    },

    async handleNextSubmission() {
        if (this.state.listofsubmissions.length > 0) {
            let index = this.state.listofsubmissions.findIndex(subid => subid === this.state.submissionId)
            index -= 1
            if (index < 0) {
                index = this.state.listofsubmissions.length - 1
            }
            await this.setState({ submissionId: null })
            await this.setState({ submissionId: this.state.listofsubmissions[index] })
        }
    },

    async handlePreviousSubmission() {
        if (this.state.listofsubmissions.length > 0) {

            let index = this.state.listofsubmissions.findIndex(subid => subid === this.state.submissionId)
            index += 1
            if (index > this.state.listofsubmissions.length - 1) {
                index = 0
            }
            await this.setState({ submissionId: null })
            await this.setState({ submissionId: this.state.listofsubmissions[index] })
        }
    },

    async handleAddDocument(docid) {
        if (!this.state.listofdocs.find(id => docid === id)) {
            await this.setState({ listofdocs: [...this.state.listofdocs, docid] })
        }
    },

    async handleAddSubmission(subid) {
        if (!this.state.listofsubmissions.find(id => subid === id)) {
            await this.setState({ listofsubmissions: [...this.state.listofsubmissions, subid] })
        }
    },

    async handleRemoveSubmission(subid) {
        let index = this.state.listofsubmissions.findIndex(id => subid === id)
        if (index !== -1) {
            let listofsubmissions = this.state.listofsubmissions
            listofsubmissions.splice(index, 1)
            await this.setState({ listofsubmissions })
        }
    },

    async handleSaveCName(courseName, course) {
        // console.log("Course", course)
        await this.setState({ courseName, course })
    },

    async handleSaveSubmissionId(submissionId) {
        if (submissionId != this.state.submissionId) {
            await this.setState({ submissionId: null })
            await this.setState({ submissionId, listofsubmissions: [] })
        }
    },

    render() {
        // console.log("COUR")
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
                                                        (course, i) =>
                                                            <Course key={i} id={course}
                                                                handleAddDocument={this.handleAddDocument}
                                                                handleSaveCName={this.handleSaveCName}
                                                                handleSaveContentId={this.handleSaveContentId} />
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

                                    <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                                        <label class=" checkbx2" > <Checkbox checked={this.state.allStudents} onClick={() => this.setState({ allStudents: !this.state.allStudents })} inline>Show All Students</Checkbox></label>
                                    </div>

                                    <table className="scroll" >
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Student Id</th>
                                                <th>Time</th>
                                                <th>Files</th>
                                                <th>Work Grade</th>
                                                <th>Course Grade</th>
                                                <th >GPA </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.contentid
                                                &&
                                                <ContentShowSub handleAddSubmission={this.handleAddSubmission}
                                                    selectedsubmissionid={this.state.submissionId}
                                                    id={this.state.contentid}
                                                    students={this.props.students}
                                                    sections={this.props.selectedsections}
                                                    course={this.state.course}
                                                    allStudents={this.state.allStudents}
                                                    handleSaveSubmissionId={this.handleSaveSubmissionId}
                                                    handleRemoveSubmission={this.handleRemoveSubmission} />
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </li>
                        </ul>
                        <div className='simplemargin5'>
                            <Transition visible={visible} animation='scale' duration={500}>
                                <div class='togglestyle' >
                                    {
                                        this.state.submissionId
                                        &&
                                        <StudentSubmission handleNextSubmission={this.handleNextSubmission}
                                            handlePreviousSubmission={this.handlePreviousSubmission}
                                            contentid={this.state.contentid} coursename={this.state.courseName}
                                            id={this.state.submissionId} />
                                    }
                                </div>
                            </Transition>
                        </div>
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
        ////console.log("SEEE ", this.props.selectedcourses)
        return (
            this.data.course.value()
            &&
            this.data.course.value().contents.map(
                (content, i) =>
                    <Content key={i} handleSaveCName={this.props.handleSaveCName}
                        id={content} courseid={this.props.id}
                        course={this.data.course.value()}
                        coursename={this.data.course.value().name}
                        handleAddDocument={this.props.handleAddDocument}
                        handleSaveContentId={this.props.handleSaveContentId}
                    />
            )
        )
    },
});

const Content = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    observe(props, state) {
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

    async componentDidUpdate(prevProps, prevState, snapshot) {
        await this.props.handleAddDocument(prevProps.id)
    },

    handleSelectedDocument() {
        this.props.handleSaveContentId(this.data.content.value().id)
        let allrows = document.querySelectorAll(".selectedrow")
        for (let i = 0; i < allrows.length; i++)
            allrows[i].classList.remove("selectedrow")
        document.getElementById(this.data.content.value().id).classList.add("selectedrow")
        this.props.handleSaveCName(this.props.coursename, this.props.course)
    },

    render() {
        return (
            this.data.content.value()
            &&
            <tr id={this.data.content.value().id} onClick={() => this.handleSelectedDocument()}>
                <td>{this.props.coursename}</td>
                <td><Document id={this.data.content.value().docid} /> </td>
                <td>A</td>
                <td>A</td>
                <td>A</td>
                <td>A</td>
                <td>A</td>
                <td>A</td>
            </tr>
        )
    },
});


const ContentShowSub = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    observe(props, state) {

        return {
            content: new ReactRethinkdb.QueryRequest({
                query: r.table('contents').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    render() {
        return (
            this.data.content.value()
            &&
            this.data.content.value().submissions.map(
                (submission, i) =>
                    <Submission key={i} handleAddSubmission={this.props.handleAddSubmission}
                        selectedsubmissionid={this.props.selectedsubmissionid} id={submission}
                        sections={this.props.sections} students={this.props.students}
                        handleSaveSubmissionId={this.props.handleSaveSubmissionId}
                        content={this.props.id} course={this.props.course}
                        allStudents={this.props.allStudents} handleRemoveSubmission={this.props.handleRemoveSubmission} />
            )
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
            this.data.document.value().name

        )
    },
});

const StudentSubmission = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],
    observe(props, state) {
        return {
            submissions: new ReactRethinkdb.QueryRequest({
                query: r.table('submissions').get(this.props.id),
                changes: true,
                initial: null,
            }),
            content: new ReactRethinkdb.QueryRequest({
                query: r.table('contents').get(this.props.contentid),
                changes: true,
                initial: null,
            }),
        };
    },

    getInitialState() {
        return {
            document: "",
            feedbacks: [],
            grades: [],
            finalFeed: "",
            show: true
        };
    },

    async handleUpdateSub() {
        if (this.data.content.value()) {
            let query = r.table('documents').get(this.data.content.value().docid)
            ReactRethinkdb.DefaultSession.runQuery(query).then(
                async res => {
                    await this.setState({ document: res.name })
                }
            )
        }
    },

    handleEditField(newValue, fieldName) {
        let query = r.table('submissions').get(this.props.id).update({
            [fieldName]: newValue
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    componentWillMount() {
        this.handleUpdateSub()
    },

    componentWillReceiveProps() {
        this.handleUpdateSub()
    },

    render() {
        return (
            this.data.submissions.value()
            &&
            <Form class="ui form" >
                <div class="ui dividing header ">
                    <div><Form.Group inline >
                        <label class='formlabelstyle simplemargin4'>Work Detail</label>
                        <label class='formlabelstyle2'> {this.props.coursename}</label>
                        <Form.Input width={2} value={this.state.document} readOnly />

                        {/* start date */}  <Form.Input size='mini' placeholder='13/5/2018' readOnly />
                        {/* due date */}    <Form.Input size='mini' placeholder='19/5/2018' readOnly />
                        {/* end date */}    <Form.Input size='mini' placeholder='20/5/2018' readOnly />
                        <div class="navcss2">
                            <a href="#" onClick={this.props.handleNextSubmission} uk-icon="chevron-left" ></a>
                            <a href="#" onClick={this.props.handlePreviousSubmission} uk-icon="chevron-right"></a>
                        </div>
                    </Form.Group>
                    </div>
                </div>
                {
                    this.data.submissions.value().answers.map(
                        (answer, i) =>
                            <Answer key={i} id={answer} />
                    )
                }

                <div class="ui dividing header">
                    <div class="inline fields">
                        <label>Feedback:</label>
                        <textarea value={this.data.submissions.value().feedback} onChange={(e) => this.handleEditField(e.target.value, "feedback")} placeholder="Document Feedback" rows="1" style={{ width: '100vh', height: '3vh' }} />
                    </div>
                </div>
            </Form>
        )
    },
});

const Answer = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    observe(props, state) {
        return {
            answer: new ReactRethinkdb.QueryRequest({
                query: r.table('answers').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    getInitialState() {
        return {
            correct: ''
        };
    },

    handleEditField(newValue, fieldName) {
        let query = r.table('answers').get(this.props.id).update({
            [fieldName]: newValue
        })
        ReactRethinkdb.DefaultSession.runQuery(query)
    },

    render() {
        return (
            this.data.answer.value()
            &&
            <div class="ui dividing header">

                <div className='simplemargin2' >
                    <FormGroup>
                        <ControlLabel><Question id={this.data.answer.value().questionid} /></ControlLabel>
                    </FormGroup>
                </div >
                <div className='simplemargin' >

                    <div class="inline fields ">
                        <div class="field">
                            <label>Student Answer:</label>
                            <FroalaEditor
                                id="answer"
                                tag='textarea'
                                config={FroalaConfiguration.StudentQuestion}
                                model={('html.set', this.data.answer.value().answer)}
                            />
                            <label>Correct Answer:</label>
                            <CorrectAnswer id={this.data.answer.value().questionid} />
                        </div>
                    </div></div>
                <div className='simplemargin' >
                    <Form.Group inline>
                        <div class="inline fields ">
                            <ControlLabel >Grade:</ControlLabel>
                            <input type="number" min={0} max={20} value={this.data.answer.value().grade} onChange={(e) => this.handleEditField(e.target.value, "grade")} style={{ width: '10vh', marginLeft: '0.5vh' }} />
                            <input type="text" value={"/20"} readOnly style={{ width: '8vh', marginLeft: '0.5vh' }} />
                        </div>
                    </Form.Group>
                </div>
                <div class="inline fields">
                    <label>Feedback:</label>
                    <textarea value={this.data.answer.value().feedback} onChange={(e) => this.handleEditField(e.target.value, "feedback")} placeholder="Feedback" rows="1" style={{ width: '50vh', height: '3vh' }} />
                </div>
            </div>
        )
    }
})

const Question = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],
    observe(props, state) {
        return {
            question: new ReactRethinkdb.QueryRequest({
                query: r.table('questions').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    render() {
        return (
            this.data.question.value()
            &&
            <FroalaEditor
                id="question"
                tag='textarea'
                config={FroalaConfiguration.StudentQuestion}
                model={('html.set', this.data.question.value().question)}
            />

        )
    },
});

const CorrectAnswer = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],
    observe(props, state) {
        return {
            question: new ReactRethinkdb.QueryRequest({
                query: r.table('questions').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    render() {
        return (
            this.data.question.value()
            &&
            <FroalaEditor
                id="question"
                tag='textarea'
                config={FroalaConfiguration.StudentQuestion}
                model={('html.set', this.data.question.value().answer)}
            />

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

    getInitialState() {
        return {
            students: []
        };
    },

    handleSelectedSubmission() {
        this.props.handleSaveSubmissionId(this.props.id)
    },

    checkCourse() {
        console.log("CheckCourse")
        let thisStudent = this.props.students.filter(st => st.student === this.data.submissions.value().studentid)
        let show = false
        thisStudent.map(id => {
            if (id.course === this.props.course.id) {
                show = true
                this.props.handleAddSubmission(this.props.id)
            }
        })
        if (show === false)
            this.props.handleRemoveSubmission(this.props.id)
        return show
    },

    checkAll() {
        console.log("CheckAll")
        if (this.props.allStudents === true)
            return true
        else {
            return this.checkCourse()
        }
    },

    render() {
        console.log("Submissions")
        return (
            this.data.submissions.value()
                &&
                // this.props.students.find(st => st.student === this.data.submissions.value().studentid)
                // ?
                this.checkAll()
                // this.props.students.find(st => st.course === this.props.course.id)
                ?
                <tr style={this.props.selectedsubmissionid === this.props.id ? { backgroundColor: 'yellow' } : null} id={this.data.submissions.value().id} onClick={() => this.handleSelectedSubmission()}>
                    <td>{this.data.submissions.value().studentid}</td>
                    <td>B</td>
                    <td>B</td>
                    <td>B</td>
                    <td>B</td>
                    <td>B</td>
                    <td>B</td>
                    <td>B</td>
                </tr>
                :
                <span></span>
            // :
            // <span></span>
        )
    },
});

export default Instructor