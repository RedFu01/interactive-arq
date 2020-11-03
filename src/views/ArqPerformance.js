import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {
    Chart,
    Series,
    ArgumentAxis,
    ValueAxis,
    Legend,
    Crosshair,
    Label,
    HorizontalLine,
    CommonAxisSettings,
} from 'devextreme-react/chart';


import MessageSequenceChart from '../components/MessageSequenceChart/MessageSequenceChart';


const crosshairFormat = {
    type: 'fixedPoint',
    precision: 2
};


export default class ArqPerformance extends React.Component {
    constructor(props) {
        super(props);

        this.initialState = {
            R: 2000,
            n: 100,
            n_h: 10,
            T_p: 0.01,
            T_process: 0.01,
            T_x_ACK: 0.005
        };

        this.state = {
            ...this.initialState
        }
    }

    getData() {
        const {
            T_p, T_process, n, n_h, R, T_x_ACK
        } = this.state;
        const data = [];
        const step = 0.005;
        for (let per = 0; per <= 1; per += step) {
            const T_rt = 2 * T_p + T_x_ACK + 2 * T_process;

            const o = 1 - n_h / n;

            const y_saw = n * (1 - per) / (n + R * T_rt) * o;
            const y_gbn = n * (1 - per) / (n + R * T_rt * per) * o;
            const y_sr = (1 - per) * o;

            data.push({
                per,
                y_saw,
                y_gbn: per == 0 ? o : y_gbn,
                y_sr
            });
        }
        return data;
    }

    setValue(name, value) {
        clearTimeout(this.handler);
        this.handler = setTimeout(() => {
            this.setState(prevState => ({
                ...prevState,
                [name]: value,
                //loading: true
            }));
            setTimeout(() => {
                this.setState({
                    loading: false
                })
            }, 200);
        }, 200);
    }


    render() {
        const {
            n,
            n_h,
            R,
            T_p,
            T_process,
            T_x_ACK
        } = this.initialState;
        return (
            <div style={{ margin: '2rem' }}>
                <Paper elevation={3}>
                    <div style={{ padding: '2rem' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={8}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="h4" gutterBottom>
                                            Channel utilization of Stop-and-Wait ARQ
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography id="discrete-slider" gutterBottom>
                                            Segment Length [bit]<br/><span style={{ color: '#3F88C5' }}>n<sub>&nbsp;</sub></span>
                                        </Typography>
                                        <Slider
                                            step={1}
                                            min={100}
                                            max={200}
                                            defaultValue={n}
                                            valueLabelDisplay="auto"
                                            onChange={(_, v) => this.setValue('n', v)}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography id="discrete-slider" gutterBottom>
                                            Header Length [bit]<br/><span style={{ color: '#FFD338' }}>n<sub>h</sub></span>
                                        </Typography>
                                        <Slider
                                            step={1}
                                            min={0}
                                            max={50}
                                            defaultValue={n_h}
                                            valueLabelDisplay="auto"
                                            onChange={(_, v) => this.setValue('n_h', v)}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography id="discrete-slider" gutterBottom>
                                            Transmission Rate [bit/s]<br/>R<sub>&nbsp;</sub>
                                        </Typography>
                                        <Slider
                                            step={1}
                                            min={1000}
                                            max={4000}
                                            defaultValue={R}
                                            valueLabelDisplay="auto"
                                            onChange={(_, v) => this.setValue('R', v)}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography id="discrete-slider" gutterBottom>
                                            Propagation Delay [s]<br/>
                                            <span style={{ color: '#40C9A2' }}>T<sub>p</sub></span>
                                        </Typography>
                                        <Slider
                                            step={0.01}
                                            min={0}
                                            max={0.3}
                                            defaultValue={T_p}
                                            valueLabelDisplay="auto"
                                            onChange={(_, v) => this.setValue('T_p', v)}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography id="discrete-slider" gutterBottom>
                                            Processing Delay [s] <br/>
                                            <span style={{ color: '#C5CBD3' }}>T<sub>process</sub></span>
                                        </Typography>
                                        <Slider
                                            step={0.001}
                                            min={0}
                                            max={0.01}
                                            defaultValue={T_process}
                                            valueLabelDisplay="auto"
                                            onChange={(_, v) => this.setValue('T_process', v)}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography id="discrete-slider" gutterBottom>
                                            Acknowledgement Delay [s]<br/>
                                            <span style={{ color: '#DE3C4B' }}>T<sub>x, ACK</sub></span>
                                        </Typography>
                                        <Slider
                                            step={0.005}
                                            min={0}
                                            max={0.1}
                                            defaultValue={T_x_ACK}
                                            valueLabelDisplay="auto"
                                            onChange={(_, v) => this.setValue('T_x_ACK', v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                {!this.state.loading && <MessageSequenceChart
                                    {...this.state}
                                />}
                            </Grid>
                        </Grid>

                    </div>
                </Paper>
            </div>
        )
    }
}