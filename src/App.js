import React from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import ArqPerformance from './views/ArqPerformance';

import './styles/normalize.scss';
import './styles/app.scss';


const App = () => (
<ArqPerformance />
);

render(<App />, document.getElementById('app'));