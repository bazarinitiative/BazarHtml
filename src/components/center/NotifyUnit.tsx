import React, { Component } from 'react';
import { NotifyDto } from '../../api/impl/notifydtos';
import '../../App.css';
import { UserDto } from '../../facade/entity';
import { getUserDto, getUserImgUrl } from '../../facade/userfacade';
import { goURL } from '../../utils/bazar-utils';
import { Post } from './Post';

type PropsType = {
    notiDto: NotifyDto,
    refreshMainCourse: any,
}

type StateType = {
    user: UserDto | null
}

export class NotifyUnit extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            user: null,
        };
    }

    async componentDidMount() {
        var user = await getUserDto(this.props.notiDto.noti.fromWho)
        if (user == null) {
            return
        }
        this.setState({
            user: user,
        })
    }

    onClick() {
        var url = '/t/' + this.props.notiDto.postDto.post.postID + '/'
        goURL(url, this.props.refreshMainCourse)
    }

    render() {
        var noti = this.props.notiDto.noti;
        var post = this.props.notiDto.postDto.post;
        var user = this.state.user;
        if (user == null) {
            return <div>
                Loading...
            </div>
        }

        if (noti.notifyType === "Reply" || noti.notifyType === "Mention") {
            return <div>
                <Post
                    postDto={this.props.notiDto.postDto}
                    refreshMainCourse={this.props.refreshMainCourse}
                />
            </div>
        }

        return <div className='notifyunit' onClick={this.onClick.bind(this)}>
            <div className="row" style={{ "paddingLeft": "55px" }}>
                <div className="" style={{ "marginLeft": "-55px", "display": "inline-block", "verticalAlign": "top" }}>
                    <p style={{ "marginLeft": "-5px" }}>
                        <a className='userimg' href={'/p/' + user.userID}>
                            <img src={getUserImgUrl(this.state.user)} alt="" />
                        </a>
                    </p>
                </div>
                <div className="" style={{ "width": "100%", "display": "inline-block" }}>
                    <div style={{ "marginLeft": "10px" }}>
                        <p className="author" style={{}}>
                            <a href={'/p/' + user.userID}><span className='linelimitlength usernameshort'>{user.userInfo.userName}</span></a>
                            <span className='lightsmall'> liked your {post.replyTo.length > 0 ? 'reply' : 'post'}</span>
                        </p>
                        <p className='clickbody'>{post.content}</p>
                    </div>

                </div>
            </div>
        </div>
    }
}
