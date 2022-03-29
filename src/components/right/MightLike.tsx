import React, { Component } from 'react';
import { mightLike } from '../../api/impl/mightlike';
import '../../App.css';
import { Identity, UserDto } from '../../facade/entity';
import { currentTimeMillis } from '../../utils/date-utils';
import { getPrivateKey, signMessage } from '../../utils/encryption';
import { MightLikeUnit } from './MightLikeUnit';

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any
}

type StateType = {
    mightlikes: UserDto[]
}

export class MightLike extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            mightlikes: []
        };
    }

    async componentDidMount() {
        if (this.props.identityObj == null) {
            return;
        }
        var identityObj = this.props.identityObj;
        var userID = identityObj.userID;
        var queryTime = currentTimeMillis();
        var privateKeyObj = await getPrivateKey(identityObj.privateKey);
        var token = await signMessage(privateKeyObj, queryTime.toString());
        var ret = await mightLike(userID, queryTime, token, 3);

        this.setState({
            mightlikes: ret.data
        });
    }

    render() {
        return <div>
            <h4><p>Who to follow</p></h4>
            <div className='mightlike'>
                {
                    Object
                        .keys(this.state.mightlikes)
                        .map(key => <MightLikeUnit key={this.state.mightlikes[Number(key)].userInfo.userID}
                            identityObj={this.props.identityObj}
                            userDto={this.state.mightlikes[Number(key)]}
                            refreshMainCourse={this.props.refreshMainCourse}
                        />)
                }
            </div>
        </div>
    }
}
