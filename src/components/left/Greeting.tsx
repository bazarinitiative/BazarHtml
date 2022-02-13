import React, { Component } from 'react';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { Sidebar } from './SideBar';
import { Userbar } from './Userbar';

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any
}

type StateType = {
}

export class Greeting extends Component<PropsType, StateType> {
    render() {
        return <div>
            <Sidebar refreshMainCourse={this.props.refreshMainCourse} />
            <div>
                <Userbar
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.props.refreshMainCourse}
                />
            </div>
        </div>
    }
}
