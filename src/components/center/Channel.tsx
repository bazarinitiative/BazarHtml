import React, { Component } from 'react';
import Modal from 'react-modal';
import { sendChannel } from '../../api/impl/cmd/channel';
import { ChannelDto, getUserChannels } from '../../api/impl/getchannels';
import '../../App.css';
import { randomString } from '../../utils/encryption';
import { getIdentity } from '../../utils/identity-storage';
import { logger } from '../../utils/logger';
import { ChannelUnit } from './ChannelUnit';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { AiOutlineClose } from 'react-icons/ai';
import { UserDto } from '../../facade/entity';
import { getUserDto } from '../../facade/userfacade';

type PropsType = {
    refreshMainCourse: any
}

type StateType = {
    chs: ChannelDto[]
    openModal: boolean
    userDto: UserDto | null
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export class Channel extends Component<PropsType, StateType> {
    nameCtl: HTMLInputElement | null | undefined;
    descrCtl: HTMLTextAreaElement | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            chs: [],
            openModal: false,
            userDto: null
        };
    }

    async componentDidMount() {
        await this.refreshPage();
    }

    getUserID() {
        var identityObj = getIdentity();
        var userID = identityObj?.userID ?? ""
        var ayPath = window.location.pathname.split('/', 10);
        if (ayPath[2].length > 0) {
            userID = ayPath[2]
        }
        return userID
    }

    async refreshPage() {
        var identityObj = getIdentity();
        if (identityObj == null) {
            return
        }

        var userID = this.getUserID()
        var ayPath = window.location.pathname.split('/', 10);
        if (ayPath[2].length > 0) {
            userID = ayPath[2]
        }
        var dto = await getUserDto(userID)
        if (dto == null) {
            return
        }

        var ret = await getUserChannels(userID);
        var chs = ret.data as ChannelDto[]
        this.setState({
            chs: chs,
            userDto: dto,
        })
    }

    async addChannel(name: string, descr: string) {
        var identityObj = getIdentity();
        if (identityObj == null) {
            return
        }
        var dd = await sendChannel(identityObj, randomString(30), name, descr);
        logger("channel-addChannel", dd);

        this.closeModal();
    }

    onClickIcon() {
        this.setState({
            openModal: true
        })
    }

    closeModal() {
        this.setState({
            openModal: false
        })
        this.props.refreshMainCourse();
    }

    render() {

        var vb = "0,0,24,24";
        var identityObj = getIdentity();
        var userID = this.getUserID();
        var isOwn = (identityObj?.userID === userID)

        return <div className=''>
            <div>
                <Modal
                    isOpen={this.state.openModal}
                    shouldCloseOnEsc={true}
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={this.closeModal.bind(this)}
                    style={customStyles}
                >
                    <div className='row'>
                        <div className='two columns' style={{ "marginLeft": "0px" }}>
                            <button className="miniclosebutton" onClick={this.closeModal.bind(this)}>
                                <AiOutlineClose />
                            </button>
                        </div>
                        <div className='six columns'>
                            <p>Create a new List</p>
                        </div>
                    </div>
                    <div>
                        <table style={{ "border": "none" }}>
                            <tr>
                                <td style={{ "textAlign": "right" }}>Name</td>
                                <td><input type="text" ref={x => this.nameCtl = x}></input></td>
                            </tr>
                            <tr>
                                <td style={{ "textAlign": "right" }}>Description</td>
                                <td><textarea placeholder='' ref={x => this.descrCtl = x}></textarea></td>
                            </tr>
                        </table>
                        <div style={{ "textAlign": "center" }}>
                            <button className='editlistbutton'
                                onClick={() => this.addChannel(this.nameCtl?.value ?? "", this.descrCtl?.value ?? "")} >
                                Add
                            </button>
                        </div>
                    </div>
                </Modal>

                <div className='row'>
                    <span className='ten columns'>
                        <h4><p>Lists</p></h4>
                        <p className='lightsmall' style={{ "marginTop": "-10px" }}>{`@${this.state.userDto?.userInfo.userName}`}</p>
                    </span>
                    {
                        isOwn ? <span className='two columns' style={{ "height": "40px" }} onClick={this.onClickIcon.bind(this)} >
                            <PlaylistAddIcon viewBox={vb}
                                style={{ "fontSize": "28px", "cursor": "pointer" }} />
                        </span>
                            : null
                    }

                </div>
            </div>
            {
                this.state.chs.map(x => <ChannelUnit
                    key={x.channel.channelID}
                    dto={x}
                    refreshMainCourse={this.props.refreshMainCourse}
                />)
            }
            {
                (this.state.chs.length === 0) ? <div>No data</div> : null
            }
            <br />
            <br />
            <br />
            <br />
        </div>
    }
}
