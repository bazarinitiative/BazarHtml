import React, { Component } from 'react';
import { getNotifications } from '../../api/impl/notifications';
import '../../App.css';
import { currentTimeMillis } from '../../utils/date-utils';
import { getPrivateKey, signMessage } from '../../utils/encryption';
import { getIdentity } from '../../utils/identity-storage';
import { NotifyUnit } from './NotifyUnit';

type PropsType = {
}

type StateType = {
    notis: any
}

export class Notifications extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            notis: null
        };
    }

    async componentDidMount() {
        var identityObj = getIdentity();
        if (identityObj == null) {
            return;
        }
        var privateKeyObj = await getPrivateKey(identityObj.privateKey);
        var queryTime = currentTimeMillis();
        var token = await signMessage(privateKeyObj, queryTime.toString());
        var ret = await getNotifications(identityObj.userID, queryTime, token, 0, 20);
        this.setState({
            notis: ret.data
        })
    }

    render() {
        if (this.state.notis == null) {
            return <div>
                Loading...
            </div>
        }
        if (this.state.notis.length === 0) {
            return <div>
                No data
            </div>
        }

        return <div className='container'>
            {
                Object
                    .keys(this.state.notis)
                    .map(key => <NotifyUnit key={key}
                        noti={this.state.notis[key]}
                    />)
            }
            <br />
        </div>
    }
}
