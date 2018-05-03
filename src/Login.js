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

ReactRethinkdb.DefaultSession.connect({
    host: 'localhost',
    port: 8015,
    path: '/db',
    secure: false,
    db: 'capstone',
});

const Login = createReactClass({

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
            <div className='login-container' style={{
                backgroundImage: 'url(' + photo + ')',
                backgroundSize: 'cover',
                overflow: 'hidden',
            }}>
                <center>
                    <div class="uk-card uk-card-default uk-card-body uk-width-1-4@m  login-card" style={{ borderRadius: 20 }}>
                        <img src={logo} style={{ width: 200, height: 150 }} />
                        <hr />
                        <h3 class="login-title"><strong>Username.Password</strong></h3>

                        <div class="uk-margin">
                            <div class="uk-inline">
                                <span class="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
                                <input class="uk-input login-input" type="password" placeholder="username.password" />
                            </div>
                        </div>
                        <button class="uk-button login-btn">Login</button>
                        <br />
                        <br />
                        <a onClick={() => this.props.history.push("/forgot")} className="login-link">Forgot Your Password?</a>

                    </div>
                </center>

            </div>
        )
    },
});

export default Login;