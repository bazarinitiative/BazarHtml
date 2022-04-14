import { Menu, MenuItem } from '@material-ui/core';
import React, { Component } from 'react';
import '../../App.css';
import { Identity, UserDto } from '../../facade/entity';
import { getUserImgUrl } from '../../facade/userfacade';
import { goURL, handleLogout } from '../../utils/bazar-utils';
import { PostList } from './PostList';
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';
import PublicIcon from '@material-ui/icons/Public';
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import { getPrivateKey, signMessage } from '../../utils/encryption';
import { logger } from '../../utils/logger';
import { currentTimeMillis } from '../../utils/date-utils';
import { getHomeline } from '../../api/impl/homeline';
import { AddPost } from './AddPost';
import ListAltIcon from "@material-ui/icons/ListAlt";
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any,
    ownerDto: UserDto | null,
}

type StateType = {
    openMenu: boolean;
    anckerEl: any;
}

export class Home extends Component<PropsType, StateType> {

    PostList: PostList | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            openMenu: false,
            anckerEl: null,
        };
    }

    async componentDidMount() {
    }

    async refreshPage() {
        if (this.PostList) {
            await this.PostList.refreshPage();
        }
    }

    onHeadImg(event: any) {
        var mobile = (window.screen.width < 1000);
        if (mobile) {
            this.onMenu(event);
        } else {
            goURL('/p/', this.props.refreshMainCourse);
        }
    }

    onMenu(event: any) {
        var oepnMenu = !this.state.openMenu;
        this.setState({
            openMenu: oepnMenu,
            anckerEl: event.currentTarget
        })
    }

    async getHomelineData(userID: string, page: number, pageSize: number) {
        if (!this.props.identityObj) {
            return
        }

        var privateKeyObj = await getPrivateKey(this.props.identityObj.privateKey);
        logger('getHomelineData', 'query')
        var queryTime = currentTimeMillis();
        var token = await signMessage(privateKeyObj, queryTime.toString());
        var ret = await getHomeline(userID, queryTime, token, page, pageSize)
        return ret;
    }

    logout() {
        var out = window.confirm("Sure to logout?")
        if (out) {
            handleLogout();
        }
    }

    render() {

        var mobile = (window.screen.width < 1000);
        var padside = mobile ? "0" : "null";
        var border = mobile ? "none" : "null";
        var userID = this.props.identityObj?.userID ?? "";

        var vb = "0,0,24,24"
        return <div className='maincourse container' id='maincourse'
            style={{ paddingLeft: padside, paddingRight: padside, border: border, marginTop: "-10px", paddingTop: "15px" }}>

            <div style={{ "width": "100%" }}>
                <div className='row' style={{ "display": "flex" }}>
                    <div style={{ "display": "inline-block", "marginLeft": "2px" }} onClick={this.onHeadImg.bind(this)}>
                        <p style={{ "float": "left", "marginLeft": "0px", "marginTop": "5px" }}>
                            <img src={getUserImgUrl(this.props.ownerDto)}
                                alt="" style={{ width: "35px" }}>
                            </img>
                        </p>
                        <Menu
                            open={this.state.openMenu}
                            anchorEl={this.state.anckerEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                        >
                            <div style={{ width: "100%" }}>
                                <MenuItem onClick={() => goURL('/timeline', this.props.refreshMainCourse)}>
                                    <PublicIcon viewBox={vb} />
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
                        </Menu>

                    </div>
                    <div style={{ "display": "inline-block" }}>
                        <h4><p style={{ "marginTop": "8px", "marginLeft": "5px" }}>Home</p></h4>
                    </div>
                </div>
                <div style={{ "margin": "0px 5px" }}>
                    <AddPost
                        refreshMainCourse={this.props.refreshMainCourse}
                    />
                </div>
            </div>
            <div>
                <PostList
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.props.refreshMainCourse}
                    getPostData={this.getHomelineData.bind(this)}
                    resourceID={this.props.identityObj?.userID ?? ""}
                    ref={node => this.PostList = node}
                />
            </div>
        </div>
    }
}
