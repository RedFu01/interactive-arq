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
                            <Grid item xs={4}>
                                <Typography id="discrete-slider" gutterBottom>
                                    <span style={{color: '#3F88C5'}}>n</span>
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
                                    <span style={{color: '#FFD338'}}>n_h</span>
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
                                    R
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
                                    <span style={{ color: '#40C9A2' }}>T_p</span>
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
                                    <span style={{color: '#C5CBD3'}}>T_process</span>
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
                                    <span style={{color: '#DE3C4B'}}>T_x_ACK</span>
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
                            <Grid item xs={8}>
                                <Chart
                                    dataSource={this.getData()}
                                    title="Utilization of ARQ Methods"
                                >
                                    <CommonAxisSettings endOnTick={false} />
                                    <ArgumentAxis
                                        title="PER"
                                    />
                                    <ValueAxis
                                        visualRange={[0, 1]}
                                        title="Utilization"
                                    />
                                    <Series
                                        name="Stop &amp; Wait ARQ"
                                        valueField="y_saw"
                                        argumentField="per"
                                    />
                                    <Series
                                        name="Go-Back-N ARQ"
                                        valueField="y_gbn"
                                        argumentField="per"
                                    />
                                    <Series
                                        name="Selective Repeat ARQ"
                                        valueField="y_sr"
                                        argumentField="per"
                                    />
                                    <Legend visible={true} />
                                </Chart>
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