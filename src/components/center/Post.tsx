import React, { Component } from 'react';
import { sendDelete } from '../../api/impl/cmd/delete';
import { sendLike } from '../../api/impl/cmd/like';
import { getUserInfo, getUserPic } from '../../facade/userfacade';
import { initialUser, initialUserPic } from '../../initdata/users';
import { formatRelativeTime, getLocalTime } from '../../utils/date-utils';
import { getIdentity } from '../../utils/identity-storage';
import Modal from 'react-modal';
import { sendPost } from '../../api/impl/cmd/post';
import { UserInfo } from '../../facade/entity';

type PropsType = {
    refreshMainCourse: any,
    post: any,
    ps: any,
    liked: any,
    boldConent: boolean,
}

type StateType = {
    authorUserObj: UserInfo | null,
    picstr: string,
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
            picstr: '',
            isShowModal: false,
        }
    }

    componentDidMount() {
        this.updateUser();
    }

    async updateUser() {
        var userID = this.props.post.userID;
        var userObj = await getUserInfo(userID);
        if (userObj == null) {
            var user = initialUser as UserInfo;
            user.userID = userID;
            userObj = user;
        }

        var picstr = await getUserPic(userID);
        if (picstr == null) {
            picstr = initialUserPic;
        }

        this.setState({
            authorUserObj: userObj,
            picstr: picstr
        });
    }

    async onLike() {

        var post = this.props.post;
        var liked = this.props.liked;

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

        var contentstr = this.replyctl.value;
        await sendPost(identityObj, contentstr, this.props.post.postID, this.props.post.threadID, false);

        this.props.refreshMainCourse();
    }

    async onReply() {
        this.openModal();
    }

    async onClickContent() {
        window.history.pushState('', '', '/t/' + this.props.post.postID);
        setTimeout(() => {
            this.props.refreshMainCourse();
        }, 50);
    }

    async onDelete() {
        var del = window.confirm('Sure to delete?')
        if (del) {
            var identityObj = getIdentity();
            if (identityObj == null) {
                return;
            }
            // alert(this.props.post.postID);
            var ret = await sendDelete(identityObj, "Post", this.props.post.postID);
            if (ret.success) {
                this.props.refreshMainCourse();
            } else {
                window.alert(ret.msg);
            }
        }
    }

    render() {
        var post = this.props.post;
        var ps = this.props.ps;
        var liked = this.props.liked;

        var timestr = getLocalTime(post.commandTime);
        var user = initialUser as UserInfo;
        var picstr = initialUserPic;
        if (this.state.authorUserObj != null) {
            user = this.state.authorUserObj;
            picstr = this.state.picstr;
        }

        var relativeTime = formatRelativeTime(post.commandTime);

        var replystr = 'Reply ' + ps.replyCount;
        var repoststr = 'Repost ' + ps.repostCount;
        var likestr = 'Like ' + ps.likeCount;
        var likestyle = 'postbutton';
        if (liked) {
            likestyle += ' postbuttonred';
        }

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
                x
            </button>;
        }

        Modal.setAppElement("#root");

        return (
            <div className="individualPost">
                <div>
                    <Modal
                        isOpen={this.state.isShowModal}
                        style={customStyles}
                    >
                        <div className="row replymodal">
                            <div><button className="minibutton" onClick={this.closeModalCancel.bind(this)}>x</button></div>
                            <div className="two columns"><p><img src={'data:image/gif;base64,' + picstr} alt="" /></p></div>
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
                        <div style={{ "width": "20%", "display": "inline-block", "verticalAlign": "top" }}>
                            <p><a className='userimg' href={'/p/' + user.userID}><img src={'data:image/gif;base64,' + picstr} alt="" /></a></p>
                        </div>
                        <div style={{ "width": "80%", "display": "inline-block" }}>
                            <p className="author">
                                <a href={'/p/' + user.userID}>{user.userName}</a>
                                <span title={'UserID:' + user.userID + ' - Time:' + timestr}>
                                    <b className='lightsmall'> @{user.userID.substr(0, 4)} - {relativeTime}</b>
                                </span>
                                {deletebtn}
                            </p>
                            <p className={contentstyle} onClick={this.onClickContent.bind(this)}>{post.content}</p>
                            <p>
                                <button onClick={this.onReply.bind(this)} className='postbutton' title='Reply'>{replystr}</button>
                                <button onClick={this.onRepost.bind(this)} className='postbutton' title='Repost'>{repoststr}</button>
                                <button onClick={this.onLike.bind(this)} className={likestyle} title='Like'>{likestr}</button>
                            </p>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        );
    }
}


