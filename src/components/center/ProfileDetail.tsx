import { Component } from "react"
import { sendDelete } from "../../api/impl/cmd/delete";
import { sendFollow } from "../../api/impl/cmd/follow";
import { getFollowing } from "../../api/impl/getfollowing";
import { getUserPosts } from "../../api/impl/userposts";
import { getUserProfile } from "../../api/impl/userprofile";
import { Identity, UserDto } from "../../facade/entity"
import { getUserDto, getUserImgUrl } from "../../facade/userfacade";
import { ProfileCenter } from "./ProfileCenter";
import { ProfileTab } from "./ProfileTab";

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any,
    userID: string
}

type StateType = {
    profile: any
    posts: any
    userDto: UserDto | null
    following: boolean
}

export class ProfileDetail extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props)

        this.state = {
            profile: null,
            posts: null,
            userDto: null,
            following: false,
        }
    }

    async componentDidMount() {
        this.setState({
            posts: null
        })
        this.refreshPage();
    }

    async refreshPage() {
        var ret = await getUserProfile(this.props.userID)
        var ret2 = await getUserPosts(this.props.userID, false, 0, 20, this.props.identityObj?.userID ?? "")

        var userObj = await getUserDto(this.props.userID);

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
            userDto: userObj,
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
        if (this.state.userDto == null) {
            return <div>Loading for userID:{userID}</div>
        }
        var userObj = this.state.userDto;
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
                            <img className="profile-info-img" src={getUserImgUrl(userObj)} alt="" />
                        </div>
                        <div className="six columns">
                            <p></p>
                        </div>
                        <div className="four columns">
                            <button className="profilebutton" onClick={this.follow.bind(this)}>{followstr}</button>
                        </div>
                    </div>
                </div>

                <ProfileCenter
                    userObj={userObj}
                    stat={stat}
                />

            </div>
            <div>
                <ProfileTab
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.props.refreshMainCourse}
                    userID={this.props.userID}
                />
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    }
}
