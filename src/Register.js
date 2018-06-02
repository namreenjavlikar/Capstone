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
            id: null,
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

    componentWillMount() {
        // if(!sessionStorage.getItem("token") || sessionStorage.getItem("role") !== "Admin"){
        //     this.props.history.push("/")
        // }
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
    },

    async handleRegister() {
        // console.log("Registering", this.state.flag)
        if (this.state.flag) {
            let key = Math.random().toString(36).substring(7)
            let id = Math.random().toString(24)
            id = id.substring(id.length - 4)
            let match = false;
            let check = false;
            // console.log('inside if register, before arr')
            let exist=r.table('users').isEmpty()
            let arr = this.data.students.value()
            // console.log('arr',arr)
            if (!exist) {
                while (check === false) {

                    // console.log('inside while register')

                    for (let i = 0; i < arr.length + 1; i++) {
                        // console.log('inside for register')
                        if (arr[i - 1].id === id) {
                            id = Math.random().toString(24)
                            id = id.substring(key.length - 4)
                            check = false
                            break;
                        } else {
                            check = true
                            // console.log('inside else register')
                        }
                        //console.log('inside for', match)
                    }
                    // if (check === false) {
                    //     id = Math.random().toString(24)
                    //     id = id.substring(key.length - 4)
                    // } else {
                    //     check = false
                    // }
                }
            }
            else {
                check = true
            }
            // arr.forEach((element, i) => {
            //     this.data.students.value()[i].id === id ? check = true : false
            // })

            // console.log('after check before register')
            let query = r.table('users').insert({ id: id,  collegeId: this.state.collegeId,number: this.state.number, name: (this.state.firstName + " " + this.state.lastName), role: this.state.role, department: this.state.department, recovEmail: this.state.recovEmail, collegeEmail: this.state.collegeEmail, key: key, password: "", courses: [] })
            console.log('logIn Id:', id)

            // console.log('after check after register')
            await ReactRethinkdb.DefaultSession.runQuery(query)
            console.log('after query')

            try {
                await fetch("http://localhost:3001/api/activate/" + this.state.recovEmail + "/" + key + "/" + id)
            } catch (ex) {
                console.log("error")
            }
            this.setState({
                collegeId: " ", number: " ", firstName: " ", lastName: " ", role: " ", department: " ", recovEmail: " ", collegeEmail: " ",
                collegeIdMessage: '',
                loginIdMessage: '',
                firstNameMessage: '',
                lastNameMessage: '',
                numberMessage: '',
                recovEmailMessage: '',
                collegeEmailMessage: '',
                roleMessage: '',
                departmentMessage: '',
            })
            this.props.history.push("/")
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
        console.log('before calling check')
        this.handleCollegeId(this.state.collegeId)
        // this.handleLoginId(this.state.id)
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
        console.log('before first check')
        this.data.students.value().forEach((element, i) => {
            // console.log('checking data', i, this.data.students.value()[i].collegeId)
            this.data.students.value()[i].collegeId === collegeId ? check = true : null
        })
        console.log('after first check')
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
        collegeIdMessage !== '' ? this.setState({ collegeIdMessage, flag: false }) : this.setState({ collegeIdMessage })
    },

    handleFirstName(firstName) {
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
        firstNameMessage !== '' ? this.setState({ firstNameMessage, flag: false }) : this.setState({ firstNameMessage })
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
        lastNameMessage !== '' ? this.setState({ lastNameMessage, flag: false }) : this.setState({ lastNameMessage })
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
        numberMessage !== '' ? this.setState({ numberMessage, flag: false }) : this.setState({ numberMessage })
    },

    handleRecovEmail(recovEmail) {
        //console.log('checking Recovery Email', this.state.flag, recovEmail)
        let recovEmailRegex = /^[a-zA-Z0-9\.\-]+@[a-zA-Z0-9\-]+\.[A-Za-z\-]{2,}/
        let check = false
        let recovEmailMessage = ""
        this.data.students.value().forEach((element, i) => {
            this.data.students.value()[i].recovEmail === recovEmail ? check = true : check = check
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
        recovEmailMessage !== '' ? this.setState({ recovEmailMessage, flag: false }) : this.setState({ recovEmailMessage })
    },

    handleCollegeEmail(collegeEmail) {
        //console.log('checking Recovery Email', this.state.flag, recovEmail)
        let collegeEmailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9\-]+\.[A-Za-z\-]{2,}/
        let check = false
        let collegeEmailMessage = ""
        this.data.students.value().forEach((element, i) => {
            this.data.students.value()[i].collegeEmail === collegeEmail ? check = true : check = check
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
        collegeEmailMessage !== '' ? this.setState({ collegeEmailMessage, flag: false }) : this.setState({ collegeEmailMessage })
    },

    handleRole(role) {
        let roleMessage = ""
        !role ?
            roleMessage = "Please select user's Role"
            :
            roleMessage = ""

        this.setState({ flag: !role ? false : this.state.flag, roleMessage })
    },

    handleDepartment(department) {
        let departmentMessage = ""
        !department ?
            departmentMessage = "Please select user's Department"
            :
            departmentMessage = ""

        this.setState({ flag: !department ? false : this.state.flag, departmentMessage })
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

                <div className="ui left fixed vertical menu" style={{ width: '15%', float: 'left', height: '100vh', backgroundColor: '#76323f' }}>
                    <div class="item">
                        <div style={{ width: '100%', height: '30%' }}>
                            <div style={{ height: '100%', float: 'left', width: '50%' }} >

                                <img src={logo} style={{ width: 100, height: 100, borderRadius: 50 }}
                                />
                            </div>
                            <div className='user-data'>
                                <strong>
                                    Admin Name

                       <br />
                                    60081926
                         
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
                <div style={{ width: '100%', float: 'left', height: '100vh' }}>
                    <div class="ui raised very padded text container segment " style={{ height: '100vh' }} class="register-container">
                        <div style={{ backgroundColor: 'white' }}>
                            <center>
                                <img src={logo} style={{ width: 70, height: 70, marginTop: 20 }} />
                                <h2 class="ui header h-style" style={{ color: '#76323f', fontSize: '400%', marginTop: 2 }}>Register</h2>
                            </center>

                            <hr class="uk-divider-icon" style={{ backgroundColor: '#76323f', opacity: 1 }} />
                        </div>
                        <div class="" style={{
                            marginLeft: '32%', marginTop: 80, width: 1200
                        }}>
                            <div class="ui large form ">
                                <div class="fields">
                                    <div class="field text-field" style={{ width: 321, marginLeft: 45 }}>
                                        <label>College ID</label>
                                        <input type="text" placeholder="College ID" onChange={(event) => this.setState({ collegeId: event.target.value })} />
                                        <span>{this.state.collegeIdMessage}</span>
                                    </div>
                                    <div class="field text-field" style={{ width: 321, marginLeft: 50 }}>
                                        <label>Contact No.</label>

                                        <input type="text" name="contact-no." placeholder="Contact No."
                                            value={this.state.number} onChange={(event) => this.setState({ number: event.target.value })} />
                                        <span>{this.state.numberMessage}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ui large form">
                                <div class="fields">
                                    <div class="field text-field" style={{ width: 321, marginLeft: 45 }}>
                                        <label>First Name</label>
                                        <input type="text" placeholder="First Name" onChange={(event) => this.setState({ firstName: event.target.value })} />
                                        <span>{this.state.firstNameMessage}</span>
                                    </div>
                                    <div class="field text-field" style={{ width: 321, marginLeft: 50 }}>
                                        <label>Last Name</label>
                                        <input type="text" placeholder="Last Name" onChange={(event) => this.setState({ lastName: event.target.value })} />
                                        <span>{this.state.lastNameMessage}</span>
                                    </div>
                                </div>
                            </div><div class="ui large form">
                                <div class="fields">
                                    <div class="field text-field" style={{ width: 321, marginLeft: 45 }}>
                                        <label>Personal(Recovery) Email</label>
                                        <input type="text" placeholder="Email" onChange={(event) => this.setState({ recovEmail: event.target.value })} />
                                        <span>{this.state.recovEmailMessage}</span>
                                    </div><div class="field text-field" style={{ width: 321, marginLeft: 50 }}>
                                        <label>College Email</label>
                                        <input type="text" placeholder="College Email" onChange={(event) => this.setState({ collegeEmail: event.target.value })} />
                                        <span>{this.state.collegeEmailMessage}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ui large form" style={{ marginLeft: 5 }}>
                                <div class="fields">
                                    <div class="field  ">
                                        <label style={{ marginLeft: 43 }}>Role</label>
                                        <select style={{ width: 317, marginLeft: 39 }} class="ui fluid dropdown" onChange={(event) => this.setState({ role: event.target.value })}>
                                            <option value="">Role</option>
                                            <option value="Instructor">Instructor</option>
                                            <option value="Student">Student</option>
                                            <option value="Admin assistant">Admin assistant</option>
                                        </select>
                                        <span style={{ width: '100%', marginLeft: 45 }} >{this.state.roleMessage}</span>
                                    </div>
                                    <div class="field" style={{ marginRight: 400 }}>
                                        <label style={{ marginLeft: 50 }}>Department</label>
                                        <select style={{ width: 317, marginLeft: 45 }} class="ui fluid dropdown" onChange={(event) => this.setState({ department: event.target.value })}>
                                            <option value="">Departments</option>
                                            <option value="Business Studies">Business Studies</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Health Sciences">Health Sciences</option>
                                        </select>
                                        <span style={{ width: '100%', marginLeft: 45 }} >{this.state.departmentMessage}</span>
                                    </div>
                                </div>
                            </div>
                            <button class="uk-button register-btn" style={{ borderRadius: 20, marginLeft: '23%', marginTop: 30 }} onClick={() => this.handleCreate()}>Register</button>

                        </div>
                    </div>
                </div>

            </div>
        )
    },
});

export default Register;