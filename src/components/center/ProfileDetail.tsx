import { Component } from "react"
import { sendDelete } from "../../api/impl/cmd/delete";
import { sendFollow } from "../../api/impl/cmd/follow";
import { getFollowing } from "../../api/impl/getfollowing";
import { getUserPosts } from "../../api/impl/userposts";
import { getUserProfile } from "../../api/impl/userprofile";
import { Identity, UserInfo } from "../../facade/entity"
import { getUserInfo, getUserPic } from "../../facade/userfacade";
import { Post } from "./Post";

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any,
    userID: string
}

type StateType = {
    profile: any
    posts: any
    userObj: UserInfo | null
    picstr: string,
    following: boolean
}

export class ProfileDetail extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props)

        this.setState({
            profile: null,
            posts: null,
            userObj: null,
            picstr: '',
            following: false,
        })
    }

    async componentDidMount() {
        this.setState({
            posts: null
        })
        this.refreshPage();
    }

    async refreshPage() {
        var ret = await getUserProfile(this.props.userID)
        var ret2 = await getUserPosts(this.props.userID, false, 0, 20)

        var userObj = await getUserInfo(this.props.userID);
        var picstr = '';
        if (userObj != null) {
            picstr = await getUserPic(userObj.userID)
        }

        var following = false;
        if (this.props.identityObj && userObj) {
            var ret3 = await getFollowing(this.props.identityObj.userID, userObj.userID);
            if (ret3.data.userID === this.props.identityObj.userID) {
                following = true;
            }
        }

        this.setState({
            profile: ret.data,
            posts: ret2.data,
            userObj: userObj,
            picstr: picstr,
            following: following
        })
    }

    async follow() {
        if (this.props.identityObj == null) {
            return
        }

        if (this.state.following) {
            var ret = await sendDelete(this.props.identityObj, 'Following', this.props.userID);
            if (!ret.success) {
                alert(ret.msg)
            }
        } else {
            var ret2 = await sendFollow(this.props.identityObj, 'User', this.props.userID);
            if (!ret2.success) {
                alert(ret2.msg)
            }
        }

        this.props.refreshMainCourse()
    }

    clickFollowees() {
        window.location.href = '/followees/' + this.props.userID
    }

    clickFollowers() {
        window.location.href = '/followers/' + this.props.userID
    }

    render() {

        var userID = this.props.userID;
        if (this.state?.userObj == null) {
            return <div>Loading for userID:{userID}</div>
        }
        var userObj = this.state?.userObj;
        var followstr = 'Follow';
        if (this.state.following) {
            followstr = 'Following'
        }

        var stat = this.state.profile.userStatistic;

        return <div className='container'>
            <div>
                <div className='row'>
                    <div>
                        <div className="two columns">
                            <img className="profile-info-img" src={'data:image/gif;base64,' + this.state.picstr} alt="" />
                        </div>
                        <div className="six columns">
                            <p></p>
                        </div>
                        <div className="four columns">
                            <button className="profilebutton2" onClick={this.follow.bind(this)}>{followstr}</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h1><p>{userObj.userName}</p></h1>
                    <p>{userObj.userID}</p>
                    <p>
                        <button className="profilebutton2" onClick={this.clickFollowees.bind(this)}>{stat.followingCount} Followings</button>
                        <button className="profilebutton2" onClick={this.clickFollowers.bind(this)}>{stat.followedCount} Followers</button>
                    </p>
                </div>
            </div>
            <hr />
            {/* <Divider></Divider> */}
            {
                Object
                    .keys(this.state.posts)
                    .map(key => <Post key={this.state.posts[key].post.postID}
                        post={this.state.posts[key].post}
                        ps={this.state.posts[key].ps}
                        liked={this.state.posts[key].liked}
                        refreshMainCourse={this.props.refreshMainCourse}
                    />)
            }
        </div>
    }
}
