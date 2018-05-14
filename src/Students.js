import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';

let r = ReactRethinkdb.r;


export const Enroll = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            studentIdSearch: "66180672",
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
                            let querySection = r.table('sections').get(section)
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
        return { }
    },

    handleSearchStudent() {
        let query = r.table("users").filter({ number: this.state.studentIdSearch, role: "Student" })
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
        //split by space (" ") to get the course id in pos 0 and section num in pos 1
        this.setState({ selectedCourse: course, error: "" })
    },

    handleAddStudent() {
        if (this.state.selectedCourse !== "") {
            let item = this.state.selectedCourse + " " + this.state.searchedStudent.id

            console.log("List", this.state.changes)
            console.log("Item", item)

            if (this.state.changes.findIndex(x => x === item) === -1) {
                this.setState({ changes: [...this.state.changes, item], students: [...this.state.students, this.state.searchedStudent] })
                console.log("SSS", this.state.changes)
            } else {
                this.setState({ error: "duplicate" })
            }
        } else {
            this.setState({ error: "select a course" })
        }

    },

    handleRemoveChange(record) {
        console.log("REC", record)
        console.log("Whole", this.state.changes)
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
            let querySection = r.table('sections').get(sectionId).update({
                students: r.row('students').append(studentId)
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

export const SomethingElse = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            name: "",
            semester: "",
            allInstructors: [],
            selectedInstructors: [],
            dropDownSelection: "",
            error: ""
        };
    },

    async componentWillMount() {
        if (!sessionStorage.getItem("token") || sessionStorage.getItem("role") !== "Admin") {
            this.props.history.push("/")
        } else {
            let query = r.table('users').filter({ role: "Instructor" })

            let users = {}
            await ReactRethinkdb.DefaultSession.runQuery(query).then(
                (res) => {
                    res.toArray((err, results) => {
                        console.log("All Insts", results);
                        users = results
                    })
                })
            this.setState({ allInstructors: users })
            console.log("ALL ", users)
        }
    },

    observe(props, state) {
        return {}
    },

    handleSubmit() {
        // let query = r.table('courses').insert({ name: this.state.name, semester: this.state.semester, instructors: instructors, exams: [] });
        // ReactRethinkdb.DefaultSession.runQuery(query);
    },

    handleSelectInstructor(event) {
        let id = event.target.value
        console.log("DI", id)
        this.setState({ dropDownSelection: id, error: "" })
    },

    handleAddInstructor() {
        let id = this.state.dropDownSelection
        console.log("ID", id)
        if (id !== "" && !this.state.selectedInstructors.find(x => x.id === id)) {
            this.setState({ dropDownSelection: id })
            let instructor = this.state.allInstructors.find((inst) => inst.id === id)
            this.setState({ selectedInstructors: [...this.state.selectedInstructors, instructor] })
            this.setState({ dropDownSelection: '' })
            console.log("IN", instructor)
        }
    },

    render() {
        return (
            <div>

                <div style={{ marginLeft: 130, marginRight: 5 }}>

                    <div class="ui raised very padded text container segment" style={{ height: '100vh' }}>
                        <center>
                            <h2 class="ui  header">Create a Course</h2>
                        </center>
                        <hr class="uk-divider-icon" />
                        <div class="ui form">
                            <p>name</p>
                            <input type={"text"} value={this.state.name} onChange={(event) => this.setState({ name: event.target.value, error: "" })} />
                            <p>semester</p>
                            <input type={"text"} value={this.state.semester} onChange={(event) => this.setState({ semester: event.target.value, error: "" })} />
                            <p>Instructors</p>
                            <select class="ui search dropdown" placeholder={"Select Instructor"} onChange={this.handleSelectInstructor}>
                                <option value="">Select Instructor</option>
                                {
                                    this.state.allInstructors.map(instructor =>
                                        <option value={instructor.id}>{instructor.name}</option>
                                    )
                                }
                            </select>
                            <button onClick={this.handleAddInstructor}>Add Instructor</button><br />
                            Selected Instructors: {this.state.selectedInstructors.map(inst => <p>{inst.name}</p>)}<br />
                            <button onClick={this.handleSubmit}>Submit</button>
                            <br />
                            {this.state.error}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});
