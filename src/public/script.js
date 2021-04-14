(function(win, doc) {

    'use strict'

    /* Elements */

    const form = doc.querySelector('form');

    const formEntry = form.querySelector('#form-entry');

    const formEntryNote = formEntry.nextElementSibling;
    const formBtnsNote = form.lastElementChild;

    const formToken = form.querySelector('[name="_csrf"]');


    /* Utility functions */

    /*
        For data transfer, choice of URI encoding or JSON;
        JSON chosen & lines for URI encoding commented out.
    */

    /*
    const createURIString = (values) => {
        const substrings = [];
        for (let key in values) {
            substrings.push(encodeURIComponent(key)
                + '=' + encodeURIComponent(values[key]));
        };
        return substrings.join('&');
    };
    */

    const useFetch = (uri, options, expect) => {
        return fetch(uri, options)
            .then((res) => {
                if (expect && expect === 'JSON') {
                    return res.json();
                } else if (expect && expect === 'text') {
                    return res.text();
                };
            });
    };


    /* Form functionality */

    const noteContent = {
        entryAbsent: "No entry provided.",
        createBtnPressed: 'Creating entry...',
        readAllBtnPressed: 'Reading all entries...',
        deleteAllBtnPressed: 'Deleting all entries...',
        failure: 'Error: please try again.'
    };

    const setNote = (content='', note=formBtnsNote, warn=true) => {
        note.textContent = content;
        warn
            ? note.classList.add('text--warning')
            : note.classList.remove('text--warning');
    };

    const handleSubmit = (message, method, data = null) => {

        setNote(message, formBtnsNote, false);

        const options = {
            method: method.toUpperCase(),
            headers: {
                'CSRF-Token': formToken.value
            }
        };
        if (data) {
            options.headers['Content-Type'] = data.type;
            options.body = data.body;
        };

        useFetch('/entries', options, 'JSON')
            .then(data => {
                data.result.string &&
                    setNote(data.result.string, formBtnsNote, data.result.isError);
            })
            .catch(err => {
                setNote(noteContent.failure);
            });
    };

    const handleCreate = () => {

        if (!formEntry.value) {
            setNote(noteContent.entryAbsent, formEntryNote);
            return;
        };
        setNote('', formEntryNote);

        const entry = formEntry.value;
        /*
        handleSubmit(noteContent.createBtnPressed, 'POST', {
            body: createURIString({entry}),
            type: 'application/x-www-form-urlencoded'
        });
        */
        handleSubmit(noteContent.createBtnPressed, 'POST', {
            body: JSON.stringify({entry}),
            type: 'application/json'
        });
        formEntry.value = '';
    };

    const handleReadAll = () => {
        handleSubmit(noteContent.readAllBtnPressed, 'GET');
    };

    const handleDeleteAll = () => {
        handleSubmit(noteContent.deleteAllBtnPressed, 'DELETE');
    };

    form.addEventListener('click', event => {
        event.preventDefault();
        event.target.id === 'form-create' && handleCreate();
        event.target.id === 'form-read-all' && handleReadAll();
        event.target.id === 'form-delete-all' && handleDeleteAll();
    });

})(window, document);
