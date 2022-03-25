import React, { Component } from 'react';
import { BsCalendar3 } from 'react-icons/bs';
import { TiLinkOutline, TiLocationOutline } from 'react-icons/ti';
import '../../App.css';
import { UserInfo, UserStatistic } from '../../facade/entity';
import { getLocalTime } from '../../utils/date-utils';

type PropsType = {
    userObj: UserInfo
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
        var joined = new Date(getLocalTime(userObj.createTime)).toLocaleDateString("en-US", { year: "numeric", month: "short" });

        return <div className=''>
            <h3 title={'UserID: ' + userObj.userID}><p>{userObj.userName}</p></h3>
            <p style={{ "fontSize": "12px", "lineHeight": "17px", "marginTop": "-15px" }}>@{userObj.userID}</p>

            <div style={{ "marginTop": "10px", "fontSize": "14px", "lineHeight": "17px", marginBottom: "10px" }}>
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
