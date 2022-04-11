import React, { Component } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { sendChannel } from '../../api/impl/cmd/channel';
import { sendDelete } from '../../api/impl/cmd/delete';
import { ChannelDto } from '../../api/impl/getchannels';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { goURL } from '../../utils/bazar-utils';
import { logger } from '../../utils/logger';
import './Channel.css';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
    closeModal: any
    channelDto: ChannelDto
}

type StateType = {
}

export class ChannelEdit extends Component<PropsType, StateType> {
    nameCtl: HTMLInputElement | null | undefined;
    descrCtl: HTMLTextAreaElement | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    async saveChannel(channelID: string, name: string, descr: string) {
        var identityObj = this.props.identityObj
        if (identityObj == null) {
            return
        }
        var dd = await sendChannel(identityObj, channelID, name, descr);
        logger("channel-addChannel", dd);

        this.props.closeModal();
    }

    async deleteChannel(channelID: string) {
        if (!window.confirm('sure to delete this list?')) {
            return
        }
        var identityObj = this.props.identityObj
        if (identityObj == null) {
            return
        }
        var ret = await sendDelete(identityObj, "Channel", channelID);
        if (!ret.success) {
            alert(ret.msg)
            return
        }
        // this.props.closeModal();
        var url = '/list/'
        goURL(url, this.props.refreshMainCourse)
    }

    render() {

        var channel = this.props.channelDto.channel;

        return <div className=''>
            <div className='row'>
                <div className='one columns' style={{ "marginLeft": "0px" }}>
                    <button className="minibutton" onClick={this.props.closeModal}>
                        <AiOutlineClose />
                    </button>
                </div>
                <div className='six columns'>
                    <p>Edit List</p>
                </div>
            </div>
            <div>
                <table style={{ "border": "none" }}>
                    <tr>
                        <td style={{ "textAlign": "right", "verticalAlign": "top" }}>Name</td>
                        <td><input type="text" ref={x => this.nameCtl = x}
                            defaultValue={channel.channelName} /></td>
                    </tr>
                    <tr>
                        <td style={{ "textAlign": "right", "verticalAlign": "top" }}>Description</td>
                        <td><textarea placeholder='' ref={x => this.descrCtl = x}
                            defaultValue={channel.description} /></td>
                    </tr>
                </table>
                <div className='row'>
                    <div className='four columns'>
                        <button className='editlistbutton'
                            onClick={() => this.saveChannel(channel.channelID, this.nameCtl?.value ?? "", this.descrCtl?.value ?? "")} >
                            Save
                        </button>
                    </div>
                    <div className='four columns'>
                        <button className='editlistbutton'
                            onClick={() => this.deleteChannel(channel.channelID)} >
                            Delete
                        </button>
                    </div>

                </div>
            </div>
        </div>
    }
}
