import React, { Component } from 'react';
import { getPublicTimeline } from '../../api/impl/timeline';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { PostList } from './PostList';

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any,
}

type StateType = {
}

export class PublicTimeline extends Component<PropsType, StateType> {

    PostList: PostList | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    refreshPage() {
        if (this.PostList) {
            this.PostList.refreshPage();
        }
    }

    render() {
        return <div>
            <div>
                <h4><p>Timeline</p></h4>
            </div>
            <PostList
                identityObj={this.props.identityObj}
                refreshMainCourse={this.props.refreshMainCourse}
                getPostData={getPublicTimeline}
                userID={this.props.identityObj?.userID ?? ""}
                ref={node => this.PostList = node}
            />
            <br />
        </div>
    }
}
