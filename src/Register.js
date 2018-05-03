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
let noScroll = require('no-scroll')
noScroll.on();

// ReactRethinkdb.DefaultSession.connect({
//     host: 'localhost',
//     port: 8015,
//     path: '/db',
//     secure: false,
//     db: 'capstone',
// });

const Register = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            credentials: '',
            messageToUser: '',
            showcredentials: false
        };
    },

    observe(props, state) {
        return {
        };
    },

    handleLogin() {
        let field = this.state.credentials;
        const specialCharacter = "."
        let splitIndex = -1
        for (let i = 0; i < field.length; i++) {
            let c = field.charAt(i)
            if (c === specialCharacter) {
                splitIndex = i
                break
            }
        }
        let username = field.substring(0, splitIndex).trim()
        let password = field.substring(splitIndex + 1).trim()

        if (username === "" || password === "") {
            this.setState({ messageToUser: "Invalid Input" })
        }
        else {
            let result = null;
            let query = r.table('users').get(username);
            ReactRethinkdb.DefaultSession.runQuery(query).then(user => {
                console.log("user", user)
                if (user) {
                    bcrypt.compare(password, user.password, (err, check) => {
                        if (check) {
                            result = { user, token: sign(user, secret) }
                            console.log('login result', result)
                            sessionStorage.setItem("token", result.token)
                            sessionStorage.setItem("user_id", result.user.id)
                            sessionStorage.setItem("role", result.user.role)
                            this.setState({ messageToUser: "" })
                        }
                        else {
                            this.setState({ messageToUser: "Invalid Input" })
                        }
                    })

                    //For now my goal is to be able to create an exam, but this 
                    //should be in a "Home.js" file that checks who is logged in and 
                    //depending on the role it will redirect the user to whatever 
                    //homepage they can are supposed to be in
                    //if (result.user.role === "Instructor")
                    //    this.props.history.push("/Instructor")
                }
                else {
                    this.setState({ messageToUser: "Invalid Input" })
                }
            });
        }
    },


    render() {
        return (
            <div>
            <div style={{ marginLeft: 120, marginRight: 5 }}>
               <div class="ui raised very padded text container segment " style={{ height: '100vh' }} class="register-container">
                   <center>
                   <img src={logo} style={{ width: 70, height: 70, marginTop:20}} />
                       <h1 class="ui  header" style={{color:'#76323f', fontSize: '400%', marginTop:2}}>Register </h1>
                   </center>
                   <hr class="uk-divider-icon" />
                   <center>
                   <div class="ui form" style={{ marginLeft: 30 }} >
                       <div class="four wide field">
                           <label style={{ float: "left", fontSize:18 }}>College ID</label>
                           <input type="text" name="college-id" placeholder="College ID" />
                       </div>
                       <div class="four wide field">
                           <label style={{ float: "left", fontSize:18 }}>Login ID</label>
                           <input type="text" name="login-id" placeholder="Login ID" />

                       </div>
                       <div class="four wide field">
                           <label style={{ float: "left" , fontSize:18}}>Name</label>
                           <input type="text" name="name" placeholder="Name" />
                       </div>

                       <div class="four wide field">
                           <label style={{ float: "left", fontSize:18 }}>Contact No.</label>
                           <input type="text" name="contact-no." placeholder="Contact No." />
                       </div>

                       <div class="four wide field">
                           <label style={{ float: "left", fontSize:18 }}>Personal(Recovery) Email</label>
                           <input type="text" name="personal-email" placeholder="Email" />
                       </div>

                       <div class="four wide field">
                           <label style={{ float: "left", fontSize:18 }}>College Email</label>
                           <input type="text" name="college-email" placeholder="Email" />
                       </div>
                       <div class="four wide field">
                           <label style={{ float: "left", fontSize:18 }}>Role</label>
                           <select class="ui search dropdown">
                               <option value="1">Role</option>
                               <option value="2">Instructor</option>
                               <option value="3">Student</option>
                               <option value="4">Admin assistant</option>
                           </select>
                       </div>
                       <div class="four wide field">
                           <label style={{ float: "left" , fontSize:18}}>Departments</label>
                           <select class="ui search dropdown">
                               <option value="1">Departments</option>
                               <option value="2">Business Studies</option>
                               <option value="3">Engineering</option>
                               <option value="4">Information Technology</option>
                               <option value="4">Health Sciences</option>
                           </select>
                       </div>
                       <button class="uk-button register-btn" style={{borderRadius:20}}onClick={() => this.handle()}>Register</button>
                       
                   </div>
                   </center>
               </div>
           </div>
       </div>
        )
    },
});

export default Register;