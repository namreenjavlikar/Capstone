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

const NavInstructor = createReactClass({

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

    handleLogout() {
        sessionStorage.clear()
        this.props.history.push("/")
    },

    render() {
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", sessionStorage.getItem("user_id"))
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
                            {this.data.user.value() && this.data.user.value().number}
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
                    <h4 className="nav-head"><input id="nav_check_all" class="uk-checkbox" onClick={() => this.props.handleSelectedCourse("All")} type="checkbox" /> My Term Courses</h4>
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
            <Accordion inverted className="nav-box1">
                <span className="nav-course-checkbox"><input onClick={() => this.props.handleSelectedCourse(this.props.id)} class="Nav_check uk-checkbox" type="checkbox" /></span>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick} className="nav-term-course">
                    <span className="nav-font"> {this.data.course.value().name} </span>
                    <span className="nav-dropdown-icon" > <Icon name='dropdown' /></span>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    {
                        this.data.course.value().sections.map((section, i) =>
                            
                            <div>
                                <span className="nav-section-checkbox">
                                    <input id={section} 
                                        className={this.data.course.value().id + " Nav_check " + "uk-checkbox"} 
                                        onClick={() => this.props.handleSelectSection(section)}
                                        type="checkbox" />
                                </span>
                                <span className="nav-section-img">
                                    <img class="ui avatar image" src={userpic} />
                                </span>
                                <span className="nav-sections" style={{ color: 'white' }}>
                                    <Section id={section}  />
                                </span>
                                <br />
                            </div>
                        )
                    }
                </Accordion.Content>
            </Accordion>
        )
    },
});

const Section = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],

    observe(props, state) {
        return {
            section: new ReactRethinkdb.QueryRequest({
                query: r.table('sections').get(this.props.id),
                changes: true,
                initial: null,

            }),
        };
    },

    render() {
        return (
            this.data.section.value()
            &&
            <span>
                {
                    this.data.section.value().sectionNo
                }
            </span>
        )
    },

});
export default NavInstructor;