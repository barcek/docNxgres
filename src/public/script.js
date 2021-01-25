(function(win, doc) {

    'use strict'

    /* Elements */

    const form = doc.querySelector('form');

    const formEntry = form.querySelector('#form-entry');
    const formEntryNote = formEntry.nextElementSibling;

    const formToken = form.querySelector('[name="_csrf"]');

    const formCreate = form.querySelector('#form-create');
    const formReadAll = form.querySelector('#form-read-all');
    const formDeleteAll = form.querySelector('#form-delete-all');

    const formNote = form.lastElementChild;

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

    const messages = {
        entryAbsent: "No entry provided.",
        formCreatePressed: 'Creating entry...',
        formReadAllPressed: 'Reading all entries...',
        formDeleteAllPressed: 'Deleting all entries...',
        failure: 'Error: please try again.'
    };

    const setNote = (content='', note=formNote, warn=true) => {
        note.textContent = content;
        warn ?
            note.classList.add('text--warning') :
            note.classList.remove('text--warning');
    };

    const useFetchEntries = (options) => {
        useFetch('/entries', options, 'JSON')
            .then((data) => {
                data.result.string &&
                    setNote(data.result.string, formNote, data.result.isError);
            })
            .catch((err) => {
                setNote(messages.failure);
            });
    };

    formCreate.addEventListener('click', (event) => {

        event.preventDefault();

        if (!formEntry.value) {
            setNote(messages.entryAbsent, formEntryNote);
            return;
        };

        setNote('', formEntryNote);
        setNote(messages.formCreatePressed, formNote, false);

        const entry = formEntry.value;
        //const URIString = createURIString({entry});
        const JSONString = JSON.stringify({entry});
        useFetchEntries({
            method: 'POST',
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json',
                'CSRF-Token': formToken.value
            },
            //body: URIString,
            body: JSONString,
            credentials: 'include'
        });

        formEntry.value = '';
    });

    formReadAll.addEventListener('click', (event) => {
        event.preventDefault();
        setNote(messages.formReadAllPressed, formNote, false);
        useFetchEntries({
            method: 'GET',
            headers: {
                'CSRF-Token': formToken.value
            },
            credentials: 'include'
        });
    });

    formDeleteAll.addEventListener('click', (event) => {
        event.preventDefault();
        setNote(messages.formDeleteAllPressed, formNote, false);
        useFetchEntries({
            method: 'DELETE',
            headers: {
                'CSRF-Token': formToken.value
            },
            credentials: 'include'
        });
    });

})(window, document);
