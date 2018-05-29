import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';

let r = ReactRethinkdb.r;


export const Enroll = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            studentIdSearch: "",
            searchedStudent: null,
            addedStudents: [],
            selectedCourse: "",
            changes: [],
            //students who has been added to a course (before commiting)
            students: [],
            coursesList: [],
            error: ''
        };
    },

    componentWillMount() {
        //if (!sessionStorage.getItem("token") || sessionStorage.getItem("role") !== "Admin") {
        ///  this.props.history.push("/")
        //} else {
        let query = r.table('courses')
        ReactRethinkdb.DefaultSession.runQuery(query).then(res => {
            res.toArray((err, results) => {
                results.map(course => {
                    course.sections.map(section => {
                        let querySection = r.table('sections').get(section)
                        ReactRethinkdb.DefaultSession.runQuery(querySection).then(resSec => {
                            let courseData = { courseid: course.id, courseName: course.name, sectionNo: resSec.sectionNo, sectionid: resSec.id }
                            this.setState({ coursesList: [...this.state.coursesList, courseData] })
                            console.log("Record", courseData)
                        })
                    })
                })
            })
        })
        //}
    },

    observe(props, state) {
        return {}
    },

    handleSearchStudent() {
        let query = r.table("users").filter({ collegeId: this.state.studentIdSearch, role: "Student" })
        ReactRethinkdb.DefaultSession.runQuery(query).then(res => {
            res.toArray((err, results) => {
                if (results.length > 0) {
                    console.log("Found Student", results);
                    this.setState({ searchedStudent: results[0] })
                } else {
                    this.setState({ error: "Student Not Found" })
                }
            })
        })
    },

    handleSelectCourseSection(event) {
        console.log(event.target.value)
        let course = event.target.value
        //split by space (" ") to get the course id in pos 0 and section id in pos 1
        this.setState({ selectedCourse: course, error: "" })
    },

    handleAddStudent() {
        // console.log("ST", this.state.selectedCourse)
        if (this.state.selectedCourse !== "") {
            let item = this.state.selectedCourse + " " + this.state.searchedStudent.id
            if (this.state.changes.findIndex(x => x === item) === -1) {
                if (this.state.changes.findIndex(x => x.split(" ")[0] === item.split(" ")[0] && x.split(" ")[2] === item.split(" ")[2]) === -1) {
                    this.setState({ changes: [...this.state.changes, item], students: [...this.state.students, this.state.searchedStudent] })
                    // console.log("TS", item)
                } else {
                    this.setState({ error: "student already in one section" })
                }
            } else {
                this.setState({ error: "duplicate" })
            }
        } else {
            this.setState({ error: "select a course" })
        }

    },

    handleRemoveChange(record) {
        let index = this.state.changes.findIndex(x => x === record)
        let newChangesList = this.state.changes
        newChangesList.splice(index, 1)
        this.setState({ changes: newChangesList })
    },

    handleSubmit() {
        this.state.changes.map(record => {
            let splitArray = record.split(" ")
            let courseId = splitArray[0]
            let sectionId = splitArray[1]
            let studentId = splitArray[2]

            let queryStudent = r.table('users').get(studentId).update({
                courses: r.row('courses').append(courseId)
            })
            let queryCollegeId = r.table('users').get(studentId)

            ReactRethinkdb.DefaultSession.runQuery(queryStudent)

            ReactRethinkdb.DefaultSession.runQuery(queryCollegeId).then(
                res => {
                    let querySection = r.table('sections').filter({collegeId : res.collegeId}).update({
                        students: r.row('students').append(studentId)
                    })
                    ReactRethinkdb.DefaultSession.runQuery(querySection);
                }
            );
        })
    },

    render() {
        return (
            this.state.coursesList === []
                ?
                <p>Loading...</p>
                :
                <div>
                    <div>
                    </div>
                    <center><h1>Enroll a Student</h1>
                    </center>
                    <br />
                    <p>-Courses</p>
                    <select class="ui search dropdown" onChange={this.handleSelectCourseSection}>
                        <option value="">Select Course</option>
                        {
                            this.state.coursesList.map(record =>
                                <option value={record.courseid + " " + record.sectionid}>{record.courseName} - s{record.sectionNo}</option>
                            )
                        }
                    </select>
                    <br />
                    <p>-Enter Student College Id</p>
                    <input type={"text"} value={this.state.studentIdSearch} onChange={(event) => this.setState({ studentIdSearch: event.target.value, error: "" })} />
                    <button onClick={this.handleSearchStudent}>Search</button>
                    {this.state.searchedStudent && <p>Found: {this.state.searchedStudent.name} <button onClick={this.handleAddStudent}>add</button></p>}
                    {
                        this.state.changes.length > 0
                        &&
                        <div>
                            <p style={{ marginTop: 20 }}>-Changes Made:</p>
                            {this.state.changes.map(item =>
                                <p>{this.state.students.find(c => c.id === item.split(" ")[2]).collegeId} - {this.state.coursesList.find(c => c.courseid === item.split(" ")[0]).courseName}- section: {this.state.coursesList.find(c => c.sectionid === item.split(" ")[1]).sectionNo} <button onClick={() => this.handleRemoveChange(item)}>Undo</button></p>
                            )}
                            <button onClick={this.handleSubmit}>Commit</button>
                        </div>
                    }
                    {this.state.error}
                </div>
        )

    },
});

export const Home = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            documents: null,
            selectedcourses: [],
            questions: [],
            answers: [],
            selectedDocId: null
        };
    },

    componentWillMount() {
        if (!sessionStorage.getItem("token") || sessionStorage.getItem("role") !== "Student") {
            this.props.history.push("/")
        }
        else {
            let query = r.table('users').get(sessionStorage.getItem("user_id"))
            ReactRethinkdb.DefaultSession.runQuery(query).then(
                (res) => {
                    this.setState({ student: res })
                    console.log("here", res)
                })
        }
    },

    observe(props, state) {
        //this.setState({ messageToUser: "Invalid Input" })
        return {
            courses: new ReactRethinkdb.QueryRequest({
                query: r.table('courses')
                    .innerJoin(r.table('users').get(sessionStorage.getItem("user_id"))('courses'),
                        (action, user) =>
                            action('id').eq(user('courseid'))).zip(),
                changes: false,
                initial: null,
            }),
            student: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(sessionStorage.getItem("user_id")),
                changes: true,
                initial: null,
            }),
        };
    },

    async handleSelectedCourse(courseid) {
        console.log("S1 IN")
        let courseIdIndex = this.state.selectedcourses.findIndex((selectedcourse) => selectedcourse == courseid)
        if (courseIdIndex == -1) {
            await this.setState({ selectedcourses: [...this.state.selectedcourses, courseid] })
            console.log("Selected Courses 1 ", this.state.selectedcourses)
        }
        else {
            let selectedcourses = this.state.selectedcourses
            selectedcourses.splice(courseIdIndex, 1)
            await this.setState({ selectedcourses })
            console.log("Selected Courses 2 ", this.state.selectedcourses)

        }
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
                    console.log("sdfgdg", res)
                    res.map((r) => this.setState({ documents: [...this.state.documents, r] }))

                }
            )
        })
    },

    handleSelectedDocument(docid) {
        //get submissions for the document
        let questions = []
        let answers = []
        let query = r.table('questions').innerJoin(
            r.table('documents').get(docid)('questions'),
            (question, documents) => question('id').eq(documents('questionid'))).zip()

        ReactRethinkdb.DefaultSession.runQuery(query).then(
            (res) => {
                res.toArray((err, results) => {
                    results.map(res => answers.push(""))
                    this.setState({ questions: results, answers, selectedDocId: docid })
                });
            }
        )
        // let submissions = []
        // this.state.documents.filter((doc) => doc.docid == docid)[0].submissions.map(
        //     (submission) => submissions.push(submission.submissionid)
        // )
        // let query = r.table("submissions").filter(
        //     (doc) => {
        //         return r.expr(submissions).contains(doc("id"));
        //     }
        // )

        // ReactRethinkdb.DefaultSession.runQuery(query).then(
        //     (res) => {
        //         res.toArray((err, results) => {
        //             this.setState({ submissions: results })
        //         });
        //     }
        // )

    },

    handleAnswer(e, i) {
        let text = e.target.value
        let updated = this.state.answers
        updated[i] = text
        this.setState({ answers: updated })
    },

    handleSubmitContent() {
        let answers = []
        this.state.answers.map((ans, i) => {
            answers.push({
                answer: ans,
                questionid: this.state.questions[i].id
            })
        })
        let query = r.table("submissions").insert({ studentid: sessionStorage.getItem("user_id"), answers: answers })
        ReactRethinkdb.DefaultSession.runQuery(query, { return_changes: true }).then(res => {
            let insertedSubmissionId = res.generated_keys[0]
            let query2 = r.table('contents').filter({ docid: this.state.selectedDocId }).update({
                submissions: r.row('submissions').append(insertedSubmissionId)
            })
            ReactRethinkdb.DefaultSession.runQuery(query2);
        })

    },

    render() {
        return (
            <div>
                {
                    this.data.student.value() != null
                    &&
                    <h3>Welcome {this.data.student.value().name}</h3>
                }
                {
                    this.data.courses.value() != null
                    &&
                    this.data.courses.value().map(
                        (c) =>
                            <p style={{ paddingLeft: '20px' }}>
                                <input class="uk-checkbox" type="checkbox" onClick={() => this.handleSelectedCourse(c.id)} /> {c.name}
                            </p>
                    )
                }
                {
                    this.state.documents
                    &&
                    <table >
                        {
                            this.state.documents.map(
                                (doc, i) =>
                                    <tr key={i}>
                                        <td onClick={() => this.handleSelectedDocument(doc.docid)}>{doc.name}</td>
                                    </tr>
                            )
                        }
                    </table>
                }
                {
                    this.state.questions.length > 0
                    &&
                    <div style={{ marginTop: 20 }}>
                        {
                            this.state.questions.map(
                                (q, i) =>
                                    <p key={i}>
                                        <h4>{q.question}</h4><br />
                                        <input type={"text"} value={this.state.answers[i]} onChange={(e) => this.handleAnswer(e, i)} />
                                    </p>
                            )
                        }
                        <button onClick={() => this.handleSubmitContent()}>Submit</button>
                    </div>
                }
            </div>

        );
    },
});