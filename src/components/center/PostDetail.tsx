import { Component } from 'react';
import { ApiResponse } from '../../api/impl/ApiResponse';
import { getPostDetail } from '../../api/impl/postdetail';
import { Identity } from '../../facade/entity';
import { randomString } from '../../utils/encryption';
// import { logger } from '../../utils/logger';
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
            // logger('postdetail', 'userID:' + userID);
        }
        // logger('postdetail', 'postID:' + this.props.postID);
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
                key={randomString(10)}
                postDto={parentPostM}
                refreshMainCourse={this.props.refreshMainCourse}
            />
        }

        let thread = null;
        if (topPostM != null) {
            thread = <Post
                key={randomString(10)}
                postDto={topPostM}
                refreshMainCourse={this.props.refreshMainCourse}
            />;
        }

        return (
            <div>
                <div>
                    <h4><p>Post Detail</p></h4>
                </div>
                {thread}
                {parent}
                <Post
                    key={randomString(10)}
                    postDto={curPostM}
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
                                    .map(key => <Post key={randomString(10)}
                                        postDto={replies[key]}
                                        refreshMainCourse={this.props.refreshMainCourse}
                                    />)
                            }
                        </div>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }

}





