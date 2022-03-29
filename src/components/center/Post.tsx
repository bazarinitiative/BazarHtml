import React, { Component } from 'react';
import { sendDelete } from '../../api/impl/cmd/delete';
import { sendLike } from '../../api/impl/cmd/like';
import { getUserDto, getUserImgUrl } from '../../facade/userfacade';
import { initialUser } from '../../initdata/users';
import { formatRelativeTime, getLocalTime } from '../../utils/date-utils';
import { getIdentity } from '../../utils/identity-storage';
import Modal from 'react-modal';
import { sendPost } from '../../api/impl/cmd/post';
import { PostDto, UserDto, UserInfo } from '../../facade/entity';
import { TiHeartFullOutline, TiHeartOutline, TiMessage } from "react-icons/ti";
import '../../App.css'
import '../tweet.css'
import { AiOutlineClose } from "react-icons/ai";
import { goURL } from '../../utils/bazar-utils';
import { getPostSimple } from '../../api/impl/getpostsimple';
import { randomString } from '../../utils/encryption';
import { logger } from '../../utils/logger';
import { EmojiButton } from '@joeattardi/emoji-button';
import twemoji from 'twemoji';

type PropsType = {
    refreshMainCourse: any,
    postDto: PostDto
    boldConent: boolean,
}

type StateType = {
    key: string,
    authorUserObj: UserDto | null,
    replyToUserObj: UserDto | null,
    isShowModal: boolean,
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export class Post extends Component<PropsType, StateType> {

    static defaultProps = {
        boldConent: false
    }

    origPost: any;
    replyctl: any;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            key: "",
            authorUserObj: null,
            replyToUserObj: null,
            isShowModal: false,
        }
    }

    componentDidMount() {
        this.updateUser();

        const picker = new EmojiButton({
            emojiSize: '20px',
            // style: 'twemoji'
        });
        const trigger = document.querySelector('#emoji-trigger') as HTMLElement;
        if (trigger) {
            picker.on('emoji', selection => {
                // handle the selected emoji here
                console.log(selection.emoji);

                if (this.replyctl) {
                    this.replyctl.value += selection.emoji;
                    this.replyctl.focus();

                    twemoji.parse(this.replyctl, { size: '20px' })
                }
            });
            trigger.addEventListener('click', () => picker.togglePicker(trigger));
        }
    }

    getInitUser(userID: string) {
        var user = initialUser as UserInfo;
        user.userID = userID;
        return user;
    }

    async updateUser() {
        var dto = this.props.postDto;
        var post = dto.post
        // logger('Post-updateUser', post.postID + '-' + post.userID)
        var userID = post.userID;
        var userObj = await getUserDto(userID);

        if (dto.replyToUser) {
            var replyToUserObj = await getUserDto(dto.replyToUser)
            this.setState({
                replyToUserObj: replyToUserObj
            })
        }

        this.setState({
            authorUserObj: userObj,
        });
    }

    async onLike() {
        var dto = this.props.postDto;
        var post = dto.post;
        var liked = dto.liked;

        var identityObj = getIdentity();
        if (identityObj == null) {
            return;
        }
        var postID = post.postID;

        if (liked) {
            var ret = await sendDelete(identityObj, 'Like', postID);
            if (!ret.success) {
                alert(ret.msg);
            }
        } else {
            var ret2 = await sendLike(identityObj, postID);
            if (!ret2.success) {
                alert(ret2.msg);
            }
        }

        // this.props.refreshMainCourse();
        await this.refreshSelf()
    }

    async refreshSelf() {
        logger('Post', 'refreshSelf')
        var identityObj = getIdentity();
        if (identityObj == null) {
            return;
        }
        var newdto = (await getPostSimple(this.props.postDto.post.postID, identityObj.userID)).data as PostDto;
        this.props.postDto.liked = newdto.liked
        this.props.postDto.ps = newdto.ps
        this.setState({
            key: randomString(10)
        })
    }

    async onRepost() {
        alert('not immpl yet');

        this.props.refreshMainCourse();
    }

    async onShare() {
        alert('not immpl yet');

        this.props.refreshMainCourse();
    }

    openModal() {
        this.setState({
            isShowModal: true,
        });
    }

    closeModalCancel() {
        this.setState({
            isShowModal: false,
        });
    }

    async closeModalReply() {
        this.setState({
            isShowModal: false,
        });

        var identityObj = getIdentity();
        if (identityObj == null) {
            return;
        }

        var dto = this.props.postDto;
        var contentstr = this.replyctl.value;
        if (contentstr.length === 0) {
            alert('Please input content')
            this.replyctl.focus();
            return;
        }
        await sendPost(identityObj, contentstr, dto.post.postID, dto.post.threadID, false);

        this.props.refreshMainCourse();
    }

    async onReply() {
        this.openModal();
    }

    async onMouseUp() {
        var txt = window.getSelection()?.toString()
        logger('post.mouseup', txt)
        if (txt && txt.length > 0) {
            return false
        } else {
            return true
        }
    }

    async onClickContent() {
        var txt = window.getSelection()?.toString()
        if (txt && txt.length > 0) {
            return
        }
        logger('post.click', txt)
        goURL('/t/' + this.props.postDto.post.postID, this.props.refreshMainCourse);
    }

    async onDelete() {
        var del = window.confirm('Sure to delete?')
        if (del) {
            var identityObj = getIdentity();
            if (identityObj == null) {
                return;
            }
            // alert(this.props.post.postID);
            var ret = await sendDelete(identityObj, "Post", this.props.postDto.post.postID);
            if (ret.success) {
                this.props.refreshMainCourse();
            } else {
                window.alert(ret.msg);
            }
        }
    }

    render() {
        var dto = this.props.postDto;
        var post = dto.post;
        var ps = dto.ps;
        var liked = dto.liked;

        var timestr = getLocalTime(post.commandTime);
        var user = initialUser as UserInfo;
        if (this.state.authorUserObj != null) {
            user = this.state.authorUserObj.userInfo;
        }
        var userDto = this.state.authorUserObj;

        var relativeTime = formatRelativeTime(post.commandTime);

        var replystr = ps.replyCount > 0 ? ps.replyCount : null;
        // var repoststr = ps.repostCount > 0 && ps.repostCount;
        var likestr = ps.likeCount > 0 ? ps.likeCount : null;

        var contentstyle = 'clickbody';
        if (this.props.boldConent) {
            contentstyle = 'clickbodybold';
        }

        var identityObj = getIdentity();
        if (identityObj == null) {
            return;
        }
        var deletebtn;
        if (identityObj.userID === userDto?.userID) {
            deletebtn = <button
                className='deletebtn'
                onClick={this.onDelete.bind(this)}
            >
                <AiOutlineClose style={{ "fontSize": "16px", "marginRight": "10px" }} />
            </button>;
        }

        var replyinfo = null
        if (this.state.replyToUserObj) {
            replyinfo = <p className='lightsmall'>
                Replying to @<a href={'/p/' + this.state.replyToUserObj.userID}>{this.state.replyToUserObj.userInfo.userName}</a>
            </p>
        }

        var mobile = (window.screen.width < 1000);
        var rpwidth = 'replymodal';
        if (mobile) {
            rpwidth = 'replymodalmobile';
        }

        Modal.setAppElement("#root");

        return (
            <div id="post" className="tweet" style={{ margin: "0" }}>
                <div>
                    <Modal
                        isOpen={this.state.isShowModal}
                        style={customStyles}
                    >
                        <div className={`row ${rpwidth}`} style={{ "paddingLeft": "55px" }}>
                            <div style={{ "marginLeft": "-55px" }}>
                                <button className="minibutton" onClick={this.closeModalCancel.bind(this)}>
                                    <AiOutlineClose />
                                </button>
                            </div>
                            <div style={{ "marginLeft": "-55px", "width": "55px", display: "inline-block", "verticalAlign": "top", "marginTop": "5px" }}>
                                <p><img src={getUserImgUrl(userDto)} alt="" /></p>
                            </div>
                            <div style={{ "width": "100%", display: "inline-block" }}>
                                <p className="author" title={'UserID:' + user.userID + ' - Time:' + timestr}>
                                    {user.userName}@{user.userID.substring(0, 3)}... - {relativeTime}
                                </p>
                                <p className='replycontent'>{post.content}</p>
                            </div>
                        </div>
                        <p></p>
                        <div className='row margintop10' style={{ "paddingLeft": "55px" }}>
                            <div style={{ "marginLeft": "-55px", "width": "55px", display: "inline-block", "verticalAlign": "top", "marginTop": "10px" }}>
                                <p><img src={getUserImgUrl(userDto)} alt="" /></p>
                            </div>
                            <div style={{ "width": "100%", display: "inline-block" }}>
                                <p className="lightp  margintop10 marginbottom10">Replying to @<a href={`/p/${user.userID}`}>{user.userName}</a></p>
                                <textarea className='replytxt' placeholder='Write your reply' ref={(x) => this.replyctl = x} />
                                <div>
                                    {/* <div id="emoji-trigger" className='two columns emoji-button' title='Emoji'>🙂</div> */}
                                    <button className="replybutton" onClick={this.closeModalReply.bind(this)}>Reply</button>
                                </div>

                            </div>
                        </div>

                    </Modal>

                    <div className="row" style={{ "paddingLeft": "55px", marginTop: "3px" }}>
                        <div style={{ "width": "55px", "marginLeft": "-55px", "display": "inline-block", "verticalAlign": "top" }}>
                            <p style={{ "marginLeft": "5px" }}>
                                <a className='userimg' href={'/p/' + user.userID}>
                                    <img src={getUserImgUrl(userDto)} alt="" />
                                </a>
                            </p>
                        </div>
                        <div style={{ "width": "100%", "display": "inline-block" }}>
                            <div style={{ "marginLeft": "10px" }}>
                                <p className="author">
                                    <a href={'/p/' + user.userID}>{user.userName}</a>
                                    <span title={'UserID:' + user.userID + ' - Time:' + timestr}>
                                        <b className='lightsmall'> @{user.userID.substring(0, 4)} - {relativeTime}</b>
                                    </span>
                                    {deletebtn}
                                </p>

                                {replyinfo}
                                <p className={contentstyle}
                                    onClick={this.onClickContent.bind(this)}
                                    onMouseUp={this.onMouseUp.bind(this)}
                                >
                                    {post.content}
                                </p>

                                <div className='tweet-icons'>
                                    <div onClick={this.onReply.bind(this)} title='Reply' className='tweet-button'>
                                        <div style={{ "display": "inline-block" }}>
                                            <TiMessage className='tweet-icon' />
                                        </div>
                                        <div style={{ "display": "inline-block" }} className='tweet-num'><p>{replystr}</p></div>
                                    </div>
                                    {/* <div onClick={this.onRepost.bind(this)} title='Repost' className='tweet-button'>
                                        <TiArrowRepeat className='tweet-icon' />
                                        <span >{repoststr}</span>
                                    </div> */}
                                    <div onClick={this.onLike.bind(this)} title='Like' className='tweet-button'>
                                        <div style={{ "display": "inline-block" }}>
                                            {liked === true ? (
                                                <TiHeartFullOutline color="#e0245e" className='tweet-icon' />
                                            ) : (
                                                <TiHeartOutline className='tweet-icon' />
                                            )}
                                        </div>
                                        <div style={{ "display": "inline-block" }} className='tweet-num'><p>{likestr}</p></div>
                                    </div>
                                    {/* <button onClick={this.onShare.bind(this)} title='Share' className='tweet-button'>
                                        <TiArrowBackOutline className='tweet-icon' />
                                        <span ></span>
                                    </button> */}
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* <hr /> */}
                </div>
            </div>
        );
    }
}


