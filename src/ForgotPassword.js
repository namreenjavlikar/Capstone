import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import '../node_modules/uikit/dist/css/uikit.css';
import './App.css';
import photo from './photo.png';
import logo from './logo.png';
//import noScroll from 'no-scroll'
// var noScroll = require('no-scroll');
// noScroll.on();
let r = ReactRethinkdb.r;

// //Open a react-rethinkdb session (a WebSocket connection to the server)
// ReactRethinkdb.DefaultSession.connect({
//   host: 'localhost', // hostname of the websocket server
//   port: 8015,        // port number of the websocket server
//   path: '/db',       // HTTP path to websocket route
//   secure: false,     // set true to use secure TLS websockets
//   db: 'capstonedemo',    // default database, passed to rethinkdb.connect
// });

const ForgotPassword = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            email: '',
            errorMessage: ''
        };
    },

    observe(props, state) {
        return {
            users: new ReactRethinkdb.QueryRequest({
                query: r.table('users'),
                changes: true,
                initial: [],
            }),
        };
    },

    async sendEmail() {
        //find user with this specific email
        let query = r.table('users').filter({ recovEmail: this.state.email })

        let user = {}
        await ReactRethinkdb.DefaultSession.runQuery(query).then(
            (res) => {
                res.toArray(function (err, results) {
                    console.log(results);
                    user = results
                });
            })

        console.log("user ", user[0])
        let emailCheck = /.+\@.+\..+/
        if (user[0].recovEmail === this.state.email && emailCheck.test(this.state.email)) {
            let key = Math.random().toString(36).substring(7)
            user[0].key = key
            let replaceQuery = r.table("users").get(user[0].id).replace(user[0])
            await ReactRethinkdb.DefaultSession.runQuery(replaceQuery)

            //send the email
            const response = await fetch("http://localhost:3001/api/resetpassword/" + user[0].recovEmail + "/" + key + "/" + user[0].id)
            try {
                const json = await response.json()
                return json
            } catch (ex) {
                return null
            }
        }
        else {
            if (!emailCheck.test(this.state.email))
                this.setState({ errorMessage: "Enter a valid email address" })
            else if (user.email === this.state.email)
                this.setState({ errorMessage: "Not a valid user" })

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
                    <div className="uk-card uk-card-default uk-card-body uk-width-1-4@m  login-card" style={{ borderRadius: 20, marginTop: 200 }}>
                        <img src={logo} style={{ width: 200, height: 150 }} />
                        <hr />
                        <h3 className="reset-title2"><strong>Enter your email to reset password</strong></h3>
                        <div className="uk-margin"  >
                            <div className="uk-inline reset-input">
                                <input className="uk-input reset-input" type="email" value={this.state.email} placeholder="Enter Your Email" onChange={
                                    (event) => this.setState({ email: event.target.value, error: '' })} />
                            </div>
                            <p>{this.state.errorMessage}</p>
                        </div>
                        <button className="uk-button reset-btn" onClick={() => this.sendEmail()}>Send email</button>

                    </div>
                </center>
            </div>
        )
    },
});

export default ForgotPassword;