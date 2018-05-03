import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { dark } from 'react-syntax-highlighter/styles/prism';
import createReactClass from 'create-react-class'
import CodeMirror from 'react-codemirror'
import React from 'react'

const SyntaxHighlightTest = createReactClass({
    getInitialState() {
        return {
            code: `
            //hello comment here
            <center>
            <div className="uk-card uk-card-default uk-card-body uk-width-1-4@m  login-card" style={{ borderRadius: 20 }}>
                <img src={logo} style={{ width: 200, height: 150 }} />
                <hr />
                <h2 className="reset-title2"><strong>Enter your email to reset password</strong></h2>
                <div className="uk-margin"  >
                    <div className="uk-inline reset-input">
                        <input className="uk-input reset-input" type="email" value={this.state.email} placeholder="Enter Your Email" onChange={
                            (event) => this.setState({ email: event.target.value, error: '' })} />
                    </div>
                    <p>{this.state.errorMessage}</p>
                </div>
                <button className="uk-button reset-btn" onClick={() => this.sendEmail()}>Send email</button>

            </div>
        </center>`,
        };
    },

    render() {
        return (
            <div>
                <SyntaxHighlighter language='javascript'>{this.state.code}</SyntaxHighlighter>
            </div>
        )
    }
})
export default SyntaxHighlightTest