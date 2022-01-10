import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

const LinkTab = (props) => {
    return (
        <Tab
            component="a"
            onClick={() => {}}
            {...props}
        />
    );
}

const Nav = () => {
    const path = window.location.pathname;
    const value = path === '/utilization' ? 1 : 0;
    return (
        <Paper elevation={3}>
            <Tabs
                indicatorColor="primary"
                textColor="primary"
                onChange={() => null}
                value={value}
                centered
            >
                <LinkTab
                    label="Message Sequence Chart"
                    href="/"
                />
                <LinkTab
                    label="Utilization Graph"
                    href="/utilization"
                />
            </Tabs>
        </Paper>
    );
}

export default Nav;