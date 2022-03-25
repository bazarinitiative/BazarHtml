import { Component } from "react"
import { BsCalendar3 } from "react-icons/bs";
import { TiLinkOutline, TiLocationOutline } from "react-icons/ti";
import { sendDelete } from "../../api/impl/cmd/delete";
import { sendFollow } from "../../api/impl/cmd/follow";
import { getFollowing } from "../../api/impl/getfollowing";
import { getUserPosts } from "../../api/impl/userposts";
import { getUserProfile } from "../../api/impl/userprofile";
import { HOST_CONCIG } from "../../bazar-config";
import { Identity, UserInfo } from "../../facade/entity"
import { getUserInfo } from "../../facade/userfacade";
import { getLocalTime } from "../../utils/date-utils";
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
    following: boolean
}

export class ProfileDetail extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props)

        this.setState({
            profile: null,
            posts: null,
            userObj: null,
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

        var joined = new Date(getLocalTime(userObj.createTime)).toLocaleDateString("en-US", { year: "numeric", month: "short" });

        return <div className='container'>
            <div>
                <div className='row'>
                    <div>
                        <div className="two columns">
                            <img className="profile-info-img" src={`${HOST_CONCIG.apihost}UserQuery/UserPicImage/${userObj.userID}.jpeg`} alt="" />
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
                    <p style={{ "fontSize": "12px", "lineHeight": "17px", "marginTop": "-15px" }}>@{userObj.userID}</p>
                </div>

                <div style={{ "marginTop": "10px", "fontSize": "14px", "lineHeight": "17px" }}>
                    <div><p>{userObj.biography}</p></div>
                </div>
                <div className='row' style={{ "fontSize": "12px" }}>
                    {userObj.location.length > 0 ?
                        <div className='two columns' style={{ width: "auto", marginRight: "5px" }}>
                            <TiLocationOutline /> <span style={{ "fontSize": "14px" }}>{userObj.location}</span></div>
                        : null
                    }
                    {
                        userObj.website.length > 0 ?
                            <div className='two columns' style={{ width: "auto", marginRight: "5px" }}>
                                <TiLinkOutline /> <span style={{ "fontSize": "14px" }}>{userObj.website}</span></div>
                            : null
                    }
                    <div className='two columns' style={{ width: "auto", marginRight: "5px" }}>
                        <BsCalendar3 /> <span style={{ "fontSize": "14px" }}>Joined {joined}</span></div>
                </div>

                <p style={{ "marginBottom": "5px" }}>
                    <button className="profilebutton2" onClick={this.clickFollowees.bind(this)}>
                        {stat.followingCount} Followings</button>
                    <button className="profilebutton2" onClick={this.clickFollowers.bind(this)}>
                        {stat.followedCount} Followers</button>
                </p>

            </div>
            {
                Object
                    .keys(this.state.posts)
                    .map(key => <Post key={this.state.posts[key].post.postID}
                        dto={this.state.posts[key]}
                        refreshMainCourse={this.props.refreshMainCourse}
                    />)
            }
        </div>
    }
}
