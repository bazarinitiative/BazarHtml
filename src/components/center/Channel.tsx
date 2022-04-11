import React, { Component } from 'react';
import { sendChannel } from '../../api/impl/cmd/channel';
import { ChannelDto, getChannels } from '../../api/impl/getchannels';
import '../../App.css';
import { randomString } from '../../utils/encryption';
import { getIdentity } from '../../utils/identity-storage';
import { logger } from '../../utils/logger';
import { ChannelUnit } from './ChannelUnit';

type PropsType = {
}

type StateType = {
    chs: ChannelDto[]
}

export class Channel extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            chs: []
        };
    }

    async componentDidMount() {
        var identityObj = getIdentity();
        if (identityObj == null) {
            return
        }

        var dd = await sendChannel(identityObj, randomString(30), "FreeChat", "list of free chat");
        logger("channel", dd);

        var ret = await getChannels(identityObj.userID);
        var chs = ret.data as ChannelDto[]
        this.setState({
            chs: chs
        })
    }

    render() {

        return <div className=''>
            {
                this.state.chs.map(x => <ChannelUnit
                    key={x.channel.channelID}
                    dto={x}
                />)
            }
            <br />
        </div>
    }
}
