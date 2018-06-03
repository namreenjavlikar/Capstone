import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';

let r = ReactRethinkdb.r;

const Userinfo = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            contacts: [],
            txtUsername: "",
            userid: sessionStorage.getItem("user_id")
        };
    },

    observe(props, state) {

        return {
            user: new ReactRethinkdb.QueryRequest({
                query: r.table('users').get(this.props.id),
                changes: true,
                initial: [],
            })
        };
    },


    render() {
        return (
            <span>

                {
                    this.data.user.value()
                        ?
                        this.data.user.value().collegeid && this.data.user.value().status
                            ?
                            <span >

                                {this.data.user.value().collegeid + "   "} 

                               

                                    {
                                        this.data.user.value().status == "online" && this.props.option == "1"
                                        ?
                                        <span class="chat-online-status"></span>
                                        :
                                        <span class="chat-offline-status"></span>
                                    }


                                


                            </span>
                            :
                            <div></div>
                        :
                        <div></div>
                }

            </span>
        )

    },
});

export default Userinfo;