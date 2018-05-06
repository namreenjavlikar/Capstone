import React from 'react';
import ReactDOM from 'react-dom';
import ReactRethinkdb from 'react-rethinkdb';
import createReactClass from 'create-react-class';
import jwt from 'express-jwt'
import '../node_modules/uikit/dist/css/uikit.css';
import './App.css';
import photo from './photo.png';
import logo from './logo.png'

import { sign } from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import base64 from 'file-base64'
let r = ReactRethinkdb.r;


ReactRethinkdb.DefaultSession.connect({
    host: 'localhost',
    port: 8015,
    path: '/db',
    secure: false,
    db: 'capstone',
});

const Login = createReactClass({

    mixins: [ReactRethinkdb.DefaultMixin],


    getInitialState() {
        return {
            fileChosen: '',
            savedBlob: null
        }
    },

    observe(props, state) {
        return {
        };
    },
    uploadFile() {
        //get the file
        var files = document.getElementById('file').files;

        //convert to base64
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);

        //send to server
        reader.onload = function () {
            let result = reader.result
            result = result.replace(/\+/g, "-").replace(/\//g, '_').replace(/\=/g, '*')
            let query = r.table('files').insert({ savedfile: result, user: "nazha666" });
            ReactRethinkdb.DefaultSession.runQuery(query);
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        }
    },

    async retrieveFile() {
        let query = r.table('files').filter({ user: "nazha666" })

        let savedfile = {}
        await ReactRethinkdb.DefaultSession.runQuery(query).then(
            (res) => {
                res.toArray(function (err, results) {

                    // results[0].savedfile.replace(/\\n/g, "\\n")
                    //     .replace(/\\'/g, "\\'")
                    //     .replace(/\\"/g, '\\"')
                    //     .replace(/\\&/g, "\\&")
                    //     .replace(/\\r/g, "\\r")
                    //     .replace(/\\t/g, "\\t")
                    //     .replace(/\\b/g, "\\b")
                    //     .replace(/\\f/g, "\\f");

                    console.log(results[0].savedfile);
                    if (err) throw err;
                    console.log(results);
                    savedfile = results[0].savedfile.replace(/\-/g, "+").replace(/\_/g, '/').replace(/\*/g, '=')


                });
            })

        let contentType = ''
        let b64Data = ''
        contentType = savedfile.substring(savedfile.indexOf(":") + 1, savedfile.indexOf(";"))
        b64Data = savedfile.split(",")[1]

        contentType = contentType || '';
        let sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });

        this.setState({
            savedBlob: blob
        })

        var blobUrl = URL.createObjectURL(blob);
        var iframe = document.createElement('iframe');
        iframe.src = blobUrl;
        document.getElementById("maincontent").appendChild(iframe);
    },
    testing() {
        let contentType = ''
        let b64Data = ''
        var files = document.getElementById('file').files;
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = function () {
            contentType = reader.result.substring(reader.result.indexOf(":") + 1, reader.result.indexOf(";"))
            b64Data = reader.result.split(",")[1]

            contentType = contentType || '';
            let sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });

            var blobUrl = URL.createObjectURL(blob);
            var iframe = document.createElement('iframe');
            iframe.src = blobUrl;
            document.getElementById("maincontent").appendChild(iframe);

        };

    },
    downloadFile() {
        let url = window.URL.createObjectURL(this.state.savedBlob)
        let a = document.getElementById("downloadlink")
        a.href = url
        a.download = "downloadedfile"
    },

    render() {
        return (
            <div>
                <br />
                <br />
                <div>
                    <input type="file" id="file" />
                </div>
                <br />
                <button onClick={() => this.uploadFile()}>UPLOAD</button>
                <button onClick={() => this.retrieveFile()}>RETRIEVE</button>
                <br />
                <div id="maincontent"></div>

                <a id="downloadlink" onClick={() => this.downloadFile()}>Download</a>


            </div>
        )
    },
});

export default Login;