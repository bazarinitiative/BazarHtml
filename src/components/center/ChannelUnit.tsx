import React, { Component } from 'react';
import { ChannelDto } from '../../api/impl/getchannels';
import '../../App.css';

type PropsType = {
    dto: ChannelDto
}

type StateType = {
}

export class ChannelUnit extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    render() {

        var dto = this.props.dto;
        var channel = dto.channel;

        return <div className='' style={{ "border": "1px solid grey" }}>
            {channel.channelName}<br />
            {channel.description}
        </div>
    }
}
