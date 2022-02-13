import React, { Component } from 'react';
import { getFollowees } from '../../api/impl/getfollowees';
import { getFollowers } from '../../api/impl/getfollowers';
import '../../App.css';
import { getIdentity } from '../../utils/identity-storage';
import { FollowUnit } from './FollowUnit';

type PropsType = {
    userID: string,
    refreshMainCourse: any,
    showfollowers: boolean,
}

type StateType = {
    units: any
}

/**
 * show folloers or followees of someone (props.userID)
 */
export class Follow extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            units: {}
        };
    }

    async componentDidMount() {
        var userID = this.props.userID;
        if (this.props.showfollowers) {
            var ret = await getFollowers(userID, 0, 20);
            this.setState({
                units: ret.data
            });
        } else {
            var ret2 = await getFollowees(userID, 0, 20);
            this.setState({
                units: ret2.data
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
                        .map(key => <FollowUnit key={key}
                            identityObj={identityObj}
                            userInfo={this.state.units[key].userInfo}
                            userStatic={this.state.units[key].userStatic}
                            refreshMainCourse={this.props.refreshMainCourse}
                        />)
                }
            </div>
        </div>
    }
}
