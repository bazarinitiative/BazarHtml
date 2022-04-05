import React, { Component } from 'react';
import { getNotifyDtos, NotifyDto } from '../../api/impl/notifydtos';
import '../../App.css';
import { currentTimeMillis } from '../../utils/date-utils';
import { getPrivateKey, randomString, signMessage } from '../../utils/encryption';
import { getIdentity } from '../../utils/identity-storage';
import { logger } from '../../utils/logger';
import { NotifyUnit } from './NotifyUnit';

type PropsType = {
    refreshMainCourse: any
}

type StateType = {
    notis: NotifyDto[]
    startTime: number,
    key: string | null,
    fetching: boolean,
    hasMoreData: boolean,
}

var AsyncLock = require('async-lock');
var lock = new AsyncLock();

export class Notifications extends Component<PropsType, StateType> {
    pageSize: number = 20

    constructor(props: PropsType) {
        super(props);
        this.state = {
            notis: [],
            startTime: 0,
            key: null,
            fetching: false,
            hasMoreData: true,
        };
    }

    async componentDidMount() {
        await this.fetchData();

        window.onscroll = this.onScroll.bind(this)
    }

    async onScroll() {
        lock.acquire("notify_onscoll", async () => {
            var top = document.documentElement.scrollTop || document.body.scrollTop
            var over = window.innerHeight + top + 100 - Number(document.scrollingElement?.scrollHeight);
            if (over > 0) {
                await this.fetchData()
            }
        });
    }

    async refreshPage() {
        logger('notifications', 'refreshPage');
        this.setState({
            startTime: 0,
            key: randomString(10),
            hasMoreData: true
        });
        await this.fetchData();
    }

    async fetchData() {

        if (!this.state.hasMoreData) {
            return
        }

        if (this.state.fetching) {
            return
        }

        this.setState({
            fetching: true
        })

        logger('notification', `fetchData ${this.state.startTime}`)

        setTimeout(async () => {
            try {
                var startTime = this.state.startTime;
                var maxCount = this.pageSize;

                var identityObj = getIdentity();
                if (identityObj == null) {
                    return;
                }
                var privateKeyObj = await getPrivateKey(identityObj.privateKey);
                var queryTime = currentTimeMillis();
                var token = await signMessage(privateKeyObj, queryTime.toString());
                var ret = await getNotifyDtos(identityObj.userID, queryTime, token, startTime, maxCount);
                if (ret.data.length === 0) {
                    this.setState({
                        hasMoreData: false
                    })
                }
                var ay = this.state.notis;
                if (startTime === 0) {
                    ay = ret.data;
                } else {
                    ay = this.state.notis.concat(ret.data);
                }
                ay.forEach(x => {
                    if (x.noti.notifyTime < startTime || startTime === 0) {
                        startTime = x.noti.notifyTime - 2
                    }
                });
                this.setState({
                    startTime: startTime,
                    notis: ay,
                })
            } finally {
                this.setState({
                    fetching: false
                })
            }

        }, 50);
    }

    render() {
        if (this.state.notis.length === 0 && this.state.fetching) {
            return <div>
                Loading...
            </div>
        }
        if (this.state.notis.length === 0) {
            return <div>
                No data
            </div>
        }

        var nomore = <div><br />No more data</div>
        if (this.state.hasMoreData || this.state.notis.length < this.pageSize) {
            nomore = <div></div>
        }

        logger('notification', `render notis ${this.state.notis.length}`)

        return <div className='container'>
            {
                Object
                    .keys(this.state.notis)
                    .map(key => <NotifyUnit key={key}
                        notiDto={this.state.notis[Number(key)]}
                        refreshMainCourse={this.props.refreshMainCourse}
                    />)
            }
            {nomore}
            <br />
        </div>
    }
}
