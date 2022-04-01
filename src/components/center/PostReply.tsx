import React, { Component } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { sendPost } from '../../api/impl/cmd/post';
import '../../App.css';
import { Post, PostDto, UserDto, UserInfo } from '../../facade/entity';
import { getUserImgUrl } from '../../facade/userfacade';
import { formatRelativeTime, getLocalTime } from '../../utils/date-utils';
import { getIdentity } from '../../utils/identity-storage';
import { htmlDecode } from '../../utils/string-utils';

type PropsType = {
    user: UserInfo,
    userDto: UserDto | null,
    post: Post,
    postDto: PostDto,
    closeModal: any,
    refreshMainCourse: any,
}

type StateType = {
}

export class PostReply extends Component<PropsType, StateType> {
    replyTxtCtl: HTMLTextAreaElement | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    /** in mobile, userName should be short to keep window width normal */
    getCopUserName(userName: string) {
        var mobile = (window.screen.width < 1000);
        var modUserName = userName;
        if (mobile) {
            modUserName = userName.substring(0, 20);
        }
        return modUserName
    }

    /** in mobile width is special */
    getCopWidth() {
        var mobile = (window.screen.width < 1000);
        var modWidth = 400;
        if (mobile) {
            modWidth = window.screen.availWidth - 120;
        }
        return modWidth
    }

    focus() {
        this.replyTxtCtl?.focus();
    }

    getReplyContent() {
        return this.replyTxtCtl?.value ?? "";
    }

    async onReply() {

        var identityObj = getIdentity();
        if (identityObj == null) {
            return;
        }
        if (!this.replyTxtCtl) {
            return;
        }

        var dto = this.props.postDto;
        var contentstr = this.replyTxtCtl.value as string;
        if (contentstr.length === 0) {
            alert('Please input content')
            this.replyTxtCtl.focus();
            return;
        }
        if (contentstr.length > 300) {
            alert('content too long')
            this.replyTxtCtl.focus();
            return
        }
        await sendPost(identityObj, contentstr, dto.post.postID, dto.post.threadID, false);

        this.props.closeModal()

        this.props.refreshMainCourse();

    }

    render() {

        var user = this.props.user;
        var userDto = this.props.userDto;
        var post = this.props.post;

        var timestr = getLocalTime(post.commandTime);
        var relativeTime = formatRelativeTime(post.commandTime);

        var rpwidth = this.getCopWidth();
        var rpusername = this.getCopUserName(user.userName);

        return <div>
            <div className="row" style={{ "paddingLeft": "55px", "width": `${rpwidth}px` }}>
                <div style={{ "marginLeft": "-55px" }}>
                    <button className="minibutton" onClick={this.props.closeModal}>
                        <AiOutlineClose />
                    </button>
                </div>
                <div style={{ "marginLeft": "-55px", "width": "55px", display: "inline-block", "verticalAlign": "top", "marginTop": "5px" }}>
                    <p><img src={getUserImgUrl(userDto)} alt="" /></p>
                </div>
                <div style={{ "width": "100%", display: "inline-block" }}>
                    <p className="author" title={'UserID:' + user.userID + ' - Time:' + timestr}>
                        <span className='linelimitlength usernameshort'>{rpusername}</span>
                        <span className='lightsmall'>@{user.userID.substring(0, 4)} - {relativeTime}</span>
                    </p>
                    <p className='contentinreply'>{htmlDecode(post.content)}</p>
                </div>
            </div>
            <p></p>
            <div className='row margintop10' style={{ "paddingLeft": "55px" }}>
                <div style={{ "marginLeft": "-55px", "width": "55px", display: "inline-block", "verticalAlign": "top", "marginTop": "10px" }}>
                    <p><img src={getUserImgUrl(userDto)} alt="" /></p>
                </div>
                <div style={{ "width": "100%", display: "inline-block" }}>
                    <p className="replylead margintop10 marginbottom10">Replying to&nbsp;
                        <span className='linelimitlength usernameshort' style={{ "marginBottom": "1px" }}>
                            <a href={`/p/${user.userID}`} className='nounderlineblue' >@{rpusername}</a></span>
                    </p>
                    <textarea className='replytxt' placeholder='Write your reply' ref={(x) => this.replyTxtCtl = x} />
                    <div>
                        {/* <div id="emoji-trigger" className='two columns emoji-button' title='Emoji'>🙂</div> */}
                        <button className="replybutton" onClick={this.onReply.bind(this)}>Reply</button>
                    </div>

                </div>
            </div>
        </div>
    }
}
