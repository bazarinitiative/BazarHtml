import React, { Component } from 'react';
import { sendDelete } from '../../api/impl/cmd/delete';
import { sendLike } from '../../api/impl/cmd/like';
import { getUserInfo } from '../../facade/userfacade';
import { initialUser } from '../../initdata/users';
import { formatRelativeTime, getLocalTime } from '../../utils/date-utils';
import { getIdentity } from '../../utils/identity-storage';
import Modal from 'react-modal';
import { sendPost } from '../../api/impl/cmd/post';
import { PostDto, UserInfo } from '../../facade/entity';
import { HOST_CONCIG } from '../../bazar-config';
import { TiArrowBackOutline, TiArrowRepeat, TiHeartFullOutline, TiHeartOutline, TiMessage } from "react-icons/ti";
import '../../App.css'
import '../tweet.css'
import { AiOutlineClose } from "react-icons/ai";
import { goURL } from '../../utils/bazar-utils';

type PropsType = {
    refreshMainCourse: any,
    dto: PostDto
    boldConent: boolean,
}

type StateType = {
    authorUserObj: UserInfo | null,
    replyToUserObj: UserInfo | null,
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
            authorUserObj: null,
            replyToUserObj: null,
            isShowModal: false,
        }
    }

    componentDidMount() {
        this.updateUser();
    }

    async updateUser() {
        var dto = this.props.dto;
        var post = dto.post
        // logger('Post-updateUser', post.postID + '-' + post.userID)
        var userID = post.userID;
        var userObj = await getUserInfo(userID);
        if (userObj == null) {
            var user = initialUser as UserInfo;
            user.userID = userID;
            userObj = user;
        }

        if (dto.replyToUser) {
            var replyToUserObj = await getUserInfo(dto.replyToUser)
            this.setState({
                replyToUserObj: replyToUserObj
            })
        }

        this.setState({
            authorUserObj: userObj,
        });
    }

    async onLike() {
        var dto = this.props.dto;
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

        this.props.refreshMainCourse();
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

        var dto = this.props.dto;
        var contentstr = this.replyctl.value;
        await sendPost(identityObj, contentstr, dto.post.postID, dto.post.threadID, false);

        this.props.refreshMainCourse();
    }

    async onReply() {
        this.openModal();
    }

    async onClickContent() {
        goURL('/t/' + this.props.dto.post.postID, this.props.refreshMainCourse);
    }

    async onDelete() {
        var del = window.confirm('Sure to delete?')
        if (del) {
            var identityObj = getIdentity();
            if (identityObj == null) {
                return;
            }
            // alert(this.props.post.postID);
            var ret = await sendDelete(identityObj, "Post", this.props.dto.post.postID);
            if (ret.success) {
                this.props.refreshMainCourse();
            } else {
                window.alert(ret.msg);
            }
        }
    }

    render() {
        var dto = this.props.dto;
        var post = dto.post;
        var ps = dto.ps;
        var liked = dto.liked;

        var timestr = getLocalTime(post.commandTime);
        var user = initialUser as UserInfo;
        if (this.state.authorUserObj != null) {
            user = this.state.authorUserObj;
        }

        var relativeTime = formatRelativeTime(post.commandTime);

        var replystr = ps.replyCount > 0 && ps.replyCount;
        var repoststr = ps.repostCount > 0 && ps.repostCount;
        var likestr = ps.likeCount > 0 && ps.likeCount;

        var contentstyle = 'clickbody';
        if (this.props.boldConent) {
            contentstyle = 'clickbodybold';
        }

        var identityObj = getIdentity();
        if (identityObj == null) {
            return;
        }
        var deletebtn;
        if (identityObj.userID === this.state.authorUserObj?.userID) {
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
                Replying to <a href={'/p/' + this.state.replyToUserObj.userID}>@{this.state.replyToUserObj.userName}</a>
            </p>
        }

        var mobile = (window.screen.width < 1000);
        var borderside = mobile ? "none" : "null";

        Modal.setAppElement("#root");

        return (
            <div className="tweet" style={{ "borderLeft": borderside, "borderRight": borderside }}>
                <div>
                    <Modal
                        isOpen={this.state.isShowModal}
                        style={customStyles}
                    >
                        <div className="row replymodal">
                            <div>
                                <button className="minibutton" onClick={this.closeModalCancel.bind(this)}>
                                    <AiOutlineClose />
                                </button>
                            </div>
                            <div className="two columns"><p><img src={`${HOST_CONCIG.apihost}UserQuery/UserPicImage/${user.userID}.jpeg`} alt="" /></p></div>
                            <div className="ten columns">
                                <p className="author" title={'UserID:' + user.userID + ' - Time:' + timestr}>
                                    {user.userName}@{user.userID.substr(0, 3)}... - {relativeTime}
                                </p>
                                <p className='replybold'>{post.content}</p>
                            </div>
                        </div>
                        <p></p>
                        <p className="lightp">Replying to {user.userName}</p>
                        <p><textarea className='replymodal' placeholder='Write your reply' ref={(x) => this.replyctl = x} /></p>
                        <button className="replybutton" onClick={this.closeModalReply.bind(this)}>Reply</button>
                    </Modal>

                    <div className="row">
                        <div style={{ "width": "15%", "display": "inline-block", "verticalAlign": "top", marginTop: "3px" }}>
                            <p style={{ "marginLeft": "2px" }}>
                                <a className='userimg' href={'/p/' + user.userID}>
                                    <img src={`${HOST_CONCIG.apihost}UserQuery/UserPicImage/${user.userID}.jpeg`} alt="" />
                                </a>
                            </p>
                        </div>
                        <div style={{ "width": "85%", "display": "inline-block" }}>
                            <p className="author">
                                <a href={'/p/' + user.userID}>{user.userName}</a>
                                <span title={'UserID:' + user.userID + ' - Time:' + timestr}>
                                    <b className='lightsmall'> @{user.userID.substring(0, 4)} - {relativeTime}</b>
                                </span>
                                {deletebtn}
                            </p>

                            {replyinfo}
                            <p className={contentstyle} onClick={this.onClickContent.bind(this)}>{post.content}</p>

                            <div className='tweet-icons'>

                                <div onClick={this.onReply.bind(this)} title='Reply' className='tweet-button'>
                                    <TiMessage className='tweet-icon' />
                                    <span >{replystr}</span>
                                </div>
                                <div onClick={this.onRepost.bind(this)} title='Repost' className='tweet-button'>
                                    <TiArrowRepeat className='tweet-icon' />
                                    <span >{repoststr}</span>
                                </div>
                                <div onClick={this.onLike.bind(this)} title='Like' className='tweet-button'>
                                    {liked === true ? (
                                        <TiHeartFullOutline color="#e0245e" className='tweet-icon' />
                                    ) : (
                                        <TiHeartOutline className='tweet-icon' />
                                    )}
                                    <span >{likestr}</span>
                                </div>
                                <button onClick={this.onShare.bind(this)} title='Share' className='tweet-button'>
                                    <TiArrowBackOutline className='tweet-icon' />
                                    <span ></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* <hr /> */}
                </div>
            </div>
        );
    }
}


