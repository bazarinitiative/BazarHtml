import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { sendPost } from '../../api/impl/cmd/post'
import { getIdentity } from '../../utils/identity-storage';
import { EmojiButton } from '@joeattardi/emoji-button';
import twemoji from 'twemoji'
import '../../App.css'
import './Post.css'
import { CircleProgress } from './CircleProgress';

type PropsType = {
    refreshMainCourse: any
}

type StateType = {
    leftNum: number
}

export class AddPost extends Component<PropsType, StateType> {

    blogPost: HTMLTextAreaElement | null | undefined;
    btnPost: HTMLButtonElement | null | undefined;
    canv: HTMLCanvasElement | null | undefined;

    constructor(props: PropsType) {
        super(props)

        this.state = {
            leftNum: 300
        }
    }

    componentDidMount() {
        const picker = new EmojiButton({
            emojiSize: '20px',
            // style: 'twemoji'
        });
        const trigger = document.querySelector('#emoji-trigger') as HTMLElement;
        if (trigger) {
            picker.on('emoji', selection => {
                // handle the selected emoji here
                console.log(selection.emoji);

                if (this.blogPost) {
                    this.blogPost.value += selection.emoji;
                    this.blogPost.focus();

                    twemoji.parse(this.blogPost, { size: '20px' });
                    this.onTxtChange();
                }
            });
            trigger.addEventListener('click', () => picker.togglePicker(trigger));
        }

        this.onTxtChange();
    }

    onTxtChange() {
        var contentstr = this.blogPost?.value ?? "";
        // logger('addPost', `content: ${contentstr}`);
        if (this.btnPost) {
            if (contentstr.length === 0) {
                this.btnPost.style.backgroundColor = "rgb(180, 235, 210)";
            } else {
                this.btnPost.style.backgroundColor = "rgb(131, 175, 155)"
            }
        }
        this.setState({
            leftNum: 300 - contentstr.length
        })
    }

    async addNewPost(e: any) {
        e.preventDefault();

        var identityObj = getIdentity();
        if (identityObj == null) {
            return;
        }
        if (this.blogPost == null) {
            return;
        }

        var contentstr = this.blogPost.value;
        if (contentstr.length === 0) {
            return
        }
        if (contentstr.length > 300) {
            alert('content too long')
            return;
        }
        await sendPost(identityObj, contentstr, '', '', false);

        this.blogPost.value = "";
        this.blogPost.placeholder = "What are you doing?";

        this.onTxtChange();

        this.props.refreshMainCourse();
    }

    render() {

        return (
            <div>
                <textarea className='newpostarea' onChange={this.onTxtChange.bind(this)}
                    ref={(input) => this.blogPost = input} placeholder="What are you doing?" />
                <div className='row'>
                    <div id="emoji-trigger" className='two columns emoji-button' title='Emoji'>🙂</div>
                    <div style={{ "textAlign": "right" }}>
                        <div className='cellblock canv'>
                            <CircleProgress
                                curNum={300 - this.state.leftNum}
                                totalNum={300}
                                viewboxSize={40}
                                r={9}
                                hideOnZero={true}
                            />
                        </div>
                        <div className='cellblock newpostdiv'>
                            <Button id='newpostbutton' ref={x => this.btnPost = x}
                                type="submit" onClick={this.addNewPost.bind(this)}>
                                Post</Button>
                        </div>

                    </div>
                </div>

            </div>
        );
    }
}


