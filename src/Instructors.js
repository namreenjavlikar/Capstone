import React, { Component } from 'react';
// import testing from './testing';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import jwt from 'express-jwt'
import '../node_modules/uikit/dist/css/uikit.css';
import './App.css';
// import Workdetail from './workdetail';
// var noScroll = require ('no-scroll');
//  

let r = ReactRethinkdb.r;


const Instructors = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

// export default class Details extends Component {
    getInitialState() {
        return {
            select: null
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
    render() {

        return (

            <div style={{ backgroundColor: '#E9E9E9' }}>
                <div class="ui left fixed vertical menu" style={{ float: 'Left' }}>
                    <div class="item">
                        <img class="ui mini image" src="../images/logo.png" />
                    </div>
                    <a class="item">Instructor List</a>
                    <a class="item">Student List</a>
                    <a class="item">Sign-in</a>
                </div>

                <div class="uk-section uk-section-default" style={{ marginLeft: 20, backgroundColor: '#E9E9E9', marginRight: 20 }}>
                    <div style={{ marginLeft: 123, backgroundColor: '#E9E9E9' }}>
                        <center>
                            <h1 class="uk-heading">College of the North Atlantic - Qatar</h1>
                        </center>
                        <hr class="uk-divider-icon" />

                        <ul uk-accordion="multiple: true">

                            <li class="uk-open">
                                <div class="addwork">
                                    <i class="plus square icon" uk-tooltip="Create New Work" ></i>
                                    {/* <button  variant="raised" color="primary"  size="small" onClick={() => this.handleSelect(user)} uk-tooltip="Create Document" >Create</button> */}

                                </div>
                                <div class="addwork2">
                                    <div class="ui right floated pagination menu">
                                        <a class="icon item">
                                            <i class="left chevron icon"></i>
                                        </a>
                                        <a class="icon item">
                                            <i class="right chevron icon"></i>
                                        </a>
                                    </div>
                                </div>
                                <a class="uk-accordion-title" href="#"><strong>Course Works


                                </strong>  </a>

                                <div class="uk-accordion-content">

                                    <table class="uk-table uk-table-hover uk-table-divider " style={{ float: 'left' }}>

                                        <thead >

                                            <tr >

                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Course</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Type</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Work</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Start</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Due</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>End</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Submit</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>New</th>


                                            </tr>

                                        </thead>

                                        <tbody>
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
                            </li>
                            <li class="uk-open">
                                <div class="navstyle">
                                    <div class="ui right floated pagination menu">
                                 
                                        <a class="icon item">
                                            <i class="left chevron icon"></i> 
                                        </a>
                                      
                                        <a class="icon item">
                                            <i class="right chevron icon"></i>
                                        </a>
                                        
                                    </div>
                                </div>
                                <a class="uk-accordion-title" href="#"><strong> Work Submitted  </strong>  </a>
                                <div class="uk-accordion-content">
                                    <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                                        <label><input class="uk-checkbox" type="checkbox" /> Show All Students</label>
                                    </div>
                                    <table class="uk-table uk-table-hover uk-table-divider">
                                        <thead>
                                            <tr>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Name</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>#</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Time</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Files</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Work Grade</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>Course Grade</th>
                                                <th style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 }}>GPA</th>


                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
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

export default Instructors;