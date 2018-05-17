import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import Userinfo from './Userinfo'
import GroupInfo from './GroupInfo'
let r = ReactRethinkdb.r;

export const Single = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            contacts: [],
            txtUserId: "",
            userid: sessionStorage.getItem("user_id")
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
            })
        };
    },

    handleAddContact() {
        if (this.state.txtUserId == "") {
            return
        }

        console.log("First: " + this.state.txtUserId)
        console.log("second: " + this.state.userid)

        if (this.state.txtUserId == this.state.userid) {

            alert("invalid user")
            return
        }

        let findUserquery = r.table('users').get(this.state.txtUserId)

        ReactRethinkdb.DefaultSession.runQuery(findUserquery).then(
            (res) => {
                if (res) {
                    // let queryAdd2Contacts = r.table('users').get(this.state.userid).update({
                    //     contacts: r.row('contacts').append({ userid: this.state.txtUserId, status: "accepted" })
                    // });
                    // ReactRethinkdb.DefaultSession.runQuery(queryAdd2Contacts);

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




    render() {
        return (
            <div>
                {/* 
                werid error, the list doenst get updated real time to to this ???
                
                <div>
                    Hello <Userinfo id={this.state.userid} />
                </div>
                */}

                <center><h1>Contacts page</h1>
                </center>


                <br />
                <center>
                    <table striped bordered condensed hover style={{ width: '70%' }} >
                        <thead>
                            <tr><th>Name</th><th>status</th></tr>
                        </thead>
                        <tbody>
                            {
                                this.data.user.value().contacts
                                    ?
                                    this.data.user.value().contacts.map((item) => {
                                        return <tr key={item.userid}>

                                            <td><Userinfo id={item.userid} /></td>
                                            <td>{item.status}</td>
                                            {
                                                item.status == "blocked"
                                                    ?
                                                    <td>
                                                        <button onClick={() => this.handleUnBlockContact(item.userid)}>UnBlock</button>
                                                    </td>
                                                    :
                                                    <td>
                                                        <button onClick={() => this.props.history.push("/Messages/" + item.userid)}>Message</button>
                                                        <button onClick={() => this.handleDeleteContact(item.userid)}>Unfriend</button>
                                                        <button onClick={() => this.handleBlockContact(item.userid)}>Block</button>
                                                    </td>
                                            }

                                        </tr>;
                                    })
                                    :
                                    <p>Empty</p>
                            }


                        </tbody>
                    </table >
                    <div style={{ padding: 10 }}>
                        <div class="four wide field">
                            <input type="text" value={this.state.txtUserId} onChange={(event) => this.setState({ txtUserId: event.target.value })} />
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
            txtGroupId: "",
            txtGroupName: "",
            userid: sessionStorage.getItem("user_id")
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
                // get the id from the session cookie later
                query: r.table('users').get(sessionStorage.getItem("user_id")),
                changes: true,
                initial: [],
            }),
            groupsArray: new ReactRethinkdb.QueryRequest({
                query: r.table("groups").pluck("id"),
                changes: true,
                initial: [],
            }),
        };
    },

    handleCreateGroup() {

        let isExist = false
        let isAlreadyJoined = false

        if (this.state.txtGroupName == "") {
            return
        }

        if (!this.data.user.value().groups) {
            let addGroupField = r.table('users').get(this.state.userid).update({
                "groups": []
            });
            ReactRethinkdb.DefaultSession.runQuery(addGroupField);
        }


        let addingGroupQuery = r.table('groups').insert({
            "name": this.state.txtGroupName,
            "messages": [],
            "groupAdmin": { userid: this.state.userid },
        })


        ReactRethinkdb.DefaultSession.runQuery(addingGroupQuery).then(
            (res) => {
                if (res) {
                    console.log(res.generated_keys[0])
                    let addingGroup2UserQuery = r.table('users').get(this.state.userid).update({
                        groups: r.row('groups').append({ groupid: res.generated_keys[0] })
                    });
                    ReactRethinkdb.DefaultSession.runQuery(addingGroup2UserQuery);

                } else {
                    alert("invalid user")
                }
            })

        this.setState({ txtGroupName: '' })
    },

    handleJoinGroup() {

        let isExist = false
        let isAlreadyJoined = false

        if (this.state.txtGroupId == "") {
            return
        }

        if (!this.data.user.value().groups) {
            let addGroupField = r.table('users').get(this.state.userid).update({
                "groups": []
            });
            ReactRethinkdb.DefaultSession.runQuery(addGroupField);
        }



        let addingGroup2UserQuery = r.table('users').get(this.state.userid).update({
            groups: r.row('groups').append({ groupid: this.state.txtGroupId })
        });

        // let addingGroupQuery = r.table('groups').insert({
        //     "id": this.state.txtGroupId,
        //     "messages": []
        // })


        this.data.user.value().groups.map((item) => {
            if (item.groupid == this.state.txtGroupId) {
                isAlreadyJoined = true
            }
        })



        this.data.groupsArray.value().map((item) => {
            if (item.id == this.state.txtGroupId) {
                isExist = true
            }
        })

        if (isAlreadyJoined) {
            alert("You already joined in the group")
            return
        } else {
            if (isExist) {
                console.log("the group exist")
                ReactRethinkdb.DefaultSession.runQuery(addingGroup2UserQuery);
            } else {
                alert("The group does not exist")
            }
        }
        this.setState({ txtGroupId: '' })
    },

    handleLeaveGroup(value) {
        let query = r.table('users').get(this.state.userid).update({
            groups: r.row('groups').difference([{ groupid: value }])
        })
        ReactRethinkdb.DefaultSession.runQuery(query);
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
                                            <td><GroupInfo id={item.groupid} /></td>
                                            <td>
                                                <button onClick={() => this.props.history.push("/GroupMessages/" + item.groupid)}>Message</button>
                                                <button onClick={() => this.handleLeaveGroup(item.groupid)}>Leave</button>
                                            </td>
                                        </tr>;
                                    })
                                    :
                                    <p>Loading...</p>
                            }
                        </tbody>
                    </table >
                    <div style={{ padding: 10 }}>
                        <div class="four wide field">
                            <input type="text" value={this.state.txtGroupName} onChange={(event) => this.setState({ txtGroupName: event.target.value })} />
                        </div>
                        <button onClick={() => this.handleCreateGroup()}>Create group</button>


                        <div class="four wide field">
                            <input type="text" value={this.state.txtGroupId} onChange={(event) => this.setState({ txtGroupId: event.target.value })} />
                        </div>

                        <button onClick={() => this.handleJoinGroup()}>Join group</button>

                    </div>

                </center>


            </div>
        )

    },
});