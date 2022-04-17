import React, { Component } from 'react';
import '../../App.css';
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';
import PublicIcon from '@material-ui/icons/Public';
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import ListAltIcon from "@material-ui/icons/ListAlt";
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import { MenuItem } from '@material-ui/core';
import { goURL, handleLogout } from '../../utils/bazar-utils';
import { Identity, UserDto } from '../../facade/entity';
import { getUserImgUrl } from '../../facade/userfacade';
import { AiOutlineSwap } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';

type PropsType = {
    identityObj: Identity | null
    ownerDto: UserDto | null
    refreshMainCourse: any
}

type StateType = {
}

export class HomeMenu extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    logout() {
        var out = window.confirm("Sure to logout?")
        if (out) {
            handleLogout();
        }
    }

    render() {
        if (this.props.ownerDto == null) {
            return <div>not login yet</div>
        }

        var userID = this.props.identityObj?.userID ?? "";
        var vb = "0,0,24,24"
        var dto = this.props.ownerDto;
        var stat = this.props.ownerDto.userStatistic;

        return <div>
            <div style={{ "padding": "8px 8px 2px 20px", "minWidth": "200px" }} >
                <div style={{ "fontSize": "14px", "fontWeight": "600" }}>
                    <span style={{ "width": "90%", "display": "inline-block" }}>Account info</span>
                    <span style={{ "verticalAlign": "middle", "display": "inline-block" }}> <GrClose /> </span>
                </div>
                <div className="row" style={{ "marginTop": "20px" }}>
                    <div style={{ "display": "inline-block", "verticalAlign": "top", "width": "88%" }}>
                        <p>
                            <a className='userimg' href={'/p/' + userID}>
                                <img src={getUserImgUrl(this.props.ownerDto)} alt="" style={{ width: "35px" }} />
                            </a>
                        </p>
                    </div>
                    <div style={{ "display": "inline-block", "verticalAlign": "middle", "marginTop": "15px", "fontSize": "17px" }}>
                        <span onClick={() => { goURL('/account/switch', this.props.refreshMainCourse) }}><AiOutlineSwap /></span>
                    </div>
                </div>
                <div>
                    <p className='linelimitlength usernameshort' style={{ "fontSize": "14px", "fontWeight": "600", "maxWidth": "150px" }}>{dto.userInfo.userName}</p>
                    <p style={{ "fontSize": "13px", "fontWeight": "200" }}>@{dto.userID.substring(0, 4)}...</p>
                </div>
                <div style={{ "marginTop": "20px" }}>
                    <p style={{ "fontSize": "10px", "fontWeight": "400" }}>
                        <span onClick={() => { goURL('/followees/' + userID, this.props.refreshMainCourse) }} >
                            {stat.followingCount} Following</span>
                        <span onClick={() => { goURL('/followers/' + userID, this.props.refreshMainCourse) }}
                            style={{ "marginLeft": "10px" }}>
                            {stat.followedCount} Followers</span></p>
                </div>
            </div>
            <div style={{ width: "100%" }}>
                <MenuItem onClick={() => goURL('/timeline', this.props.refreshMainCourse)}>
                    <PublicIcon viewBox={vb} className='lineicon' />
                    Timeline
                </MenuItem>
            </div>
            <div style={{ width: "100%" }}>
                <MenuItem onClick={() => goURL('/notification/', this.props.refreshMainCourse)}>
                    <NotificationsNoneIcon viewBox={vb} className='lineicon' />
                    Notifications
                </MenuItem>
            </div>

            <div style={{ width: "100%" }}>
                <MenuItem onClick={() => goURL('/bookmark/', this.props.refreshMainCourse)}>
                    <BookmarkBorderOutlinedIcon viewBox={vb} className='lineicon' />
                    Bookmarks
                </MenuItem>
            </div>
            <div style={{ width: "100%" }}>
                <MenuItem onClick={() => goURL('/list/', this.props.refreshMainCourse)}>
                    <ListAltIcon viewBox={vb} className='lineicon' />
                    Lists
                </MenuItem>
            </div>

            <div style={{ width: "100%" }}>
                <MenuItem onClick={() => goURL(`/p/${userID}/`, this.props.refreshMainCourse)}>
                    <PermIdentityIcon viewBox={vb} className='lineicon' />
                    Profile
                </MenuItem>
            </div>
            <div style={{ width: "100%" }}>
                <MenuItem onClick={() => this.logout()}>
                    <OfflineBoltOutlinedIcon viewBox={vb} className='lineicon' />
                    Logout
                </MenuItem>
            </div>
        </div>
    }
}
