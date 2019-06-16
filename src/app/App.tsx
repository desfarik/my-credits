import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {MainComponent} from './components/main.component';

declare let module: any
import './global.scss';

ReactDOM.render(<MainComponent/>,
    document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
}