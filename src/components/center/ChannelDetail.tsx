import React, { Component } from 'react';
import { getChannel } from '../../api/impl/getchannel';
import { getChannelPosts } from '../../api/impl/getchannelposts';
import { ChannelDto } from '../../api/impl/getchannels';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { PostList } from './PostList';
import './Channel.css';
import Modal from 'react-modal';
import { ChannelEdit } from './ChannelEdit';

type PropsType = {
    identityObj: Identity | null
    refreshMainCourse: any
    channelID: string
}

type StateType = {
    channelDto: ChannelDto | null
    openModal: boolean
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export class ChannelDetail extends Component<PropsType, StateType> {
    PostList: PostList | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            channelDto: null,
            openModal: false,
        };
    }

    async componentDidMount() {
        await this.refreshPage();
    }

    async refreshPage() {
        var ret = await getChannel(this.props.channelID);
        var dto = ret.data as ChannelDto
        this.setState({
            channelDto: dto
        })

        if (this.PostList) {
            await this.PostList.refreshPage();
        }
    }

    async fetchData(channelID: string, page: number, size: number) {
        var userID = this.props.identityObj?.userID;
        var ret = await getChannelPosts(channelID, page, size, userID ?? "");
        return ret;
    }

    clickEdit() {
        this.setState({
            openModal: true
        })
    }

    closeModal() {
        this.setState({
            openModal: false
        })
        this.refreshPage();
    }

    render() {

        if (this.state.channelDto == null) {
            return <div>loading for {this.props.channelID}</div>
        }
        var dto = this.state.channelDto;
        var channel = dto.channel;

        return <div style={{ "borderLeft": "1px solid #e6e7e7", "borderRight": "1px solid #e6e7e7" }}>
            <div style={{ "borderBottom": "1px solid #e6e7e7", "padding": "15px 20px" }}>
                <div style={{ "textAlign": "left" }}>
                    ID: {channel.channelID}<br />
                    Name: {channel.channelName} <br />
                    Description: {channel.description}<br />
                    <br />
                    <div style={{ "textAlign": "center" }}>
                        <button className='editlistbutton' onClick={this.clickEdit.bind(this)} >Edit List</button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={this.state.openModal}
                style={customStyles}
                shouldCloseOnEsc={true}
                shouldCloseOnOverlayClick={true}
                onRequestClose={this.closeModal.bind(this)}
            >
                <ChannelEdit
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.props.refreshMainCourse}
                    closeModal={this.closeModal.bind(this)}
                    channelDto={dto}
                />
            </Modal>

            <div style={{ "marginTop": "10px" }}>
                <PostList
                    identityObj={this.props.identityObj}
                    refreshMainCourse={this.props.refreshMainCourse}
                    getPostData={this.fetchData.bind(this)}
                    resourceID={this.state.channelDto.channel.channelID}
                    ref={x => this.PostList = x}
                />
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />

        </div>
    }
}
