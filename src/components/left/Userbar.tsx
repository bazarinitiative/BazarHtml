import React, { Component } from 'react';
import '../../App.css';
import './userbar.css'
import { Identity, UserDto } from '../../facade/entity';
import { getUserDto, getUserImgUrl } from '../../facade/userfacade';
import { Menu } from '@material-ui/core';
import { handleLogout } from '../../utils/bazar-utils';
import Modal from 'react-modal'
import { UserbarAddAccount } from './UserbarAddAccount';
import { UserbarMenu } from './UserbarMenu';
import { getExtendIdentity } from '../../utils/identity-storage';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
}

type StateType = {
    userDto: UserDto | null
    openMenu: boolean
    anckerEl: any
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

export class Userbar extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            userDto: null,
            openMenu: false,
            anckerEl: null,
            openModal: false,
        };
    }

    async componentDidMount() {
        if (this.props.identityObj == null) {
            return;
        }
        var user = await getUserDto(this.props.identityObj.userID);
        if (user == null) {
            return;
        }

        this.setState({
            userDto: user,
        })
    }

    onMenu(event: any) {
        var open = !this.state.openMenu
        this.setState({
            openMenu: open,
            anckerEl: event.currentTarget
        })
    }

    closeMenu() {
        this.setState({
            openMenu: false
        })
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
            openMenu: false,
            openModal: true,
        })
    }

    closeModal() {
        this.setState({
            openModal: false
        })
    }

    render() {
        if (this.state.userDto == null) {
            return <div></div>
        }
        var userDto = this.state.userDto;
        var userInfo = userDto.userInfo

        var ay = getExtendIdentity();
        var len = ay?.length ?? 0
        var menuv = 120 + len * 35;

        return <div id='userbar'>

            <Menu
                open={this.state.openMenu}
                anchorEl={this.state.anckerEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: menuv,
                    horizontal: 'right'
                }}
                onClose={this.closeMenu.bind(this)}
            >
                <UserbarMenu
                    identityObj={this.props.identityObj}
                    userDto={this.state.userDto}
                    openAddAccountModal={this.openAddAccountModal.bind(this)}
                    logout={this.logout.bind(this)}
                />
            </Menu>

            <Modal
                isOpen={this.state.openModal}
                shouldCloseOnEsc={true}
                shouldCloseOnOverlayClick={true}
                onRequestClose={this.closeModal.bind(this)}
                style={customStyles}
            >
                <UserbarAddAccount
                    closeModal={this.closeModal.bind(this)}
                />
            </Modal>

            <div className='row' onClick={this.onMenu.bind(this)}>
                <div className="three columns">
                    <p className='pmargin'>
                        <img src={getUserImgUrl(userDto)} alt="" />
                    </p>
                </div>
                <div className="seven columns userinfo">
                    <p className="author linelimitlength" style={{ "marginLeft": "25px", "textAlign": "left" }}>
                        {userInfo.userName}
                    </p>
                    <p className='userid' title={'UserID:' + userDto.userID} style={{ "marginLeft": "25px", "textAlign": "left" }}>
                        @{userDto.userID.substring(0, 4)}...
                    </p>
                </div>
                <div className='two columns'>
                    <p className='extshow'>...</p>
                </div>
            </div>
        </div >
    }
}
