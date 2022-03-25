import React, { Component } from 'react';
import { publicsearch, SearchResult } from '../../api/impl/publicsearch';
import '../../App.css';
import { Identity, PostDto, UserDto } from '../../facade/entity';
import { getUrlParameter, goURL } from '../../utils/bazar-utils';
import { randomString } from '../../utils/encryption';
import { logger } from '../../utils/logger';
import { MightLikeUnit } from '../right/MightLikeUnit';
import { SearchCom } from '../share/SearchCom';
import { Post } from './Post';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
    wd: string
}

type StateType = {
    key: string
    sresult: SearchResult | null
}

export class Search extends Component<PropsType, StateType> {
    searchCom: SearchCom | null | undefined;

    async refreshPage() {
        var wd = getUrlParameter('wd');
        if (typeof wd != 'string') {
            return
        }
        var ret = await publicsearch(wd, 0, 20);

        var sr = ret.data as SearchResult;
        logger('search1', 'ok: ' + wd)
        if (sr.posts.length > 0) {
            logger('search1', 'post0: ' + sr.posts[0].post.content)
        }

        this.setState({
            key: randomString(10),
            sresult: sr
        });

        if (this.searchCom) {
            await this.searchCom.refreshPage()
        }
    }

    constructor(props: PropsType) {
        super(props);
        this.state = {
            key: '',
            sresult: null
        };
    }

    async componentDidMount() {
        await this.refreshPage();
        this.searchCom?.focus();
    }

    async onSearch() {
        goURL('/search?wd=' + this.searchCom?.inputval(), this.props.refreshMainCourse);
    }

    render() {

        logger('search1', 'render')

        let users: UserDto[] = []
        let posts: PostDto[] = []
        if (this.state.sresult) {
            users = this.state.sresult.users
            posts = this.state.sresult.posts
        }

        var nodata = <br />
        if (users.length === 0 && posts.length === 0 && this.props.wd) {
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
