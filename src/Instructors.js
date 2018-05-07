
import React, { Component } from 'react';
// import testing from './testing';

import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import jwt from 'express-jwt'
import '../node_modules/uikit/dist/css/uikit.css';
import './App.css';
// import testing from './testing';
import userpic from './logo.png'

 import logo from './logo.png'

// import Workdetail from './workdetail';
// var noScroll = require ('no-scroll');
// noScroll.on();

// const users = ['ade']
// export default class InstructorHome extends Component {

//     state = { items: users.slice(0, 3) }



// render() {
    let r = ReactRethinkdb.r;

    const users = ['ade']
    const InstructorHome = createReactClass({

        mixins: [ReactRethinkdb.DefaultMixin],

        // export default class Details extends Component {
        getInitialState() {
            return {
                items: users.slice(0, 3)
            }; 
        },
        observe(props, state) {
            //this.setState({ messageToUser: "Invalid Input" })
            return {
                students: new ReactRethinkdb.QueryRequest({
                    query: r.table('users'), // RethinkDB query
                    changes: true,             // subscribe to realtime changefeed
                    initial: [],               // return [] while loading
                }),
            };
            //this.setState({ students: students})
        },
        handleAdd  () { 
            this.setState({ items: users.slice(0, this.state.items.length + 1) })
        },
        handleRemove  () { this.setState({ items: this.state.items.slice(0, -1) })},
        render() {
            const { items } = this.state

            return (

                <div style={{ backgroundColor: '#E9E9E9' }}>
                    <div class="ui left fixed vertical menu" style={{ width: '15%', float: 'left', height: '100vh', backgroundColor: '#76323f' }}>
                        <div class="item">
                            <div style={{ width: '100%', height: '30%' }}>
                                <div style={{ height: '100%', float: 'left', width: '50%' }} >

                                    <div class="uk-inline-clip uk-transition-toggle" tabindex="0" style={{ width: 100, height: 100 }}>
                                        <a>
                                            <img src={userpic} style={{ width: 100, height: 100, borderRadius: 50 }}
                                            />
                                            <div class="uk-transition-slide-bottom uk-position-bottom uk-overlay uk-overlay-default" style={{ width: 100, height: 100, borderRadius: 50 }}>
                                                <div class="uk-position-center">
                                                    <div class="uk-transition-slide-bottom-small"><h4 class="uk-margin-remove">Logout</h4></div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>

                                </div>
                                <div className='user-data'>
                                    <strong>
                                        Instructor Name
    
                                        <br />
                                        60071256
                                        <br />
                                        <a uk-tooltip="title: My profile page; pos: bottom-right">
                                            My Profile
                                        </a>
                                    </strong>
                                    <br />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div class="term-courses-nav">
                            <ul class="uk-nav-default uk-nav-parent-icon" uk-nav="multiple: true">
                                <li class="uk-active header nav-head">
                                    <a href="#">
                                        <h4 style={{ color: 'white' }}><input class="uk-checkbox" type="checkbox" /> My Term Courses</h4>
                                    </a></li>

                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /> </div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}> CP1820</a>
                                    <ul class="uk-nav-sub">
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 1 - Wagdi</a></li>
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" style={{ color: 'white' }} /> <img class="ui avatar image" src={userpic} /> Section 2 - Doug</a></li>
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 3 - Doug</a></li>
                                    </ul>
                                </li>
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /></div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}>  CP4567</a>
                                    <ul class="uk-nav-sub">
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 1 - Wagdi</a></li>
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 2 - Doug</a></li>
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 3 - Doug</a></li>
                                    </ul>

                                </li>
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /></div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}>  CP1502</a>
                                    <ul class="uk-nav-sub">
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 1 - Wagdi</a></li>
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 2 - Doug</a></li>
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 3 - Doug</a></li>
                                    </ul>
                                </li>
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /></div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}>  CP3450</a>
                                    <ul class="uk-nav-sub">
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 1 - Wagdi</a></li>
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 2 - Doug</a></li>
                                        <li><a href="#" className="nav-sections" style={{ color: 'white' }}> <input class="uk-checkbox" type="checkbox" /> <img class="ui avatar image" src={userpic} /> Section 3 - Doug</a></li>
                                    </ul>

                                </li>
                            </ul>
                        </div>
                        <hr />

                        <div class="term-courses-nav">
                            <li class="uk-active header nav-head">
                                <a href="#">
                                    <h4 style={{ color: 'white' }}><input class="uk-checkbox" type="checkbox" /> Previous Courses</h4>
                                </a>
                            </li>
                            <div class="ui category search  nav-search-box">
                                <div class="ui icon input">
                                    <input class="prompt" type="text" placeholder="Search..." />
                                    <i class="search icon"></i>
                                </div>
                                <div class="results"></div>
                            </div>
                            <ul class="uk-nav-default nav-prev-menu" uk-nav="multiple: true">
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /> </div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}> CP1820</a>

                                </li>
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /></div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}>  CP4567</a>

                                </li>
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /></div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}>  CP1502</a>

                                </li>
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /></div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}>  CP3450</a>

                                </li>
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /> </div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}> CP1820</a>

                                </li>
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /></div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}>  CP4567</a>

                                </li>
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /></div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}>  CP1502</a>

                                </li>
                                <li class="uk-parent">
                                    <div className="nav-course-checkbox"><input class="uk-checkbox" type="checkbox" /></div>
                                    <a href="#" className="nav-courses" style={{ color: 'white' }}>  CP3450</a>

                                </li>

                            </ul>

                        </div>
                        <hr />
                    </div>
                    <div class="uk-section uk-section-default" style={{ marginLeft: '9%', backgroundColor: '#E9E9E9' }}>
                        <div style={{ marginLeft: 123, backgroundColor: '#E9E9E9' }}>
                            <div class="logostyle">
                                <center >
                                    <img src={logo} class="imglogo" />
                                    <h2 class="ui header h-style" style={{ color: '#76323f', fontSize: '400%', marginTop: 2 }}>Instructor Home</h2>
                                </center>

                            </div>

                            <hr class="uk-divider-icon dividercss" />

                            <ul uk-accordion="multiple: true">

                                <li class="uk-open">
                                    <div class="xxx2"> </div>

                                    <div class="addwork">

                                        <div>
                                            <i class="plus square icon" uk-tooltip="Create New document" uk-toggle="target: #toggle-usage" ></i>


                                        </div>
                                    </div>

                                    <a class="uk-accordion-title" href="#"><strong>Course Works
    
                                </strong>  </a>
                                    <div class="uk-accordion-content">
                                        <table class="uk-table uk-table-hover uk-table-divider scroll">
                                            <thead >

                                                <tr >

                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Course</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Type</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Work</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Start</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Due</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>End</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Submit</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>New
                                                <div class="navcss">
                                                            <a href="#" uk-icon="chevron-left"></a>
                                                            <a href="#" uk-icon="chevron-right"></a>
                                                        </div>
                                                    </th>

                                                </tr>
                                            </thead>

                                            <tbody  >
                                                <tr>
                                                    <td style={{ textAlign: 'center' }} class="collapsing" >
                                                        <a class="uk-link-heading" href="" style={{ color: "red", fontWeight: ' bold', fontSize: 15 }}>CP1880-1</a>
                                                    </td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Lab</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>CIS</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Sep 05</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>-</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Dec 07</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>5</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>1</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'center' }} class="collapsing">
                                                        <a class="uk-link-heading" href="" style={{ color: "red", fontWeight: ' bold', fontSize: 15 }}>CP1880-1</a>
                                                    </td>

                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Lab</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Lab 01</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Dec 06</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>-</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Dec 07</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>10</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>10</td>


                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <a class="uk-link-heading" href="" style={{ color: "red", fontWeight: ' bold', fontSize: 15 }}>CP1880-1</a>
                                                    </td>

                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Quiz</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Quiz 01</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}> Sep 10</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Sep 10</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Sep 10</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}> 10</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>10</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'center' }} class="collapsing" >
                                                        <a class="uk-link-heading" href="" style={{ color: "green", fontWeight: ' bold', fontSize: 15 }}>CP3700-1</a>
                                                    </td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Lab</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>lab 02</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Sep 7</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Sep 8</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Sep 8</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>8</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>7</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                    {/* </div> */}
                                </li>
                                <li class="uk-open">
                                    <div class="xxx"></div>
                                    <a class="uk-accordion-title checkbx" href="#" ><strong> Work Submitted  </strong>  </a>

                                    <div class="uk-accordion-content">

                                        <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                                            <label><input class="uk-checkbox checkbx" type="checkbox" /> Show All Students</label>
                                        </div>

                                        <table class="uk-table uk-table-hover uk-table-divider scroll1">
                                            <thead>
                                                <tr>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Name</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>#</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Time</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Files</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Work Grade</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Course Grade</th>
                                                    <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>GPA
                                                <div class="navcss">
                                                            <a href="#" uk-icon="chevron-left"></a>
                                                            <a href="#" uk-icon="chevron-right"></a>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr >
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Aya</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>6005</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Sep 10 16:20</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>5</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>30 60%</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>60/60 100%</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>2.3</td>


                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Maya</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>6002</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Sep 10 15:20</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>1</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>40 60%</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>60/60 100%</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>4.0</td>

                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Zara</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>6010</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Sep 10 15:25</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>3</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>0 0%</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>0/60 0%</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>3.3</td>

                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Farah</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>6025</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>Sep 10 16:00</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>3</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>.5 75%</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>45/60 75%</td>
                                                    <td style={{ textAlign: 'center', fontSize: 15.5 }}>2.4</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </li>
                            </ul>

                            <div id="toggle-usage">
                                <div style={{ marginLeft: 10, marginTop: 100 }} >


                                    <div class="ui form" >


                                        <h3 class="ui dividing header">

                                            <div class="inline fields">
                                                <div class="eleven fields" style={{ marginRight: "5vh" }}>
                                                    <ths>  Work Detail</ths>
                                                    <ths>  CP1818</ths>
                                                    <div class="field">

                                                        <input type="text" placeholder="Task" />
                                                    </div>
                                                    <div class="field">

                                                        <input type="text" placeholder="Start Date " />
                                                    </div>
                                                    <div class="field">

                                                        <input type="text" placeholder="Due Date" />
                                                    </div>
                                                    <div class="field">

                                                        <input type="text" placeholder="End Date" />
                                                    </div>
                                                </div>

                                            </div>
                                        </h3>


                                        <div class="field">
                                            <div class="inline fields">
                                                <div class="field">
                                                    <ths style={{ marginLeft: '5vh' }}> Q01:</ths>
                                                    <ths style={{ marginLeft: '0.5vh' }} >   Write a Java program that...</ths>
                                                </div>
                                            </div>
                                            <div class="inline fields">
                                                <div class="field">
                                                    <ths> <a style={{ marginLeft: '10vh' }}>q1.java</a></ths>
                                                </div>
                                            </div>
                                            <div class="inline fields">
                                                <div class="field">
                                                    <ths> <a style={{ marginLeft: '10vh' }}>q1.html</a></ths>
                                                </div>
                                            </div>

                                            <div class="ui form">
                                                <div class="inline fields">
                                                    <label style={{ marginRight: "3.5%" }}>Grade: </label>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>0</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>1</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" checked="checked" />
                                                            <label>2</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>3</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>4</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="inline fields">
                                                <ths> Feedback:
                                           </ths>
                                                <textarea placeholder="Q01 Feedback" rows="1" style={{ width: '50vh', height: '3vh' }}></textarea>
                                            </div>


                                            <div class="inline fields">
                                                <div class="field">
                                                    <ths style={{ marginLeft: '5vh' }}>Q02:</ths>
                                                    <ths style={{ marginLeft: '0.25vh' }} > What is the....</ths>

                                                </div>
                                            </div>
                                            <div class="inline fields">
                                                <div class="field">
                                                    <ths style={{ marginLeft: '2vh' }}>Answer:</ths>
                                                    <input type="text" placeholder="it depends on the value of loop counters in the calling" disabled style={{ width: '50vh', marginLeft: '0.5vh' }} />
                                                </div>
                                            </div>


                                            <div class="ui form">
                                                <div class="inline fields">
                                                    <label style={{ marginRight: "3.5%" }}>Grade: </label>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>0</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>1</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" checked="checked" />
                                                            <label>2</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>3</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>4</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="inline fields">
                                                <ths> Feedback:
                                                   </ths>
                                                <textarea placeholder="Q02 Feedback" rows="1" style={{ width: '50vh', height: '3vh' }}></textarea>

                                            </div>


                                            <div class="inline fields">
                                                <div class="field">
                                                    <ths style={{ marginLeft: '5vh' }}>Q03:</ths>
                                                    <ths style={{ marginLeft: '0.5vh' }} >Write a Python program that...</ths>

                                                </div>
                                            </div>
                                            <div class="inline fields">
                                                <div class="field">
                                                    <ths> <a style={{ marginLeft: '10vh' }}> q3.py</a></ths>
                                                </div>
                                            </div>

                                            <div class="ui form">
                                                <div class="inline fields">
                                                    <label style={{ marginRight: "3.5%" }}>Grade: </label>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" checked="checked" />
                                                            <label>0</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>1</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>2</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>3</label>
                                                        </div>
                                                    </div>
                                                    <div class="field">
                                                        <div class="ui radio checkbox">
                                                            <input type="radio" name="frequency" />
                                                            <label>4</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="inline fields">
                                                <ths> Feedback:
                                                               </ths>
                                                <textarea placeholder="Q03 Feedback" rows="1" style={{ width: '50vh', height: '3vh' }}></textarea>
                                            </div>
                                            <h3 class="ui dividing header"></h3>

                                            <h3> Feedback: </h3>

                                            <textarea placeholder="General Feedback" rows="1" style={{ width: '60vh', marginLeft: "1%" }}></textarea>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    {/* {
                    this.state.select
                        ?
                        <div>
                            <Workdetail user={this.state.select} />
                            <LikedList user={this.state.select} />
                        </div>
                        :
                        <div></div>
                } */}
                  </div>
 )
},
});

export default InstructorHome;
// {/* <a class="uk-button uk-button-primary" href="#target" uk-scroll>Scroll down</a> */ }