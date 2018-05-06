import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import jwt from 'express-jwt'
import '../node_modules/uikit/dist/css/uikit.css';
import './App.css';
import photo from './photo.png';
import logo from './logo.png'

import { sign } from 'jsonwebtoken'
import bcrypt from "bcryptjs"

let r = ReactRethinkdb.r;
const secret = 'abc'

const Register = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            collegeId: null,
            loginId: null,
            firstName: null,
            lastName: null,
            number: null,
            recovEmail: null,
            collegeEmail: null,
            role: null,
            department: null,

            collegeIdMessage: '',
            loginIdMessage: '',
            firstNameMessage: '',
            lastNameMessage: '',
            numberMessage: '',
            recovEmailMessage: '',
            collegeEmailMessage: '',
            roleMessage: '',
            departmentMessage: '',

            flag: true,
            users: null,

            courseName: '',
            courseSemester: '',
            instructors: [],
            SelectedInstructor: ""
        };
    },

    observe(props, state) {
        //this.setState({ messageToUser: "Invalid Input" })
        return {
            students: new ReactRethinkdb.QueryRequest({
                query: r.table('users'), // RethinkDB query
                changes: true,             // subscribe to realtime changefeed
                initial: [],               // return [] while loading
            }),
        };
        //this.setState({ students: students})
    },
    
    async handleRegister() {
        console.log("Registering")
        let key = Math.random().toString(36).substring(7)
        let query = r.table('users').insert({ collegeId: this.state.collegeId, loginId: this.state.loginId, number: this.state.number, name: (this.state.firstName + " " + this.state.lastName), role: this.state.role, department: this.state.department, recovEmail: this.state.recovEmail, key: key, password: "" })
        await ReactRethinkdb.DefaultSession.runQuery(query)
        await fetch("http://localhost:3001/api/activate/"+this.state.recovEmail+"/"+key+"/"+this.state.loginId)
    },

    async handleCreate() {
        this.handleCollegeId(this.state.collegeId)
        this.handleLoginId(this.state.loginId)
        this.handleFirstName(this.state.firstName)
        this.handleLastName(this.state.lastName)
        this.handleNumber(this.state.number)
        this.handleRecovEmail(this.state.recovEmail)
        this.handleCollegeEmail(this.state.collegeEmail)
        this.handleRole(this.state.role)
        this.handleDepartment(this.state.department)
        console.log('checking', this.state.flag)
        if (this.state.flag) {
            this.handleRegister()
        } else {
            console.log("failed")
        }
    },

    handleCollegeId(collegeId) {
        let collegeIdRegex = /^600[0-9]{5}$/
        let check = false;
        let collegeIdMessage = ""
        this.data.students.value().forEach((element, i) => {
            this.data.students.value()[i].collegeId === collegeId ? check = true : null
        })
        collegeId ?
            check ?
                collegeIdMessage = "Error Duplicate College Id"
                :
                collegeIdRegex.test(collegeId)
                    ?
                    collegeIdMessage = ""
                    :
                    collegeIdMessage = "Error Invalid College Id"
            :
            collegeIdMessage = "Please enter an College Id"
        collegeIdMessage === '' ? this.setState({ collegeIdMessage, flag: false }) : this.setState({ collegeIdMessage })
    },

    handleLoginId(loginId) {
        let loginIdRegex = /^600[0-9]{5}$/
        let check = false;
        let loginIdMessage = ""
        this.data.students.value().forEach((element, i) => {
            this.data.students.value()[i].loginId === loginId ? check = true : null
        })
        loginId ?
            check ?
                loginIdMessage = "Error Duplicate Login Id"
                :
                loginIdRegex.test(loginId)
                    ?
                    loginIdMessage = ""
                    :
                    loginIdMessage = "Error Invalid Login Id"
            :
            loginIdMessage = "Please enter an Login Id"
        loginIdMessage === '' ? this.setState({ loginIdMessage, flag: false }) : this.setState({ loginIdMessage })
    },

    handleFirstName(firstName) {
        console.log('checking email', this.state.firstName, firstName)
        let firstNameRegex = /^[a-zA-Z]*$/
        let firstNameMessage = ""
        firstName ?
            firstNameRegex.test(firstName)
                ?
                firstNameMessage = ""
                :
                firstNameMessage = "Error Invalid First Name"
            :
            firstNameMessage = "Please enter a First Name"
        firstNameMessage === '' ? this.setState({ firstNameMessage, flag: false }) : this.setState({ firstNameMessage })
    },

    handleLastName(lastName) {
        let lastNameRegex = /^[a-zA-Z]*$/
        let lastNameMessage = ""
        lastName ?
            lastNameRegex.test(lastName)
                ?
                lastNameMessage = ""
                :
                lastNameMessage = "Error Invalid Last Name"
            :
            lastNameMessage = "Please enter a Last Name"
        lastNameMessage === '' ? this.setState({ lastNameMessage, flag: false }) : this.setState({ lastNameMessage })
    },

    handleNumber(number) {
        let numberRegex = /[0-9]{8}$/
        let check = false;
        let numberMessage = ""
        number ?
            numberRegex.test(number)
                ?
                numberMessage = ""
                :
                numberMessage = "Error Invalid Phone Number"
            :
            numberMessage = "Please enter a Phone Number"
        numberMessage === '' ? this.setState({ numberMessage, flag: false }) : this.setState({ numberMessage })
    },

    handleRecovEmail(recovEmail) {
        //console.log('checking Recovery Email', this.state.flag, recovEmail)
        let recovEmailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
        let check = false
        let recovEmailMessage = ""
        this.data.students.value().forEach((element, i) => {
            this.data.students.value()[i].recovEmail === recovEmail ? check = true : null
        })
        recovEmail ?
            check ?
            recovEmailMessage = "Error Duplicate Recovery Email"
                :
                recovEmailRegex.test(recovEmail)
                    ?
                    recovEmailMessage = ""
                    :
                    recovEmailMessage = "Error Invalid Recovery Email"
            :
            recovEmailMessage = "Please enter an Recovery Email"
            recovEmailMessage === '' ? this.setState({ recovEmailMessage, flag: false }) : this.setState({ recovEmailMessage })
    },

    handleCollegeEmail(collegeEmail) {
        //console.log('checking Recovery Email', this.state.flag, recovEmail)
        let collegeEmailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
        let check = false
        let collegeEmailMessage = ""
        this.data.students.value().forEach((element, i) => {
            this.data.students.value()[i].collegeEmail === collegeEmail ? check = true : null
        })
        collegeEmail ?
            check ?
            collegeEmailMessage = "Error Duplicate College Email"
                :
                collegeEmailRegex.test(collegeEmail)
                    ?
                    collegeEmailMessage = ""
                    :
                    collegeEmailMessage = "Error Invalid College Email"
            :
            collegeEmailMessage = "Please enter an College Email"
            collegeEmailMessage === '' ? this.setState({ collegeEmailMessage, flag: false }) : this.setState({ collegeEmailMessage })
    },

    handleRole(role) {
        let roleMessage = ""
        !role ?
            roleMessage = "Please select user's Role"
            :
            roleMessage = ""

        this.setState({ flag: !role ? false : null, roleMessage })
    },

    handleDepartment(department) {
        let departmentMessage = ""
        !department ?
            departmentMessage = "Please select user's Department"
            :
            departmentMessage = ""

        this.setState({ flag: !department ? false : null, departmentMessage })
    },

    handleRoleSelect(role) {
        this.setState({ role })
    },

    handleDepartmentSelect(department) {
        this.setState({ department })
    },

    render() {
        return (
            <div>
                <div style={{ marginLeft: 120, marginRight: 5 }}>
                    <div class="ui raised very padded text container segment " style={{ height: '100vh' }} class="register-container">
                        <center>
                            <img src={logo} style={{ width: 70, height: 70, marginTop: 20 }} />
                            <h1 class="ui  header" style={{ color: '#76323f', fontSize: '400%', marginTop: 2 }}>Register </h1>
                        </center>
                        <hr class="uk-divider-icon" />
                        <center>
                            <div class="ui form" style={{ marginLeft: 30 }} >
                                <div class="four wide field">
                                    <label style={{ float: "left", fontSize: 18 }}>College ID</label>
                                    <input type="text" name="college-id" placeholder="College ID" 
                                    value={this.state.collegeId} onChange={(event) => this.setState({collegeId: event.target.value})} />
                                </div>
                                <div class="four wide field">
                                    <label style={{ float: "left", fontSize: 18 }}>Login ID</label>
                                    <input type="text" name="login-id" placeholder="Login ID" 
                                    value={this.state.loginId} onChange={(event) => this.setState({loginId: event.target.value})} />

                                </div>
                                <div class="four wide field">
                                    <label style={{ float: "left", fontSize: 18 }}>First Name</label>
                                    <input type="text" name="name" placeholder="Name" 
                                    value={this.state.firstName} onChange={(event) => this.setState({firstName: event.target.value})} />
                                </div>

                                <div class="four wide field">
                                    <label style={{ float: "left", fontSize: 18 }}>Last Name</label>
                                    <input type="text" name="name" placeholder="Name" 
                                    value={this.state.lastName} onChange={(event) => this.setState({lastName: event.target.value})} />
                                </div>

                                <div class="four wide field">
                                    <label style={{ float: "left", fontSize: 18 }}>Contact No.</label>
                                    <input type="text" name="contact-no." placeholder="Contact No." 
                                    value={this.state.number} onChange={(event) => this.setState({number: event.target.value})} />
                                </div>

                                <div class="four wide field">
                                    <label style={{ float: "left", fontSize: 18 }}>Personal(Recovery) Email</label>
                                    <input type="text" name="personal-email" placeholder="Email" 
                                    value={this.state.recovEmail} onChange={(event) => this.setState({recovEmail: event.target.value})} />
                                </div>

                                <div class="four wide field">
                                    <label style={{ float: "left", fontSize: 18 }}>College Email</label>
                                    <input type="text" name="college-email" placeholder="Email" 
                                    value={this.state.collegeEmail} onChange={(event) => this.setState({collegeEmail: event.target.value})} />
                                </div>

                                <div class="four wide field">
                                    <label style={{ float: "left", fontSize: 18 }}>Role</label>
                                    <select class="ui search dropdown" onChange={(event) => this.setState({role: event.target.value})}>
                                        <option value="">Role</option>
                                        <option value="Instructor">Instructor</option>
                                        <option value="Student">Student</option>
                                        <option value="Admin assistant">Admin assistant</option>
                                    </select>
                                </div>

                                <div class="four wide field">
                                    <label style={{ float: "left", fontSize: 18 }}>Departments</label>
                                    <select class="ui search dropdown" onChange={(event) => this.setState({department: event.target.value})}>
                                        <option value="">Departments</option>
                                        <option value="Business Studies">Business Studies</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Health Sciences">Health Sciences</option>
                                    </select>
                                </div>

                                <button class="uk-button register-btn" style={{ borderRadius: 20 }} onClick={() => this.handleCreate()}>Register</button>
                            dddddddd<br/>fff
                            </div>
                        </center>
                    </div>
                </div>
            </div>
        )
    },
});

export default Register;