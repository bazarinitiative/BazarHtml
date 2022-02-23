import React, { Component } from 'react';
import { SearchResult } from '../../api/impl/publicsearch';
import { Identity } from '../../facade/entity';
import '@material/list'
import { goURL } from '../../utils/bazar-utils';


type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any,
    wd: string
}

type StateType = {
    val: string,
    sresult: SearchResult | null,
    index: any
}

export class SearchCom extends Component<PropsType, StateType> {
    input: any;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            val: "",
            sresult: null,
            index: -1
        }
    }

    async refreshPage() {
        this.input.value = this.props.wd
        this.setState({
            val: '',
            sresult: null
        })
        await this.handleChange()
    }

    async focus() {
        this.input.focus();
    }

    inputval() {
        return this.input.value
    }

    async handleChange() {
        this.setState({
            val: this.input.value
        });
        if (!this.input.value) {
            return
        }
    }
    handleKeyDown(e: any) {
        if (e.keyCode === 13) {
            goURL('/search?wd=' + this.state.val, this.props.refreshMainCourse);
        }
    }
    async componentDidMount() {
        await this.refreshPage()
    }
    handleMouseEnter(key: any, item: any, event: any) {
    }
    handleClickItem() {
        goURL('/search?wd=' + this.state.val, this.props.refreshMainCourse);
        this.input.focus();
    }
    render() {
        return (
            <div style={{ height: "50px", margin: "0px", padding: "0px" }}>
                <input type="text"
                    ref={x => this.input = x}
                    defaultValue={this.state.val}
                    onChange={this.handleChange.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                    placeholder='Search Bazar'
                    style={{ "padding": "0px 6px", width: "98%" }}
                />
            </div>
        )
    }
}
