import React, { Component } from 'react';
import { TrendData } from '../../api/impl/trending';
import '../../App.css';

type PropsType = {
    idx: number
    trendData: TrendData
}

type StateType = {
}

export class TrendUnit extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    render() {

        return <div className='trendunit'>
            <div className='content'>
                <p className='lightsmall'>{this.props.idx}. {this.props.trendData.catalog} Trending</p>
                <p className='boldlarge'>{this.props.trendData.key}</p>
                <p className='lightsmall'>{this.props.trendData.describe}</p>
            </div>
        </div>
    }
}
