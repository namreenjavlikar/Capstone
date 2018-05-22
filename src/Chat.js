import React, { Component } from 'react';
import userpic from './Images/cat.jpg'
import userpic1 from './Images/flower.jpg'
import * as BS from 'react-bootstrap'
import { Accordion, Icon, Segment, Form, Button, Image, List, Transition, Dropdown, Menu } from 'semantic-ui-react'
import _ from 'lodash'
import { Rating } from 'semantic-ui-react'

const users = ['ade']

export default class Chat extends Component {
    state = {
        screen: window.innerWidth,
        activeIndex: 0,
        items: users.slice(0, 3),
        changeClass: window.innerWidth >= 500 ? "container-instructor-full" : "container-instructor-both",
        expandRight: false,
        iconRight: false ? "icon: chevron-right; ratio: 2.5" : "icon: chevron-left; ratio: 2.5",
        expandLeft: false,
        iconLeft: false ? "icon: chevron-left; ratio: 2.5" : "icon: chevron-right; ratio: 2.5"
        //    iconLeft: false ? <Icon name='pointing left' size='massive' /> : <Icon name='pointing right' size='massive' />
    }

    handleAdd = () => this.setState({ items: users.slice(0, this.state.items.length + 1) })

    handleRemove = () => this.setState({ items: this.state.items.slice(0, -1) })

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }



    handleSize = () => {
        this.setState(
            {
                screen: window.innerWidth,
                changeClass: this.state.screen >= 500 ? "container-instructor" : "container-instructor-full"
            }
        )
    }
    handleExpandRight = () => {
        let right = !this.state.expandRight
        console.log('right:', right, this.state.expandLeft, this.state.expandRight)
        this.setState(
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
    }
    handleExpandLeft = () => {
        let left = !this.state.expandLeft

        console.log('left:', left, this.state.expandLeft, this.state.expandRight)
        console.log('left:', left)
        this.setState(
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
    }
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }

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
                        <div class="item" onClick={this.handleAdd} >
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Helen</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Christian</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Daniel</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Tom</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Mark</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Jerry</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Helen</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Christian</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Daniel</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Tom</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Mark</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                        <div class="item">
                            <img class="ui avatar image" src={userpic}
                            />
                            <div class="content">
                                <div class="header" className="contacts">Jerry</div>
                            </div>
                            <div class="right floated content">
                                <span class="chat-online-status"></span>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <Accordion inverted>
                        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick} className="chat-gp">
                            <span style={{ fontSize: '18px' }}>Group Chat</span>
                            <span className="nav-dropdown-icon" > <Icon name='dropdown' /></span>
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 0}>
                            <div class="ui middle aligned selection list chat-group-contacts">
                                <div class="item">
                                    <img class="ui avatar image" src={userpic}
                                    />
                                    <div class="content">
                                        <div class="header" className="contacts">My Best Group</div>
                                    </div>
                                </div>
                                <div class="item">
                                    <img class="ui avatar image" src={userpic}
                                    />
                                    <div class="content">
                                        <div class="header" className="contacts">Capstone Team 2018</div>
                                    </div>
                                </div>
                                <div class="item">
                                    <img class="ui avatar image" src={userpic}
                                    />
                                    <div class="content">
                                        <div class="header" className="contacts">Cp12345 Gp</div>
                                    </div>
                                </div>
                                <div class="item">
                                    <img class="ui avatar image" src={userpic}
                                    />
                                    <div class="content">
                                        <div class="header" className="contacts">GIrls 2018</div>
                                    </div>
                                </div>
                            </div>
                        </Accordion.Content>
                    </Accordion>

                    <hr />


                    <div>

                        <Transition.Group
                            as={List}
                            duration={200}
                            divided
                            size='huge'
                            verticalAlign='middle'
                        >
                            {items.map(item => (

                                <div className="chat-msg">
                                    <div className="chat-head">
                                        <img class="ui avatar image" src={userpic}
                                        />
                                        <span style={{ color: "#76323f" }} className="contacts">
                                            <strong>Helen </strong>
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
                                            <li>
                                                <img class="ui avatar image left" src={userpic} style={{ marginBottom: '20px' }}
                                                />
                                                <span className="chat-from">Hello, Where are you ??
                                                <p className="msg-time">11:00 PM</p>
                                                </span>

                                            </li>
                                            <li style={{ paddingRight: 0 }}>
                                                <img class="ui avatar image" style={{ float: 'right', marginLeft: '5px' }} src={userpic1}
                                                />
                                                <span class="right">Yes I am here
                                                <p className="msg-time">11:00 PM</p>
                                                </span>
                                                <div class="clear"></div>
                                            </li>
                                            <li>
                                                <img class="ui avatar image left" src={userpic} style={{ marginBottom: '20px' }}
                                                />
                                                <span className="chat-from">Hello, Where are you ??
                                                <p className="msg-time">11:00 PM</p>
                                                </span>

                                            </li>
                                            <li style={{ paddingRight: 0 }}>
                                                <img class="ui avatar image" style={{ float: 'right', marginLeft: '5px' }} src={userpic1}
                                                />
                                                <span class="right">Yes I am here
                                                <p className="msg-time">11:00 PM</p>
                                                </span>
                                                <div class="clear"></div>
                                            </li>
                                            <li>
                                                <img class="ui avatar image left" src={userpic} style={{ marginBottom: '20px' }}
                                                />
                                                <span className="chat-from">Hello, Where are you ??
                                                <p className="msg-time">11:00 PM</p>
                                                </span>

                                            </li>
                                            <li style={{ paddingRight: 0 }}>
                                                <img class="ui avatar image" style={{ float: 'right', marginLeft: '5px' }} src={userpic1}
                                                />
                                                <span class="right">Yes I am here
                                                <p className="msg-time">11:00 PM</p>
                                                </span>
                                                <div class="clear"></div>
                                            </li>
                                            <li>
                                                <img class="ui avatar image left" src={userpic} style={{ marginBottom: '20px' }}
                                                />
                                                <span className="chat-from">Hello, Where are you ??
                                                <p className="msg-time">11:00 PM</p>
                                                </span>

                                            </li>
                                            <li style={{ paddingRight: 0 }}>
                                                <img class="ui avatar image" style={{ float: 'right', marginLeft: '5px' }} src={userpic1}
                                                />
                                                <span class="right">Yes I am here
                                                <p className="msg-time">11:00 PM</p>
                                                </span>
                                                <div class="clear"></div>
                                            </li>
                                            <li>
                                                <img class="ui avatar image left" src={userpic} style={{ marginBottom: '20px' }}
                                                />
                                                <span className="chat-from">Hello, Where are you ??
                                                <p className="msg-time">11:00 PM</p>
                                                </span>

                                            </li>
                                            <li style={{ paddingRight: 0 }}>
                                                <img class="ui avatar image" style={{ float: 'right', marginLeft: '5px' }} src={userpic1}
                                                />
                                                <span class="right">Yes I am here
                                                <p className="msg-time">11:00 PM</p>
                                                </span>
                                                <div class="clear"></div>
                                            </li>
                                            <li>
                                                <img class="ui avatar image left" src={userpic} style={{ marginBottom: '20px' }}
                                                />
                                                <span className="chat-from">Hello, Where are you ??
                                                <p className="msg-time">11:00 PM</p>
                                                </span>

                                            </li>
                                            <li style={{ paddingRight: 0 }}>
                                                <img class="ui avatar image" style={{ float: 'right', marginLeft: '5px' }} src={userpic1}
                                                />
                                                <span class="right">Yes I am here
                                                <p className="msg-time">11:00 PM</p>
                                                </span>
                                                <div class="clear"></div>
                                            </li>

                                        </ul>
                                        <div class="clear"></div>
                                    </div>
                                    <div className="input-box">
                                       
                                        <div style={{ float: 'left', marginLeft: '10px', marginTop: '10px' }}>
                                            <Icon color='grey' size='large' name='smile' />
                                        </div>
                                        <div style={{ float: 'left' }}>
                                            <textarea placeholder="Enter message"></textarea>
                                        </div>
                                        <div style={{ float: 'left', marginRight: '10px', marginTop: '10px' }}>
                                            <Icon color='grey' size='large' name='send' />
                                        </div>
                                    </div>




                                </div>
                            ))}
                        </Transition.Group>
                    </div>

                </div>







            </div>

        );
    }
}

