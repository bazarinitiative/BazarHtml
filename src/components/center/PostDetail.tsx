import { Component } from 'react';
import { ApiResponse } from '../../api/impl/ApiResponse';
import { getPostDetail } from '../../api/impl/postdetail';
import { Identity } from '../../facade/entity';
import { randomString } from '../../utils/encryption';
import { logger } from '../../utils/logger';
import { Post } from './Post';

type PropsType = {
    identityObj: Identity | null,
    postID: string,
    refreshMainCourse: any
}

type StateType = {
    key: string | null,
    resp: ApiResponse | null
}

export class PostDetail extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            key: null,
            resp: null
        };
    }

    async componentDidMount() {
        await this.refreshPage();
    }

    async refreshPage() {
        var resp = await this.getData();

        this.setState({
            key: randomString(10),
            resp: resp
        });
    }

    async getData() {
        var userID = '';
        if (this.props.identityObj != null) {
            var identityObj = this.props.identityObj;
            userID = identityObj.userID;
            logger('postdetail', 'userID:' + userID);
        }
        logger('postdetail', 'postID:' + this.props.postID);
        var resp = await getPostDetail(this.props.postID, 0, 25, userID);
        return resp;
    }

    render() {

        var resp = this.state.resp;
        if (resp == null) {
            return <div>loading</div>
        }

        var curPostM = resp.data.current;
        var parentPostM = resp.data.parent;
        var topPostM = resp.data.thread;
        var replies = resp.data.replies;

        let parent = null;
        if (parentPostM != null) {
            parent = <Post
                post={parentPostM.post}
                ps={parentPostM.ps}
                liked={parentPostM.liked}
                refreshMainCourse={this.props.refreshMainCourse}
            />
        }

        let thread = null;
        if (topPostM != null) {
            thread = <Post
                post={topPostM.post}
                ps={topPostM.ps}
                liked={topPostM.liked}
                refreshMainCourse={this.props.refreshMainCourse}
            />;
        }

        return (
            <div>
                {thread}
                {parent}
                <Post
                    post={curPostM.post}
                    ps={curPostM.ps}
                    liked={curPostM.liked}
                    refreshMainCourse={this.props.refreshMainCourse}
                    boldConent={true}
                />
                <div className='container'>
                    <div className='row'>
                        <div className='four cloumns'></div>
                        <div className='eleven cloumns'>
                            {
                                Object
                                    .keys(replies)
                                    .map(key => <Post key={key}
                                        post={replies[key].post}
                                        ps={replies[key].ps}
                                        liked={replies[key].liked}
                                        refreshMainCourse={this.props.refreshMainCourse}
                                    />)
                            }
                        </div>
                    </div>
                </div>

            </div>
        );
    }

}





