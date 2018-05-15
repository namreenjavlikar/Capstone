import { Button, Image, List, Transition, Form } from 'semantic-ui-react'
import * as BS from 'react-bootstrap'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
const r = ReactRethinkdb.r;

const Question = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {

        };
    },

    observe(props, state) {
        return {
            question: new ReactRethinkdb.QueryRequest({
                query: r.table('questions').get(this.props.questionId),
                changes: true,
                initial: true,
            })
        };

    },


    render() {
        return (
            this.data.question.value() == true
                ?
                <div>Loading</div>
                :
                <div className="document-question-content">
                    <div id={this.data.question.value().id} className="document-question" class="uk-card uk-card-default uk-card-body">
                        <div className="document-question-header">
                            <p className="document-question-name">{this.data.question.value().question}</p>
                        </div>
                        {
                            this.data.question.value().choices.length !== 0
                            &&
                            <ol type="a" className="document-question-choices">
                                {
                                    this.data.question.value().choices.map((choice, index) =>
                                        <li key={index}>{choice}</li>
                                    )
                                }
                            </ol>
                        }
                        <p className="document-question-answer">A. {this.data.question.value().answer}</p>
                    </div>
                </div>
        )
    },
});

export default Question;