import React from 'react';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import Userinfo from './Userinfo'
import userpic from './Images/cat.jpg'
import userpic1 from './Images/flower.jpg'
// import GroupInfo from './GroupInfo'
import { Accordion, Icon, Segment, Form, Button, Image, List, Transition, Dropdown, Menu, Rating } from 'semantic-ui-react'

let r = ReactRethinkdb.r;


export const Single = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            userid: sessionStorage.getItem("user_id"),
            txtMessage: "",
        };
    },
    async componentWillMount() {
        if (!sessionStorage.getItem("token")) {
            this.props.history.push("/")
        }
    },

    observe(props, state) {
        return {
            contact: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(sessionStorage.getItem("user_id")),
                changes: true,
                initial: [],
            }),

        };
    },

    dateConverter(val) {
        let time = new Date(val);

        return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

    },

    handleSendContacts() {

        let tempMessage = {
            from: sessionStorage.getItem("user_id"),
            to: this.props.id,
            date: new Date(),
            content: this.state.txtMessage
        }

        // get the user id from the session
        let messageToSelfQuery = r.table('users').get(sessionStorage.getItem("user_id")).update({
            messages: r.row('messages').append(tempMessage)
        });
        ReactRethinkdb.DefaultSession.runQuery(messageToSelfQuery);

        let messageToOtherQuery = r.table('users').get(this.props.id).update({
            messages: r.row('messages').append(tempMessage)
        });
        ReactRethinkdb.DefaultSession.runQuery(messageToOtherQuery);


        this.setState({ txtMessage: '' })
    },

    render() {
        var time = new Date();

        return (

            <div className="chat-msg">
                <div className="chat-head">
                    <img class="ui avatar image" src={userpic}
                    />
                    <span style={{ color: "#76323f" }} className="contacts">
                        {/* <strong> <Userinfo id={this.props.id} /> </strong> */}
                        <strong>  {this.props.contactName} </strong>
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
                            this.data.contact.value().messages
                                ?
                                this.data.contact.value().messages.map((item) => {
                                    return <div >
                                        {
                                            item.from == this.props.id
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
                                                item.to == this.props.id
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

        )

    },
});



export const Group = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            user: "TestUser",
            txtMessage: "",
        };
    },

    async componentWillMount() {
        if (!sessionStorage.getItem("token")) {
            this.props.history.push("/")
        }
    },

    observe(props, state) {
        return {
            messages: new ReactRethinkdb.QueryRequest({
                query: r.table('groups').get(this.props.id),
                changes: true,
                initial: [],
            })
        };
    },

    handleSend() {

        let tempMessage = {
            from: sessionStorage.getItem("user_id"),
            to: "all",
            date: new Date(),
            content: this.state.txtMessage
        }

        let sendMessageQuery = r.table('groups').get(this.props.id).update({
            messages: r.row('messages').append(tempMessage)
        });

        ReactRethinkdb.DefaultSession.runQuery(sendMessageQuery);

        this.setState({ txtMessage: '' })
    },

    dateConverter(val) {
        let time = new Date(val);

        return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

    },

    render() {
        return (

            <div className="chat-msg">
                <div className="chat-head">

                    <span style={{ color: "#76323f" }} className="contacts">
                        <strong> {this.props.groupname} </strong>



                        {
                            // group info causes error
                            // this.data.messages.value().id
                            // ?
                            // <strong> <GroupInfo id={this.data.messages.value().id} /> </strong>
                            // :
                            // <strong> Loading.. </strong>
                        }
                        <strong> {this.props.groupName} </strong>

                    </span>

                </div>

                <div style={{ borderTop: '1px solid #76323f', marginTop: '15px' }}>
                </div>


                <div id="messages" class="messages">
                    <ul>
                        {
                            this.data.messages.value().messages
                                ?
                                this.data.messages.value().messages.map((item) => {
                                    return <div >
                                        {
                                            <span>
                                                {/* <img class="ui avatar image left" src={userpic} style={{ marginBottom: '20px' }}
                                                /> */}
                                                <span class="chat-from">
                                                    <Userinfo id={item.from} />
                                                    :
                                                    <span class="right">
                                                        {item.content}
                                                    </span>


                                                    <p className="msg-time"> {this.dateConverter(item.date)} </p>
                                                </span>
                                            </span>
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
                        <button style={{ border: "none", background: "none" }} onClick={() => this.handleSend()}><Icon color='grey' size='large' name='send' /></button>
                    </div>
                </div>
            </div>
        )

    },
});





