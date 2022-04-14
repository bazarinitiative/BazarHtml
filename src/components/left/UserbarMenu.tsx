import { MenuItem } from '@material-ui/core';
import React, { Component } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import '../../App.css';
import { Identity, UserDto } from '../../facade/entity';
import { getUserDto, getUserImgUrl, switchToIdentity } from '../../facade/userfacade';
import { getExtendIdentity, saveExtendIdentity } from '../../utils/identity-storage';

type PropsType = {
    identityObj: Identity | null
    userDto: UserDto
    openAddAccountModal: any
    logout: any
}

type StateType = {
    extUsers: UserDto[]
}

export class UserbarMenu extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            extUsers: []
        };
    }

    async componentDidMount() {
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

    render() {

        var userDto = this.props.userDto;
        var userInfo = userDto.userInfo;
        var extids = getExtendIdentity();
        var extlen = extids?.length ?? 0
        var outstr = `Log out @${userDto.userID.substring(0, 4)}...`
        if (extlen > 0) {
            outstr = `Log out all accounts`
        }

        return <div className='usermenutop'>
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
            <MenuItem onClick={this.props.openAddAccountModal}>
                <div className='mitem'>
                    Add an existing account
                </div>
            </MenuItem>
            {
                this.state.extUsers.map(x => <div>
                    <MenuItem>
                        <div className='mitem'>
                            <span className='mname linelimitlength usernameshort' onClick={() => { this.switch(x) }}>{x.userInfo.userName}</span>
                            <span className='mcross' onClick={() => { this.remove(x) }}><AiOutlineClose /></span>
                        </div>
                    </MenuItem>
                </div>)
            }
            <MenuItem onClick={this.props.logout}>
                <div className='mitem'>
                    {outstr}
                </div>
            </MenuItem>
        </div>
    }
}
