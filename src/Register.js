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
//  
//  

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

            flag: false,
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
        if (this.state.flag) {
            let key = Math.random().toString(36).substring(7)
            let loginId = Math.random().toString(36)
            loginId = loginId.substring(key.length - 4)
            let query = r.table('users').insert({ collegeId: this.state.collegeId, loginId: loginId, number: this.state.number, name: (this.state.firstName + " " + this.state.lastName), role: this.state.role, department: this.state.department, recovEmail: this.state.recovEmail, key: key, password: "" })
            console.log('logIn Id:', loginId)
            await ReactRethinkdb.DefaultSession.runQuery(query)
            await fetch("http://localhost:3001/api/activate/" + this.state.recovEmail + "/" + key + "/" + loginId)
        }
        else {
            console.log("not yet")
        }
    },

    async handleCreate() {
        await this.resetFlag()
        console.log('after reset flag', this.state.flag)
        // let key = Math.random().toString(36)
        // console.log('key',key.substring(key.length-4))
        this.handleCollegeId(this.state.collegeId)
        // this.handleLoginId(this.state.loginId)
        this.handleFirstName(this.state.firstName)
        this.handleLastName(this.state.lastName)
        this.handleNumber(this.state.number)
        this.handleRecovEmail(this.state.recovEmail)
        this.handleCollegeEmail(this.state.collegeEmail)
        this.handleRole(this.state.role)
        this.handleDepartment(this.state.department)
        this.handleRegister()
    },

    async resetFlag() {
        await this.setState({ flag: true })
        console.log('iside reset flag', this.state.flag)
    },

    handleCollegeId(collegeId) {
        let collegeIdRegex = /^600[0-9]{5}$/
        let check = false;
        let collegeIdMessage = ""
        this.data.students.value().forEach((element, i) => {
            console.log('checking data', i, this.data.students.value()[i].collegeId)
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
            collegeIdMessage = "Please enter a College Id"
        collegeIdMessage === '' ? this.setState({ collegeIdMessage, flag: false }) : this.setState({ collegeIdMessage })
    },

    handleFirstName(firstName) {
        console.log('checking Name', this.state.firstName, firstName)
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
        //console.log('nuber',numberRegex.test(number))
        let numberRegex = /^[0-9]{8}$/

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
        let recovEmailRegex = /^[a-zA-Z0-9\.\-]+@[a-zA-Z0-9\-]+\.[A-Za-z\-]{2,}/
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
            recovEmailMessage = "Please enter a Recovery Email"
        recovEmailMessage === '' ? this.setState({ recovEmailMessage, flag: false }) : this.setState({ recovEmailMessage })
    },

    handleCollegeEmail(collegeEmail) {
        //console.log('checking Recovery Email', this.state.flag, recovEmail)
        let collegeEmailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9\-]+\.[A-Za-z\-]{2,}/
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
            collegeEmailMessage = "Please enter a College Email"
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

            <div >
                {/* <div class="ui left fixed vertical menu " style={{ height: '100vh', backgroundColor: '#76323f' }}>
                <div class="item">
                    <img class="ui mini circular image" src={p1} style={{ width: 100, height: 95 }} />
                </div>
                <a class="item" style={{ color: 'white' }}>Faculty List</a>
              
            </div> */}
                <div className="ui left fixed vertical menu" style={{ width: '15%', float: 'left', height: '100vh', backgroundColor: '#76323f' }}>
                    {/* <div class="ui vertical menu right-nav" style={{ width: '15%', float: 'left', height: '100vh' }}> */}
                    <div class="item">
                        <div style={{ width: '100%', height: '30%' }}>
                            <div style={{ height: '100%', float: 'left', width: '50%' }} >

                                <div class="uk-inline-clip uk-transition-toggle" tabindex="0" style={{ width: 100, height: 100 }}>
                                    <a>
                                        <img src={logo} style={{ width: 100, height: 100, borderRadius: 50 }}
                                        />
                                        <div class="uk-transition-slide-bottom uk-position-bottom uk-overlay uk-overlay-default" style={{ width: 100, height: 100, borderRadius: 50 }}>
                                            <div class="uk-position-center">
                                                <div class="uk-transition-slide-bottom-small"><h4 class="uk-margin-remove">Logout</h4></div>
                                            </div>
                                        </div>
                                    </a>
                                </div>

                            </div>
                            <div className='user-data'>
                                <strong>
                                    Admin Name

                            <br />
                                    60081926
                                <br />
                                    <a uk-tooltip="title: My profile page; pos: bottom-right">
                                        My Profile
                                </a>
                                </strong>
                                <br />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class="term-courses-nav">
                        <li class="header nav-head">
                            <a href="#">
                                <h4 style={{ color: 'white' }}>Faculty List</h4>
                            </a>
                        </li>
                    </div>

                </div>
                <div style={{ marginLeft: 120, marginRight: 5 }}>
                    <div class="ui raised very padded text container segment " style={{ height: '100vh' }} class="register-container">

                        <div style={{ backgroundColor: 'white' }}>
                            <center>
                                <img src={logo} style={{ width: 70, height: 70, marginTop: 20 }} />
                                <h2 class="ui header h-style" style={{ color: '#76323f', fontSize: '400%', marginTop: 2 }}>Register</h2>
                            </center>

                            <hr class="uk-divider-icon" style={{ backgroundColor: '#76323f', opacity: 1 }} />
                        </div>

                        <div class="centralize-form" style={{ marginLeft: 620, marginTop: 80 }}>

                            <div class="ui  large form " style={{ marginLeft: 45 }}>
                                <div class="fields">
                                    <div class="field">
                                        <label>College ID</label>
                                        {/* <input type="text" placeholder="College ID" />
                                    <label style={{ float: "left", fontSize: 18 }}>College ID</label> */}
                                        <input type="text" name="college-id" placeholder="College ID"
                                            value={this.state.collegeId} onChange={(event) => this.setState({ collegeId: event.target.value })} />
                                        <span>{this.state.collegeIdMessage}</span>
                                    </div>
                                    <div class="field" style={{ marginLeft: 50 }}>
                                        {/* <label>Login ID</label>
                                    <input type="text" placeholder="Login ID" /> */}
                                        {/* <label>Contact No.</label>
                                    <input type="text" placeholder="Contact No." /> */}
                                        <label>Contact No.</label>

                                        <input type="text" name="contact-no." placeholder="Contact No."
                                            value={this.state.number} onChange={(event) => this.setState({ number: event.target.value })} />
                                        <span>{this.state.numberMessage}</span>
                                        {/* <label style={{ float: "left", fontSize: 18 }}>Login ID</label>
                                     <input type="text" name="login-id" placeholder="Login ID"
                                         value={this.state.loginId} onChange={(event) => this.setState({ loginId: event.target.value })} />
                                     <span>{this.state.loginIdMessage}</span>  */}
                                    </div>

                                </div>
                            </div>

                            <div class="ui large form" style={{ marginLeft: 45 }}>
                                <div class="fields">
                                    <div class="field">
                                        {/* <label>Name</label>
                                    <input type="text" placeholder=" Name" /> */}
                                        <label>First Name</label>
                                        <input type="text" name="name" placeholder="Name"
                                            value={this.state.firstName} onChange={(event) => this.setState({ firstName: event.target.value })} />
                                        <span>{this.state.firstNameMessage}</span>

                                    </div>
                                    <div class="field" style={{ marginLeft: 50 }}>
                                        {/* <label>Contact No.</label>
                                    <input type="text" placeholder="Contact No." /> */}
                                        <label>Last Name</label>
                                        <input type="text" name="name" placeholder="Name"
                                            value={this.state.lastName} onChange={(event) => this.setState({ lastName: event.target.value })} />
                                        <span>{this.state.lastNameMessage}</span>
                                    </div>

                                </div>
                            </div>
                            <div class="ui large form" style={{ marginLeft: 45 }}>
                                <div class="fields">
                                    <div class="field">
                                        {/* <label>Personal(Recovery) Email</label>
                                    <input type="text" placeholder="Email" /> */}
                                        <label>Personal(Recovery) Email</label>
                                        <input type="text" name="personal-email" placeholder="Email"
                                            value={this.state.recovEmail} onChange={(event) => this.setState({ recovEmail: event.target.value })} />
                                        <span>{this.state.recovEmailMessage}</span>
                                    </div>
                                    <div class="field" style={{ marginLeft: 50 }}>
                                        {/* <label>College Email</label>
                                    <input type="text" placeholder="College Email" /> */}
                                        <label>College Email</label>
                                        <input type="text" name="college-email" placeholder="Email"
                                            value={this.state.collegeEmail} onChange={(event) => this.setState({ collegeEmail: event.target.value })} />
                                        <span>{this.state.collegeEmailMessage}</span>
                                    </div>

                                </div>
                            </div>

                            <div>

                                <div class="ui large form " style={{ marginLeft: 5 }}>

                                    <div class="fields">


                                        {/* <div class="field">
                                        <label style={{ marginLeft: 43 }}>Role</label>
                                        <select style={{ width: 207, marginLeft: 40 }} class="ui fluid dropdown">
                                            <option value="">Select </option>
                                            <option value="">Admin</option>
                                            <option value="">Instructor</option>
                                            <option value="">Student</option>
                                        </select>
                                    </div> */}
                                        <div class="four wide field">
                                            <label>Role</label>
                                            <select class="ui search dropdown" onChange={(event) => this.setState({ role: event.target.value })}>
                                                <option value="">Role</option>
                                                <option value="Instructor">Instructor</option>
                                                <option value="Student">Student</option>
                                                <option value="Admin assistant">Admin assistant</option>
                                            </select>
                                            <span>{this.state.roleMessage}</span>

                                        </div>

                                        {/* <div class="field" style={{ marginRight: 500 }}>
                                        <label style={{ marginLeft: 50 }}>Department</label>
                                        <select style={{ width: 207, marginLeft: 45 }} class="ui fluid dropdown">
                                            <option value="">Select </option>
                                            <option value="">School of Information Technology</option>
                                            <option value="">School of Information Technology</option>
                                            <option value="">School of Engineering Technology</option>
                                            <option value="">School of Business </option>
                                            <option value="">School of Health Sciences</option>
                                        </select>
                                    </div> */}
                                        <div class="four wide field">
                                            <label>Departments</label>
                                            <select class="ui search dropdown" onChange={(event) => this.setState({ department: event.target.value })}>
                                                <option value="">Departments</option>
                                                <option value="Business Studies">Business Studies</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Information Technology">Information Technology</option>
                                                <option value="Health Sciences">Health Sciences</option>
                                            </select>
                                            <span>{this.state.departmentMessage}</span>

                                        </div>
                                    </div>
                                </div>
                                {/* <button class="uk-button register-btn" style={{ borderRadius: 20, marginLeft: 190, marginTop: 30 }} onClick={() => this.handle()}>Register</button> */}
                                <button class="uk-button register-btn" style={{ borderRadius: 20, marginLeft: 190, marginTop: 30 }} onClick={() => this.handleCreate()}>Register</button>

                            </div>
                        </div>
                    </div>


                </div>
                {/* <div class="uk-offcanvas-content right-chat">

                    <button class="uk-button uk-button-default chat-btn" type="button" uk-toggle="target: #offcanvas-flip" >Chat</button>

                    <div id="offcanvas-flip" uk-offcanvas="flip: true; overlay: true">
                        <div class="uk-offcanvas-bar" style={{ backgroundColor: 'lightblue' }}>

                            <button class="uk-offcanvas-close" type="button" uk-close style={{ color: 'black' }}>x</button>

                            <h3>Title</h3>

                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>


                        </div>

                    </div>

                </div> */}
            </div>
        )
    },
});

export default Register;