import { Component } from 'react';
import { Identity } from '../../facade/entity';
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
    posts: any,
    fetching: boolean,
    hasMoreData: boolean,
}

export class PostList extends Component<PropsType, StateType> {

    pageSize: number = 25;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            page: 0,
            key: null,
            posts: null,
            fetching: false,
            hasMoreData: true,
        };
    }

    async componentDidMount() {

        await this.fetchData();

        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll.bind(this))
    }

    async fetchData() {

        logger('PostList', `fetchData curPage ${this.state.page}`)

        if (!this.state.hasMoreData) {
            return
        }

        if (this.state.fetching) {
            return
        }

        this.setState({
            fetching: true
        })

        logger('PostList', `fetchData ${this.state.page}`)

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
            logger('PostList', `PostCount ${ay.length}`)
            logger('PostList', `curPage ${this.state.page}`)
            this.setState({
                page: this.state.page + 1,
                posts: ay,
            })

        } finally {
            this.setState({
                fetching: false
            })
        }
    }

    async onScroll() {
        // logger('PostList', `onscroll ${window.innerHeight}, ${document.documentElement.scrollTop}, ${document.scrollingElement?.scrollHeight}`);
        if (window.innerHeight + document.documentElement.scrollTop + 5 >= Number(document.scrollingElement?.scrollHeight)) {
            // logger('PostList', `loadingMoreData ${this.state.page}`);
            await this.fetchData()
        }
    }

    async refreshPage() {
        logger('PostList', 'refreshPage');
        this.setState({
            page: 0,
            key: randomString(10),
            posts: {},
            hasMoreData: true
        });
        await this.fetchData();
    }

    render() {

        if (this.state.posts == null) {
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
                <div>
                    {
                        Object
                            .keys(this.state.posts)
                            .map(key => <Post key={this.state.posts[key].post.postID}
                                dto={this.state.posts[key]}
                                refreshMainCourse={this.props.refreshMainCourse}
                            />)
                    }
                </div>
                {nomore}
            </div>

        );
    }

}





