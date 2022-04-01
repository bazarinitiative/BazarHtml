
import { Component } from "react";
import "./sidebar.css";
import SidebarLink from "./SidebarLink";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
// import ListAltIcon from "@material-ui/icons/ListAlt";
import PublicIcon from '@material-ui/icons/Public';
import ExploreIcon from '@material-ui/icons/Explore';
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';
import PostAddOutlinedIcon from '@material-ui/icons/PostAddOutlined';
import CallMadeOutlinedIcon from '@material-ui/icons/CallMadeOutlined';
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import BrushOutlinedIcon from '@material-ui/icons/BrushOutlined';
import AccessibilityNewOutlinedIcon from '@material-ui/icons/AccessibilityNewOutlined';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const options = [
    { link: 'Bookmarks', icon: <BookmarkBorderOutlinedIcon /> },
    { link: 'List', icon: <ListAltOutlinedIcon /> },
    { link: 'Topic', icon: <ChatOutlinedIcon /> },
    { link: 'Moments', icon: <OfflineBoltOutlinedIcon /> },
    { link: 'Newsletters', icon: <PostAddOutlinedIcon /> },
    { link: 'Twitter Ads', icon: <CallMadeOutlinedIcon /> },
    { link: 'Analytics', icon: <BarChartOutlinedIcon /> },
    { link: 'Settings', icon: <SettingsOutlinedIcon /> },
    { link: 'Help Center', icon: <HelpOutlineOutlinedIcon /> },
    { link: 'Display', icon: <BrushOutlinedIcon /> },
    { link: 'Keyboard shortcuts', icon: <AccessibilityNewOutlinedIcon /> },
];

type PropsType = {
    refreshMainCourse: any
}

type StateType = {
    open: boolean
}

export class Sidebar extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);

        this.state = {
            open: false
        };
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    handleClick() {
        this.setState({
            open: true
        });
    }

    render() {

        var vb = "0,0,24,24"

        return (
            <div className="sidebar2">
                <SidebarLink refreshMainCourse={this.props.refreshMainCourse} text="Home"
                    Icon={<HomeIcon viewBox={vb} />} href="/" />
                <SidebarLink refreshMainCourse={this.props.refreshMainCourse} text="Explore"
                    Icon={<ExploreIcon viewBox={vb} />} href="/explore/" />
                <SidebarLink refreshMainCourse={this.props.refreshMainCourse} text="Timeline"
                    Icon={<PublicIcon viewBox={vb} />} href="/timeline/" />
                <SidebarLink refreshMainCourse={this.props.refreshMainCourse} text="Search"
                    Icon={<SearchIcon viewBox={vb} />} href="/search?wd=" />
                <SidebarLink refreshMainCourse={this.props.refreshMainCourse} text="Notifications"
                    Icon={<NotificationsNoneIcon viewBox={vb} />} href="/notification/" />
                {/* <SidebarLink refreshMainCourse={this.props.refreshMainCourse} text="Bookmarks"
                 Icon={BookmarkBorderIcon} href="/" /> */}
                {/* <SidebarLink refreshMainCourse={this.props.refreshMainCourse} text="Lists"
                    Icon={<ListAltIcon viewBox={vb} />} href="/list/" /> */}
                <SidebarLink refreshMainCourse={this.props.refreshMainCourse} text="Profile"
                    Icon={<PermIdentityIcon viewBox={vb} />} href="/p/" />
                {/* <Button onClick={this.handleClick.bind(this)} id="moreLinks">
                    <NotificationsNoneIcon viewBox={vb} /> More
                </Button> */}
                {/* <Button id="tweet">
                    Post
                </Button> */}

                <Menu
                    id="long-menu"
                    open={this.state.open}
                    onClose={this.handleClose.bind(this)}
                >
                    {options.map((option) => (
                        <MenuItem key={option.link} onClick={this.handleClose.bind(this)}>
                            {option.icon} {option.link}
                        </MenuItem>
                    ))}
                </Menu>

            </div>


        );
    }

}
