import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';

let r = ReactRethinkdb.r;


export const All = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            name: "",
            semester: "",
            allInstructors: [],
            selectedInstructors: [],
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
        return {
            courses: new ReactRethinkdb.QueryRequest({
                query: r.table('courses'),
                changes: true,
                initial: [],
            })
        };
    },

    handleSubmit() {
        let query = r.table('courses').insert({ name: this.state.name, semester: this.state.semester, instructors: this.state.selectedInstructors });
        ReactRethinkdb.DefaultSession.runQuery(query);
        // this.setState({ name: '', semester: '', selectedInstructors: [] })
    },

    render() {
        return (
            <div>
                <div>

                </div>
                <center><h1>Courses</h1>
                </center>
                <br />
                <center>
                    <table striped bordered condensed hover style={{ width: '70%' }} >
                        <thead>
                            <tr><th>Id</th><th>Name</th><th>Semester</th><th>Instructors</th></tr>
                        </thead>
                        <tbody>
                            {
                                this.data.courses.value().map((course) => {
                                    return <tr key={course.id}>
                                        <td>{course.id}</td>
                                        <td>{course.name}</td>
                                        <td>{course.semester}</td>
                                        <td>{course.instructors}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table >
                </center>
            </div>
        )

    },
});

export const Create = createReactClass({
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
        if (this.state.name.trim() !== "" && this.state.semester.trim() !== "" && this.state.selectedInstructors.length === 0) {
            console.log(this.state.selectedInstructors)
            let instructors = []
            this.state.selectedInstructors.map((inst, i) => instructors.push({ id: inst.id, sections: [{ number: i + 1, courseWorks: [] }] }))
            let query = r.table('courses').insert({ name: this.state.name, semester: this.state.semester, instructors: instructors, exams: [] });
            ReactRethinkdb.DefaultSession.runQuery(query);
        } else {
            this.setState({ error: "Invalid Input" })
        }
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
                            <input type={"text"} value={this.state.name} onChange={(event) => this.setState({ name: event.target.value, error: ""  })} />
                            <p>semester</p>
                            <input type={"text"} value={this.state.semester} onChange={(event) => this.setState({ semester: event.target.value, error: ""  })} />
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
