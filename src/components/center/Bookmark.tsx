import React, { Component } from 'react';
import { BookmarkDto, getBookmarks } from '../../api/impl/getbookmarks';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { Post } from './Post';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
}

type StateType = {
    bms: BookmarkDto[]
}

export class Bookmark extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            bms: []
        };
    }

    async componentDidMount() {
        var identityObj = this.props.identityObj;
        if (identityObj == null) {
            return
        }

        var ay = await getBookmarks(identityObj.userID, 0, 20);
        var bms = ay.data as BookmarkDto[]
        this.setState({
            bms: bms
        })
    }

    render() {

        return <div className=''>
            {
                this.state.bms.map(x => <Post
                    key={x.post.post.postID}
                    refreshMainCourse={this.props.refreshMainCourse}
                    postDto={x.post}
                />)
            }
            <br />
        </div>
    }
}
