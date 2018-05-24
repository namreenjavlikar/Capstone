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
import * as Contacts from './Contacts'
import * as Message from './Messages'


let r = ReactRethinkdb.r;
// let tempGroupId = ""
// let tempContactId = ""



const users = ['ade']

export const Chat = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            screen: window.innerWidth,
            activeIndex: 0,
            items: users.slice(0, 3),
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
            testUserNameToggle: false
        };
    },

    // async componentWillMount() {
    //     if (!sessionStorage.getItem("token")) {
    //         this.props.history.push("/")
    //     }
    // },

    observe(props, state) {

        return {
            user: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(this.props.userid),
                changes: true,
                initial: [],
            }),


        };
    },


    /////////////////////////// design team methods

   async  handleAdd() { await this.setState({ items: users.slice(0, this.state.items.length + 1) }) },

   async  handleRemove() {await this.setState({ items: this.state.items.slice(0, -1) }) },

    async handleClick(e, titleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        await this.setState({ activeIndex: newIndex })
    },

    async handleSize() {
       await  this.setState(
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

        let findUserquery = r.table('users').get(this.state.txtUserId)

        ReactRethinkdb.DefaultSession.runQuery(findUserquery).then(
            (res) => {
                if (res) {
                    let queryCheckMyContacts = r.table('users').get(this.state.userid)("contacts").filter({ "userid": this.state.txtUserId })
                    ReactRethinkdb.DefaultSession.runQuery(queryCheckMyContacts).then(
                        (res) => {
                            if (res.length == 0) {
                                console.log(res)
                                let queryAdd2Contacts = r.table('users').get(this.state.userid).update({
                                    contacts: r.row('contacts').append({ userid: this.state.txtUserId, status: "accepted" })
                                });
                                ReactRethinkdb.DefaultSession.runQuery(queryAdd2Contacts);
                            } else {
                                console.log("you already added the user")
                            }

                        })

                    let queryCheckOtherContacts = r.table('users').get(this.state.txtUserId)("contacts").filter({ "userid": this.state.userid })
                    ReactRethinkdb.DefaultSession.runQuery(queryCheckOtherContacts).then(
                        (res) => {
                            if (res.length == 0) {
                                console.log(res)
                                let query2 = r.table('users').get(this.state.txtUserId).update({
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
        await this.setState({ tempContactId: id })
        await this.setState({ targetedChat: "contacts" })


    },
    async selectGroup(id) {
        await this.setState({ tempGroupId: id })
        await this.setState({ targetedChat: "group" })

    },

    async handleSendContacts() {

        let tempMessage = {
            from: this.props.userid,
            to: this.state.tempContactId,
            date: new Date(),
            content: this.state.txtMessage
        }

        // get the user id from the session
        let messageToSelfQuery = r.table('users').get(this.props.userid).update({
            messages: r.row('messages').append(tempMessage)
        });
        ReactRethinkdb.DefaultSession.runQuery(messageToSelfQuery);

        let messageToOtherQuery = r.table('users').get(this.state.tempContactId).update({
            messages: r.row('messages').append(tempMessage)
        });
        ReactRethinkdb.DefaultSession.runQuery(messageToOtherQuery);


        await this.setState({ txtMessage: '' })
    },


    /////////////////////////////////////////

    render() {
        const { items, activeIndex } = this.state
        return (

            <div className="chat">
                <div class="chat-page">
                    <h3 className="contacts">Chat
                                <span class="ui category search  chat-search-box">
                            <div class="ui icon input">
                                <input class="prompt" type="text" placeholder="Search..." />
                                <i class="search icon"></i>
                            </div>
                            <div class="results"></div>
                        </span></h3>

                    <div class="ui middle aligned selection list chat-contacts">

                        {
                            this.data.user.value().contacts
                                ?
                                this.data.user.value().contacts.map((item) => {
                                    return <div key={item.userid} class="item" id={item.userid} onClick={() => this.selectContact(item.userid)}>

                                        <img class="ui avatar image" src={userpic}
                                        />
                                        <div class="content">
                                            <div class="header" className="contacts"><Userinfo id={item.userid} /></div>
                                        </div>
                                        <div class="right floated content">
                                            <span class="chat-online-status"></span>
                                        </div>

                                    </div>;
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
                                    // this.data.user.value().groups
                                    //     ?
                                    //     this.data.user.value().groups.map((item) => {
                                    //         return <div key={item.groupid} class="item" id={item.groupid} onClick={() => this.selectGroup(item.groupid)}>

                                    //             <img class="ui avatar image" src={userpic}
                                    //             />
                                    //             <div class="content">
                                    //                 <div class="header" className="contacts"><GroupInfo id={item.groupid} /> </div>
                                    //             </div>


                                    //         </div>;
                                    //     })
                                    //     :
                                    //     <p>Loading...</p>
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
                                            <span class="chat-online-status"></span>
                                        </span>
                                        <span style={{ marginLeft: '140px', paddingRight: '10px', borderRight: '1px solid #76323f' }}>
                                            <Rating maxRating={1} icon='star' size='huge' uk-tooltip="title: Star This Contact; pos: bottom-right" />
                                        </span>
                                        <span style={{ marginLeft: '10px', paddingRight: '10px', borderRight: '1px solid #76323f', cursor: 'pointer' }}>
                                            <Icon inverted color='red' size='large' name='attach' uk-tooltip="title: Attach Any File ; pos: bottom-right" />
                                        </span>
                                        <span uk-icon="close" onClick={this.handleRemove} uk-tooltip="title: Close Message ; pos: bottom-right" style={{ color: "black", marginLeft: '10px', marginRight: '10px', cursor: 'pointer' }}></span>
                                    </div>

                                    <div style={{ borderTop: '1px solid #76323f', marginTop: '15px' }}>
                                    </div>

                                    <div id="messages" class="messages">
                                        <ul>
                                            {
                                                this.data.user.value().messages
                                                    ?
                                                    this.data.user.value().messages.map((item) => {
                                                        return <div >
                                                            {
                                                                item.from == this.state.tempContactId
                                                                    ?
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
                                                                        <li>
                                                                            <img class="ui avatar image left" src={userpic} style={{ marginBottom: '20px' }}
                                                                            />
                                                                            <span className="chat-from"> {item.content}
                                                                                <p className="msg-time"> {this.dateConverter(item.date)} </p>
                                                                            </span>
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
                                            <Icon color='grey' size='large' name='smile' />
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
                                // <Message.Single id={tempContactId}  />
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

            </div>

        );
    },
});

export default Chat;
