import { Component } from 'react';
import '../../App.css';
import { Identity, UserDto } from '../../facade/entity';
import { randomString } from '../../utils/encryption';
import { logger } from '../../utils/logger';
import { NotLoginYet } from './NotLoginYet';
import { ProfileSelf } from './ProfileSelf';
import { PostDetail } from './PostDetail';
import { PostList } from './PostList';
import { ProfileDetail } from './ProfileDetail';
import { Notifications } from './Notifications';
import { Follow } from './Follow';
import { Explore } from './Explore';
import { getUrlParameter } from '../../utils/bazar-utils';
import { Search } from './Search';
import { Home } from './Home';
import { PublicTimeline } from './PublicTimeline';
import { Channel } from './Channel';
import { Bookmark } from './Bookmark';

type PropsType = {
    identityObj: Identity | null,
    ownerDto: UserDto | null
}

type StateType = {
    key: string | null;
}

export class MainCourse extends Component<PropsType, StateType> {
    publicPostList: PostList | null | undefined;
    PostDetail: PostDetail | null | undefined;
    profileDetail: ProfileDetail | null | undefined;
    search: Search | null | undefined;
    Home: Home | null | undefined;
    Timeline: PublicTimeline | null | undefined;
    Notification: Notifications | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            key: null,
        };
    }

    async refreshMainCourse() {
        this.setState({
            key: randomString(10)
        });

        var top = document.documentElement.scrollTop || document.body.scrollTop
        if (top > 0) {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }

        try {
            if (this.Home) {
                await this.Home.refreshPage();
            }

            if (this.Timeline) {
                await this.Timeline.refreshPage();
            }

            if (this.Notification) {
                await this.Notification.refreshPage();
            }

            if (this.publicPostList) {
                await this.publicPostList.refreshPage();
            }

            if (this.PostDetail) {
                await this.PostDetail.refreshPage();
            }

            if (this.profileDetail) {
                await this.profileDetail.refreshPage();
            }

            if (this.search) {
                // await this.search.refreshPage();
            }

        } catch (error) {

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

        logger('mainCourse', 'ay:' + ayPath);

        if (ayPath[1].length === 0) {
            return <Home
                ref={x => this.Home = x}
                identityObj={this.props.identityObj}
                ownerDto={this.props.ownerDto}
                refreshMainCourse={this.refreshMainCourse.bind(this)}
            />;
        } else {
            if (ayPath[1] === 'timeline') {
                return <PublicTimeline
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.refreshMainCourse.bind(this)}
                    ref={x => this.Timeline = x}
                />
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
                        ref={x => this.Notification = x}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                    />
                </div>
            }

            if (ayPath[1] === 't' && ayPath[2].length > 0) {
                var postID = ayPath[2];
                // logger('mainCourse', 'postID:' + postID);

                return <PostDetail
                    identityObj={this.props.identityObj}
                    postID={postID}
                    refreshMainCourse={this.refreshMainCourse.bind(this)}
                    ref={node => this.PostDetail = node}
                />;
            }
            if (ayPath[1] === 'p') {
                if (ayPath[2].length === 0 || ayPath[2] === this.props.identityObj.userID) {
                    if (this.props.identityObj == null) {
                        return <a href='/'><p>Not Login Yet</p></a>
                    }
                    logger('mainCourse', 'ProfileSelf');
                    return <ProfileSelf
                        identityObj={this.props.identityObj}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                    />;
                } else {
                    var userID = ayPath[2];
                    logger('mainCourse', 'ProfileDetail');
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
            if (ayPath[1] === 'bookmark') {
                return <div>
                    <div>
                        <h4><p>Bookmarks</p></h4>
                    </div>
                    <Bookmark
                        identityObj={this.props.identityObj}
                        refreshMainCourse={this.refreshMainCourse.bind(this)}
                    />
                </div>
            }
            if (ayPath[1] === 'list') {
                return <div>
                    <div>
                        <h4><p>Lists</p></h4>
                    </div>
                    <Channel
                    />
                </div>
            }

            return <div>
                <p className=''>unkown url: {window.location.pathname}</p>
            </div>;
        }

    }
}
