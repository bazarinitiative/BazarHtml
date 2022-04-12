import React, { Component } from 'react';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { logger } from '../../utils/logger';
import { CMUnit } from './ChannelEditMember';
import { ChannelMemberUnit } from './ChannelMemberUnit';

type PropsType = {
    channelID: string
    mbs: CMUnit[]
    identityObj: Identity | null
    refreshMainCourse: any
    refreshMemberPage: any
}

type StateType = {
}

export class ChannelMemberList extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    render() {
        if (this.props.mbs.length === 0) {
            return <div>
                No data
            </div>
        }

        logger('memberlist', this.props.mbs)

        return <div>
            {
                Object.keys(this.props.mbs).map(x => <ChannelMemberUnit
                    key={this.props.mbs[Number(x)].userID}
                    identityObj={this.props.identityObj}
                    channelID={this.props.channelID}
                    userID={this.props.mbs[Number(x)].userID}
                    isMember={this.props.mbs[Number(x)].isMember}
                    cmID={this.props.mbs[Number(x)].cmID}
                    refreshMainCourse={this.props.refreshMainCourse}
                    refreshMemberPage={this.props.refreshMemberPage}
                />)
            }
        </div>
    }
}
