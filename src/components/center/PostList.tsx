import { Component } from 'react';
import { Identity, PostDto } from '../../facade/entity';
import { randomString } from '../../utils/encryption';
import { logger } from '../../utils/logger';
import { Post } from './Post';

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any,
    /**
     * getPublicTimeline or something similar
     */
    getPostData: any
}

type StateType = {
    page: number,
    key: string | null,
    posts: PostDto[],
    fetching: boolean,
    hasMoreData: boolean,
}

var AsyncLock = require('async-lock');
var lock = new AsyncLock();

export class PostList extends Component<PropsType, StateType> {

    pageSize: number = 25;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            page: 0,
            key: null,
            posts: [],
            fetching: false,
            hasMoreData: true,
        };
    }

    async componentDidMount() {

        await this.fetchData();

        window.onscroll = this.onScroll.bind(this)
    }

    componentWillUnmount() {
        window.onscroll = null
    }

    async fetchData() {

        // logger('PostList', `fetchData curPage ${this.state.page}`)

        if (!this.state.hasMoreData) {
            return
        }

        if (this.state.fetching) {
            return
        }

        this.setState({
            fetching: true
        })

        // logger('PostList', `fetchData ${this.state.page}`)

        setTimeout(async () => {
            try {
                var page = this.state.page;
                var size = this.pageSize;

                var userID = '';
                if (this.props.identityObj != null) {
                    var identityObj = this.props.identityObj;
                    userID = identityObj.userID;
                    logger('postlist', userID);
                }

                var ret = await this.props.getPostData(userID, page, size);
                if (ret.data.length < size) {
                    this.setState({
                        hasMoreData: false
                    })
                }
                var ay = this.state.posts;
                if (page === 0) {
                    ay = ret.data;
                } else {
                    ay = this.state.posts.concat(ret.data);
                }
                // logger('PostList', `PostCount ${ay.length}`)
                // logger('PostList', `curPage ${this.state.page}`)
                this.setState({
                    page: this.state.page + 1,
                    posts: ay,
                })

            } finally {
                this.setState({
                    fetching: false
                })
            }
        }, 50);
    }

    async onScroll() {
        lock.acquire("postlist_onscoll", async () => {
            var top = document.documentElement.scrollTop || document.body.scrollTop
            var over = window.innerHeight + top + 100 - Number(document.scrollingElement?.scrollHeight);
            if (over > 0) {
                // logger('PostList', `onscroll ${this.state.page}, over=${over}`);
                await this.fetchData()
            }
        });
    }

    async refreshPage() {
        logger('PostList', 'refreshPage');
        this.setState({
            page: 0,
            key: randomString(10),
            //posts: [],
            hasMoreData: true
        });
        await this.fetchData();
    }

    render() {
        var fetchelm = <div></div>;
        if (this.state.fetching) {
            fetchelm = <div style={{ 'marginBottom': "8px" }}>
                ...
            </div>
        }

        if (this.state.posts.length === 0 && this.state.fetching) {
            return <div>
                Loading...
            </div>
        }
        if (this.state.posts.length === 0) {
            return <div>
                No data
            </div>
        }

        var nomore = <div>No more data</div>
        if (this.state.hasMoreData) {
            nomore = <div></div>
        }

        // logger('PostList', 'render');
        return (
            <div id='postList'>
                {fetchelm}
                <div>
                    {
                        Object
                            .keys(this.state.posts)
                            .map(key => <Post key={this.state.posts[Number(key)].post.postID}
                                postDto={this.state.posts[Number(key)]}
                                refreshMainCourse={this.props.refreshMainCourse}
                            />)
                    }
                </div>
                {nomore}
            </div>

        );
    }

}





