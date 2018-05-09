import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import showdown from 'showdown';
import ReactMarkdown from 'react-markdown'

let r = ReactRethinkdb.r;
let converter = new showdown.Converter();


/// need a param for from and to in order to be complete
// so its almost complete

export const All = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            user: "TestUser",
            txtMessage: "",
        };
    },

    observe(props, state) {
        return {
            messages: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get("6f6ed3b6-ea31-4a4b-b140-a0e892254cf8"),
                changes: true,
                initial: [],
            })
        };
    },

    handleSend() {

        let tempMessage = {
            from: this.state.user,
            to: this.props.match.params.id,
            date: new Date(),
            content: this.state.txtMessage
        }

        // get the user id from the session
        let query = r.table('users').get('6f6ed3b6-ea31-4a4b-b140-a0e892254cf8').update({
            messages: r.row('messages').append(tempMessage)
        });


        ReactRethinkdb.DefaultSession.runQuery(query);
        this.setState({ txtMessage: '' })
    },

    render() {
        return (

            <div style={{ padding: 20, backgroundSize: 'cover', height: 1600, width: 3060, filter: 'blur' }}>
                <div style={{ padding: 10, backgroundColor: '#b7ebff', width: '50%', borderRadius: 10 }}>
                    <h1 style={{ fontSize: 50 }}>Messaging Page</h1>
                    <div style={{ backgroundColor: "white", width: 1000, height: 400 }}>

                    {
                        this.data.messages.value().messages
                        ?
                        this.data.messages.value().messages.map((item) => {
                            return <tr key={item.id}>
                                {
                                    item.from==this.props.match.params.id || item.to==this.props.match.params.id
                                    ?
                                    <td>{item.from} : {item.content}</td>
                                    :
                                    <span></span>
                                    
                                }
                            </tr>;
                        })
                        :
                        <p>Loading</p>
                    }

                    </div>

                    <div style={{ padding: 10 }}>
                        <div class="four wide field">
                            <input type="text" value={this.state.txtMessage} onChange={(event) => this.setState({ txtMessage: event.target.value })} />
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



