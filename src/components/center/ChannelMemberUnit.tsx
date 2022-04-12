import React, { Component } from 'react';
import { sendChannelMember } from '../../api/impl/cmd/channelMember';
import { sendDelete } from '../../api/impl/cmd/delete';
import '../../App.css';
import { Identity, UserDto } from '../../facade/entity';
import { getUserDto, getUserImgUrl } from '../../facade/userfacade';
import { goURL } from '../../utils/bazar-utils';
import { logger } from '../../utils/logger';

type PropsType = {
    identityObj: Identity | null
    channelID: string
    userID: string
    isMember: boolean
    cmID: string
    refreshMainCourse: any
    refreshMemberPage: any
}

type StateType = {
    userDto: UserDto | null
}

export class ChannelMemberUnit extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            userDto: null,
        };
    }

    async componentDidMount() {
        logger('ChannelMemberUnit', this.props.userID)
        var dto = await getUserDto(this.props.userID)
        this.setState({
            userDto: dto
        })
    }

    onClickUser() {
        var url = '/p/' + this.props.userID;
        goURL(url, this.props.refreshMainCourse)
    }

    async onClickAddRemove() {
        if (this.props.identityObj == null) {
            return
        }

        if (this.props.isMember) {
            var res = await sendDelete(this.props.identityObj, "ChannelMember", this.props.cmID);
            logger('ChannelMemberUnit-clickAdd', res);
            this.props.refreshMemberPage();
        }
        else {
            var ret = await sendChannelMember(this.props.identityObj, this.props.channelID, this.props.userID);
            logger('ChannelMemberUnit-clickAdd', ret)
            this.props.refreshMemberPage();
        }

    }

    render() {
        if (this.state.userDto == null) {
            return <div>
                loading
            </div>
        }

        var user = this.state.userDto.userInfo;
        var addremovestr = this.props.isMember ? "Remove" : "Add";

        return <div className='mightlikeunit'>
            <div style={{ "maxWidth": "220px", marginBottom: '-3px', marginTop: '5px', "paddingLeft": "55px" }}>
                <div style={{ "width": "55px", "marginLeft": "-55px", "display": "inline-block" }} onClick={this.onClickUser.bind(this)}>
                    <p><img style={{ "marginTop": "0px" }} src={getUserImgUrl(this.state.userDto)} alt="" /></p>
                </div>
                <div style={{ "width": "100%", "display": "inline-block" }}>
                    <div className='row'>
                        <div className='eight columns' onClick={this.onClickUser.bind(this)}>
                            <p className="author">
                                <span className='linelimitlength usernameshort2'>{user.userName}</span>
                            </p>
                            <p className="author" title={'UserID:' + user.userID}>
                                @{user.userID.substring(0, 4)}...
                            </p>
                        </div>
                        <div className='three columns'>
                            <button className='followbutton' onClick={this.onClickAddRemove.bind(this)}>{addremovestr}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
