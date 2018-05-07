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
import ForgotPassword from './ForgotPassword'
import * as Courses from './Courses'
import * as Instructors from './Instructors'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom"
import * as Contacts  from './Contacts'
import * as Messages  from './Messages'

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
        <Route path="/forgot" component={ForgotPassword} />
        <Route path="/register" component={Register} />
        <Route path="/reset/:loginId/:key" component={ResetPassword} />
        <Route path="/questions" component={Questions.Create} />
        <Route path="/allquestions" component={Questions.All} />
        <Route path="/allcourses" component={Courses.All} />
        <Route path="/createcourse" component={Courses.Create} />
        <Route path="/exams/:id" component={Exams.Details} />
        <Route path="/Instructors" component={Instructors} />

        <Route path="/Contacts" component={Contacts.All} />
        <Route path="/AddContacts" component={Contacts.Create} />
        <Route path="/Messages" component={Messages.All} />

      </div>
    </Router>
  },
})

export default App