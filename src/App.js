import React from 'react'
import ReactDOM from 'react-dom'
import ReactRethinkdb from 'react-rethinkdb'
import createReactClass from 'create-react-class'
import Login from './Login'
import Register from './Register'
import * as Documents from './Documents'
import * as Documents2 from './Documents2'
import * as Exams from './Exams'
import ResetPassword from './ResetPassword'
import SyntaxHighlightTest from './SyntaxHighlightTest'
import ForgotPassword from './ForgotPassword'
import * as Courses from './Courses'
import * as Students from './Students'
import InstructorsHome from './InstructorsHome'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom"
import * as Contacts  from './Contacts'
import * as Messages  from './Messages'
import EditDocument from './EditDocument'
import Question from './Question'
import StudentHome from './StudentHome'
import Chat from './Chat'
let r = ReactRethinkdb.r

ReactRethinkdb.DefaultSession.connect({
  host: 'localhost',
  port: 8015,
  path: '/db',
  secure: false,
  db: 'capstonedemo',
});

const App = createReactClass({
  render() {
    return <Router>
      <div>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/forgot" component={ForgotPassword} />
        <Route path="/register" component={Register} />
        <Route path="/reset/:id/:key" component={ResetPassword} />
        <Route path="/allcourses" component={Courses.All} />
        <Route path="/createcourse" component={Courses.Create} />
        <Route path="/documents2/:id" component={Documents2.Details} />
        <Route exact path="/documents/create" component={Documents.Create} />
        <Route exact path="/documents/:id" component={EditDocument} />
        <Route path="/enroll" component={Students.Enroll} />
        <Route path="/studenthome" component={StudentHome} />
        <Route path="/exams/:id" component={Exams.Details} />
        <Route path="/instructors" component={InstructorsHome} />
        {/* <Route path="/Contacts" component={Contacts.All} />
        <Route path="/AddContacts" component={Contacts.Create} /> */}
        {/* <Route path="/Messages" component={Messages.All} /> */}
        <Route path="/Groups" component={Contacts.Groups} />
        <Route path="/Contacts" component={Contacts.Single} />
        <Route path="/Messages/:id" component={Messages.Single} />
        <Route path="/GroupMessages/:id" component={Messages.Group} />
        <Route path="/Chat/" component={Chat} />

      </div>
    </Router>
  },
})

export default App