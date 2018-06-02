import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import bcrypt from "bcryptjs"

import '../node_modules/uikit/dist/css/uikit.css';
import './App.css';
import photo from './photo.png';
import logo from './logo.png'

let r = ReactRethinkdb.r;

const ResetPassword = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            password: '',
            confirmPassword: '',
            user: null,
            error: ''
        };
    },

    async componentDidMount() {
        let urlQuery = window.location.href
        let username = urlQuery.split("/")[4]
        let key = urlQuery.split("/")[5]

        let query = r.table('users').filter({ id: username })

        let user = {}
        await ReactRethinkdb.DefaultSession.runQuery(query).then(
            (res) => {
                res.toArray((err, results) => {
                    console.log("LOOP", results);
                    user = results
                });
            })
        console.log("user ", user[0])

        if (!user[0] || !username || user[0].key != key) {
            await this.props.history.push("/")
        }
        else {
            await this.setState({
                user: user[0]
            })
        }
    },

    async observe(props, state) {
        return {}
    },

    handleReset() {
        let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        if (this.state.password.trim() != '' && this.state.confirmPassword.trim() != '' && this.state.password == this.state.confirmPassword && strongRegex.test(this.state.password)) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(this.state.password, salt, async (err, hash) => {
                    let user = this.state.user
                    user.password = hash
                    user.key = ''
                    let replaceQuery = r.table("users").get(user.id).replace(user)
                    await ReactRethinkdb.DefaultSession.runQuery(replaceQuery)
                    await this.props.history.push("/login")
                })
            })
        } else {
            if (this.state.password.trim() == '' || this.state.confirmPassword.trim() == '')
                this.setState({ error: "Error Empty Field(s)" })
            else if (!strongRegex.test(this.state.password))
                this.setState({ error: "Error not following the validation rule" })
            else if (this.state.password != this.state.confirmPassword)
                this.setState({ error: "Error both password doesn't match" })
        }
    },

    render() {
        return (
            <div className='login-container' style={{
                backgroundImage: 'url(' + photo + ')',
                backgroundSize: 'cover',
                overflow: 'hidden',
                height: '100vh'
            }}>
                <center>
                    <div class="uk-card uk-card-default uk-card-body uk-width-1-4@m  login-card" style={{ borderRadius: 20, marginTop: 200 }}>
                        <img src={logo} style={{ width: 200, height: 150 }} />
                        <hr />
                        <h3 class="login-title"><strong>Reset Password</strong></h3>
                        <div class="uk-margin">
                            <div class="uk-inline">
                                <input class="uk-input reenter-input" type="password" placeholder="New Password" onChange={
                                    (event) => this.setState({ password: event.target.value, error: '' })} />
                                <br />
                                <br />
                                <input class="uk-input reenter-input" type="password" placeholder="Confirm Password" onChange={
                                    (event) => this.setState({ confirmPassword: event.target.value, error: '' })} />
                                <p>{this.state.error}</p>
                            </div>
                        </div>
                        <button class="uk-button reenter-btn" onClick={this.handleReset}>Reset</button>
                    </div>
                </center>

            </div>
        )
    },
});

export default ResetPassword;