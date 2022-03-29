import React, { Component } from 'react';
import { getFollowees } from '../../api/impl/getfollowees';
import { getFollowers } from '../../api/impl/getfollowers';
import '../../App.css';
import { UserDto } from '../../facade/entity';
import { getIdentity } from '../../utils/identity-storage';
import { FollowUnit } from './FollowUnit';

type PropsType = {
    userID: string,
    refreshMainCourse: any,
    showfollowers: boolean,
}

type StateType = {
    units: UserDto[]
}

/**
 * show folloers or followees of someone (props.userID)
 */
export class Follow extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            units: []
        };
    }

    async componentDidMount() {
        var userID = this.props.userID;
        if (this.props.showfollowers) {
            var ret = await getFollowers(userID, 0, 20);
            var ay = ret.data as UserDto[]
            this.setState({
                units: ay
            });
        } else {
            var ret2 = await getFollowees(userID, 0, 20);
            var ay2 = ret2.data as UserDto[]
            this.setState({
                units: ay2
            });
        }
    }

    render() {
        var identityObj = getIdentity();
        var hint = "Following"
        if (this.props.showfollowers) {
            hint = "Followers"
        }

        return <div>
            <h4><p>@{this.props.userID}</p></h4>
            <h4><p>{hint}</p></h4>
            <div className='mightlike'>
                {
                    Object
                        .keys(this.state.units)
                        .map(key => <FollowUnit key={this.state.units[Number(key)].userInfo.userID}
                            identityObj={identityObj}
                            userDto={this.state.units[Number(key)]}
                            refreshMainCourse={this.props.refreshMainCourse}
                        />)
                }
            </div>
        </div>
    }
}
