import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';

let r = ReactRethinkdb.r;


export const Enroll = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            studentIdSearch: "60072692",
            searchedStudent: null,
            addedStudents: [],
            selectedCourse: "",
            changes: [],
            //students who has been added to a course (before commiting)
            students: [],
            error: ''
        };
    },

    componentWillMount() {
        if (!sessionStorage.getItem("token") || sessionStorage.getItem("role") !== "Admin") {
            this.props.history.push("/")
        }
    },

    observe(props, state) {
        return {
            courses: new ReactRethinkdb.QueryRequest({
                query: r.table('courses'),
                changes: true,
                initial: [],
            })
        };
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
            let sectionNum = splitArray[1]
            let studentId = splitArray[2]

            let query = r.table('courses').get(courseId).getField("sections").filter({ sectionNo: parseInt(sectionNum) }).getField("students")
            //.filter({sectionNo: sectionNum}).update({students: r.row("students").append({studentId: studentId})  })
            ReactRethinkdb.DefaultSession.runQuery(query).then(res => {
                console.log("RES", res)
            })
        })
    },

    render() {
        return (
            this.data.courses.value() == []
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
                            this.data.courses.value().map(course =>
                                course.sections.map(section =>
                                    <option value={course.id + " " + section.sectionNo}>{course.name} - s{section.sectionNo}</option>
                                )
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
                                <p>{this.state.students.find(c => c.id === item.split(" ")[2]).name} - {this.data.courses.value().find(c => c.id === item.split(" ")[0]).name}- section: {item.split(" ")[1]} <button onClick={() => this.handleRemoveChange(item)}>Undo</button></p>
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
