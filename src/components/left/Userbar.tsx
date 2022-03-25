import React, { Component } from 'react';
import '../../App.css';
import './userbar.css'
import { Identity, UserInfo } from '../../facade/entity';
import { getUserInfo } from '../../facade/userfacade';
import { Menu, MenuItem } from '@material-ui/core';
import { handleLogout } from '../../utils/bazar-utils';
import { HOST_CONCIG } from '../../bazar-config';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
}

type StateType = {
    user: UserInfo | null
    open: boolean
    anckerEl: any
}

export class Userbar extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            user: null,
            open: false,
            anckerEl: null
        };
    }

    async componentDidMount() {
        if (this.props.identityObj == null) {
            return;
        }
        var user = await getUserInfo(this.props.identityObj.userID);
        if (user == null) {
            return;
        }

        this.setState({
            user: user,
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
        var user = this.state.user;
        if (user == null) {
            return <div></div>
        }

        var username = user.userName;
        var usertitle = '';
        if (username.length > 10) {
            username = username.substring(0, 10) + '...';
            usertitle = user.userName;
        }

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
                        logout @{user.userID.substring(0, 4)}...
                    </MenuItem>
                </div>

            </Menu>

            <div className='row'>
                <div className="three columns">
                    <p className='pmargin'>
                        <img src={`${HOST_CONCIG.apihost}UserQuery/UserPicImage/${user.userID}.jpeg`} alt="" />
                    </p>
                </div>
                <div className="six columns" id="userinfo">
                    <p className="author" title={usertitle} style={{ "marginLeft": "25px", "textAlign": "left" }}>
                        {username}
                    </p>
                    <p id='userid' title={'UserID:' + user.userID} style={{ "marginLeft": "25px", "textAlign": "left" }}>
                        @{user.userID.substring(0, 4)}...
                    </p>
                </div>
                <div className='three columns'>
                    <p id='extshow'>...</p>
                </div>
            </div>
        </div >
    }
}
