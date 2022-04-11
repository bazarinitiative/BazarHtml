import React, { Component } from 'react';
import { getUserLikePosts } from '../../api/impl/userlikes';
import { getUserPosts } from '../../api/impl/userposts';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { goURL } from '../../utils/bazar-utils';
import { logger } from '../../utils/logger';
import { PostList } from './PostList';

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any,
    userID: string,
}

type StateType = {
    tabPath: string
}

export class ProfileTab extends Component<PropsType, StateType> {
    getPostData: any;
    PostList: PostList | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            tabPath: ""
        };

        this.componentDidUpdate();
    }

    async componentDidMount() {
    }

    async componentDidUpdate() {
        var ayPath = window.location.pathname.split('/', 10);
        var tabPath = ayPath[3];
        if (!this.getPostData || tabPath !== this.state.tabPath) {
            this.getPostData = this.getPostMain.bind(this);
            if (ayPath[3] === 'with_replies') {
                this.getPostData = this.getPostWithReplies.bind(this);
            }
            if (ayPath[3] === 'likes') {
                this.getPostData = this.getPostLikes.bind(this);
            }
            this.setState({
                tabPath: tabPath
            })

            setTimeout(() => {
                if (this.PostList) {
                    this.PostList.refreshPage();
                }
            }, 50);
        }
    }

    async getPostMain(userID: string, page: number, pageSize: number) {
        var ret = await getUserPosts(userID, true, page, pageSize, this.props.identityObj?.userID ?? "")
        return ret
    }

    async getPostWithReplies(userID: string, page: number, pageSize: number) {
        var ret = await getUserPosts(userID, false, page, pageSize, this.props.identityObj?.userID ?? "")
        return ret
    }

    async getPostLikes(userID: string, page: number, pageSize: number) {
        var ret = await getUserLikePosts(userID, page, pageSize, this.props.identityObj?.userID ?? "")
        return ret
    }

    clickTab(tabPath: string) {
        var ayPath = window.location.pathname.split('/', 10);
        logger('clickTab', ayPath[1] + ',' + ayPath[2] + ',' + ayPath[3])
        if (!ayPath[2]) {
            ayPath[2] = this.props.identityObj?.userID ?? "";
        }
        ayPath[3] = tabPath;
        var url = `${window.location.origin}/${ayPath[1]}/${ayPath[2]}/${ayPath[3]}`;
        goURL(url, this.props.refreshMainCourse);
    }

    render() {

        var tabstyle1 = 'four columns searchtab ';
        var tabstyle2 = 'five columns searchtab ';
        var tabstyle3 = 'three columns searchtab ';
        var tabPath = this.state.tabPath;
        logger('profileTab', 'tabPath ' + tabPath);
        if (tabPath === 'with_replies') {
            tabstyle2 += 'searchtabsel'
        } else if (tabPath === 'likes') {
            tabstyle3 += 'searchtabsel'
        } else {
            tabstyle1 += 'searchtabsel'
        }

        return <div className=''>
            <div>
                <div className='row searchtabar'>
                    <div className={tabstyle1} onClick={() => this.clickTab('')}>Posts</div>
                    <div className={tabstyle2} onClick={() => this.clickTab('with_replies')}>Posts &amp; Replies</div>
                    <div className={tabstyle3} onClick={() => this.clickTab('likes')}>Likes</div>
                </div>
            </div>
            <div>
                <PostList
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.props.refreshMainCourse}
                    getPostData={this.getPostData}
                    resourceID={this.props.userID}
                    ref={x => this.PostList = x}
                />
            </div>
        </div>
    }
}
