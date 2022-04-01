import React, { Component } from 'react';
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from '@material-ui/icons/Explore';
import PublicIcon from '@material-ui/icons/Public';
import { Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import '../App.css';
import './BottomLine.css'
import { goURL } from '../utils/bazar-utils';

type PropsType = {
    refreshMainCourse: any
}

type StateType = {
}

export class BottomLine extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    render() {
        var vb = "0,0,24,24"
        return <div className='bottomline'>
            <div className='bottomcmdline'>
                <div className=''>
                    <div className='bottomcmdcell'>
                        <HomeIcon viewBox={vb} className='lineicon' />
                        <Button onClick={() => goURL('/', this.props.refreshMainCourse)}>Home</Button>
                    </div>
                    <div className='bottomcmdcell'>
                        <PublicIcon viewBox={vb} className='lineicon' />
                        <Button onClick={() => goURL('/timeline', this.props.refreshMainCourse)}>Public</Button>
                    </div>
                    <div className='bottomcmdcell'>
                        <ExploreIcon viewBox={vb} className='lineicon' />
                        <Button onClick={() => goURL('/explore/', this.props.refreshMainCourse)}>Explore</Button>
                    </div>
                    <div className='bottomcmdcell'>
                        <SearchIcon viewBox={vb} className='lineicon' />
                        <Button onClick={() => goURL('/search/', this.props.refreshMainCourse)}>Search</Button>
                    </div>
                </div>
            </div>
        </div>;
    }
}
