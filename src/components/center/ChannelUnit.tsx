import React, { Component } from 'react';
import { ChannelDto } from '../../api/impl/getchannels';
import '../../App.css';
import { UserDto } from '../../facade/entity';
import { getUserDto, getUserImgUrl } from '../../facade/userfacade';
import { goURL } from '../../utils/bazar-utils';

type PropsType = {
    dto: ChannelDto
    refreshMainCourse: any
}

type StateType = {
    user: UserDto | null
}

export class ChannelUnit extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            user: null
        };
    }

    async componentDidMount() {
        var user = await getUserDto(this.props.dto.channel.userID)
        this.setState({
            user: user
        })
    }

    onClick() {
        var url = `/listdetail/${this.props.dto.channel.channelID}`
        goURL(url, this.props.refreshMainCourse)
    }

    render() {

        if (this.state.user == null) {
            return <div>loading {this.props.dto.channel.channelID}</div>
        }

        var channelDto = this.props.dto;
        var channel = channelDto.channel;
        var userDto = this.state.user
        var userInfo = userDto.userInfo;

        return <div className='channelUnit' onClick={this.onClick.bind(this)}>
            <div style={{ "paddingLeft": "55px" }}>
                <div style={{ "marginLeft": "-55px", "width": "55px", "display": "inline-block" }}>
                    <img className='channelImg' src={getUserImgUrl(userDto)} alt="" />
                </div>
                <div style={{ "width": "100%", "display": "inline-block" }}>
                    <div style={{ "textAlign": "left" }}>{channel.channelName}</div>
                    <div style={{ "textAlign": "left" }}>
                        <span className='lightsmall linelimitlength usernameshort cellblock'>{userInfo.userName}</span>
                        <span className='lightsmall linelimitlength cellblock'>@{userInfo.userID.substring(0, 4)}...</span>
                    </div>
                </div>

            </div>

        </div>
    }
}
