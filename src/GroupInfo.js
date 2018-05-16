import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';

let r = ReactRethinkdb.r;

const GroupInfo = createReactClass({
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
            group: new ReactRethinkdb.QueryRequest({
                query: r.table('groups').get(this.props.id),
                changes: true,
                initial: [],
            })
        };
    },





    render() {
        return (
            <div>

                {
                    this.data.group.value()
                        ?
                        this.data.group.value()
                            ?
                            this.data.group.value().name
                            :
                            <div></div>
                        :
                        <div></div>
                }





            </div>
        )

    },
});

export default GroupInfo;