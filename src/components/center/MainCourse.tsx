import React, { Component } from 'react';
import { getPublicTimeline } from '../../api/impl/timeline';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { getPrivateKey, randomString, signMessage } from '../../utils/encryption';
import { logger } from '../../utils/logger';
import { NotLoginYet } from './NotLoginYet';
import { ProfileSelf } from './ProfileSelf';
import { AddPost } from './AddPost';
import { PostDetail } from './PostDetail';
import { PostList } from './PostList';
import { ProfileDetail } from './ProfileDetail';
import { getHomeline } from '../../api/impl/homeline';
import { Notifications } from './Notifications';
import { currentTimeMillis } from '../../utils/date-utils';
import { Follow } from './Follow';
import { Explore } from './Explore';
import { getUrlParameter, goURL, handleLogout } from '../../utils/bazar-utils';
import { Search } from './Search';
import { HOST_CONCIG } from '../../bazar-config';
import { Menu, MenuItem } from '@material-ui/core';
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';
import PublicIcon from '@material-ui/icons/Public';
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";

type PropsType = {
    identityObj: Identity | null,
}

type StateType = {
    key: string | null;
    openMenu: boolean;
    anckerEl: any;
}

export class MainCourse extends Component<PropsType, StateType> {
    PostList: PostList | null | undefined;
    PostDetail: PostDetail | null | undefined;
    profileDetail: ProfileDetail | null | undefined;
    search: Search | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            key: null,
            openMenu: false,
            anckerEl: null,
        };
    }

    async refreshMainCourse() {
        this.setState({
            key: randomString(10)
        });

        try {
            if (this.PostList) {
                await this.PostList.refreshPage();
            }

            if (this.PostDetail) {
                await this.PostDetail.refreshPage();
            }

            if (this.profileDetail) {
                await this.profileDetail.refreshPage();
            }

            if (this.search) {
                await this.search.refreshPage();
            }

        } catch (error) {

        }

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

    onMenu(event: any) {
        var oepnMenu = !this.state.openMenu;
        this.setState({
            openMenu: oepnMenu,
            anckerEl: event.currentTarget
        })
    }

    onHeadImg(event: any) {
        var mobile = (window.screen.width < 1000);
        if (mobile) {
            this.onMenu(event);
        } else {
            goURL('/p/', this.refreshMainCourse.bind(this));
        }
    }

    logout() {
        var out = window.confirm("Sure to logout?")
        if (out) {
            handleLogout();
        }
    }

    render() {

        if (this.props.identityObj == null) {
            return <div className='container'>
                <div className='row '>
                    <div className='content'>
                        <NotLoginYet />
                    </div>
                </div>
            </div>
        }

        var ayPath = window.location.pathname.split('/', 10);

        logger('mainCourse', 'ay.Length:' + ayPath.length);
        logger('mainCourse', 'ay:' + ayPath);

        var mobile = (window.screen.width < 1000);
        var padside = mobile ? "0" : "null";
        var border = mobile ? "none" : "null";

        var vb = "0,0,24,24"

        if (ayPath[1].length === 0) {
            return <div className='maincourse container' id='maincourse'
                style={{ paddingLeft: padside, paddingRight: padside, border: border, marginTop: "-10px", paddingTop: "15px" }}>

                <div style={{ "width": "100%" }}>
                    <div className='row' style={{ "display": "flex" }}>
                        <div style={{ "display": "inline-block", "marginLeft": "2px" }} onClick={this.onHeadImg.bind(this)}>
                            <p style={{ "float": "left", "marginLeft": "0px", "marginTop": "5px" }}>
                                <img src={`${HOST_CONCIG.apihost}UserQuery/UserPicImage/${this.props.identityObj?.userID}.jpeg`}
                                    alt="" style={{ width: "35px" }}>
                                </img>
                            </p>
                            <Menu
                                id="ss-menu"
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
                                    <MenuItem onClick={() => goURL('/timeline', this.refreshMainCourse.bind(this))}>
                                        <PublicIcon viewBox={vb} />
                                        Timeline
                                    </MenuItem>
                                </div>
                                <div style={{ width: "100%" }}>
                                    <MenuItem onClick={() => goURL('/notification/', this.refreshMainCourse.bind(this))}>
                                        <NotificationsNoneIcon viewBox={vb} className='lineicon' />
                                        Notifications
                                    </MenuItem>
                                </div>
                                <div style={{ width: "100%" }}>
                                    <MenuItem onClick={() => goURL('/p/', this.refreshMainCourse.bind(this))}>
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
                            refreshMainCourse={this.refreshMainCourse.bind(this)}
                        />
                    </div>
                </div>
                <div>
                    <PostList
                        identityObj={this.props.identityObj}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                        getPostData={this.getHomelineData.bind(this)}
                        ref={node => this.PostList = node}
                    />
                </div>
            </div>;
        } else {
            if (ayPath[1] === 'timeline') {
                return <div>
                    <div>
                        <h4><p>Timeline</p></h4>
                    </div>
                    <PostList
                        identityObj={this.props.identityObj}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                        getPostData={getPublicTimeline}
                        ref={node => this.PostList = node}
                    />
                    <br />
                </div>
            }
            if (ayPath[1] === 'explore') {
                return <div>
                    <Explore
                        identityObj={this.props.identityObj}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                    />
                </div>
            }
            if (ayPath[1] === 'notification') {
                return <div>
                    <div>
                        <h4><p>Notifications</p></h4>
                    </div>
                    <Notifications
                    />
                </div>
            }

            if (ayPath[1] === 't' && ayPath[2].length > 0) {
                var postID = ayPath[2];
                logger('mainCourse', 'postID:' + postID);

                return <PostDetail
                    identityObj={this.props.identityObj}
                    postID={postID}
                    refreshMainCourse={this.refreshMainCourse.bind(this)}
                    ref={node => this.PostDetail = node}
                />;
            }
            if (ayPath[1] === 'p') {
                if (ayPath[2].length === 0) {
                    if (this.props.identityObj == null) {
                        return <a href='/'><p>Not Login Yet</p></a>
                    }
                    return <ProfileSelf
                        identityObj={this.props.identityObj}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                    />;
                } else {
                    var userID = ayPath[2];
                    logger('mainCourse', 'userID:' + userID);

                    return <ProfileDetail
                        identityObj={this.props.identityObj}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                        userID={userID}
                        ref={node => this.profileDetail = node}
                    />;
                }
            }
            if (ayPath[1] === 'followers') {
                var userID2 = ayPath[2];
                return <div>
                    <Follow
                        userID={userID2}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                        showfollowers={true}
                    />
                </div>
            }
            if (ayPath[1] === 'followees') {
                var userID3 = ayPath[2];
                return <div>
                    <Follow
                        userID={userID3}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                        showfollowers={false}
                    />
                </div>
            }
            if (ayPath[1] === 'search') {
                var wd = getUrlParameter('wd');
                var ss = ''
                if (typeof wd == 'string') {
                    ss = wd
                }
                return <div>
                    <div>
                        <h4><p>Search</p></h4>
                    </div>
                    <Search
                        identityObj={this.props.identityObj}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                        wd={ss}
                        ref={node => this.search = node}
                    />
                </div>
            }

            return <div>
                <p className=''>unkown url: {window.location.pathname}</p>
            </div>;
        }

    }
}
