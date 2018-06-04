import React from 'react'
import ReactDOM from 'react-dom'
import ReactRethinkdb from 'react-rethinkdb'
import createReactClass from 'create-react-class'
import jwt from 'express-jwt'
import '../node_modules/uikit/dist/css/uikit.css'
import './App.css'
import photo from './photo.png'
import logo from './logo.png'
import { sign } from 'jsonwebtoken'
import bcrypt from "bcryptjs"

let r = ReactRethinkdb.r;
const secret = 'abc'

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

    async handleUserStatus(id) {
        let querySetOnline = r.table('users').get(id).update({ status: "online" })
        ReactRethinkdb.DefaultSession.runQuery(querySetOnline);
    },

    async handleLogin() {
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
        console.log(username)
        if (username === "" || password === "") {
            this.setState({ messageToUser: "Invalid Input" })
        }
        else {
            let result = null;
            let query = r.table('users').get(username)
            ReactRethinkdb.DefaultSession.runQuery(query).then(
                (res) => {
                    console.log(res)
                    let user = res
                    if (user.password != "") {
                        console.log("USER", user)
                        if (user) {
                            bcrypt.compare(password, user.password, (err, check) => {
                                if (check) {
                                    result = { user, token: sign(user, secret) }
                                    console.log('Success')
                                    sessionStorage.setItem("token", result.token)
                                    sessionStorage.setItem("user_id", result.user.id)
                                    sessionStorage.setItem("user_name", result.user.name)
                                    sessionStorage.setItem("role", result.user.role)
                                    console.log(sessionStorage.getItem("token"))
                                    console.log(sessionStorage.getItem("user_id"))
                                    console.log(sessionStorage.getItem("role"))
                                    //handleUserStatus(result.user.id)
                                    this.setState({ messageToUser: "" })
                                    if (sessionStorage.getItem("role") === "Instructor") {
                                        this.props.history.push("instructors")
                                    }
                                    if (sessionStorage.getItem("role") === "Student") {
                                        this.props.history.push("studenthome")
                                    }
                                }
                                else {
                                    this.setState({ messageToUser: "Invalid Input" })
                                }
                            })
                        }
                        else {
                            this.setState({ messageToUser: "Invalid Input" })
                        }
                    }
                    else {
                        this.setState({ messageToUser: "Activate your account to login" })
                    }
                })

        }
    },

    render() {
        return (
            <div className='login-container' style={{
                backgroundImage: 'url(' + photo + ')',
                backgroundSize: 'cover',
                overflow: 'hidden', height: '100vh'
            }}>
                <center>
                    <div class="login_card uk-card uk-card-default uk-card-body uk-width-1-4@m  login-card" style={{ borderRadius: 20, marginTop: 200 }}>
                        <img src={logo} style={{ width: 200, height: 150 }} />
                        <hr />
                        <h3 class="login-title"><strong>Username.Password</strong></h3>

                        {/* <div class="uk-margin">
                            <div class="uk-inline">
                                <input class="uk-input login-input" type="password" placeholder="username.password" 
                                value={this.state.credentials} onChange={(event) => this.setState({credentials: event.target.value})} />
                                
                            </div>
                        </div> */}
                        <div class="uk-margin">
                            <div className="ui icon input">
                                <input
                                    type={this.state.showcredentials ? "text" : "password"}
                                    placeholder="username.password"
                                    value={this.state.credentials}
                                    onChange={e => this.setState({ credentials: e.target.value, messageToUser: '' })} />
                                <i className={this.state.showcredentials ? "unhide link icon" : "unhide link icon"} style={{ fontSize: 22 }}
                                    onClick={() => { this.setState({ showcredentials: !this.state.showcredentials }) }} ></i>
                            </div>
                        </div>
                        <p style={{ color: 'white' }}>{this.state.messageToUser}</p>
                        <button class="uk-button login-btn" onClick={this.handleLogin}>Login</button>
                        <br />
                        <br />
                        <br/>
                        <a onClick={() => this.props.history.push("/forgot")} className="login-link"><strong>Forgot Your Password?</strong></a>
                    </div>
                </center>

            </div>
        )
    },
});

export default Login;