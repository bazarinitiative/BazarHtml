import React, { Component } from 'react';
import { sendDelete } from '../../api/impl/cmd/delete';
import { sendFollow } from '../../api/impl/cmd/follow';
import { getFollowing } from '../../api/impl/getfollowing';
import '../../App.css';
import { Identity, UserInfo } from '../../facade/entity';
import { getUserPic } from '../../facade/userfacade';

type PropsType = {
    identityObj: Identity | null
    userInfo: UserInfo
    userStatic: any
    refreshMainCourse: any
}

type StateType = {
    picstr: string
    following: boolean
}

export class FollowUnit extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            picstr: '',
            following: false
        };
    }

    async componentDidMount() {
        var user = this.props.userInfo;
        var picstr = await getUserPic(user.userID)

        var following = false
        if (this.props.identityObj) {
            var ret3 = await getFollowing(this.props.identityObj.userID, user.userID);
            if (ret3.data.userID === this.props.identityObj.userID) {
                following = true;
            }
        }

        this.setState({
            picstr: picstr,
            following: following
        })
    }

    onClick() {
        var user = this.props.userInfo;
        var uri = '/p/' + user.userID;

        window.history.pushState('', '', uri);
        setTimeout(() => {
            this.props.refreshMainCourse();
        }, 50);
    }

    async onClickFollow() {
        if (this.props.identityObj == null) {
            return
        }

        if (this.state.following) {
            var ret = await sendDelete(this.props.identityObj, 'Following', this.props.userInfo.userID);
            if (!ret.success) {
                alert(ret.msg)
            }
        } else {
            var ret2 = await sendFollow(this.props.identityObj, 'User', this.props.userInfo.userID);
            if (!ret2.success) {
                alert(ret2.msg)
            }
        }

        await this.componentDidMount();
    }

    render() {
        var user = this.props.userInfo;
        var picstr = this.state.picstr;
        var username = user.userName;
        var usertitle = '';
        if (username.length > 10) {
            username = username.substring(0, 10) + '...';
            usertitle = user.userName;
        }

        var followstr = 'Follow'
        if (this.state.following) {
            followstr = 'Following'
        }

        return <div className='mightlikeunit'>
            <div className='row'>
                <div className="three columns" onClick={this.onClick.bind(this)}><p><img src={'data:image/gif;base64,' + picstr} alt="" /></p></div>
                <div className="six columns" onClick={this.onClick.bind(this)}>
                    <p className="author" title={usertitle}>
                        {username}
                    </p>
                    <p className="author" title={'UserID:' + user.userID}>
                        @{user.userID.substring(0, 3)}...
                    </p>
                    <div>
                        <p className='lightsmall'>{user.biography}</p>
                    </div>
                </div>
                <div className='three columns'>
                    <button className='followbutton' onClick={this.onClickFollow.bind(this)}>{followstr}</button>
                </div>

            </div>

        </div>
    }
}
