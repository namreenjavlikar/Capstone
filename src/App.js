import React from 'react'
import ReactDOM from 'react-dom'
import ReactRethinkdb from 'react-rethinkdb'
import createReactClass from 'create-react-class'
import Login from './Login'
import Register from './Register'
import * as Questions from './Questions'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

let r = ReactRethinkdb.r

const App = createReactClass({

  render() {
    return <Router>
      <div>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/questions" component={Questions.Create} />
        <Route path="/allquestions" component={Questions.All} />
      </div>
    </Router>
  },
})

export default App