import { SettingsBackupRestoreRounded } from '@material-ui/icons';
import React from 'react';
import * as d3 from 'd3';
import './MessageSequenceChart.scss';

const pxPerS = 2000;

export default class MessageSequenceChart extends React.Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();

        this.WIDTH = 420;
        this.HEIGHT = 600;
        this.MARGIN = 30;
    }

    drawTimelines() {
        const {
            WIDTH,
            HEIGHT,
            MARGIN
        } = this;
        // Primary Time
        this.containerSVG.append("line")
            .attr("x1", WIDTH / 4)
            .attr("y1", MARGIN)
            .attr("x2", WIDTH / 4)
            .attr("y2", HEIGHT)
            .attr("stroke-width", 2)
            .attr("stroke", "black");

        // Secondary Time
        this.containerSVG.append("line")
            .attr("x1", 3 * WIDTH / 4)
            .attr("y1", MARGIN)
            .attr("x2", 3 * WIDTH / 4)
            .attr("y2", HEIGHT)
            .attr("stroke-width", 2)
            .attr("stroke", "black");

        this.containerSVG.append("text")
            .attr("text-anchor", "middle")
            .attr("x", WIDTH / 4)
            .attr("y", MARGIN * 0.75)
            .text("P");

        this.containerSVG.append("text")
            .attr("text-anchor", "middle")
            .attr("x", 3 * WIDTH / 4)
            .attr("y", MARGIN * 0.75)
            .text("S");
    }

    drawDashedLines() {
        this.dashedLines = [];
        const N = 2;
        for (let i = 0; i < N; i++) {
            const line = this.containerSVG.append("line");
            this.dashedLines.push(line);
        }
        this.updateDashedLines();
    }

    updateDashedLines() {
        const {
            WIDTH,
            MARGIN
        } = this;
        const { T_p, n, R, T_process, T_x_ACK } = this.props;
        const positions = [
            2 * MARGIN,
            2 * MARGIN + (2 * T_p + n / R + 2 * T_process + T_x_ACK) * pxPerS,
        ];
        const transition = d3.transition()
            .duration(200);
        for (let i = 0; i < this.dashedLines.length; i++) {
            this.dashedLines[i]
                .transition(transition)
                .attr("x1", WIDTH / 4)
                .attr("y1", positions[i])
                .attr("x2", 3 * WIDTH / 4)
                .attr("y2", positions[i])
                .attr("stroke-width", 1)
                .attr("stroke", "black")
                .attr("stroke-dasharray", 4)
        }
    }

    drawLegend() {
        this.propagationDelay1 = this.containerSVG.append("line");
        this.propagationDelay2 = this.containerSVG.append("line");
        this.processingDelay1 = this.containerSVG.append("line");
        this.processingDelay2 = this.containerSVG.append("line");
        this.transmissionDelay1 = this.containerSVG.append("line");
        this.transmissionDelay2 = this.containerSVG.append("line");
        this.updateLegend();
    }

    updateLegend() {
        const {
            WIDTH,
            MARGIN
        } = this;

        const transition = d3.transition()
            .duration(200);

        const { T_p, n, R, T_process, T_x_ACK } = this.props;

        this.propagationDelay1
            .transition(transition)
            .attr("x1", 3 * WIDTH / 4 + 10)
            .attr("y1", 2 * MARGIN)
            .attr("x2", 3 * WIDTH / 4 + 10)
            .attr("y2", 2 * MARGIN + T_p * pxPerS)
            .attr("stroke-width", 4)
            .attr("stroke", "#40C9A2");

        this.transmissionDelay1
            .transition(transition)
            .attr("x1", 3 * WIDTH / 4 + 10)
            .attr("y1", 2 * MARGIN + (T_p) * pxPerS)
            .attr("x2", 3 * WIDTH / 4 + 10)
            .attr("y2", 2 * MARGIN + (T_p + n / R) * pxPerS)
            .attr("stroke-width", 4)
            .attr("stroke", "#3F88C5");

        this.processingDelay1
            .transition(transition)
            .attr("x1", 3 * WIDTH / 4 + 10)
            .attr("y1", 2 * MARGIN + (T_p + n / R) * pxPerS)
            .attr("x2", 3 * WIDTH / 4 + 10)
            .attr("y2", 2 * MARGIN + (T_p + n / R + T_process) * pxPerS)
            .attr("stroke-width", 4)
            .attr("stroke", "#C5CBD3");

        const ACK_START = 2 * MARGIN + T_p * pxPerS + n / R * pxPerS + T_process * pxPerS;

        this.transmissionDelay2
            .transition(transition)
            .attr("x1", 3 * WIDTH / 4 + 10)
            .attr("y1", ACK_START)
            .attr("x2", 3 * WIDTH / 4 + 10)
            .attr("y2", ACK_START + T_x_ACK * pxPerS)
            .attr("stroke-width", 4)
            .attr("stroke", "#DE3C4B");

        this.propagationDelay2
            .transition(transition)
            .attr("x1", 3 * WIDTH / 4 + 10)
            .attr("y1", ACK_START + T_x_ACK * pxPerS)
            .attr("x2", 3 * WIDTH / 4 + 10)
            .attr("y2", ACK_START + (T_p + T_x_ACK) * pxPerS)
            .attr("stroke-width", 4)
            .attr("stroke", "#40C9A2");

        this.processingDelay2
            .transition(transition)
            .attr("x1", 3 * WIDTH / 4 + 10)
            .attr("y1", ACK_START + (T_p + T_x_ACK) * pxPerS)
            .attr("x2", 3 * WIDTH / 4 + 10)
            .attr("y2", ACK_START + (T_p + T_x_ACK) * pxPerS + T_process * pxPerS)
            .attr("stroke-width", 4)
            .attr("stroke", "#C5CBD3");
    }

    drawAck() {
        this.ackPoly = this.containerSVG.append("path");
        this.ackText = this.containerSVG.append("text");
        this.updateAck();
    }

    drawMessage() {
        this.msgPoly = this.containerSVG.append("path");
        this.msgPoly2 = this.containerSVG.append("path");
        this.msgHeaderPoly2 = this.containerSVG.append("path");
        this.msgHeaderPoly = this.containerSVG.append("path");
        this.msgText = this.containerSVG.append("text");
        this.msgText2 = this.containerSVG.append("text");
        this.updateMessage();
    }

    updateAck() {
        const {
            WIDTH,
            MARGIN
        } = this;

        const transition = d3.transition()
            .duration(200);

        const { T_p, n, R, T_process, T_x_ACK } = this.props;

        const points = [
            [3 * WIDTH / 4, 2 * MARGIN + T_p * pxPerS + n / R * pxPerS + T_process * pxPerS],
            [WIDTH / 4, 2 * MARGIN + T_p * pxPerS + n / R * pxPerS + T_p * pxPerS + T_process * pxPerS],
            [WIDTH / 4, 2 * MARGIN + T_p * pxPerS + n / R * pxPerS + T_p * pxPerS + T_x_ACK * pxPerS + T_process * pxPerS],
            [3 * WIDTH / 4, 2 * MARGIN + T_p * pxPerS + n / R * pxPerS + T_x_ACK * pxPerS + T_process * pxPerS]
        ];

        const y = points.map(p => p[1])
        const minY = Math.min(...y);
        const maxY = Math.max(...y);

        this.ackPoly
            .transition(transition)
            .attr("d", d3.line()(points)).
            attr("fill", "#DE3C4B")

        this.ackText
            .transition(transition)
            .attr("text-anchor", "middle")
            .attr("x", WIDTH / 2)
            .attr("y", minY + (maxY - minY) / 2 + 5)
            .text("ACK(N)");

    }

    updateMessage() {
        const {
            WIDTH,
            MARGIN
        } = this;

        const transition = d3.transition()
            .duration(200);

        const { T_p, n, n_h, R, T_process, T_x_ACK } = this.props;

        const points = [
            [WIDTH / 4, 2 * MARGIN],
            [3 * WIDTH / 4, 2 * MARGIN + T_p * pxPerS],
            [3 * WIDTH / 4, 2 * MARGIN + T_p * pxPerS + n / R * pxPerS],
            [WIDTH / 4, 2 * MARGIN + n / R * pxPerS]
        ];
        const headerPoints = [
            [WIDTH / 4, 2 * MARGIN],
            [3 * WIDTH / 4, 2 * MARGIN + T_p * pxPerS],
            [3 * WIDTH / 4, 2 * MARGIN + T_p * pxPerS + n_h / R * pxPerS],
            [WIDTH / 4, 2 * MARGIN + n_h / R * pxPerS]
        ];
        const ACK_RVD = 2 * MARGIN + T_p * pxPerS + n / R * pxPerS + T_p * pxPerS + T_x_ACK * pxPerS + T_process * pxPerS
        const points2 = [
            [WIDTH / 4, ACK_RVD + T_process * pxPerS],
            [3 * WIDTH / 4, ACK_RVD + T_process * pxPerS + T_p * pxPerS],
            [3 * WIDTH / 4, ACK_RVD + T_process * pxPerS + T_p * pxPerS + n / R * pxPerS],
            [WIDTH / 4, ACK_RVD + T_process * pxPerS + n / R * pxPerS]
        ];

        const headerPoints2 = [
            [WIDTH / 4, ACK_RVD + T_process * pxPerS],
            [3 * WIDTH / 4, ACK_RVD + T_process * pxPerS + T_p * pxPerS],
            [3 * WIDTH / 4, ACK_RVD + T_process * pxPerS + T_p * pxPerS + n_h / R * pxPerS],
            [WIDTH / 4, ACK_RVD + T_process * pxPerS + n_h / R * pxPerS]
        ];

        const y = points.map(p => p[1])
        const minY = Math.min(...y);
        const maxY = Math.max(...y);

        const y2 = points2.map(p => p[1])
        const minY2 = Math.min(...y2);
        const maxY2 = Math.max(...y2);

        this.msgPoly
            .transition(transition)
            .attr("d", d3.line()(points)).
            attr("fill", "#3F88C5")

        this.msgHeaderPoly
            .transition(transition)
            .attr("d", d3.line()(headerPoints)).
            attr("fill", "#FFD338")

        this.msgPoly2
            .transition(transition)
            .attr("d", d3.line()(points2)).
            attr("fill", "#3F88C5")

        this.msgHeaderPoly2
            .transition(transition)
            .attr("d", d3.line()(headerPoints2)).
            attr("fill", "#FFD338")

        this.msgText
            .transition(transition)
            .attr("text-anchor", "middle")
            .attr("x", WIDTH / 2)
            .attr("y", minY + (maxY - minY) / 2 + 5)
            .text("I(N)");

        this.msgText2
            .transition(transition)
            .attr("text-anchor", "middle")
            .attr("x", WIDTH / 2)
            .attr("y", minY2 + (maxY2 - minY2) / 2 + 5)
            .text("I(N+1)");
    }

    draw() {
        const {
            WIDTH,
            HEIGHT,
            MARGIN
        } = this;

        this.containerSVG = d3.select(this.containerRef.current)
            .append('svg')
            .attr('width', WIDTH)
            .attr('height', HEIGHT);


        this.drawMessage();
        this.drawAck();
        this.drawDashedLines();
        this.drawTimelines();
        this.drawLegend();
    }

    componentDidMount() {
        this.draw();
    }

    componentDidUpdate() {
        this.updateMessage();
        this.updateAck();
        this.updateDashedLines();
        this.updateLegend();
    }

    render() {
        return (
            <div className="c-message-sequence-chart">
                <div ref={this.containerRef} />
                <div className="c-message-sequence-chart__fade" />
            </div>
        );
    }
}