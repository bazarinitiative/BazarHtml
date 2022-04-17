import React, { Component } from 'react';
import { AiOutlineArrowLeft, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import '../../App.css';
import { UserDto } from '../../facade/entity';
import { getUserDto, getUserImgUrl, switchToIdentity } from '../../facade/userfacade';
import { goURL, handleLogout } from '../../utils/bazar-utils';
import { getExtendIdentity, saveExtendIdentity } from '../../utils/identity-storage';
import './Account.css'
import Modal from 'react-modal'
import { AccountSwitchAdd } from './AccountSwitchAdd';

type PropsType = {
    refreshMainCourse: any
    ownerDto: UserDto | null
}

type StateType = {
    extUsers: UserDto[]
    openModal: boolean
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

export class AccountSwitch extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            extUsers: [],
            openModal: false,
        };
    }

    async componentDidMount() {
        await this.refreshPage();
    }

    async refreshPage() {
        let ay: UserDto[] = []
        var ids = getExtendIdentity();
        if (ids) {
            let pp: Promise<UserDto | null>[] = []
            ids.reduce((pp, b) => {
                var p = getUserDto(b.userID)
                pp.push(p)
                return pp
            }, pp)

            var tt = await Promise.all(pp)
            tt.forEach(x => {
                if (x != null) {
                    ay.push(x)
                }
            })
        }

        this.setState({
            extUsers: ay
        })
    }

    switch(x: UserDto) {
        if (!window.confirm(`sure switch to ${x.userInfo.userName}?`)) {
            return
        }
        var ret = switchToIdentity(x.userID)
        if (ret !== true) {
            alert(ret)
            return
        }
        window.location.reload()
    }

    remove(dd: UserDto) {
        if (!window.confirm('sure to remove account?')) {
            return
        }
        var ids = getExtendIdentity();
        if (ids == null) {
            return
        }
        var idx = ids.findIndex(x => x.userID === dd.userID)
        if (idx === -1) {
            return
        }
        ids.splice(idx, 1)
        saveExtendIdentity(ids)
        window.location.reload()
    }

    logout() {
        var out = window.confirm("Sure to logout?")
        if (out) {
            handleLogout();
        }
    }

    openAddAccountModal() {
        var extids = getExtendIdentity();
        var extlen = extids?.length ?? 0;
        if (extlen >= 4) {
            alert(`Number of account (${extlen + 1}) exceed limit`)
            return
        }
        this.setState({
            openModal: true,
        })
    }

    closeModal() {
        this.setState({
            openModal: false
        })
        this.refreshPage();
    }

    render() {
        if (this.props.ownerDto == null) {
            return <div>not login</div>
        }

        var userDto = this.props.ownerDto;
        var userInfo = userDto.userInfo;

        var extids = getExtendIdentity();
        var extlen = extids?.length ?? 0
        var outstr = `Log out @${userDto.userID.substring(0, 4)}...`
        if (extlen > 0) {
            outstr = `Log out all accounts`
        }

        return <div style={{ "margin": "5px" }}>
            <div>
                <p style={{ "fontWeight": "600" }}>
                    <span onClick={() => goURL('/', this.props.refreshMainCourse)}
                        style={{ "fontSize": "19px", "lineHeight": "19px", "display": "inline-block" }}>
                        <AiOutlineArrowLeft /> </span>
                    <span style={{ "marginLeft": "30px", "display": "inline-block" }}>Account</span>
                </p>
            </div>
            <div className='usermenup'>
                <div style={{ "maxWidth": "220px", marginBottom: '-3px', marginTop: '5px', "paddingLeft": "55px" }}>
                    <div style={{ "width": "55px", "marginLeft": "-55px", "display": "inline-block" }} >
                        <p><img src={getUserImgUrl(userDto)} alt="" /></p>
                    </div>
                    <div style={{ "width": "100%", "display": "inline-block", "paddingTop": "-50px" }}>
                        <div className='row'>
                            <div className='ten columns'>
                                <p className="author">
                                    <span className='linelimitlength usernameshort2'>{userInfo.userName}</span>
                                </p>
                                <p className="lightsmall" title={'UserID:' + userInfo.userID}>
                                    @{userInfo.userID.substring(0, 4)}...
                                </p>
                            </div>
                            <div className='two columns mcheck'>
                                <AiOutlineCheck />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ "textAlign": "left", "marginTop": "15px" }}>
                <div className='aitem' style={{ "color": "skyblue" }} onClick={this.openAddAccountModal.bind(this)}>
                    Add an existing account
                </div>
                <div>
                    {
                        this.state.extUsers.map(x => <div>
                            <div className='aitem'>
                                <span className='mname linelimitlength usernameshort' onClick={() => { this.switch(x) }}>{x.userInfo.userName}</span>
                                <span className='mcross' onClick={() => { this.remove(x) }}><AiOutlineClose /></span>
                            </div>
                        </div>)
                    }
                </div>
            </div>
            <div style={{ "textAlign": "left", "color": "red" }}>
                <div className='aitem' onClick={this.logout.bind(this)}>
                    {outstr}
                </div>
            </div>

            <Modal
                isOpen={this.state.openModal}
                shouldCloseOnEsc={true}
                shouldCloseOnOverlayClick={true}
                onRequestClose={this.closeModal.bind(this)}
                style={customStyles}
            >
                <AccountSwitchAdd
                    closeModal={this.closeModal.bind(this)}
                />
            </Modal>

        </div>
    }
}
