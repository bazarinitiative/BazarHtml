import React, { Component } from 'react';
import { NotifyMessage } from '../../api/impl/notifications';
import '../../App.css';
import { UserInfo } from '../../facade/entity';
import { getUserInfo, getUserPic } from '../../facade/userfacade';
import { formatRelativeTime, getLocalTime } from '../../utils/date-utils';

type PropsType = {
    noti: NotifyMessage
}

type StateType = {
    user: UserInfo | null
    picstr: string
}

export class NotifyUnit extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            user: null,
            picstr: ''
        };
    }

    async componentDidMount() {
        var user = await getUserInfo(this.props.noti.fromWho)
        if (user == null) {
            return
        }
        var picstr = await getUserPic(user.userID)
        this.setState({
            user: user,
            picstr: picstr
        })
    }

    render() {
        var noti = this.props.noti;
        var user = this.state.user;
        if (user == null) {
            return <div>
                Loading...
            </div>
        }
        var picstr = this.state.picstr;

        var timestr = getLocalTime(noti.notifyTime)
        var relativeTime = formatRelativeTime(noti.notifyTime)
        var notifyMsg = `${noti.notifyType}ed you`
        if (noti.notifyType.endsWith('e')) {
            notifyMsg = `${noti.notifyType}d you`
        }

        var notifyMsgTailstr = ''
        var notifyMsgTail
        if (noti.notifyType === 'Mention' || noti.notifyType === 'Like') {
            notifyMsgTailstr = 'from post'
            var url = '/t/' + noti.fromWhere
            notifyMsgTail = <a href={url}>{noti.fromWhere.substring(0, 4)}...</a>
        }

        return <div className='container notifyunit'>
            <div className="row">
                <div className="two columns">
                    <p>
                        <a className='userimg' href={'/p/' + user.userID}>
                            <img src={'data:image/gif;base64,' + picstr} alt="" />
                        </a>
                    </p>
                </div>
                <div className="ten columns">
                    <p className="author">
                        <a href={'/p/' + user.userID}>{user.userName}</a>
                        <span title={'UserID:' + user.userID + ' - Time:' + timestr}>
                            <b className='lightsmall'> @{user.userID.substr(0, 4)} - {relativeTime}</b>
                        </span>
                    </p>
                    <p className=''>{notifyMsg} {notifyMsgTailstr} {notifyMsgTail}</p>
                </div>
            </div>
        </div>
    }
}
