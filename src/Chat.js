import React, { Component } from 'react';
import userpic from './Images/cat.jpg'
import userpic1 from './Images/flower.jpg'
import * as BS from 'react-bootstrap'
import { Accordion, Icon, Segment, Form, Button, Image, List, Transition, Dropdown, Menu, Rating } from 'semantic-ui-react'
import _ from 'lodash'

import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import Userinfo from './Userinfo'
import GroupInfo from './GroupInfo'
import CourseInfo from './CourseInfo'
import * as Contacts from './Contacts'
import * as Message from './Messages'


let r = ReactRethinkdb.r;


export const Chat = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            screen: window.innerWidth,
            activeIndex: 0,
            changeClass: window.innerWidth >= 500 ? "container-instructor-full" : "container-instructor-both",
            expandRight: false,
            iconRight: false ? "icon: chevron-right; ratio: 2.5" : "icon: chevron-left; ratio: 2.5",
            expandLeft: false,
            iconLeft: false ? "icon: chevron-left; ratio: 2.5" : "icon: chevron-right; ratio: 2.5",
            to: "none",
            txtMessage: "",
            targetedChat: "empty",
            tempGroupId: "",
            tempContactId: "",
            testUserNameToggle: false,
            isRecorded: false
        };
    },

    async componentWillMount() {
        if (!sessionStorage.getItem("token")) {
            this.props.history.push("/")
        }
    },

    observe(props, state) {

        return {
            user: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(sessionStorage.getItem("user_id")),
                changes: true,
                initial: [],
            }),
            messages: new ReactRethinkdb.QueryRequest({
                query: r.table('messages').get(sessionStorage.getItem("user_id")),
                changes: true,
                initial: [],
            }),
            // messageslog: new ReactRethinkdb.QueryRequest({
            //     query: r.table('messageslog').get(sessionStorage.getItem("user_id")),
            //     changes: true,
            //     initial: [],
            // }),
            sections: new ReactRethinkdb.QueryRequest({
                query: r.table('sections'),
                changes: true,
                initial: null,
            }),
            courses: new ReactRethinkdb.QueryRequest({
                query: r.table('courses'),
                changes: true,
                initial: null,
            }),
            hardsection: new ReactRethinkdb.QueryRequest({
                query: r.table('sections').get("e186e3ba-f8b4-464e-9d82-a906be5633e4"),
                changes: true,
                initial: [],
            }),



        };
    },


    /////////////////////////// design team methods

    async handleClick(e, titleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        await this.setState({ activeIndex: newIndex })
    },

    async handleSize() {
        await this.setState(
            {
                screen: window.innerWidth,
                changeClass: this.state.screen >= 500 ? "container-instructor" : "container-instructor-full"
            }
        )
    },
    async handleExpandRight() {
        let right = !this.state.expandRight
        console.log('right:', right, this.state.expandLeft, this.state.expandRight)
        await this.setState(
            {
                changeClass:
                    this.state.expandLeft && right ?
                        "container-instructor-both" :
                        !this.state.expandLeft && !right ?
                            "container-instructor-full" :
                            !this.state.expandLeft && right ?
                                "container-instructor-right" :
                                this.state.expandLeft && !right ?
                                    "container-instructor-left" :
                                    "container-instructor-both2",
                expandRight: right,
                iconRight: !this.state.expandRight ? "icon: chevron-left; ratio: 2.5" : "icon: chevron-right; ratio: 2.5"
            }
        )
    },

    async  handleExpandLeft() {
        let left = !this.state.expandLeft

        console.log('left:', left, this.state.expandLeft, this.state.expandRight)
        console.log('left:', left)
        await this.setState(
            {
                changeClass:
                    left && this.state.expandRight ?
                        "container-instructor-both" :
                        !left && !this.state.expandRight ?
                            "container-instructor-full" :
                            left && !this.state.expandRight ?
                                "container-instructor-left" :
                                !left && this.state.expandRight ?
                                    "container-instructor-right" :
                                    "container-instructor-both2",
                expandLeft: left,
                iconLeft: !this.state.expandLeft ? "icon: chevron-left; ratio: 2.5" : "icon: chevron-right; ratio: 2.5"
            }
        )
    },

    async handleClick(e, titleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        await this.setState({ activeIndex: newIndex })
    },

    /////////////////////////// contacts.js methods

    handleAddContact() {
        if (this.state.txtUserId == "") {
            return
        }



        if (this.state.txtUserId == this.state.userid) {

            alert("invalid user")
            return
        }

        let findUserquery = r.table('messages').get(this.state.txtUserId)

        ReactRethinkdb.DefaultSession.runQuery(findUserquery).then(
            (res) => {
                if (res) {
                    let queryCheckMyContacts = r.table('messages').get(this.state.userid)("contacts").filter({ "userid": this.state.txtUserId })
                    ReactRethinkdb.DefaultSession.runQuery(queryCheckMyContacts).then(
                        (res) => {
                            if (res.length == 0) {
                                console.log(res)
                                let queryAdd2Contacts = r.table('messages').get(this.state.userid).update({
                                    contacts: r.row('contacts').append({ userid: this.state.txtUserId, status: "accepted" })
                                });
                                ReactRethinkdb.DefaultSession.runQuery(queryAdd2Contacts);
                            } else {
                                console.log("you already added the user")
                            }

                        })

                    let queryCheckOtherContacts = r.table('messages').get(this.state.txtUserId)("contacts").filter({ "userid": this.state.userid })
                    ReactRethinkdb.DefaultSession.runQuery(queryCheckOtherContacts).then(
                        (res) => {
                            if (res.length == 0) {
                                console.log(res)
                                let query2 = r.table('messages').get(this.state.txtUserId).update({
                                    contacts: r.row('contacts').append({ userid: this.state.userid, status: "pending" })
                                });
                                ReactRethinkdb.DefaultSession.runQuery(query2);

                            } else {
                                console.log("The other user has already added you")
                            }
                        })
                } else {
                    alert("invalid user")
                }

            })

        this.setState({ txtUserId: '' })

    },

    handleDeleteContact(value) {
        let query = r.table('users').get(this.state.userid).update({
            contacts: r.row('contacts').difference([{ userid: value, status: "accepted" }])
        })
        ReactRethinkdb.DefaultSession.runQuery(query);
    },

    handleBlockContact(value) {
        let queryRemove = r.table('users').get(this.state.userid).update({
            contacts: r.row('contacts').difference([{ userid: value, status: "accepted" }])
        })
        ReactRethinkdb.DefaultSession.runQuery(queryRemove);

        let queryBlocked = r.table('users').get(this.state.userid).update({
            contacts: r.row('contacts').append({ userid: value, status: "blocked" })
        });

        ReactRethinkdb.DefaultSession.runQuery(queryBlocked);
    },

    handleUnBlockContact(value) {
        let queryRemove = r.table('users').get(this.state.userid).update({
            contacts: r.row('contacts').difference([{ userid: value, status: "blocked" }])
        })
        ReactRethinkdb.DefaultSession.runQuery(queryRemove);

        let queryBlocked = r.table('users').get(this.state.userid).update({
            contacts: r.row('contacts').append({ userid: value, status: "accepted" })
        });

        ReactRethinkdb.DefaultSession.runQuery(queryBlocked);
    },

    handleAcceptContact(value) {
        let queryRemove = r.table('users').get(this.state.userid).update({
            contacts: r.row('contacts').difference([{ userid: value, status: "pending" }])
        })
        ReactRethinkdb.DefaultSession.runQuery(queryRemove);

        let queryBlocked = r.table('users').get(this.state.userid).update({
            contacts: r.row('contacts').append({ userid: value, status: "accepted" })
        });

        ReactRethinkdb.DefaultSession.runQuery(queryBlocked);
    },

    dateConverter(val) {
        let time = new Date(val);

        return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

    },

    async selectContact(id) {
        // await this.setState({ tempContactId: id })
        // await this.setState({ targetedChat: "contacts" })
        console.log("student id= " + id)

        let getId = r.table('users').filter({ "collegeid": id })
        await ReactRethinkdb.DefaultSession.runQuery(getId).then(
            (res) => {
                res.toArray((err, results) => {
                    console.log("", results[0].id);
                    if (results[0].id) {
                        this.setState({ tempContactId: results[0].id })
                        this.setState({ targetedChat: "contacts" })
                    }
                })
            })
    },
    async selectGroup(id) {
        await this.setState({ tempGroupId: id })
        await this.setState({ targetedChat: "group" })

    },

    async  handleSendContacts() {



        if (this.state.isRecorded == true) {

            let tempMessage = {
                from: sessionStorage.getItem("user_id"),
                to: this.state.tempContactId,
                date: new Date(),
                content: this.state.txtMessage
            }

            let messageToSelfQuery = r.table('messages').get(sessionStorage.getItem("user_id")).update({
                messages: r.row('messages').append(tempMessage)
            });
            ReactRethinkdb.DefaultSession.runQuery(messageToSelfQuery);

            let messageToOtherQuery = r.table('messages').get(this.state.tempContactId).update({
                messages: r.row('messages').append(tempMessage)
            });
            ReactRethinkdb.DefaultSession.runQuery(messageToOtherQuery);


            //////////////////////////

            let messageToSelfQueryLog = r.table('messageslog').get(sessionStorage.getItem("user_id")).update({
                messages: r.row('messages').append(tempMessage)
            });
            ReactRethinkdb.DefaultSession.runQuery(messageToSelfQueryLog);

            let messageToOtherQueryLog = r.table('messageslog').get(this.state.tempContactId).update({
                messages: r.row('messages').append(tempMessage)
            });
            ReactRethinkdb.DefaultSession.runQuery(messageToOtherQueryLog);

            // this.clearTime()


            await this.setState({ txtMessage: '' })

        } else {

            let tempMessage = {
                from: sessionStorage.getItem("user_id"),
                to: this.state.tempContactId,
                date: new Date(),
                content: this.state.txtMessage
            }

            //

            let messageToSelfQuery = r.table('messages').get(sessionStorage.getItem("user_id")).update({
                messages: r.row('messages').append(tempMessage)
            });
            ReactRethinkdb.DefaultSession.runQuery(messageToSelfQuery);

            let messageToOtherQuery = r.table('messages').get(this.state.tempContactId).update({
                messages: r.row('messages').append(tempMessage)
            });
            ReactRethinkdb.DefaultSession.runQuery(messageToOtherQuery);

            //

            //this.data.messages.value().messages.push(tempMessage)

            // this.clearTime()

            await this.setState({ txtMessage: '' })

        }


    },


    async handleCheckbox(e) {


        if (e == true) {

            let tempMessage = {
                from: sessionStorage.getItem("user_id"),
                to: this.state.tempContactId,
                date: new Date(),
                botmessage: true,
                content: "The message is being recorded"
            }


            let messageToSelfQuery = r.table('messages').get(sessionStorage.getItem("user_id")).update({
                messages: r.row('messages').append(tempMessage)
            });
            ReactRethinkdb.DefaultSession.runQuery(messageToSelfQuery);

            let messageToOtherQuery = r.table('messages').get(this.state.tempContactId).update({
                messages: r.row('messages').append(tempMessage)
            });
            ReactRethinkdb.DefaultSession.runQuery(messageToOtherQuery);

            //this.data.messages.value().messages.push(tempMessage)
            await this.setState({ isRecorded: true })


        } else {
            let tempMessage = {
                from: sessionStorage.getItem("user_id"),
                to: this.state.tempContactId,
                date: new Date(),
                botmessage: true,
                content: "The message stopped recording"
            }


            let messageToSelfQuery = r.table('messages').get(sessionStorage.getItem("user_id")).update({
                messages: r.row('messages').append(tempMessage)
            });
            ReactRethinkdb.DefaultSession.runQuery(messageToSelfQuery);

            let messageToOtherQuery = r.table('messages').get(this.state.tempContactId).update({
                messages: r.row('messages').append(tempMessage)
            });
            ReactRethinkdb.DefaultSession.runQuery(messageToOtherQuery);

            //this.data.messages.value().messages.push(tempMessage)
            await this.setState({ isRecorded: false })
        }


    },



    async clearTime() {
        this.interval = setInterval(() => {
            console.log(this.state.number, this.props.counter)
            if (this.state.isRecorded == false) {
                console.log("clearing message")
                let clearMessages = r.table('messages').get(sessionStorage.getItem("user_id")).update({ messages: [] });
                ReactRethinkdb.DefaultSession.runQuery(clearMessages);
            } else {
                console.log("not clearing message")
                this.setState({ tempMessage: this.state.tempMessage })
            }
        }, 60000);
    },


    /////////////////////////////////////////

    render() {
        const { items, activeIndex } = this.state
        return (

            <div className="chat">




                {
                    this.data.user.value().chatStatus == "enabled" && this.data.user.value()
                        ?
                        <div class="chat-page">
                            <h3 className="contacts">Chat
                                <span class="ui category search  chat-search-box">

                                    <div class="results"></div>
                                </span></h3>

                            <div class="ui middle aligned selection list chat-contacts">



                                {
                                    this.data.user.value().courses
                                        ?
                                        this.data.user.value().courses.map((mycourse) => {
                                            return <span>
                                                <span >
                                                    {/* dont forget to get the course name */}
                                                    {/* <span > {course}</span> */}
                                                    <h5 class="header" className="contacts">  <CourseInfo id={mycourse} /> </h5>


                                                    {
                                                        this.data.courses.value()
                                                            ?
                                                            this.data.courses.value().map((item) => {
                                                                return <span>
                                                                    {
                                                                        item.id == mycourse
                                                                            ?
                                                                            item.sections.map((courseSections) => {
                                                                                return <span>

                                                                                    {
                                                                                        this.data.sections.value()
                                                                                            ?
                                                                                            this.data.sections.value().map((section) => {
                                                                                                return <span>

                                                                                                    {
                                                                                                        section.id == courseSections
                                                                                                            ?
                                                                                                            section.students.map((student) => {
                                                                                                                return <div key={student} class="item" id={student} onClick={() => this.selectContact(student)}>

                                                                                                                    {
                                                                                                                        student != this.data.user.value().collegeid
                                                                                                                            ?
                                                                                                                            <span>

                                                                                                                                {/* <div class="content">
                                                                                                                                    <img class="ui avatar image" src={userpic}
                                                                                                                                    style={{ display:"inline-block" }} />
                                                                                                                                    <div class="header" className="contacts">{student}</div>
                                                                                                                                </div> */}

                                                                                                                                <div className="content">
                                                                                                                                    <img class="ui avatar image" src={userpic}
                                                                                                                                    />
                                                                                                                                    <span style={{ color: "#76323f" }} className="contacts">
                                                                                                                                        <span style={{ color: "white" }} >{student}</span>
                                                                                                                                    </span>

                                                                                                                                </div>
                                                                                                                            </span>
                                                                                                                            :
                                                                                                                            <span></span>
                                                                                                                    }
                                                                                                                </div>;
                                                                                                            })
                                                                                                            :
                                                                                                            <span></span>
                                                                                                    }
                                                                                                </span>
                                                                                            })
                                                                                            :
                                                                                            <span></span>
                                                                                    }

                                                                                </span>
                                                                            })
                                                                            :
                                                                            <span></span>
                                                                    }
                                                                </span>
                                                            })
                                                            :
                                                            <span></span>
                                                    }

                                                    <br />



                                                </span>


                                            </span>;
                                        })
                                        :
                                        <p>Empty</p>
                                }




                            </div>

                            <hr />

                            <Accordion inverted>
                                <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick} className="chat-gp">
                                    <span style={{ fontSize: '18px' }}>Group Chat</span>
                                    <span className="nav-dropdown-icon" > <Icon name='dropdown' /></span>
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === 0}>
                                    <div class="ui middle aligned selection list chat-group-contacts">

                                        {
                                            this.data.user.value().groups
                                                ?
                                                this.data.user.value().groups.map((item) => {
                                                    return <div key={item.groupid} class="item" id={item.groupid} onClick={() => this.selectGroup(item.groupid)}>

                                                        <img class="ui avatar image" src={userpic}
                                                        />
                                                        <div class="content">
                                                            <div class="header" className="contacts"><GroupInfo id={item.groupid} /> </div>
                                                        </div>


                                                    </div>;
                                                })
                                                :
                                                <p>Loading...</p>
                                        }

                                    </div>
                                </Accordion.Content>
                            </Accordion>

                            <hr />


                            <div>


                                {/* <Transition.Group
                            as={List}
                            duration={200}
                            divided
                            size='huge'
                            verticalAlign='middle'
                        >  */}

                                {
                                    this.state.targetedChat == "contacts"
                                        ?
                                        <div className="chat-msg">
                                            <div className="chat-head">
                                                <img class="ui avatar image" src={userpic}
                                                />
                                                <span style={{ color: "#76323f" }} className="contacts">
                                                    <strong> <Userinfo id={this.state.tempContactId} /> </strong>
                                                </span>
                                                <span style={{ color: "#76323f" }} className="contacts">
                                                    <BS.Checkbox onClick={e => this.handleCheckbox(e.target.checked)} >Recording</BS.Checkbox  >

                                                </span>
                                            </div>

                                            <div style={{ borderTop: '1px solid #76323f', marginTop: '15px' }}>
                                            </div>

                                            <div id="messages" class="messages">
                                                <ul>
                                                    {
                                                        this.data.messages.value()
                                                            ?
                                                            this.data.messages.value().messages.map((item) => {
                                                                return <div >
                                                                    {
                                                                        item.from == this.state.tempContactId
                                                                            ?
                                                                            item.botmessage == true
                                                                                ?
                                                                                <li style={{ paddingRight: 0 }}>
                                                                                    <span class="right">{item.content}
                                                                                        <p className="msg-time"> {this.dateConverter(item.date)} </p>
                                                                                    </span>
                                                                                    <div class="clear"></div>
                                                                                </li>
                                                                                :
                                                                                <li style={{ paddingRight: 0 }}>
                                                                                    <img class="ui avatar image" style={{ float: 'right', marginLeft: '5px' }} src={userpic1}
                                                                                    />
                                                                                    <span class="right">{item.content}
                                                                                        <p className="msg-time"> {this.dateConverter(item.date)} </p>
                                                                                    </span>
                                                                                    <div class="clear"></div>
                                                                                </li>

                                                                            :
                                                                            item.to == this.state.tempContactId
                                                                                ?
                                                                                item.botmessage == true
                                                                                    ?
                                                                                    <li style={{ paddingRight: 0 }}>
                                                                                        <span className="chat-from">{item.content}
                                                                                            <p className="msg-time"> {this.dateConverter(item.date)} </p>
                                                                                        </span>
                                                                                        <div class="clear"></div>
                                                                                    </li>
                                                                                    :
                                                                                    <li style={{ paddingRight: 0 }}>
                                                                                        <img class="ui avatar image left" src={userpic} style={{ marginBottom: '20px' }} />
                                                                                        <span className="chat-from">{item.content}
                                                                                            <p className="msg-time"> {this.dateConverter(item.date)} </p>
                                                                                        </span>
                                                                                        <div class="clear"></div>
                                                                                    </li>
                                                                                :
                                                                                <span></span>
                                                                    }
                                                                </div>;
                                                            })
                                                            :
                                                            <p>Loading</p>
                                                    }




                                                </ul>
                                                <div class="clear"></div>
                                            </div>

                                            <div className="input-box">

                                                <div style={{ float: 'left', marginLeft: '10px', marginTop: '10px' }}>
                                                    <Icon color='grey' size='large' name='folder open' />
                                                </div>
                                                <div style={{ float: 'left' }}>
                                                    <textarea value={this.state.txtMessage} onChange={(event) => this.setState({ txtMessage: event.target.value })} placeholder="Enter message"></textarea>
                                                </div>
                                                <div style={{ float: 'left', marginRight: '10px', marginTop: '10px' }}>
                                                    <button style={{ border: "none", background: "none" }} onClick={() => this.handleSendContacts()}><Icon color='grey' size='large' name='send' /></button>
                                                </div>
                                            </div>

                                        </div>

                                        // it doenst work cause we are already observing user
                                        // <Message.Single id={this.state.tempContactId} contactName={<Userinfo id={this.state.tempContactId} />} />
                                        :
                                        this.state.targetedChat == "group"
                                            ?
                                            <Message.Group id={this.state.tempGroupId} groupName={<GroupInfo id={this.state.tempGroupId} />} />
                                            :
                                            <span></span>



                                }

                                {/* </Transition.Group> */}

                            </div>

                        </div>

                        :
                        <center>
                            <h3 className="contacts">
                                Chat has been disabled
                        </h3>

                        </center>

                }




            </div>

        );
    },
});

export default Chat;
