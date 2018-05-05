import React from 'react'
import ReactDOM from 'react-dom'
import ReactRethinkdb from 'react-rethinkdb'
import createReactClass from 'create-react-class'
import Login from './Login'
import Register from './Register'
import * as Questions from './Questions'
import * as Exams from './Exams'
import ResetPassword from './ResetPassword'
import SyntaxHighlightTest from './SyntaxHighlightTest'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom"

let r = ReactRethinkdb.r

ReactRethinkdb.DefaultSession.connect({
  host: 'localhost',
  port: 8015,
  path: '/db',
  secure: false,
  db: 'capstone',
});

const App = createReactClass({
  render() {
    return <Router>
      <div>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/questions" component={Questions.Create} />
        <Route path="/allquestions" component={Questions.All} />
        <Route path="/exams/:id" component={Exams.Details} />
      </div>
    </Router>
  },
})

export default App