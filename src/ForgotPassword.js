import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
let r = ReactRethinkdb.r;

// Open a react-rethinkdb session (a WebSocket connection to the server)
// ReactRethinkdb.DefaultSession.connect({
//   host: 'localhost', // hostname of the websocket server
//   port: 8015,        // port number of the websocket server
//   path: '/db',       // HTTP path to websocket route
//   secure: false,     // set true to use secure TLS websockets
//   db: 'capstone',    // default database, passed to rethinkdb.connect
// });

const App = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            email: '60084089@cna-qatar.edu.qa',
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
        let query = r.table('users').filter({ email:this.state.email })

        let user = {}
        await ReactRethinkdb.DefaultSession.runQuery(query).then(
            (res) => {
                res.toArray(function(err, results) {
                    console.log(results);
                   user = results
                });
            })

        console.log("user ", user[0])
        let emailCheck = /.+\@.+\..+/
        if (user[0].email === this.state.email && emailCheck.test(this.state.email)) {
            let key = Math.random().toString(36).substring(7)
            user[0].key = key
            let replaceQuery = r.table("users").get(user[0].id).replace(user[0])
            await ReactRethinkdb.DefaultSession.runQuery(replaceQuery)

            //send the email
            const response = await fetch('http://localhost:3000/api/users/resetpassword/')
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
            <div>
                <input type="email" value={this.state.email} placeholder="Enter Your Email" onChange={
                    (event) => this.setState({ email: event.target.value, error: '' })} />
                <button onClick={() => this.sendEmail()}>Send email</button>

                <p>{this.state.errorMessage}</p>
            </div>
        )
    },
});

export default App;