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
        let query = r.table('users').get('c8aabc5c-8eff-4aa7-b3bd-68ad1ae1aa2a').update({
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


export const Details = createReactClass({
    mixins: [ReactRethinkdb.DefaultMixin],

    getInitialState() {
        return {
            question: "",
            answer: "",
            content: "",
            htmlcode: ""
        };
    },

    observe(props, state) {
        return {
            exam: new ReactRethinkdb.QueryRequest({
                query: r.table('exams').get(this.props.match.params.id),
                changes: true,
                initial: true,
            }),
        };

    },

    handleAddQuestion() {
        let lines = this.state.content.split('\n')
        console.log("lines", lines)

        let questions = []
        let question = null
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] !== "") {
                if (lines[i].startsWith('Title:')) {
                    question != null && questions.push(question)
                    question = {}
                    question.title = lines[i].split(":")[1].trim()
                }
                else if (question.title && !question.question) {
                    question.question = lines[i]
                    question.choices = []
                }
                else if (question.title && question.question) {
                    if (lines[i].startsWith("*")) {
                        if (lines[i].includes(")")) {
                            question.answer = lines[i].split(")")[1].trim()
                        }
                        else {
                            question.answer = lines[i].substring(1)
                        }
                    }
                    if (lines[i].includes(")")) {
                        question.choices.push(lines[i].split(")")[1].trim())
                    }
                }
            }
        }

        question != null && questions.push(question)
        console.log("questions", questions)

        questions.map((question) => {
            let query = r.table('exams').get(this.props.match.params.id).update({
                questions: r.row('questions').append(question)
            })
            ReactRethinkdb.DefaultSession.runQuery(query);
        })

        // let query = r.table('exams').get(this.props.match.params.id).update({
        //     questions: r.row('questions').append(
        //         { question: this.state.question, answer: this.state.answer }
        //     )
        // })

    },

    handleDeleteQuestion(question) {
        let query = r.table('exams').get(this.props.match.params.id).update({
            questions: r.row('questions').difference([{ question: question.question, answer: question.answer }])
        })
        ReactRethinkdb.DefaultSession.runQuery(query);
    },

    handleEditQuestion(question) {
        //let query = r.table('exams').get(this.props.match.params.id).update({
        //    questions: r.row('questions').difference([{ question: question.question, answer: question.answer }])
        //})
        //ReactRethinkdb.DefaultSession.runQuery(query);
        this.setState({ question: question.question, answer: question.answer })

    },

    async handleMarkdown(e) {
        await this.setState({ content: e.target.value })
        let html = converter.makeHtml(this.state.content)
        await this.setState({ htmlcode: html })
    },

    render() {
        return (
            this.data.exam.value() == true
                ?
                <div>Loading</div>
                :
                <div>
                    Exam: {this.props.match.params.id}
                    <div className="exam">
                        {
                            this.data.exam.value().questions.map((question, index) =>
                                <div key={index} className="question">
                                    {/* <p>Title: {question.title}</p> */}
                                    <p>Q{index + 1}. {question.question} ({question.marks}m)</p>
                                    {
                                        question.choices.length !== 0
                                        &&
                                        <ol type="a">
                                            {
                                                question.choices.map((choice, index) =>
                                                    <li key={index}>{choice}</li>
                                                )
                                            }
                                        </ol>
                                    }
                                    <p>A. {question.answer}</p>
                                    <button onClick={() => this.handleDeleteQuestion(question)}>Delete</button>
                                    <button onClick={() => this.handleEditQuestion(question)}>Edit</button>
                                    <br /><br />
                                </div>
                            )
                        }
                    </div>


                    <input type="text" name="question" placeholder="Question" value={this.state.question} onChange={e =>
                        this.setState({ question: e.target.value })} />
                    <input type="text" name="answer" placeholder="Answer" value={this.state.answer} onChange={e =>
                        this.setState({ answer: e.target.value })} />
                    <br />
                    <textarea value={this.state.content} style={{ width: 800, height: 250 }} placeholder="Enter Markdown" onChange={(e) => this.handleMarkdown(e)} />
                    <br />
                    {/* <br/>
                    <textarea value={this.state.htmlcode} style={{ width: 800, height: 250 }} placeholder="Enter HTML" />
                    <br/>
                    <div dangerouslySetInnerHTML={{ __html: this.state.htmlcode}}></div>
                    <ReactMarkdown source={this.state.content} /> */}
                    <button onClick={() => this.handleAddQuestion()}>Add Question</button>
                </div>

        )

    },
});
