import React, { Component } from 'react';
import { TiArrowLeft } from 'react-icons/ti';
import { ChannelMemberDto, getChannelMembers } from '../../api/impl/getchannelmember';
import { publicsearch, SearchResult } from '../../api/impl/publicsearch';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { logger } from '../../utils/logger';
import { ChannelMemberList } from './ChannelMemberList';

export interface CMUnit {
    userID: string
    isMember: boolean
    cmID: string
}

type PropsType = {
    identityObj: Identity | null
    closeMember: any
    channelID: string
    refreshMainCourse: any
}

type StateType = {
    mbs: CMUnit[]
    searchs: CMUnit[]
    tab: number
}

export class ChannelEditMember extends Component<PropsType, StateType> {
    searchtxt: HTMLInputElement | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            mbs: [],
            searchs: [],
            tab: 1
        };
    }

    async componentDidMount() {
        await this.refreshMember();
    }

    async refreshMemberPage() {
        this.setState({
            tab: 1
        })
        await this.refreshMember();
    }

    async refreshMember() {
        var ret = await getChannelMembers(this.props.channelID);
        var ay = ret.data as ChannelMemberDto[]
        let mbs: CMUnit[] = []
        ay.forEach(x => {
            let node: CMUnit = {
                userID: x.channelMember.memberID,
                isMember: true,
                cmID: x.channelMember.cmID,
            }
            mbs.push(node)
        })
        this.setState({
            mbs: mbs
        })
        logger('ChannelMember-refresh', ret)
    }

    async search() {
        if (!this.searchtxt) {
            return
        }
        var ret = await publicsearch(this.searchtxt.value, 'People', 0, 20);
        var sr = ret.data as SearchResult
        let mbs: CMUnit[] = []
        sr.users.forEach(x => {
            let node: CMUnit = {
                userID: x.userID,
                isMember: false,
                cmID: ''
            }
            mbs.push(node)
        })
        this.setState({
            searchs: mbs
        })
    }

    render() {

        var ss1 = ''
        var ss2 = ''
        if (this.state.tab === 1) {
            ss1 = 'seltab'
        }
        if (this.state.tab === 2) {
            ss2 = 'seltab'
        }

        return <div className='channeleditwnd'>
            <div className='row'>
                <div className='two columns' style={{ "marginLeft": "0px" }}>
                    <button className="miniclosebutton" onClick={this.props.closeMember}>
                        <TiArrowLeft />
                    </button>
                </div>
                <div className='six columns'>
                    <p>Manage members</p>
                </div>
            </div>
            <div className='row'>
                <div className='six columns'>
                    <div className={`channeltab ${ss1}`} onClick={() => {
                        this.refreshMember(); this.setState({ tab: 1 });
                    }}>Members</div>
                </div>
                <div className='six columns'>
                    <div className={`channeltab ${ss2}`} onClick={() => {
                        this.setState({ tab: 2, searchs: [] });
                    }}>Suggested</div>
                </div>
            </div>
            <div>
                {
                    this.state.tab === 1 ?
                        <div style={{ "textAlign": "center" }}>
                            <ChannelMemberList
                                channelID={this.props.channelID}
                                mbs={this.state.mbs}
                                identityObj={this.props.identityObj}
                                refreshMainCourse={this.props.refreshMainCourse}
                                refreshMemberPage={this.refreshMemberPage.bind(this)}
                            />
                        </div>
                        :
                        <div>
                            <div>
                                <div className='cellblock'><input type='text' ref={x => this.searchtxt = x}></input></div>
                                <div className='cellblock'><button onClick={this.search.bind(this)}>Search</button></div>
                            </div>

                            <ChannelMemberList
                                channelID={this.props.channelID}
                                mbs={this.state.searchs}
                                identityObj={this.props.identityObj}
                                refreshMainCourse={this.props.refreshMainCourse}
                                refreshMemberPage={this.refreshMemberPage.bind(this)}
                            />
                        </div>
                }
            </div>
        </div>
    }
}
