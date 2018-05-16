import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
// import showdown from 'showdown';
// import ReactMarkdown from 'react-markdown'

let r = ReactRethinkdb.r;
// let converter = new showdown.Converter();


/// need a param for from and to in order to be complete
// so its almost complete

export const Single = createReactClass({
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
                query: r.table('users').get("f9724abf-3990-42ea-b3ca-846818fd3f46"),
                changes: true,
                initial: [],
            }),
            user: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(sessionStorage.getItem("user_id")),
                changes: true,
                initial: [],
            }),
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
        let query = r.table('users').get('f9724abf-3990-42ea-b3ca-846818fd3f46').update({
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


export const Group = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            userid: sessionStorage.getItem("user_id"),
            txtMessage: "",
        };
    },

    async componentWillMount() {
        if (!sessionStorage.getItem("token") ) {
            this.props.history.push("/")
        } 
    },

    observe(props, state) {
        return {
            messages: new ReactRethinkdb.QueryRequest({
                query: r.table('groups').get(this.props.match.params.id),
                changes: true,
                initial: [],
            }),
            user: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(sessionStorage.getItem("user_id")),
                changes: true,
                initial: [],
            }),
        };
    },

    handleSend() {

        console.log(this.data.user.value().name)


        let tempMessage = {
            from: this.data.user.value().name,
            to: "all",
            date: new Date(),
            content: this.state.txtMessage
        }

        let sendMessageQuery = r.table('groups').get(this.props.match.params.id).update({
            messages: r.row('messages').append(tempMessage)
        });

        ReactRethinkdb.DefaultSession.runQuery(sendMessageQuery);

        
        
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
                                    <td>{item.from} : {item.content}</td>
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



