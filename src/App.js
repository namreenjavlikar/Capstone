import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import Login from './Login';
import * as Questions from './Questions'

let r = ReactRethinkdb.r;

const App = createReactClass({

  render() {
    return <Login/>
  },

});

export default App;