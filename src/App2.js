import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
let r = ReactRethinkdb.r;

// Open a react-rethinkdb session (a WebSocket connection to the server)
ReactRethinkdb.DefaultSession.connect({
  host: 'localhost', // hostname of the websocket server
  port: 8015,        // port number of the websocket server
  path: '/db',       // HTTP path to websocket route
  secure: false,     // set true to use secure TLS websockets
  db: 'capstonedemo',    // default database, passed to rethinkdb.connect
});

const App = createReactClass({

  mixins: [ReactRethinkdb.DefaultMixin],

  getInitialState() {
    return {
      name: "",
      testing: "Khalid"
    };
  },

  observe(props, state) {
    return {
      users: new ReactRethinkdb.QueryRequest({
        query: r.table('users'),
        changes: true,
        initial: [],
      }),
      pets: new ReactRethinkdb.QueryRequest({
        query: r.table('testing'),
        changes: true,
        initial: [],
      }),
    };
  },

  handleSubmit() {
    let query = r.table('testing').get("44cfd9cf-1510-4977-837f-68b3cba6d52a").update({ name: this.state.name, testing: "hello" });
    ReactRethinkdb.DefaultSession.runQuery(query);
    this.setState({ name: '' })
  },

  render() {
    return (
      <div>
        <input type="text" value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })}/>
        <button onClick={() => this.handleSubmit()}>Submit</button>
        {
          this.data.users.value().map((x) => {
            return <div key={x.id}>{x.name}</div>;
          })
        }
        <br/>
        <hr/>
        {
          this.data.pets.value().map((x) => {
            return <div key={x.id}>
                {x.name} {x.address} {x.testing}
                {/* Pets: {x.pets.map((y) => y.name).join(',')} */}
            </div>;
          })
        }
      </div>
    )
  },
});

export default App;