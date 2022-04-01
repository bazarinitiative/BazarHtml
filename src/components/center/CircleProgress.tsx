import React, { Component } from 'react';

type PropsType = {
    curNum: number,
    totalNum: number,
    viewboxSize: number,
    hideOnZero: boolean,
    r?: number,
    strokeWidth?: number,
}

type StateType = {
}

export class CircleProgress extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);

        this.state = {
        };
    }

    async componentDidMount() {
    }

    render() {

        var len = this.props.viewboxSize;
        var rr = this.props.r ?? this.props.viewboxSize / 3;
        var cur = this.props.curNum;
        var total = this.props.totalNum;
        if (cur > 0) {
            if (cur / total < 0.02) cur = total * 0.02;
        }
        var percent = cur / total;
        var strokeWidth = this.props.strokeWidth ?? 2;
        var totalColor = "#e7e6e6";
        var rotateAngle = -90;

        var hideCircle = false;
        if (cur === 0 && this.props.hideOnZero) {
            hideCircle = true;
        }

        var leftNum = total - cur;
        var leftstr = "";
        var curColor = "green";
        if (leftNum <= 20) {
            curColor = "orange"
            leftstr = "" + leftNum;
            rr += 3;
        }
        if (leftNum < 0) {
            curColor = "red";
        }
        if (leftNum < -9) {
            hideCircle = true;
        }
        var tempoffset = 0;
        if (leftNum >= 0 && leftNum <= 9) {
            tempoffset = 3;
        }

        var pathlen = 2 * rr * Math.PI;
        var prog = percent * pathlen;

        return <svg style={{ "width": `${len}px`, "height": `${len}px`, "verticalAlign": "middle" }} viewBox={`0 0 ${len} ${len}`}>
            {hideCircle ? null : <circle cx="50%" cy="50%" fill='none' strokeWidth={strokeWidth} r={`${rr}`} stroke={totalColor}></circle>}
            {hideCircle ? null : <circle cx="50%" cy="50%" fill='none' strokeWidth={strokeWidth} r={`${rr}`} stroke={curColor}
                transform={`rotate(${rotateAngle}, ${len / 2}, ${len / 2})`}
                style={{ "strokeDasharray": `${prog}, ${pathlen}` }}></circle>}
            <text x={`${len / 2 - 6 + tempoffset}`} y={`${len / 2 + 5}`} fill={curColor} fontSize={"12"}>{leftstr}</text>
        </svg>
    }
}
