import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';

let r = ReactRethinkdb.r;

const CourseInfo = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            
        };
    },

    observe(props, state) {
        return {
            course: new ReactRethinkdb.QueryRequest({
                query: r.table('courses').get(this.props.id),
                changes: true,
                initial: [],
            })
        };
    },





    render() {
        return (
            <div>

                {
                    this.data.course.value()
                        ?
                        this.data.course.value()
                            ?
                            this.data.course.value().name
                            :
                            <div></div>
                        :
                        <div></div>
                }





            </div>
        )

    },
});

export default CourseInfo;