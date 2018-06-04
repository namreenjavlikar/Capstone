export const Title = {
    placeholderText: 'Title',
    charCounterCount: false,
    toolbarVisibleWithoutSelection: true,
    toolbarInline: true,
    toolbarButtons: [""],
    quickInsertButtons: [""]
}

export const Question = {
    placeholderText: 'Question',
    charCounterCount: false,
    toolbarVisibleWithoutSelection: true,
    toolbarInline: true,
    toolbarButtons: ['insertImage', 'insertFile', 'insertTable', 'insertLink', 'html'],
    imageDefaultAlign: 'left',
    imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
    imageInsertButtons: ['imageUpload', 'imageByURL'],
    imageUploadURL: 'http://localhost:3001/fileUpload',
    fileUploadURL: 'http://localhost:3001/fileUploadLink',
    events: {
        'froalaEditor.image.uploaded': async (e, editor, response) => {
            response = JSON.parse(response)
            console.log(response)
            editor.image.insert(response.link, true, null, editor.image.get(), (e) => { console.log(e) });
        },
        'froalaEditor.image.error': (e, editor, error, response) => {
            console.log("err", error)
        },
        'froalaEditor.imageManager.error': (e, editor, error, response) => {
            console.log("err2", error)
        },
        'froalaEditor.file.uploaded': (e, editor, response) => {
            response = JSON.parse(response)
            console.log(response)
        },
        'froalaEditor.file.error': (e, editor, error, response) => {
            console.log("file error", error)
        }
    }
}

export const Answer = {
    placeholderText: 'Answer',
    charCounterCount: false,
    toolbarVisibleWithoutSelection: true,
    toolbarInline: true,
    toolbarButtons: ['insertImage', 'insertFile', 'insertTable', 'insertLink', 'html'],
    //imageDefaultDisplay: 'inline',
    imageDefaultAlign: 'left',
    imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
    imageInsertButtons: ['imageUpload', 'imageByURL'],
    imageUploadURL: 'http://localhost:3001/fileUpload',
    fileUploadURL: 'http://localhost:3001/fileUploadLink',
    //linkAlwaysBlank: true,
    events: {
        'froalaEditor.image.uploaded': async (e, editor, response) => {
            response = JSON.parse(response)
            console.log(response)
            editor.image.insert(response.link, true, null, editor.image.get(), (e) => { console.log(e) });
        },
        'froalaEditor.image.error': (e, editor, error, response) => {
            console.log("err", error)
        },
        'froalaEditor.imageManager.error': (e, editor, error, response) => {
            console.log("err2", error)
        },
        'froalaEditor.file.uploaded': (e, editor, response) => {
            response = JSON.parse(response)
            console.log(response)
        },
        'froalaEditor.file.error': (e, editor, error, response) => {
            console.log("file error", error)
        }
    }
}

export const StudentQuestion = {
    charCounterCount: false,
    toolbarVisibleWithoutSelection: true,
    toolbarInline: true,
    toolbarButtons: [""],
    quickInsertButtons: [""],
    events: {
        'froalaEditor.initialized': function (e, editor) {
            editor.edit.off();
        }
    }

}
export const StudentAnswer = {
    placeholderText: 'Answer',
    charCounterCount: false,
    toolbarVisibleWithoutSelection: true,
    toolbarInline: true,
    toolbarButtons: ['insertImage', 'insertFile', 'insertTable', 'insertLink'],
    //imageDefaultDisplay: 'inline',
    imageDefaultAlign: 'left',
    imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
    imageInsertButtons: ['imageUpload', 'imageByURL'],
    imageUploadURL: 'http://localhost:3001/fileUpload',
    fileUploadURL: 'http://localhost:3001/fileUploadLink',
    //linkAlwaysBlank: true,
    events: {
        'froalaEditor.image.uploaded': async (e, editor, response) => {
            response = JSON.parse(response)
            console.log(response)
            editor.image.insert(response.link, true, null, editor.image.get(), (e) => { console.log(e) });
        },
        'froalaEditor.image.error': (e, editor, error, response) => {
            console.log("err", error)
        },
        'froalaEditor.imageManager.error': (e, editor, error, response) => {
            console.log("err2", error)
        },
        'froalaEditor.file.uploaded': (e, editor, response) => {
            response = JSON.parse(response)
            console.log(response)
        },
        'froalaEditor.file.error': (e, editor, error, response) => {
            console.log("file error", error)
        }
    }
}

export const SearchQuestion = {
    charCounterCount: false,
    toolbarVisibleWithoutSelection: true,
    toolbarInline: true,
    toolbarButtons: [""],
    quickInsertButtons: [""],
    events: {
        'froalaEditor.initialized': function (e, editor) {
            editor.edit.off();
        }
    }
 
 }