import React, { Component } from 'react';
import userpic from './Images/cat.jpg'
import userpic1 from './Images/flower.jpg'
import ReactRethinkdb from 'react-rethinkdb'
import * as BS from 'react-bootstrap'
import { Accordion, Icon, Segment, Form, Button, Image, List, Transition, Dropdown, Menu } from 'semantic-ui-react'
import _ from 'lodash'
import createReactClass from 'create-react-class';
import { Rating } from 'semantic-ui-react'

let r = ReactRethinkdb.r

const NavStudent = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState(props, state) {
        return {
            activeIndex: 0,
            selectedcourses: []
        }
    },

  
    observe(props, state) {
        return {
            user: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(sessionStorage.getItem("user_id")),
                changes: true,
                initial: null,
            }),
        };
    },

    handleClick(e, titleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    },

    async handleUserStatus(id){
        let querySetOffline= r.table('users').get(id).update({status: "offline"})
        ReactRethinkdb.DefaultSession.runQuery(querySetOffline);
    },

    async handleClearMessages(id){
        let clearMessages = r.table('messages').get(id).update({ messages: [] });
        ReactRethinkdb.DefaultSession.runQuery(clearMessages);
    },


    handleLogout() {
        //handleUserStatus(sessionStorage.getItem("user_id"))
        //handleClearMessages(sessionStorage.getItem("user_id"))
        sessionStorage.clear()
        this.props.history.push("/")
    },

    render() {
 
        const { items, activeIndex } = this.state
        return (

            <div className="nav-instructor">

                <div class="item">
                    <div className="dd">
                        <div style={{ height: '100%', float: 'left', width: '50%' }} >

                            <div class="uk-inline-clip uk-transition-toggle user-profile img-box" tabIndex="0">
                                <a>
                                    <img src={userpic} style={{ width: 100, height: 100, borderRadius: 50 }}
                                    />
                                    <div class="uk-transition-slide-bottom uk-position-bottom uk-overlay uk-overlay-default" style={{ width: 100, height: 100, borderRadius: 50 }}>
                                        <div class="uk-position-center">
                                            <div class="uk-transition-slide-bottom-small"><h4 class="uk-margin-remove" onClick={() => this.handleLogout()}>Logout</h4></div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                        </div>
                        <div className='user-data'>
                            {this.data.user.value() && this.data.user.value().name}
                            <br />
                            {this.data.user.value() && this.data.user.value().collegeid}
                            <br />
                            <a uk-tooltip="title: My profile page; pos: bottom-right">
                                My Profile
                                            </a>
                            <br />
                        </div>
                    </div>
                </div>

                <br />
                <br /> <br /> <br /> <br />
                <hr />

                   
                <div>
                    <h4 className="nav-head"><input class="uk-checkbox" type="checkbox" /> My Term Courses</h4>
                    <Accordion inverted className="nav-box1">
                    {
                        this.data.user.value()
                        &&
                        this.data.user.value().courses
                        &&
                        this.data.user.value().courses.map(
                            (course) =>
                                 <p>{<Course id={course} handleSelectedCourse={(id) => this.props.handleSelectedCourse(id)} handleSelectSection={(id) => this.props.handleSelectSection(id)} />}</p>
                        )
                    }
                    </Accordion>
                </div>
                  

                <hr />
                <div>
                    <Accordion inverted>
                        <span className="nav-prev-checkbox"><input class="uk-checkbox" type="checkbox" /></span>
                        <Accordion.Title active={activeIndex === 6} index={6} onClick={this.handleClick} className="nav-term-course">
                            <span className="nav-prev"> My Previous Courses </span>
                            <span className="nav-dropdown-icon" > <Icon name='dropdown' /></span>
                        </Accordion.Title>


                        <Accordion.Content active={activeIndex === 6}>

                            <div class="ui search nav-search">
                                <div class="ui icon input">
                                    <input class="prompt" type="text" placeholder="Search..." />
                                    <i class="search icon"></i>
                                </div>
                                <div class="results"></div>
                            </div>
                            <div className="nav-box2">
                                <div className="prev-course">
                                    <span className="prev-checkbox"><input class="uk-checkbox" type="checkbox" />
                                    </span>
                                    <span className="nav-font" style={{ color: 'white' }}>
                                        CP4567
                                        </span>
                                </div>
                            </div>
                        </Accordion.Content>
                    </Accordion>
                </div>

            </div>



        );
    }
})

const Course = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],
    observe(props, state) {
        return {
            course: new ReactRethinkdb.QueryRequest({
                query: r.table('courses').get(this.props.id),
                changes: true,
                initial: null,
            }),
        };
    },

    getInitialState(props, state) {
        return {
            activeIndex: 0,
        }
    },

    handleClick(e, titleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    },

    handleSelectedCourse() {
        let checked = document.getElementById(this.data.course.value().id).checked
        this.setState({ list: checked })
    },
    

    render() {
        const { items, activeIndex } = this.state
        return (
            this.data.course.value()
            &&
            <div style={{marginBottom: -17}}>
            <span className="nav-course-checkbox"><input onClick={() => this.props.handleSelectedCourse(this.props.id)} class="Nav_check uk-checkbox" type="checkbox" /></span>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick} >
                 <span className="nav-font"> {this.data.course.value().name} </span>
            </Accordion.Title>
            </div>
        )
    },
});


export default NavStudent;