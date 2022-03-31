import React, { Component } from 'react';
import { sendDelete } from '../../api/impl/cmd/delete';
import { sendFollow } from '../../api/impl/cmd/follow';
import { getFollowing } from '../../api/impl/getfollowing';
import '../../App.css';
import { Identity, UserDto } from '../../facade/entity';
import { getUserImgUrl } from '../../facade/userfacade';

type PropsType = {
    identityObj: Identity | null
    userDto: UserDto
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
        var user = this.props.userDto;

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
        var user = this.props.userDto;
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
            var ret = await sendDelete(this.props.identityObj, 'Following', this.props.userDto.userID);
            if (!ret.success) {
                alert(ret.msg)
            }
        } else {
            var ret2 = await sendFollow(this.props.identityObj, 'User', this.props.userDto.userID);
            if (!ret2.success) {
                alert(ret2.msg)
            }
        }

        await this.updateFollowing();
    }

    render() {
        var user = this.props.userDto.userInfo;

        var followstr = 'Follow'
        if (this.state.following) {
            followstr = 'Following'
        }

        return <div className='mightlikeunit'>
            <div style={{ "maxWidth": "220px", marginBottom: '-3px', marginTop: '5px', "paddingLeft": "55px" }}>
                <div style={{ "width": "55px", "marginLeft": "-55px", "display": "inline-block" }} onClick={this.onClick.bind(this)}>
                    <p><img style={{ "marginTop": "0px" }} src={getUserImgUrl(this.props.userDto)} alt="" /></p>
                </div>
                <div style={{ "width": "100%", "display": "inline-block" }}>
                    <div className='row'>
                        <div className='eight columns' onClick={this.onClick.bind(this)}>
                            <p className="author">
                                <span className='linelimitlength usernameshort2'>{user.userName}</span>
                            </p>
                            <p className="author" title={'UserID:' + user.userID}>
                                @{user.userID.substring(0, 4)}...
                            </p>
                        </div>
                        <div className='three columns'>
                            <button className='followbutton' onClick={this.onClickFollow.bind(this)}>{followstr}</button>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    }
}
