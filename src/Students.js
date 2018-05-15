import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';

let r = ReactRethinkdb.r;


export const Enroll = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            studentIdSearch: "60083589",
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
        if (!sessionStorage.getItem("token") || sessionStorage.getItem("role") !== "Admin") {
            this.props.history.push("/")
        } else {
            let query = r.table('courses')
            ReactRethinkdb.DefaultSession.runQuery(query).then(res => {
                res.toArray((err, results) => {
                    results.map(course => {
                        course.sections.map(section => {
                            let querySection = r.table('sections').get(section.sectionId)
                            ReactRethinkdb.DefaultSession.runQuery(querySection).then(resSec => {
                                let courseData = { courseId: course.id, courseName: course.name, sectionNo: resSec.sectionNo, sectionId: resSec.id }
                                this.setState({ coursesList: [...this.state.coursesList, courseData] })
                                console.log("Record", courseData)
                            })
                        })
                    })
                })
            })
        }
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
        if (this.state.selectedCourse !== "") {
            let item = this.state.selectedCourse + " " + this.state.searchedStudent.id

            console.log("List", this.state.changes)
            console.log("Item", item)

            if (this.state.changes.findIndex(x => x === item) === -1) {
                if (this.state.changes.findIndex(x => x.split(" ")[0] === item.split(" ")[0] && x.split(" ")[2] === item.split(" ")[2]) === -1) {
                    this.setState({ changes: [...this.state.changes, item], students: [...this.state.students, this.state.searchedStudent] })
                    console.log("SSS", this.state.changes)
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
                courses: r.row('courses').append({ courseId: courseId })
            })
            let querySection = r.table('sections').get(sectionId).update({
                students: r.row('students').append({ studentId: studentId })
            })
            ReactRethinkdb.DefaultSession.runQuery(queryStudent);
            ReactRethinkdb.DefaultSession.runQuery(querySection);

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
                                <option value={record.courseId + " " + record.sectionId}>{record.courseName} - s{record.sectionNo}</option>
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
                                <p>{this.state.students.find(c => c.id === item.split(" ")[2]).number} - {this.state.coursesList.find(c => c.sectionId === item.split(" ")[1]).courseName}- section: {this.state.coursesList.find(c => c.sectionId === item.split(" ")[1]).sectionNo} <button onClick={() => this.handleRemoveChange(item)}>Undo</button></p>
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
            student: null,
            courses: [],
        };
    },

    componentWillMount() {
        if (!sessionStorage.getItem("token") || sessionStorage.getItem("role") !== "Student") {
            this.props.history.push("/")
        }
        // else {
        //     let query = r.table('users').get(sessionStorage.getItem("user_id"))

        //     ReactRethinkdb.DefaultSession.runQuery(query).then(
        //         (res) => {
        //             this.setState({ student: res })
        //             console.log("here", res)
        //         })
        // }
    },

    observe(props, state) {
        return {
            student: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(sessionStorage.getItem("user_id")),
                changes: true,
                initial: null,
            })
        };
    },

    render() {
        return (
            this.data.student.value()
            ?
            <div>
                <div style={{ marginLeft: 130, marginRight: 5 }}>
                    <p>Welcome {this.data.student.value().name}, </p>
                </div>
            </div>
            :
            <p>Loading</p>
        );
    },
});
