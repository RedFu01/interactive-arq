import React from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import ArqPerformance from './views/ArqPerformance';
import Utilization from './views/Utilization';

import './styles/normalize.scss';
import './styles/app.scss';


const App = () => (
<Router>
        <Switch>
            <Route path="/" exact>
                {props => <ArqPerformance />}
            </Route>
            <Route path="/arq" exact>
                {props => <ArqPerformance />}
            </Route>
            <Route path="/utilization" exact>
                {props => <Utilization />}
            </Route>
        </Switch>
    </Router>
);

render(<App />, document.getElementById('app'));