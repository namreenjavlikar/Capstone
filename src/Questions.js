import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';

let r = ReactRethinkdb.r;


export const All = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            name: "",
            content: "",
            choices: [],
            answer: '',
        };
    },

    observe(props, state) {
        return {
            questions: new ReactRethinkdb.QueryRequest({
                query: r.table('questions'),
                changes: true,
                initial: [],
            })
        };
    },

    handleSubmit() {
        let query = r.table('questions').insert({ name: this.state.name, content: this.state.content, answer: this.state.answer });
        ReactRethinkdb.DefaultSession.runQuery(query);
        this.setState({ name: '', content: '', answer: '' })
    },

    handleDelete(val) {
        let query = r.table('questions').get(val).delete();
        ReactRethinkdb.DefaultSession.runQuery(query);
    },

    render() {
        return (
            <div>
                <div>

                </div>
                <center><h1>Questions</h1>
                </center>
                <br />
                <center>
                    <table striped bordered condensed hover style={{ width: '70%' }} >
                        <thead>
                            <tr><th>Id</th><th>Name</th><th>content</th><th>answer</th><th>Actions</th></tr>
                        </thead>
                        <tbody>

                            {
                                this.data.questions.value().map((question) => {
                                    return <tr key={question.id}>
                                        <td>{question.id}</td>
                                        <td>{question.name}</td>
                                        <td>{question.content}</td>
                                        <td>{question.answer}</td>

                                        <td>
                                            <button disabled onClick={() => this.handleSubmit(question.id)}>View</button>
                                            <button disabled onClick={() => this.handleSubmit(question.id)}>Edit</button>
                                            <button onClick={() => this.handleDelete(question.id)}>Delete</button>
                                        </td>
                                    </tr>;
                                })
                            }
                        </tbody>
                    </table >
                </center>
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
            questions: new ReactRethinkdb.QueryRequest({
                query: r.table('questions'),
                changes: true,
                initial: [],
            })
        };
    },

    handleSubmit() {
        let query = r.table('questions').insert({ name: this.state.name, content: this.state.content, answer: this.state.answer, choices: this.state.choices, Type: this.state.questionType });
        ReactRethinkdb.DefaultSession.runQuery(query);
        this.setState({ name: '', content: '', answer: '' })
    },


    handleNameChange(evt) {
        this.setState({ name: evt.target.value });
    },

    handleAddChoice() {
        this.setState({ choices: this.state.choices.concat([{ name: '' }]) });
    },

    handleRemoveChoice(idx) {
        this.setState({ choices: this.state.choices.filter((s, sidx) => idx !== sidx) });
    },

    handleChoiceNameChange(idx, evt) {
        const newChoices = this.state.choices.map((choice, sidx) => {
            if (idx !== sidx) return choice;
            return { ...choice, name: evt };
        });

        this.setState({ choices: newChoices });
    },


    render() {
        return (
            <div>

                <div style={{ marginLeft: 130, marginRight: 5 }}>


                    <div class="ui raised very padded text container segment" style={{ height: '100vh' }}>
                        <center>
                            <h2 class="ui  header">Create Question</h2>
                        </center>
                        <hr class="uk-divider-icon" />
                        <div class="ui form">

                            <div class="four wide field">
                                <label>Name</label>
                                <input type="text" value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} />

                            </div>

                            <div class="four wide field">
                                <label>content</label>
                                <input type="text" name="answer" placeholder={this.state.content} value={this.state.content} onChange={e =>
                                    this.setState({ content: e.target.value })} />
                            </div>

                            <label>
                                <input
                                    type="radio"
                                    value="mcq"
                                    checked={this.state.questionType === "mcq"}
                                    onChange={e => this.setState({ questionType: e.target.value })}
                                />
                                Multiple Choice Question
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    value="sh"
                                    checked={this.state.questionType === "sh"}
                                    onChange={e => this.setState({ questionType: e.target.value })}
                                />
                                Short Answer
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    value="match"
                                    checked={this.state.questionType === "match"}
                                    onChange={e => this.setState({ questionType: e.target.value })}
                                />
                                Match
                            </label>

                            {
                                this.state.questionType == 'mcq'
                                    ?
                                    <div>
                                        <p>mcq</p>

                                        {this.state.choices.map((choice, idx) => (
                                            <div className="choice">
                                                <input
                                                    type="text"
                                                    placeholder={`Choice #${idx + 1} name`}
                                                    value={choice.name}
                                                    onChange={(e) => this.handleChoiceNameChange(idx, e.target.value)}
                                                />
                                                <button type="button" onClick={() => this.handleRemoveChoice(idx)} className="small">-</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={this.handleAddChoice} className="small">Add Choice</button>

                                        <div class="four wide field">
                                            <label>Answer</label>
                                            <input type="text" name="answer" placeholder={this.state.answer} value={this.state.answer} onChange={e =>
                                                this.setState({ answer: e.target.value })} />
                                        </div>

                                    </div>
                                    :
                                    this.state.questionType == 'sh'
                                        ?
                                        <div>
                                            <p>SH</p>

                                        </div>
                                        :
                                        this.state.questionType == 'match'
                                            ?
                                            <p>Match</p>
                                            :
                                            <p></p>

                            }



                            <button onClick={() => this.handleSubmit()}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});
