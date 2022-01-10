import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

import ArqPerformance from './views/ArqPerformance';
import Utilization from './views/Utilization';

import './styles/normalize.scss';
import './styles/app.scss';


const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<ArqPerformance />} />
            <Route path="/arq" exact element={<ArqPerformance />} />
            <Route path="/utilization" exact element={<Utilization />} />
        </Routes>
    </Router>
);

export default App;