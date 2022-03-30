import React, { Component } from 'react';
import { BsCalendar3 } from 'react-icons/bs';
import { TiLinkOutline, TiLocationOutline } from 'react-icons/ti';
import '../../App.css';
import { UserDto, UserStatistic } from '../../facade/entity';
import { getLocalTime } from '../../utils/date-utils';

type PropsType = {
    userObj: UserDto
    stat: UserStatistic
}

type StateType = {
}

export class ProfileCenter extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    render() {
        var userObj = this.props.userObj;
        var stat = this.props.stat;
        var joined = new Date(getLocalTime(userObj.userInfo.createTime)).toLocaleDateString("en-US", { year: "numeric", month: "short" });
        var userInfo = userObj.userInfo

        return <div className=''>
            <h3><p style={{ "overflowWrap": "break-word" }}>{userInfo.userName}</p></h3>
            <p style={{ "fontSize": "12px", "lineHeight": "17px", "marginTop": "-15px" }}>@{userObj.userID}</p>

            <div style={{ "marginTop": "10px", "fontSize": "14px", "lineHeight": "17px", marginBottom: "10px" }}>
                <div><p>{userInfo.biography}</p></div>
            </div>
            <div className='row' style={{ "fontSize": "12px" }}>
                {userInfo.location.length > 0 ?
                    <div className='two columns' style={{ width: "auto", marginRight: "5px" }}>
                        <TiLocationOutline /> <span style={{ "fontSize": "14px" }}>{userInfo.location}</span></div>
                    : null
                }
                {
                    userInfo.website.length > 0 ?
                        <div className='two columns' style={{ width: "auto", marginRight: "5px" }}>
                            <TiLinkOutline /> <span style={{ "fontSize": "14px" }}>{userInfo.website}</span></div>
                        : null
                }
                <div className='two columns' style={{ width: "auto", marginRight: "5px" }}>
                    <BsCalendar3 /> <span style={{ "fontSize": "14px" }}>Joined {joined}</span></div>
            </div>

            <div className="alignleft marginbottom5">
                <div className="profilelink cellblock">
                    <a href={'/followees/' + userObj.userID}>
                        <span style={{ "fontWeight": "bold" }}>{stat.followingCount}</span> Following</a>
                </div>
                <div className="profilelink cellblock">
                    <a href={'/followers/' + userObj.userID}>
                        <span style={{ "fontWeight": "bold" }}>{stat.followedCount}</span> Followers</a>
                </div>
            </div>
        </div>
    }
}
