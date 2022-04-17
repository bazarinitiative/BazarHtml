import { Menu, MenuItem } from '@material-ui/core';
import React, { Component } from 'react';
import { AiOutlineSetting } from 'react-icons/ai';
import { getPublicTimeline } from '../../api/impl/timeline';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { getFilterLang, saveFilterLang } from '../../utils/user-storage';
import { PostList } from './PostList';

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any,
}

type StateType = {
    filterLang: string
    onMenu: boolean
    anckerEl: any
}

export class PublicTimeline extends Component<PropsType, StateType> {

    PostList: PostList | null | undefined;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            filterLang: getFilterLang(),
            onMenu: false,
            anckerEl: null
        };
    }

    async componentDidMount() {
    }

    refreshPage() {
        if (this.PostList) {
            this.PostList.refreshPage();
        }
    }

    async getData(userID: string, page: number, pageSize: number) {
        var ret = await getPublicTimeline(userID, page, pageSize, this.state.filterLang)
        return ret;
    }

    onMenu(event: any) {
        this.setState({
            onMenu: true,
            anckerEl: event.currentTarget,
        })
    }

    closeMenu() {
        this.setState({
            onMenu: false
        })
        window.location.reload();
    }

    useLang(lang: string) {
        saveFilterLang(lang)
        this.closeMenu();
    }

    render() {

        var lang = getFilterLang();

        return <div>
            <div>
                <h4><div style={{ "textAlign": "left" }}>
                    <span style={{ "display": "inline-block", "width": "90%" }}>Timeline</span>
                    <span style={{ "display": "inline-block", "verticalAlign": "middle", "lineHeight": "32px", "fontSize": "19px" }}
                        onClick={this.onMenu.bind(this)}> <AiOutlineSetting />
                        <span style={{ "fontSize": "13px", "fontWeight": "300", "verticalAlign": "middle", "lineHeight": "16px" }}>{lang}</span>
                    </span>
                </div></h4>
            </div>

            <Menu
                open={this.state.onMenu}
                anchorEl={this.state.anckerEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                onClose={this.closeMenu.bind(this)}
            >
                <MenuItem>
                    <div onClick={() => { this.useLang('') }}>
                        All languages
                    </div>
                </MenuItem>
                <MenuItem>
                    <div onClick={() => { this.useLang('en') }}>
                        English (en)
                    </div>
                </MenuItem>
                <MenuItem>
                    <div onClick={() => { this.useLang('fr') }}>
                        French (fr)
                    </div>
                </MenuItem>
                <MenuItem>
                    <div onClick={() => { this.useLang('es') }}>
                        Spanish (es)
                    </div>
                </MenuItem>
                <MenuItem>
                    <div onClick={() => { this.useLang('de') }}>
                        German (de)
                    </div>
                </MenuItem>
                <MenuItem>
                    <div onClick={() => { this.useLang('ja') }}>
                        Japanese (ja)
                    </div>
                </MenuItem>
                <MenuItem>
                    <div onClick={() => { this.useLang('ko') }}>
                        Korean (ko)
                    </div>
                </MenuItem>
                <MenuItem>
                    <div onClick={() => { this.useLang('zh') }}>
                        Chinese (zh)
                    </div>
                </MenuItem>
            </Menu>

            <PostList
                identityObj={this.props.identityObj}
                refreshMainCourse={this.props.refreshMainCourse}
                getPostData={this.getData.bind(this)}
                resourceID={this.props.identityObj?.userID ?? ""}
                ref={node => this.PostList = node}
            />
            <br />
        </div>
    }
}
