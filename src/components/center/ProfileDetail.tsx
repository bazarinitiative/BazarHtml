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
import './Profile.css'
import '../../App.css'
import { Menu, MenuItem } from '@material-ui/core';
import ListAltIcon from "@material-ui/icons/ListAlt";
import { goURL } from "../../utils/bazar-utils";
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import Modal from 'react-modal';
import { ChannelDto, getUserChannels } from "../../api/impl/getchannels";
import { ChannelUnit } from "./ChannelUnit";

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
    openMenu: boolean
    anckerEl: any
    amList: boolean
    ownChs: ChannelDto[]
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

export class ProfileDetail extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props)

        this.state = {
            profile: null,
            posts: null,
            userDto: null,
            following: false,
            openMenu: false,
            anckerEl: null,
            amList: false,
            ownChs: [],
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

    extMenu(event: any) {
        var oepnMenu = !this.state.openMenu;
        this.setState({
            openMenu: oepnMenu,
            anckerEl: event.currentTarget,
        })
    }

    async clickAddRemove() {
        var ret = await getUserChannels(this.props.identityObj?.userID ?? "")
        var ay = ret.data as ChannelDto[]

        this.setState({
            openMenu: false,
            amList: true,
            ownChs: ay,
        })
    }

    closeAmList() {
        this.setState({
            amList: false
        })
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

        var vb = "0,0,24,24"

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
                            <button className="profileextbutton" onClick={this.extMenu.bind(this)}>···</button>
                            <button className="profilebutton" onClick={this.follow.bind(this)}>{followstr}</button>
                        </div>
                    </div>
                </div>

                <Menu
                    open={this.state.openMenu}
                    anchorEl={this.state.anckerEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    onClose={this.extMenu.bind(this)}
                >
                    <div style={{ width: "100%" }}>
                        <MenuItem onClick={this.clickAddRemove.bind(this)}>
                            <PlaylistAddCheckIcon viewBox={vb} className='lineicon' />
                            Add to Lists
                        </MenuItem>
                        <MenuItem onClick={() => goURL('/list/' + this.props.userID, this.props.refreshMainCourse)}>
                            <ListAltIcon viewBox={vb} className='lineicon' />
                            View Lists
                        </MenuItem>
                    </div>
                </Menu>

                <Modal
                    /** Add/Remove user from Lists */
                    isOpen={this.state.amList}
                    shouldCloseOnEsc={true}
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={this.closeAmList.bind(this)}
                    style={customStyles}
                >
                    <div style={{ "minHeight": "200px", "maxHeight": "400px", "minWidth": "200px" }}>
                        <div style={{ "marginBottom": "10px" }}>Pick List to Add</div>
                        {
                            this.state.ownChs.map(x => <ChannelUnit
                                dto={x}
                                refreshMainCourse={this.props.refreshMainCourse}
                                clickAm={true}
                                userAm={this.props.userID}
                            />)
                        }

                    </div>

                </Modal>

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
