import React from 'react'
import ReactDOM from 'react-dom'
import ReactRethinkdb from 'react-rethinkdb'
import createReactClass from 'create-react-class'
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import * as Questions from './Questions'
import ResetPassword from './ResetPassword'
import SyntaxHighlightTest from './SyntaxHighlightTest'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom"


let r = ReactRethinkdb.r

const App = createReactClass({

  
  render() {
    return (
      <Router>
        <div>
          <Route path="/login" component={Login} />
          <Route path="/forgot" component={ForgotPassword} />
          <Route path="/reset/:username/:key" component={ResetPassword} />

          <Route path="/test1" component={SyntaxHighlightTest} />
        </div>
      </Router>
    )
  },
})

export default App