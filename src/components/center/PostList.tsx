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
    key: string | null,
    posts: any,
}

export class PostList extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            key: null,
            posts: null
        };
    }

    async componentDidMount() {
        var userID = '';
        if (this.props.identityObj != null) {
            var identityObj = this.props.identityObj;
            userID = identityObj.userID;
            logger('postlist', userID);
        }
        await this.getPostList(userID, 0, 25);
    }

    async getPostList(userID: string, page: number, size: number) {
        var ret = await this.props.getPostData(userID, page, size);

        try {
            this.setState({ posts: ret.data })
        } catch (error) {
            logger('getPostList', error)
        }
    }

    async refreshPage(userID: string) {
        logger('PostList', 'refreshPage');
        this.setState({
            key: randomString(10),
            posts: {}
        });
        await this.getPostList(userID, 0, 25);
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

        logger('PostList', 'render');
        return (
            <div>
                {
                    Object
                        .keys(this.state.posts)
                        .map(key => <Post key={this.state.posts[key].post.postID}
                            post={this.state.posts[key].post}
                            ps={this.state.posts[key].ps}
                            liked={this.state.posts[key].liked}
                            refreshMainCourse={this.props.refreshMainCourse}
                        />)
                }
            </div>
        );
    }

}





