import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import bcrypt from "bcryptjs"

let r = ReactRethinkdb.r;

// Open a react-rethinkdb session (a WebSocket connection to the server)
// ReactRethinkdb.DefaultSession.connect({
//   host: 'localhost', // hostname of the websocket server
//   port: 8015,        // port number of the websocket server
//   path: '/db',       // HTTP path to websocket route
//   secure: false,     // set true to use secure TLS websockets
//   db: 'capstone',    // default database, passed to rethinkdb.connect
// });

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

    async  observe(props, state) {

        let query = window.location.href
        let username = query.split("/")[5]
        let key = query.split("/")[6]

         return {
            user: await new ReactRethinkdb.QueryRequest({
                query: r.table('users'),
                changes: true,
                initial: [],
            }),
        };
        if (!this.data.user.value() || !username || this.data.user.value().key != key)
        {
            await this.props.history.push("/auth/login")
        }
        else{
            await this.setState({
                user: this.data.user.value()
            })
        }

    },

     handleReset () {
        let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        if (this.state.password.trim() != '' && this.state.confirmPassword.trim() != '' && this.state.password == this.state.confirmPassword && strongRegex.test(this.state.password)) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(this.state.password, salt, async (err, hash) => {
                    let user = this.state.user
                    user.password = hash
                    user.key = ''
                    let replaceQuery = r.table("users").get(user.id).replace(user)
                    await ReactRethinkdb.DefaultSession.runQuery(replaceQuery)
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
            <div>
                <input type="text" value={this.state.password} placeholder="Enter New Password" onChange={
                    (event) => this.setState({ password: event.target.value, error: '' })} />
                <input type="text" value={this.state.confirmPassword} placeholder="Confirm Password" onChange={
                    (event) => this.setState({ confirmPassword: event.target.value, error: '' })} />
                <button onClick={() => this.handleReset()}>Reset</button>
                <p>{this.state.error}</p>
            </div>
        )
    },
});

export default ResetPassword;