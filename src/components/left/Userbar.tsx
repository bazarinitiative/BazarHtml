import React, { Component } from 'react';
import '../../App.css';
import './userbar.css'
import { Identity, UserDto } from '../../facade/entity';
import { getUserDto, getUserImgUrl } from '../../facade/userfacade';
import { Menu, MenuItem } from '@material-ui/core';
import { handleLogout } from '../../utils/bazar-utils';
import { AiOutlineCheck } from 'react-icons/ai';
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
    extUsers: UserDto[]
}

export class Userbar extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            userDto: null,
            openMenu: false,
            anckerEl: null,
            openModal: false,
            extUsers: []
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

        let ay: UserDto[] = []
        var ids = getExtendIdentity();
        if (ids) {
            await ids.reduce(async (prom, b) => {
                var ay = await prom
                var dto = await getUserDto(b.userID)
                if (dto) {
                    ay.push(dto)
                }
                return ay
            }, Promise.resolve(ay))
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

    logout() {
        var out = window.confirm("Sure to logout?")
        if (out) {
            handleLogout();
        }
    }

    addAccount() {
        this.setState({
            openMenu: false,
            openModal: true,
        })
    }

    render() {
        var userDto = this.state.userDto;
        if (userDto == null) {
            return <div></div>
        }
        var userInfo = userDto.userInfo

        return <div id='userbar' onClick={this.onMenu.bind(this)}>

            <Menu
                open={this.state.openMenu}
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
                    {/* <div className='usermenup'>
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
                    <MenuItem onClick={this.addAccount.bind(this)}>
                        <div className='mitem'>
                            Add an existing account
                        </div>
                    </MenuItem> */}
                    {
                        this.state.extUsers.map(x => <div>
                            <MenuItem>
                                <div className='mitem'>
                                    {x.userInfo.userName}
                                </div>
                            </MenuItem>
                        </div>)
                    }
                    <MenuItem onClick={this.logout.bind(this)}>
                        <div className='mitem'>
                            Log out @{userDto.userID.substring(0, 4)}...
                        </div>
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
