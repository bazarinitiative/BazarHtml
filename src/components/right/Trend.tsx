import React, { Component } from 'react';
import { getTrending, TrendData } from '../../api/impl/trending';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { currentTimeMillis } from '../../utils/date-utils';
import { getPrivateKey, signMessage } from '../../utils/encryption';
import { TrendUnit } from './TrendUnit';

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any
}

type StateType = {
    trends: any
}

export class Trend extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            trends: {}
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
        var ret = await getTrending(userID, queryTime, token, 5);

        this.setState({
            trends: ret.data as TrendData[]
        })
    }

    render() {
        return <div>
            <h4><p>Trends for you</p></h4>
            <div className='container'>
                {
                    Object
                        .keys(this.state.trends)
                        .map(key => <TrendUnit key={key}
                            idx={Number(key) + 1}
                            trendData={this.state.trends[key] as TrendData}
                            refreshMainCourse={this.props.refreshMainCourse}
                        />)
                }
            </div>
        </div>
    }
}
