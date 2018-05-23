import React, { Component } from 'react'
import userpic from './Images/cat.jpg'
import userpic1 from './Images/flower.jpg'
import logo from './Images/logo.png'
import ReactRethinkdb from 'react-rethinkdb'
import * as BS from 'react-bootstrap'
import { Header, Input, Radio, Select, TextArea, Accordion, Icon, Segment, Form, Button, Image, List, Transition, Dropdown, Menu, TransitionablePortal } from 'semantic-ui-react'
import { Table, Checkbox, FormControl, InputGroup, Col, ControlLabel, FormGroup } from 'react-bootstrap';
import createReactClass from 'create-react-class';
import _ from 'lodash'
import { Rating } from 'semantic-ui-react'
import NavInstructor2 from './NavInstructor2'
import Chat from './Chat'
import InstructorContent from './InstructorContent'
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
        };
    },

    async componentDidMount() {
        await this.handleExpandLeft()
        await this.handleExpandLeft()
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
            expandLeft: true,
            iconLeft: false ? "icon: chevron-left; ratio: 2.5" : "icon: chevron-right; ratio: 2.5",
            cal: 0,
            selectedcourses: [],
            selectedsections: []
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

    handleSelectSection(sectionid) {
        console.log("HERE ID", sectionid)
        let item = document.getElementById(sectionid)
        if (item) {
            let checked = item.checked
            if (checked) {
                this.setState({ selectedsections: [...this.state.selectedsections, sectionid] })
            } else {
                let selectedsections = this.state.selectedsections
                selectedsections.splice(this.state.selectedsections.findIndex((selectedsection) => selectedsection === sectionid), 1)
                this.setState({ selectedsections })
            }
        }
    },

    async handleSelectCourse(courseid) {
        if (courseid === "All") {
            let checked = document.getElementById("nav_check_all").checked
            this.setState({ selectedcourses: [] })
            if (checked) {
                this.data.user.value()
                let selectedcourses = []
                this.data.user.value().courses.map(course => selectedcourses.push(course))
                await this.setState({ selectedcourses })
                await this.setState({ selectedcourses })
                let allsections = document.getElementsByClassName("Nav_check")
                for (let i = 0; i < allsections.length; i++) {
                    allsections[i].checked = true
                    await this.handleSelectSection(allsections[i].id)
                }
            } else {


                let allsections = document.getElementsByClassName("Nav_check")
                for (let i = 0; i < allsections.length; i++) {
                    allsections[i].checked = false
                    await this.handleSelectSection(allsections[i].id)
                }
            }
        } else {
            let courseIdIndex = this.state.selectedcourses.findIndex((selectedcourse) => selectedcourse == courseid)
            if (courseIdIndex == -1) {
                this.setState({ selectedcourses: [...this.state.selectedcourses, courseid] })
                //select all sections under course
                let allsections = document.getElementsByClassName(courseid)
                for (let i = 0; i < allsections.length; i++) {
                    allsections[i].checked = true
                    // console.log("HERE ID", allsections[i].id)
                    await this.handleSelectSection(allsections[i].id)
                }
            }
            else {
                let selectedcourses = this.state.selectedcourses

                selectedcourses.splice(courseIdIndex, 1)
                let allsections = document.getElementsByClassName(courseid)
                for (let i = 0; i < allsections.length; i++) {
                    allsections[i].checked = false
                    this.handleSelectSection(allsections[i].id)
                }
                await this.setState({ selectedcourses })
                await this.setState({ selectedcourses })
            }
        }
    },

    render() {
        // className={!this.state.expandLeft && "hide"}
        // window.onresize = () => this.handleSize() // to collpse on window resize
        const { items, value, activeIndex, visible, open } = this.state
        // const { activeIndex } = this.state
        return (
            <div className="container">
                <div className={!this.state.expandLeft && "hide"}>
                    {/* {
                    this.state.expandLeft
                    &&
                    <NavInstructor2  handleSelectedCourse={(id) => this.handleSelectCourse(id)} selectedcourses={this.state.selectedcourses} />

                } */}

                    <NavInstructor2 handleSelectedCourse={(id) => this.handleSelectCourse(id)} selectedcourses={this.state.selectedcourses} handleSelectSection={(id) => this.handleSelectSection(id)} />
                </div>
                <div className={this.state.changeClass}>
                    <span class={this.state.leftButton} uk-icon={this.state.iconLeft} onClick={() => this.handleExpandLeft()}>
                    </span>

                    <InstructorContent selectedcourses={this.state.selectedcourses} selectedsections={this.state.selectedsections} />

                    <span class={this.state.rightButton}
                        uk-icon={this.state.iconRight}
                        onClick={() => this.handleExpandRight()}>

                    </span>

                </div>
                {
                    // this.state.screen >= 500
                    this.state.expandRight//&&window.innerWidth>=775// collapsses when width is small
                        ?
                        <Chat />
                        :
                        <span></span>
                }




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
                    <Content id={content} coursename={this.data.course.value().name} />
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

    handleSelectedDocument() {
        // this.setState({ filteredsubmissions: this.data.content.value().submissions })
        this.setState({ list: !this.state.list })
    },

    render() {
        console.log(this.data.content.value())
        return (
            this.data.content.value()
            &&
            <tr className=" selectedrow " onClick={() => this.handleSelectedDocument()} >
                <td   >
                    {this.props.coursename}
                </td>
                <td >
                    <Document id={this.data.content.value().docid} />
                </td>
                {/* {
                    this.state.list
                    &&
                    this.data.content.value().submissions.map(
                        (submission) => <p style={{ paddingLeft: "20px" }}>
                            <Submission id={submission.submissionid} /></p>
                    )} */}
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
            <span>
                {
                    this.data.document.value().name
                }
            </span>
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

    render() {
        return (
            this.data.submissions.value()
            &&
            <span>
                {
                    this.data.submissions.value().studentid
                }
            </span>
        )
    },
});

export default Instructor
