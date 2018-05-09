import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import showdown from 'showdown';
import ReactMarkdown from 'react-markdown'

let r = ReactRethinkdb.r;
let converter = new showdown.Converter();

export const Single = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            contacts: [],
            txtUsername: ""
        };
    },

    observe(props, state) {
        return {
            user: new ReactRethinkdb.QueryRequest({
                // get the id from the session cookie later
                query: r.table('users').get('c8aabc5c-8eff-4aa7-b3bd-68ad1ae1aa2a'),
                changes: true,
                initial: [],
            })
        };
    },

    handleAddContact() {

        if(this.state.txtGroupName = ""){
            return
        }
        let query = r.table('users').get('c8aabc5c-8eff-4aa7-b3bd-68ad1ae1aa2a').update({
            contacts: r.row('contacts').append({userid : this.state.txtUsername})
        });

        // dont forget to do it both ways

        ReactRethinkdb.DefaultSession.runQuery(query);
        this.setState({ txtUsername: '' })
    },

    handleDeleteContact(value) {
        let query = r.table('users').get('c8aabc5c-8eff-4aa7-b3bd-68ad1ae1aa2a').update({
            contacts: r.row('contacts').difference([{userid: value}])
        })
        ReactRethinkdb.DefaultSession.runQuery(query);
    },



    render() {
        return (
            <div>
                <div>

                </div>
                <center><h1>Contacts page</h1>
                </center>
                <br />
                <center>
                    <table striped bordered condensed hover style={{ width: '70%' }} >
                        <thead>
                            <tr><th>Name</th></tr>
                        </thead>
                        <tbody>
                            {
                                this.data.user.value().contacts
                                    ?
                                    this.data.user.value().contacts.map((item) => {
                                        return <tr key={item.userid}>
                                            <td>{item.userid}</td>
                                            <td>
                                                <button onClick={() => this.props.history.push("/Messages/" + item.userid)}>Message</button>
                                                <button onClick={() => this.handleDeleteContact(item.userid)}>Remove</button>

                                            </td>
                                        </tr>;
                                    })
                                    :
                                    <p>Loading</p>
                            }

                        </tbody>
                    </table >
                    <div style={{ padding: 10 }}>
                        <div class="four wide field">
                            <input type="text" value={this.state.txtUsername} onChange={(event) => this.setState({ txtUsername: event.target.value })} />
                        </div>
                        <button onClick={() => this.handleAddContact()}>add new contact</button>
                    </div>

                </center>


            </div>
        )

    },
});


export const Groups = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            groups: [],
            txtGroupName: ""
        };
    },

    observe(props, state) {
        return {
            user: new ReactRethinkdb.QueryRequest({
                // get the id from the session cookie later
                query: r.table('users').get('c8aabc5c-8eff-4aa7-b3bd-68ad1ae1aa2a'),
                changes: true,
                initial: [],
            })
        };
    },
    
    handleAddGroup() {

        if(this.state.txtGroupName == ""){
            return
        }

        let query = r.table('users').get('c8aabc5c-8eff-4aa7-b3bd-68ad1ae1aa2a').update({
            groups: r.row('groups').append({groupid : this.state.txtGroupName})
        });

        let query2 = r.table('groups').insert({
            "id": this.state.txtGroupName,
        })

        // dont forget to do it both ways

        ReactRethinkdb.DefaultSession.runQuery(query);
        ReactRethinkdb.DefaultSession.runQuery(query2);

        this.setState({ txtGroupName: '' })
    },

    handleDeleteContact(value) {
        let query = r.table('users').get('c8aabc5c-8eff-4aa7-b3bd-68ad1ae1aa2a').update({
            groups: r.row('groups').difference([{groupid: value}])
        })

        let query2 = r.table('groups').get(value).delete()


        ReactRethinkdb.DefaultSession.runQuery(query);
        ReactRethinkdb.DefaultSession.runQuery(query2);
    },

    render() {
        return (
            <div>
                <div>

                </div>
                <center><h1>My Groups page</h1>
                </center>
                <br />
                <center>
                    <table striped bordered condensed hover style={{ width: '70%' }} >
                        <thead>
                            <tr><th>Name</th></tr>
                        </thead>
                        <tbody>
                            {
                                this.data.user.value().groups
                                    ?
                                    this.data.user.value().groups.map((item) => {
                                        return <tr key={item.groupid}>
                                            <td>{item.groupid}</td>
                                            <td>
                                                <button onClick={() => this.props.history.push("/GroupMessages/" + item.groupid)}>Message</button>
                                                <button onClick={() => this.handleDeleteContact(item.groupid)}>Remove</button>

                                            </td>
                                        </tr>;
                                    })
                                    :
                                    <p>Loading</p>
                            }

                        </tbody>
                    </table >
                    <div style={{ padding: 10 }}>
                        <div class="four wide field">
                            <input type="text" value={this.state.txtGroupName} onChange={(event) => this.setState({ txtGroupName: event.target.value })} />
                        </div>
                        <button onClick={() => this.handleAddGroup()}>add new contact</button>
                    </div>

                </center>


            </div>
        )

    },
});


