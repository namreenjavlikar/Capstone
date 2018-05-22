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
import NavInstructor2 from './NavInstructor2'
import Chat from './Chat'
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
            // items: users.slice(0, 3),
            changeClass: window.innerWidth >= 500 ? "container-instructor-full" : "container-instructor-both",
            expandRight: false,
            iconRight: false ? "icon: chevron-right; ratio: 2.5" : "icon: chevron-left; ratio: 2.5",
            expandLeft: false,
            iconLeft: false ? "icon: chevron-left; ratio: 2.5" : "icon: chevron-right; ratio: 2.5",
            cal: 0,
            contentid: null,
            listofdocs: []
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
        // console.log('resize',window.innerWidth)
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
        console.log('right:', right, this.state.expandLeft, this.state.expandRight)
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

        console.log('left:', left, this.state.expandLeft, this.state.expandRight)
        console.log('left:', left)
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
        await this.setState({ contentid: id })
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

    render() {
        // console.log("DDD", this.props.selectedcourses)
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
                                                            <Course id={course} handleAddDocument={this.handleAddDocument} handleSaveContentId={(id) => this.handleSaveContentId(id)} />
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
                                        <label class=" checkbx2" > <Checkbox inline>Show All Students</Checkbox></label>
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
                                                <ContentShowSub id={this.state.contentid} />
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </li>
                        </ul>
                        <div className='simplemargin5'>
                            <Transition visible={visible} animation='scale' duration={500}>

                                <div class='togglestyle' >
                                    <p>Here</p>
                                    <Form class="ui form" >
                                        <div class="ui dividing header ">
                                            <div><Form.Group inline >
                                                <label class='formlabelstyle simplemargin4'>Work Detail</label>
                                                <label class='formlabelstyle2'> CP1818</label>

                                                <Form.Input width={2} placeholder='Quiz one' readOnly />

                                                {/* start date */}  <Form.Input size='mini' placeholder='13/5/2018' readOnly />
                                                {/* due date */} <Form.Input size='mini' placeholder='19/5/2018' readOnly />
                                                {/* end date */}  <Form.Input size='mini' placeholder='20/5/2018' readOnly />
                                                <div class="navcss2">
                                                    <a href="#" uk-icon="chevron-left"></a>
                                                    <a href="#" uk-icon="chevron-right"></a>

                                                </div>
                                            </Form.Group>

                                            </div>
                                        </div>

                                        <div class="ui dividing header">

                                            <div className='simplemargin2' >
                                                <FormGroup>
                                                    <ControlLabel>Q01: Write a Java program that...</ControlLabel>
                                                </FormGroup>
                                            </div >

                                            <div className='simplemargin' >
                                                <Form.Group inline>

                                                    <ControlLabel >Grade:</ControlLabel>

                                                    <Form.Field control={Radio} label='0' value='0' checked={value === '0'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='1' value='1' checked={value === '1'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='2' value='2' checked={value === '2'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='3' value='3' checked={value === '3'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='4' value='4' checked={value === '4'} onChange={this.handleChange} />
                                                </Form.Group>
                                            </div>
                                            <div class="inline fields">
                                                <label>Feedback:</label>
                                                <textarea placeholder="Q01 Feedback" rows="1" style={{ width: '50vh', height: '3vh' }} />
                                            </div>
                                        </div>
                                        <div class="ui dividing header">
                                            <div className='simplemargin2' >
                                                <FormGroup>
                                                    <ControlLabel>Q02: What is the...</ControlLabel>

                                                </FormGroup>
                                            </div >
                                            <div className='simplemargin' >

                                                <div class="inline fields ">
                                                    <div class="field">
                                                        <label>Answer:</label>
                                                        <input type="text" placeholder="it depends on the value of loop counters in the calling" readOnly style={{ width: '50vh', marginLeft: '0.5vh' }} />
                                                    </div>
                                                </div></div>
                                            <div className='simplemargin' >
                                                <Form.Group inline>

                                                    <ControlLabel >Grade:</ControlLabel>

                                                    <Form.Field control={Radio} label='0' value='0' checked={value === '0'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='1' value='1' checked={value === '1'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='2' value='2' checked={value === '2'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='3' value='3' checked={value === '3'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='4' value='4' checked={value === '4'} onChange={this.handleChange} />
                                                </Form.Group>
                                            </div>
                                            <div class="inline fields">
                                                <label>Feedback:</label>
                                                <textarea placeholder="Q02 Feedback" rows="1" style={{ width: '50vh', height: '3vh' }} />
                                            </div>
                                        </div>
                                        <div class="ui dividing header">
                                            <div className='simplemargin2' >
                                                <FormGroup>
                                                    <ControlLabel>Q03: Write a Python program that...</ControlLabel>
                                                </FormGroup>
                                            </div >

                                            <div className='simplemargin' >
                                                <Form.Group inline>

                                                    <ControlLabel >Grade:</ControlLabel>

                                                    <Form.Field control={Radio} label='0' value='0' checked={value === '0'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='1' value='1' checked={value === '1'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='2' value='2' checked={value === '2'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='3' value='3' checked={value === '3'} onChange={this.handleChange} />
                                                    <Form.Field control={Radio} label='4' value='4' checked={value === '4'} onChange={this.handleChange} />
                                                </Form.Group>
                                            </div>
                                            <div class="inline fields">
                                                <label>Feedback:</label>
                                                <textarea placeholder="Q03 Feedback" rows="1" style={{ width: '50vh', height: '3vh' }} />
                                            </div>
                                        </div>
                                        <div class="ui dividing header">
                                            <div class="inline fields">
                                                <label>Feedback:</label>
                                                <textarea placeholder="Document Feedback" rows="1" style={{ width: '100vh', height: '3vh' }} />
                                            </div>
                                        </div>
                                    </Form>

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

    handleSelectedSection() {

    },

    render() {
        console.log("SEEE ", this.props.selectedcourses)
        return (
            this.data.course.value()
            &&
            this.data.course.value().contents.map(
                (content) =>
                    <Content id={content} coursename={this.data.course.value().name} handleAddDocument={this.props.handleAddDocument} handleSaveContentId={(id) => this.props.handleSaveContentId(id)} />
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

const ContentShowSub2 = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],
    observe(props, state) {
        return {}
    },

    componentWillMount() {
        console.log("WILL MOUNT", this.props.id)
    },

    getInitialState() {
        return {
            id: this.props.id
        };
    },

    render() {
        console.log("BETWEEN", this.state.id)
        return (
            <ContentShowSub2 id={this.state.id} />
        )
    },
})

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
        console.log("Contentsssss", this.props.id)
        return (
            this.data.content.value()
            &&
            this.data.content.value().submissions.map(
                (submission) =>
                    <Submission id={submission} />
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

const Section = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],
    observe(props, state) {
        return {
            section: new ReactRethinkdb.QueryRequest({
                query: r.table('sections').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    handleSelectedSection() {
        let sectionid = this.data.section.value().id
        console.log("Secy sec", sectionid)
        let sectionstudents = this.data.section.value().students
        let selectedsection = document.getElementById(sectionid).checked

        if (selectedsection) {
            let allsubmissions = []
            this.state.submissions.map((s) => allsubmissions.push(s))

            let addedsubmissions = this.state.filteredsubmissions
            sectionstudents.map(
                (x) => allsubmissions.filter(y => x.studentid == y.studentid).map((z) => addedsubmissions.push(z))
            )
            this.setState({
                filteredsubmissions: addedsubmissions
            })
        }
        else {
            let filtered = []
            this.state.filteredsubmissions.map((s) => filtered.push(s))
            sectionstudents.map(
                (x) => filtered.splice(filtered.findIndex(y => x.studentid == y.studentid), 1)
            )
            this.setState({
                filteredsubmissions: filtered
            })
        }
    },
    render() {
        return (
            this.data.section.value()
            &&
            <span>
                {
                    this.data.section.value().sectionNo
                }
            </span>
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
        let allrows = document.querySelectorAll(".selectedrow1")
        for (let i = 0; i < allrows.length; i++)
            allrows[i].classList.remove("selectedrow1")
        document.getElementById(this.data.submissions.value().id).classList.add("selectedrow1")
    },
    render() {
        return (
            this.data.submissions.value()
            &&
            <tr id={this.data.submissions.value().id} onClick={() => this.handleSelectedSubmission()}>
                <td>{this.data.submissions.value().studentid} </td>
                <td>B</td>
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
