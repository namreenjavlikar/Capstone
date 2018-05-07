import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import showdown from 'showdown';
import ReactMarkdown from 'react-markdown'

let r = ReactRethinkdb.r;
let converter = new showdown.Converter();

export const All = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            content: ""
        };
    },

    observe(props, state) {
        return {
            messages: new ReactRethinkdb.QueryRequest({
                // get the id from the session cookie later
                query: r.table('users').get('6f6ed3b6-ea31-4a4b-b140-a0e892254cf8'),
                changes: true,
                initial: [],
            })
        };
    },



    render() {
        return (

            <div style={{ padding: 20, backgroundImage: "url(../images/Birds.jpg)", backgroundSize: 'cover', height: 1600, width: 3060, filter: 'blur' }}>
                <div style={{ padding: 10, backgroundColor: '#b7ebff', width: '50%', borderRadius: 10 }}>
                    <h1 style={{ fontSize: 50 }}>Messaging Page</h1>

                    {
                        this.data.messages.value()
                        ?
                        console.log(this.data.messages.value())
                        :
                        <p>Loading</p>
                    }

                    <textarea rows="20" cols="150">
                        At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.
                    </textarea>

                    <div style={{ padding: 10 }}>
                        <div class="four wide field">
                            <input type="text" value={this.state.content} onChange={(event) => this.setState({ content: event.target.value })} />
                        </div>
                        <button onClick={() => this.handleSend()}>Send</button>
                    </div>
                </div>
            </div>
        )

    },
});

export const Create = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            name: "",
            content: "",
            answer: '',
            questionType: '',
            choices: [{ name: '' }],
        };
    },

    observe(props, state) {
        return {
            users: new ReactRethinkdb.QueryRequest({
                query: r.table('users'),
                changes: true,
                initial: [],
            })
        };
    },

    handleSubmit() {

        let message = {
            from: "alice",
            to: "bob",
            date: new Date(),
            content: "hello darkness my old friend"
        }

        let tempContact = {
            userid: this.state.name,
            messages: []
        }

        // get the user id from the session
        let query = r.table('users').get('6f6ed3b6-ea31-4a4b-b140-a0e892254cf8').update({
            contacts: r.row('contacts').append(tempContact)
        });

        ReactRethinkdb.DefaultSession.runQuery(query);
        this.props.history.push("/contacts")
        this.setState({ name: '' })
    },


    handleNameChange(evt) {
        this.setState({ name: evt.target.value });
    },


    render() {
        return (
            <div>

                <div style={{ marginLeft: 130, marginRight: 5 }}>


                    <div class="ui raised very padded text container segment" style={{ height: '100vh' }}>
                        <center>
                            <h2 class="ui  header">Add a contact</h2>
                        </center>
                        <hr class="uk-divider-icon" />
                        <div class="ui form">

                            <div class="four wide field">
                                <label>college Id</label>
                                <input type="text" value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} />

                            </div>


                            <button onClick={() => this.handleSubmit()}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});



