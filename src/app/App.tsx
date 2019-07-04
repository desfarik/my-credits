import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {MainComponent} from './components/main.component';

import './global.scss';

ReactDOM.render(<MainComponent/>,
    document.getElementById('root'));

if ("serviceWorker" in navigator) {
    if (navigator.serviceWorker.controller) {
        console.log("[PWA Builder] active service worker found, no need to register");
    } else {
        // Register the service worker
        navigator.serviceWorker
            .register('service.worker.js', {
                scope: "./"
            })
            .then(function (reg) {
                console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
            });
    }
}