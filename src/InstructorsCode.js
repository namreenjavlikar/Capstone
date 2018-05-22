import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import jwt from 'express-jwt'
import '../node_modules/uikit/dist/css/uikit.css';
import './App.css';
import photo from './photo.png';
import userpic from './logo.png'

import logo from './logo.png'

let r = ReactRethinkdb.r;

const Instructors = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            documents: null,
            submissions: [],
            studentsubmission: [],
            selectedcourses: [],
            selectedsections: [],
            instructorscourses: []
        };
    },
    observe(props, state) {
        //
        return {
            courses: new ReactRethinkdb.QueryRequest({
                query: r.table('courses')
                    .innerJoin(r.table('users').get('5a67')('courses'),
                        (action, user) =>
                            action('id').eq(user('courseid'))).zip().distinct(),
                changes: false,
                initial: null,

            }),
            sections: new ReactRethinkdb.QueryRequest({
                query: r.table('sections'),
                changes: false,
                initial: null,
            }),

        };


    },
    async handleSelectedCourse(courseid) {

        //selecting multiple courses
        let courseIdIndex = this.state.selectedcourses.findIndex((selectedcourse) => selectedcourse == courseid)
        if (courseIdIndex == -1) {
            await this.setState({ selectedcourses: [...this.state.selectedcourses, courseid] })
            //select all sections under course
            let allsections = document.getElementsByClassName(courseid)
            for (let i = 0; i < allsections.length; i++) {
                allsections[i].checked = true
            }
        }
        else {
            let selectedcourses = this.state.selectedcourses
            selectedcourses.splice(courseIdIndex, 1)
            let allsections = document.getElementsByClassName(courseid)
            for (let i = 0; i < allsections.length; i++) {
                allsections[i].checked = false
            }
            await this.setState({ selectedcourses })

        }
        //get the documents for the course(s)
        this.setState({ documents: [] })
        this.state.selectedcourses.map(async (course, i) => {
            let query = r.table('documents').innerJoin(
                r.table('contents').innerJoin(r.table('courses').get(course)('contents'),
                    (action, content) =>
                        action('id').eq(content('contentid'))).zip().distinct(),
                (action, document) =>
                    action('id').eq(document('docid'))).zip().distinct()
            await ReactRethinkdb.DefaultSession.runQuery(query).then(
                (res) => {
                    res.map((r) => this.setState({ documents: [...this.state.documents, r] }))

                }
            )
        })

    },
    handleSelectedDocument(docid) {
        //get submissions for the document
        let submissions = []
        this.state.documents.filter((doc) => doc.docid == docid)[0].submissions.map(
            (submission) => submissions.push(submission)
        )
        let query = r.table("submissions").filter(
            (doc) => {
                return r.expr(submissions).contains(doc("id"));
            }
        )

        ReactRethinkdb.DefaultSession.runQuery(query).then(
            (res) => {
                res.toArray((err, results) => {
                    this.setState({ submissions: results })
                });
            }
        )

    },
    handleSelectedSubmission(submissionid) {
        let query = r.table('questions').innerJoin(r.table('submissions').get(submissionid)('answers'),
            (question, submission) =>
                question('id').eq(submission('questionid'))).zip().distinct()
        ReactRethinkdb.DefaultSession.runQuery(query).then(
            (res) => {
                this.setState({ studentsubmission: res })
            }
        )


    },
    handleSelectedSection(sectionid) {
        let selectedsection = document.getElementById(sectionid).checked
        let selectedsections = this.state.selectedsections
        if (selectedsections.findIndex(x => x == sectionid) == -1) {
            selectedsections.push({ sectionid })
        }
        else {
            selectedsections.splice(selectedsections.findIndex(x => x == sectionid) == -1, 1)
        }
        this.setState({
            selectedsections
        })
        // console.log("ALL SUBMISSION ", this.state.submissions)
        // let selectedsection = document.getElementById(sectionid).checked
        // console.log(selectedsection)
        // let query = r.table('sections').get(sectionid)('students')
        // ReactRethinkdb.DefaultSession.runQuery(query).then(
        //     (res) => {


        //         let sectionsubmissions = []

        //         let studentsinsection = res
        //         studentsinsection.map(
        //             s => sectionsubmissions.push(this.state.submissions.filter(x => x.studentid == s.studentid)[0])
        //         )

        //         //if checked, remove the section submissions
        //         if (selectedsection) {
        //             this.setState({
        //                 submissions: sectionsubmissions
        //             })
        //         }
        //         //if unchecked add the section submissions
        //         else {
        //             console.log("REMOVE NOW")
        //         }

        //     }
        // )
    },

    render() {
        this.data.courses.value()
            &&
            console.log("CC", this.data.courses.value().find(c => c.id == "003081d5-5bc6-479d-8e9e-b6c7f3043795").contents)
        return (
            <div style={{ padding: '20px' }}>
                <h2>Courses</h2>
                <hr />
                {
                    this.data.courses.value() != null
                    &&
                    this.data.courses.value().map(
                        (c) =>
                            <p style={{ paddingLeft: '20px' }}>
                                <input class="uk-checkbox" type="checkbox" onClick={() => this.handleSelectedCourse(c.id)} /> {c.name}
                                {c.sections.map((section) => <p style={{ paddingLeft: '40px' }}>
                                    <input id={section} class={c.id} type="checkbox" onClick={() => this.handleSelectedSection(section)} />
                                    {
                                        this.data.sections.value()
                                        &&
                                        this.data.sections.value().find(x => x.id == section).sectionNo
                                    }
                                </p>)}
                            </p>
                    )
                }
                <br />
                <button> Prev </button>
                <button> Next </button>
                <br />
                {
                    this.state.selectedcourses.map(
                        (course, i) =>
                            this.data.courses.value().filter(c => c == course).contents
                            &&
                            this.data.courses.value().filter(c => c == course).contents.map(
                                (content, j) =>
                                    <Content key={i} id={content} selectedcourses={this.state.selectedcourses} selectedsections={this.state.selectedsections} />
                            )
                    )
                }
                {/* <Contents selectedcourses={this.state.selectedcourses} selectedsections={this.state.selectedsections} /> */}
                {/* {
                    this.state.documents
                    &&
                    <table >
                        {
                            this.state.documents.map(
                                (doc, i) =>
                                    <tr key={i}>
                                        <td onClick={() => this.handleSelectedDocument(doc.docid)} >{doc.name}</td>
                                    </tr>
                            )
                        }
                    </table>

                } */}
                <br />
                <button> Prev </button>
                <button> Next </button>
                <br />
                {/* {
                    this.state.submissions
                    &&
                    <table >
                        {
                            this.state.submissions.map(
                                (sub, i) =>
                                    <tr key={i}>
                                        <td onClick={() => this.handleSelectedSubmission(sub.id)} >{sub.studentid}</td>
                                    </tr>
                            )
                        }
                    </table>

                } */}
                {/* <br />
                {
                    this.state.studentsubmission
                    &&
                    this.state.studentsubmission.map(
                        (sub, i) =>
                            <div key={i}>
                                <h4>{sub.question}</h4>
                                <h4>{sub.answer}</h4>
                                <h5>{sub.feedback}</h5>
                                <h5>{sub.grade}</h5>
                                <hr />

                            </div>
                    )


                } */}

            </div>
        )
    },
});

const Instructors1 = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            documents: null,
            submissions: [],
            filteredsubmissions: [],
            studentsubmission: [],
            selectedcourses: [],
            instructorscourses: []
        };
    },

    observe(props, state) {
        return {
            user: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get('5a64'),
                changes: true,
                initial: null,
            }),
        };
    },

    async handleSelectedCourse(courseid) {

        //selecting multiple courses
        let courseIdIndex = this.state.selectedcourses.findIndex((selectedcourse) => selectedcourse == courseid)
        if (courseIdIndex == -1) {
            await this.setState({ selectedcourses: [...this.state.selectedcourses, courseid] })
            //select all sections under course
            let allsections = document.getElementsByClassName(courseid)
            for (let i = 0; i < allsections.length; i++) {
                allsections[i].checked = true
            }
        }
        else {
            let selectedcourses = this.state.selectedcourses
            selectedcourses.splice(courseIdIndex, 1)
            let allsections = document.getElementsByClassName(courseid)
            for (let i = 0; i < allsections.length; i++) {
                allsections[i].checked = false
            }
            await this.setState({ selectedcourses })

        }
        //get the documents for the course(s)
        this.setState({ documents: [] })
        this.state.selectedcourses.map(async (course, i) => {
            let query = r.table('documents').innerJoin(
                r.table('contents').innerJoin(r.table('courses').get(course)('contents'),
                    (action, content) =>
                        action('id').eq(content('contentid'))).zip().distinct(),
                (action, document) =>
                    action('id').eq(document('docid'))).zip().distinct()
            await ReactRethinkdb.DefaultSession.runQuery(query).then(
                (res) => {
                    res.map((r) => this.setState({ documents: [...this.state.documents, r] }))

                }
            )
        })

    },
    handleSelectedDocument(docid) {
        //get submissions for the document
        let submissions = []
        this.state.documents.filter((doc) => doc.docid == docid)[0].submissions.map(
            (submission) => submissions.push(submission)
        )
        let query = r.table("submissions").filter(
            (doc) => {
                return r.expr(submissions).contains(doc("id"));
            }
        )

        ReactRethinkdb.DefaultSession.runQuery(query).then(
            (res) => {
                res.toArray((err, results) => {
                    this.setState({ submissions: results, filteredsubmissions: results })
                });
            }
        )

    },
    handleSelectedSubmission(submissionid) {
        let query = r.table('questions').innerJoin(r.table('submissions').get(submissionid)('answers'),
            (question, submission) =>
                question('id').eq(submission('questionid'))).zip().distinct()
        ReactRethinkdb.DefaultSession.runQuery(query).then(
            (res) => {
                this.setState({ studentsubmission: res })
            }
        )

    },
    // handleSelectedSection(sectionid) {
    //     console.log("Secy sec", sectionid)
    //     let sectionstudents = this.data.sections.value().find(x => x.id == sectionid).students
    //     let selectedsection = document.getElementById(sectionid).checked

    //     if (selectedsection) {
    //         let allsubmissions = []
    //         this.state.submissions.map((s) => allsubmissions.push(s))

    //         let addedsubmissions = this.state.filteredsubmissions
    //         sectionstudents.map(
    //             (x) => allsubmissions.filter(y => x.studentid == y.studentid).map((z) => addedsubmissions.push(z))
    //         )
    //         this.setState({
    //             filteredsubmissions: addedsubmissions
    //         })
    //     }
    //     else {
    //         let filtered = []
    //         this.state.filteredsubmissions.map((s) => filtered.push(s))
    //         sectionstudents.map(
    //             (x) => filtered.splice(filtered.findIndex(y => x.studentid == y.studentid), 1)
    //         )
    //         this.setState({
    //             filteredsubmissions: filtered
    //         })
    //     }
    // },

    async handleSelectedCourse(courseid) {

        //selecting multiple courses
        let courseIdIndex = this.state.selectedcourses.findIndex((selectedcourse) => selectedcourse == courseid)
        if (courseIdIndex == -1) {
            await this.setState({ selectedcourses: [...this.state.selectedcourses, courseid] })
            //select all sections under course
            let allsections = document.getElementsByClassName(courseid)
            for (let i = 0; i < allsections.length; i++) {
                allsections[i].checked = true
            }
        }
        else {
            let selectedcourses = this.state.selectedcourses
            selectedcourses.splice(courseIdIndex, 1)
            let allsections = document.getElementsByClassName(courseid)
            for (let i = 0; i < allsections.length; i++) {
                allsections[i].checked = false
            }
            await this.setState({ selectedcourses })
        }

        //get the documents for the course(s)
        this.setState({ documents: [] })
        this.state.selectedcourses.map(async (course, i) => {
            let query = r.table('documents').innerJoin(
                r.table('contents').innerJoin(r.table('courses').get(course)('contents'),
                    (action, content) =>
                        action('id').eq(content('contentid'))).zip().distinct(),
                (action, document) =>
                    action('id').eq(document('docid'))).zip().distinct()
            await ReactRethinkdb.DefaultSession.runQuery(query).then(
                (res) => {
                    res.map((r) => this.setState({ documents: [...this.state.documents, r] }))
                }
            )
        })
    },

    render() {
        return (
            <div style={{ padding: '30px' }}>
                <h3>Courses</h3>
                <hr />
                {
                    this.data.user.value()
                    &&
                    this.data.user.value().courses
                    &&
                    this.data.user.value().courses.map(
                        (course) => <p>{<Course id={course} handleSelectedCourse={() => this.handleSelectedCourse(course)} handleSelectedSection={(secid) => this.handleSelectedSection(secid)} selectedcourses={this.state.selectedcourses} />}</p>
                    )
                }
            </div>
        )
    },
});

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
            <p>
                <input id={this.data.course.value().id} class="uk-checkbox" type="checkbox" onClick={() => this.handleSelectedCourse()} />
                {this.data.course.value().name}
                {this.data.course.value().sections.map(
                    (section) => <p style={{ paddingLeft: "20px" }}>
                        <input id={section.id} class={this.data.course.value().id} type="checkbox" onClick={() => this.handleSelectedSection()} />
                        <Section id={section} /></p>
                )}
                {
                    this.state.list &&
                    this.data.course.value().contents.map(
                        (content) => <p style={{ paddingLeft: "20px" }}>
                            <Content id={content} /></p>
                    )}
            </p>
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
            <span>
                <span onClick={() => this.handleSelectedDocument()}>
                    <Document id={this.data.content.value().docid} />
                </span>
                {
                    this.state.list
                    &&
                    this.data.content.value().submissions.map(
                        (submission) => <p style={{ paddingLeft: "20px" }}>
                            <Submission id={submission} /></p>
                    )}
            </span>
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

export default Instructors1;
