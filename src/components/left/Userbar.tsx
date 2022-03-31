import React, { Component } from 'react';
import '../../App.css';
import './userbar.css'
import { Identity, UserDto } from '../../facade/entity';
import { getUserDto, getUserImgUrl } from '../../facade/userfacade';
import { Menu, MenuItem } from '@material-ui/core';
import { handleLogout } from '../../utils/bazar-utils';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
}

type StateType = {
    userDto: UserDto | null
    open: boolean
    anckerEl: any
}

export class Userbar extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            userDto: null,
            open: false,
            anckerEl: null
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
        var open = !this.state.open
        this.setState({
            open: open,
            anckerEl: event.currentTarget
        })
    }

    logout() {
        var out = window.confirm("Sure to logout?")
        if (out) {
            handleLogout();
        }
    }

    render() {
        var userDto = this.state.userDto;
        if (userDto == null) {
            return <div></div>
        }
        var userInfo = userDto.userInfo

        return <div id='userbar' onClick={this.onMenu.bind(this)}>

            <Menu
                id="ss-menu"
                open={this.state.open}
                anchorEl={this.state.anckerEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
                <div style={{ width: "100%" }}>
                    <MenuItem onClick={this.logout.bind(this)}>
                        logout @{userDto.userID.substring(0, 4)}...
                    </MenuItem>
                </div>

            </Menu>

            <div className='row'>
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
