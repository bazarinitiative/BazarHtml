import { SaveRounded } from '@material-ui/icons';
import React, { Component } from 'react';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { randomString } from '../../utils/encryption';
import { SearchCom } from '../share/SearchCom';
import { MightLike } from './MightLike';
import { Trend } from './Trend';

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any,
}

type StateType = {
    key: string
}

export class Recommend extends Component<PropsType, StateType> {

    async refreshPage() {
        this.setState({
            key: randomString(10)
        })
    }

    render() {

        var ayPath = window.location.pathname.split('/', 10);
        var recommendtrend = true
        if (ayPath.length > 1 && ayPath[1] === 'explore') {
            recommendtrend = false
        }
        var trend: any
        if (recommendtrend) {
            trend = <Trend
                identityObj={this.props.identityObj}
                refreshMainCourse={this.props.refreshMainCourse}
            />
        }

        var search = <SearchCom
            identityObj={this.props.identityObj}
            refreshMainCourse={this.props.refreshMainCourse}
            wd=''
        />
        if (ayPath.length > 1 && ayPath[1] === 'search') {
            search = <p style={{ height: "50px" }} />
        }

        return <div>
            <div>
                {search}
            </div>
            <div className='mightlike sidebar'>
                <MightLike
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.props.refreshMainCourse}
                />
                {trend}
            </div>
        </div>
    }
}
