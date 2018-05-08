import React, { Component } from 'react';
import _ from 'lodash'
import { Button, Image, List, Transition, Form } from 'semantic-ui-react'

export class Details extends Component {

    render() {
        return (
            <div class="uk-section uk-section-default" style={{ backgroundColor: '#E9E9E9', marginRight: 20 }}>
                <div style={{ marginLeft: 123, backgroundColor: '#E9E9E9' }}>
                    <div class="ui form">
                        <div class="inline fields" style={{ width: '155%' }}>
                            <div class="eight wide field" >
                                <label style={{ marginLeft: '2%', marginRight: "2%", fontWeight: 'bold', fontSize: 20 }}>Quiz 1</label>
                                <label style={{ marginLeft: '2%', marginRight: "2%" }}>Name</label>
                                <input type="text" placeholder="Name" />
                                <label style={{ marginRight: "2%", marginLeft: '2%' }}>Start</label>
                                <input type="text" placeholder="Start Date" />
                                <label style={{ marginRight: "2%", marginLeft: '2%' }}>Due</label>
                                <input type="text" placeholder="Due Date" />
                                <label style={{ marginRight: "2%", marginLeft: '2%' }}>End</label>
                                <input type="text" placeholder="End Date" />
                                <span uk-icon="icon: arrow-left; ratio: 2" style={{ marginLeft: '91.5%' }}></span>
                                <span uk-icon="icon: arrow-right; ratio: 2"></span>
                            </div>
                        </div>
                    </div>
                    <div class="ui form">
                        <div className="quiz-area">
                            <h4 style={{ color: 'black', marginLeft: '2%' }}>What is the ...?</h4>
                            <a href="" uk-icon="close" style={{ float: 'right', marginLeft: '1%' }}></a>
                            <a href="" uk-icon="pencil" style={{ float: 'right', marginLeft: '1%' }}></a>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <hr />
                            <h4 style={{ color: 'black', marginLeft: '2%' }}>What is the ...?</h4>
                            <a href="" uk-icon="close" style={{ float: 'right', marginLeft: '1%' }}></a>
                            <a href="" uk-icon="pencil" style={{ float: 'right', marginLeft: '1%' }}></a>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <hr />
                            <h4 style={{ color: 'black', marginLeft: '2%' }}>What is the ...?</h4>
                            <a href="" uk-icon="close" style={{ float: 'right', marginLeft: '1%' }}></a>
                            <a href="" uk-icon="pencil" style={{ float: 'right', marginLeft: '1%' }}></a>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                            <p style={{ color: 'black', marginLeft: '2%' }}>*</p>
                        </div>
                    </div>
                    <br />
                    <table style={{ width: '35%' }}>
                        <tr>
                            <th className="radio-table" style={{ textAlign: 'center' }}>MCQ</th>
                            <th className="radio-table" style={{ textAlign: 'center' }}>Short Answers</th>
                            <th className="radio-table" style={{ textAlign: 'center' }}>Multiple</th>
                            <th className="radio-table" style={{ textAlign: 'center' }}>Fill in the blanks</th>

                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center', marginLeft: '20%' }}> <Form.Field label='' control='input' type='radio' name='htmlRadios' /></td>
                            <td style={{ textAlign: 'center' }}> <Form.Field label='' control='input' type='radio' name='htmlRadios' /></td>
                            <td style={{ textAlign: 'center' }}> <Form.Field label='' control='input' type='radio' name='htmlRadios' /></td>
                            <td style={{ textAlign: 'center' }}> <Form.Field label='' control='input' type='radio' name='htmlRadios' /></td>

                        </tr>
                    </table>
                </div>
                <div class="uk-margin">
                    <input class="uk-input uk-form-width-medium" type="text" placeholder="Title" style={{ marginLeft: '6.5%', fontSize: 18, width: '30%' }} />
                </div>
                <div class="uk-accordion-content" style={{ marginLeft: '5%' }}>
                    <div class="text-area1">
                        <Form>
                            <Form.Field label='' control='textarea' rows='3' />
                        </Form>
                    </div>
                </div>
                <br />
                <div>
                    <div style={{ width: '100%' }}>
                        <button class="uk-button profile-btn" style={{ borderRadius: 20, marginLeft: '50%' }} onClick={() => this.handle()}>Cancel</button>
                        <button class="uk-button profile-btn" style={{ borderRadius: 20 }} onClick={() => this.handle()}>Done</button>
                        <button class="uk-button profile-btn" style={{ borderRadius: 20 }} onClick={() => this.handle()}>Upload</button>
                    </div>
                </div>
                <div class="ui right fixed vertical menu " style={{ height: '100%', backgroundColor: '#76323f', width: '15%' }}>
                    <div class="item" style={{ color: 'white' }}></div>
                    <ul uk-accordion="multiple: true">
                        <li class="" style={{ color: 'white' }}>
                            <a class="uk-accordion-title" href="#" style={{ color: 'white', marginLeft: '5%' }}>Version</a>
                            <div class="uk-accordion-content">
                            </div>
                        </li>
                    </ul>
                    <ul uk-accordion="multiple: true">
                        <li class="" style={{ BackgroundColor: 'white' }}>
                            <a class="uk-accordion-title" href="#" style={{ color: 'white', marginLeft: '5%' }}>Collaboration</a>
                            <div class="uk-accordion-content">
                            </div>
                        </li>
                    </ul>
                    <div class="ui search">
                        <div class="ui icon input" >
                            <input class="prompt" type="text" placeholder="Search..." style={{ marginLeft: '5%' }} />
                            <i class="search icon"></i>
                        </div>
                        <div class="results"></div>
                    </div>
                </div>
            </div>
        );
    }
}