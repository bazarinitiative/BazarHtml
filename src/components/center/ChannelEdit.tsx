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
import { ChannelEditMember } from './ChannelEditMember';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
    closeModal: any
    channelDto: ChannelDto
}

type StateType = {
    isMember: boolean
}

export class ChannelEdit extends Component<PropsType, StateType> {
    nameCtl: HTMLInputElement | null | undefined;
    descrCtl: HTMLTextAreaElement | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            isMember: false
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

        if (!dd.success) {
            alert(dd.msg)
            return
        }

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

    editMember() {
        this.setState({
            isMember: true
        })
    }

    closeMember() {
        this.setState({
            isMember: false
        })
    }

    render() {

        var channel = this.props.channelDto.channel;

        if (this.state.isMember) {
            return <div>
                <ChannelEditMember
                    closeMember={this.closeMember.bind(this)}
                    channelID={channel.channelID}
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.props.refreshMainCourse}
                />
            </div>
        }

        return <div className='channeleditwnd'>
            <div className='row'>
                <div className='two columns' style={{ "marginLeft": "0px" }}>
                    <button className="miniclosebutton" onClick={this.props.closeModal}>
                        <AiOutlineClose />
                    </button>
                </div>
                <div className='eight columns'>
                    <p>Edit List</p>
                </div>
            </div>
            <div>
                <table className='cetable' style={{ "border": "none" }}>
                    <tr style={{}}>
                        <td style={{ "textAlign": "right", "verticalAlign": "top", "width": "60px", }}>Name</td>
                        <td style={{}}><input type="text" ref={x => this.nameCtl = x}
                            defaultValue={channel.channelName} /></td>
                    </tr>
                    <tr>
                        <td style={{ "textAlign": "right", "verticalAlign": "top", }}>Descr</td>
                        <td style={{}}><textarea placeholder='' ref={x => this.descrCtl = x}
                            defaultValue={channel.description} /></td>
                    </tr>
                </table>
                <div className='managemember'>
                    <div onClick={this.editMember.bind(this)}>Manage members {'>'}</div>
                </div>
                <div className='row aligncenter'>
                    <div className='four columns'>
                        <button className='editlistbutton'
                            onClick={() => this.saveChannel(channel.channelID, this.nameCtl?.value ?? "", this.descrCtl?.value ?? "")} >
                            Save
                        </button>
                    </div>
                    <div className='four columns'>
                        <button className='editlistbutton marginleft10'
                            onClick={() => this.deleteChannel(channel.channelID)} >
                            Delete
                        </button>
                    </div>

                </div>
            </div>
        </div>
    }
}
