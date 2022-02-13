import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { sendPost } from '../../api/impl/cmd/post'
import { getIdentity } from '../../utils/identity-storage';

type PropsType = {
    refreshMainCourse: any
}

type StateType = {
}

export class AddPost extends Component<PropsType, StateType> {

    blogPost: any;

    async addNewPost(e: any) {
        e.preventDefault();

        var identityObj = getIdentity();
        if (identityObj == null) {
            return;
        }

        var contentstr = this.blogPost.value;
        await sendPost(identityObj, contentstr, '', '', false);

        this.blogPost.value = "";
        this.blogPost.placeholder = "What are you doing?";

        this.props.refreshMainCourse();
    }

    render() {
        return (
            <div>
                <textarea className='newpostarea' ref={(input) => this.blogPost = input} placeholder="What are you doing?" />
                <div className='newpostdiv'>
                    <Button id='newpostbutton' type="submit" onClick={this.addNewPost.bind(this)}>Post</Button>
                </div>
            </div>
        );
    }
}


