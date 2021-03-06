import React, { Component } from 'react';
import { mightLike } from '../../api/impl/mightlike';
import '../../App.css';
import { Identity, UserDto } from '../../facade/entity';
import { currentTimeMillis } from '../../utils/date-utils';
import { getPrivateKey, signMessage } from '../../utils/encryption';
import { MightLikeUnit } from '../right/MightLikeUnit';
import { Trend } from '../right/Trend';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
}

type StateType = {
    mightlikes: UserDto[]
}

export class Explore extends Component<PropsType, StateType> {

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
        var ret = await mightLike(userID, queryTime, token, 10);

        this.setState({
            mightlikes: ret.data
        });
    }

    render() {

        return <div className='exploreinfo'>
            <div className='bottomborder'>
                <div className='padleft10'>
                    <Trend
                        identityObj={this.props.identityObj}
                        refreshMainCourse={this.props.refreshMainCourse}
                    />
                </div>

            </div>

            <div className='padleft10 margintop10'>
                <h4><p >You might like</p></h4>
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

            <br />
            <br />
        </div>
    }
}
