import React, { Component } from 'react';
import { ApiResponse } from '../../api/impl/ApiResponse';
import { BookmarkDto, getBookmarks } from '../../api/impl/getbookmarks';
import '../../App.css';
import { Identity, PostDto } from '../../facade/entity';
import { PostList } from './PostList';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
}

type StateType = {
}

export class Bookmark extends Component<PropsType, StateType> {
    PostList: PostList | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    async fetchData(userID: string, page: number, size: number) {
        var res = await getBookmarks(userID, page, size);
        if (!res.success) {
            return res
        }
        var bms = res.data as BookmarkDto[]
        var posts = [] as PostDto[]
        bms.forEach(x => {
            posts.push(x.post)
        })
        var ret = {} as ApiResponse
        ret.success = true
        ret.msg = ''
        ret.data = posts
        return ret
    }

    refreshPage() {
        this.PostList?.refreshPage();
    }

    render() {

        return <div className=''>
            <div>
                <PostList
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.props.refreshMainCourse}
                    getPostData={this.fetchData.bind(this)}
                    resourceID={this.props.identityObj?.userID ?? ""}
                    ref={x => this.PostList = x}
                />
            </div>
            <br />
            <br />
            <br />
            <br />
        </div>
    }
}
