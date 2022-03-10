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
import { getUrlParameter } from '../../utils/bazar-utils';
import { Search } from './Search';

type PropsType = {
    identityObj: Identity | null,
}

type StateType = {
    key: string | null;
}

export class MainCourse extends Component<PropsType, StateType> {
    PostList: PostList | null | undefined;
    PostDetail: PostDetail | null | undefined;
    profileDetail: ProfileDetail | null | undefined;
    search: Search | null | undefined;

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

        if (ayPath[1].length === 0) {
            return <div className='maincourse container' id='maincourse'>
                <div>
                    <h4><p>Home</p></h4>
                </div>
                <div>
                    <AddPost
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                    />
                </div>
                <hr />
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
