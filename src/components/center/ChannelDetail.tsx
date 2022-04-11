import React, { Component } from 'react';
import { getChannel } from '../../api/impl/getchannel';
import { getChannelPosts } from '../../api/impl/getchannelposts';
import { ChannelDto } from '../../api/impl/getchannels';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { PostList } from './PostList';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
    channelID: string
}

type StateType = {
    channelDto: ChannelDto | null
}

export class ChannelDetail extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            channelDto: null
        };
    }

    async componentDidMount() {
        var ret = await getChannel(this.props.channelID);
        var dto = ret.data as ChannelDto
        this.setState({
            channelDto: dto
        })
    }

    async fetchData(channelID: string, page: number, size: number) {
        var userID = this.props.identityObj?.userID;
        var ret = await getChannelPosts(channelID, page, size, userID ?? "");
        return ret;
    }

    render() {

        if (this.state.channelDto == null) {
            return <div>loading for {this.props.channelID}</div>
        }
        var dto = this.state.channelDto;
        var channel = dto.channel;

        return <div className=''>
            <div style={{ "textAlign": "left" }}>
                ID: {channel.channelID}<br />
                Name: {channel.channelName} <br />
                Description: {channel.description}<br />
            </div>
            <div>
                <PostList
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.props.refreshMainCourse}
                    getPostData={this.fetchData.bind(this)}
                    resourceID={this.state.channelDto.channel.channelID}
                />
            </div>

        </div>
    }
}
