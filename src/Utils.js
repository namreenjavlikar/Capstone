import { Button, Image, List, Transition, Form, Rail, Segment, Popup } from 'semantic-ui-react'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import profile from './profile.png';
const r = ReactRethinkdb.r;

export const UserPopup = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    observe(props, state) {
        return {
            user: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(this.props.userId),
                changes: true,
                initial: true,
            })
        };
    },

    render() {
        return (
            this.data.user.value() == true
                ?
                <div>Loading</div>
                :
                <Popup
                    trigger={<Image src={profile} avatar />}
                    content={this.data.user.value().name + ' is editing this question'}
                />
        )
    },
});

