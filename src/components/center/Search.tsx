import React, { Component } from 'react';
import { publicsearch, SearchResult } from '../../api/impl/publicsearch';
import '../../App.css';
import { Identity, PostDto, UserDto } from '../../facade/entity';
import { getUrlParameter } from '../../utils/bazar-utils';
import { logger } from '../../utils/logger';
// import { logger } from '../../utils/logger';
import { MightLikeUnit } from '../right/MightLikeUnit';
import { SearchCom } from '../share/SearchCom';
import { Post } from './Post';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
    wd: string
}

type StateType = {
    wd: string
    page: number
    users: UserDto[]
    posts: PostDto[]
    fetching: boolean,
    hasMoreData: boolean,
}

var AsyncLock = require('async-lock');
var lock = new AsyncLock();

export class Search extends Component<PropsType, StateType> {
    searchCom: SearchCom | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            wd: '',
            page: 0,
            users: [],
            posts: [],
            fetching: false,
            hasMoreData: true,
        };
    }

    async componentDidMount() {

        var wd = getUrlParameter('wd');
        this.setState({
            wd: wd
        })
        if (this.searchCom) {
            await this.searchCom.setInput(wd)
        }

        await this.fetchData();
        this.searchCom?.focus();

        window.onscroll = this.onScroll.bind(this);
    }

    async componentDidUpdate() {
        var wd = getUrlParameter('wd');
        if (this.state.wd !== wd) {

            if (this.searchCom) {
                await this.searchCom.setInput(wd)
            }

            logger('search', 'wd not match, will reset and fetch')
            this.setState({
                wd: wd,
                page: 0,
                users: [],
                posts: [],
                hasMoreData: true
            })
            // setTimeout(async () => {
            await this.fetchData();
            // }, 10);
        }
    }

    componentWillUnmount() {
        window.onscroll = null
    }

    async onScroll() {
        lock.acquire("search_onscoll", async () => {
            var top = document.documentElement.scrollTop || document.body.scrollTop
            var over = window.innerHeight + top + 100 - Number(document.scrollingElement?.scrollHeight);
            if (over > 0) {
                // logger('search', `onscroll page=${this.state.page}, over=${over}`);
                await this.fetchData()
            }
        });
    }

    async fetchData() {
        if (!this.state.hasMoreData) {
            return
        }
        if (this.state.fetching) {
            return
        }
        this.setState({
            fetching: true
        })
        try {
            var wd = getUrlParameter('wd');
            if (wd.length === 0) {
                return
            }
            var catalog = getUrlParameter('catalog');
            logger('search', `fetchData starting: wd=${wd}, catalog=${catalog}, page=${this.state.page}`)
            var pageSize = 20;
            var ret = await publicsearch(wd, catalog, this.state.page, pageSize);
            var sr = ret.data as SearchResult;
            logger('search', `fetch0: ${sr.users.length} ${sr.posts.length}`)
            if (sr.posts.length + sr.users.length < pageSize) {
                this.setState({
                    hasMoreData: false
                })
            }

            var users = this.state.users
            var posts = this.state.posts
            if (this.state.page === 0) {
                users = []
                posts = []
            }
            users = users.concat(sr.users);
            posts = posts.concat(sr.posts);
            this.setState({
                page: this.state.page + 1,
                users: users,
                posts: posts,
            });
            logger('search', `fetch1: ${users.length} ${posts.length} nextPage=${this.state.page}`)

        } finally {
            this.setState({
                fetching: false
            })
        }
    }

    async onSearch() {
        this.searchCom?.onSearch();
    }

    render() {
        let users: UserDto[] = this.state.users
        let posts: PostDto[] = this.state.posts

        // logger('search', `render: ${users.length} ${posts.length}`)

        var nodata = <br />
        if (users.length === 0 && posts.length === 0 && this.props.wd && !this.state.fetching) {
            nodata = <h5><p>No data</p></h5>
        }

        return <div>
            <div className='container'>
                <div className='row' >
                    <div className='nine columns' >
                        <SearchCom
                            identityObj={this.props.identityObj}
                            refreshMainCourse={this.props.refreshMainCourse}
                            wd={this.props.wd}
                            ref={x => this.searchCom = x}
                        />
                    </div>
                    <div className='two columns' >
                        <button style={{ "color": "skyblue", "borderColor": "skyblue", "lineHeight": "32px", "borderRadius": "3px" }} onClick={this.onSearch.bind(this)}>Search</button>
                    </div>
                </div>
            </div>

            <div className='mightlike'>
                {
                    Object
                        .keys(users)
                        .map(key => <MightLikeUnit key={users[Number(key)].userInfo.userID}
                            identityObj={this.props.identityObj}
                            userInfo={users[Number(key)].userInfo}
                            userStatic={users[Number(key)].userStatistic}
                            refreshMainCourse={this.props.refreshMainCourse}
                        />)
                }
            </div>
            <div>
                {
                    Object
                        .keys(posts)
                        .map(key => <Post key={posts[Number(key)].post.postID}
                            dto={posts[Number(key)]}
                            refreshMainCourse={this.props.refreshMainCourse}
                        />)
                }
            </div>
            {nodata}
            <br />
            <br />
        </div>
    }
}
