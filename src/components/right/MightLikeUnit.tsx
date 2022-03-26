import React, { Component } from 'react';
import { sendDelete } from '../../api/impl/cmd/delete';
import { sendFollow } from '../../api/impl/cmd/follow';
import { getFollowing } from '../../api/impl/getfollowing';
import '../../App.css';
import { HOST_CONCIG } from '../../bazar-config';
import { Identity, UserInfo } from '../../facade/entity';

type PropsType = {
    identityObj: Identity | null
    userInfo: UserInfo
    userStatic: any
    refreshMainCourse: any
}

type StateType = {
    following: boolean
}

export class MightLikeUnit extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            following: false
        };
    }

    async componentDidMount() {
        // await this.updateFollowing();
    }

    private async updateFollowing() {
        var user = this.props.userInfo;

        var following = false;
        if (this.props.identityObj) {
            var ret3 = await getFollowing(this.props.identityObj.userID, user.userID);
            if (ret3.data.userID === this.props.identityObj.userID) {
                following = true;
            }
        }

        this.setState({
            following: following
        });
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

        await this.updateFollowing();
    }

    render() {
        var user = this.props.userInfo;
        var username = user.userName;
        var usertitle = '';
        var lean = 16
        if (username && username.length > 0 && username.charAt(0) > '~') {
            //not letter or number, usually wide char
            lean = 8
        }
        if (username.length > lean) {
            username = username.substring(0, lean) + '...';
            usertitle = user.userName;
        }

        var followstr = 'Follow'
        if (this.state.following) {
            followstr = 'Following'
        }

        return <div className='mightlikeunit'>
            <div style={{ "maxWidth": "220px", marginBottom: '5px', marginTop: '5px' }}>
                <div style={{ "width": "30%", "display": "inline-block" }} onClick={this.onClick.bind(this)}>
                    <p><img style={{ "marginBottom": "-10px" }} src={`${HOST_CONCIG.apihost}UserQuery/UserPicImage/${user.userID}.jpeg`} alt="" /></p>
                </div>
                <div style={{ "width": "65%", "display": "inline-block" }} onClick={this.onClick.bind(this)}>
                    <p className="author" title={usertitle}>
                        {username}
                    </p>
                    <p className="author" title={'UserID:' + user.userID}>
                        @{user.userID.substring(0, 4)}...
                        <span style={{ "width": "25%", "display": "inline-block", "float": "right", marginRight: "15px" }}>
                            <button className='followbutton' onClick={this.onClickFollow.bind(this)}>{followstr}</button>
                        </span>
                    </p>
                </div>

            </div>
        </div>
    }
}
