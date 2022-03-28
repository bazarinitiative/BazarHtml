import React, { Component } from 'react';
import { Identity } from '../../facade/entity';
import '@material/list'
import { getUrlParameter, goURL } from '../../utils/bazar-utils';

type PropsType = {
    identityObj: Identity | null,
    refreshMainCourse: any,
    wd: string,
}

type StateType = {
}

export class SearchCom extends Component<PropsType, StateType> {
    input: any;

    async setInput(wd: string) {
        this.input.value = wd
    }

    async focus() {
        this.input.focus();
    }

    getInput() {
        return this.input.value
    }

    onSearch(newcata: string) {
        var catalog = getUrlParameter('catalog');
        var cata = '';
        if (catalog.length > 0) {
            cata = `&catalog=${catalog}`;
        }
        if (newcata.length > 0) {
            cata = `&catalog=${newcata}`;
        }
        var url = '/search?wd=' + this.input.value + cata
        goURL(url, this.props.refreshMainCourse);
    }

    handleKeyDown(e: any) {
        if (e.keyCode === 13) {
            this.onSearch('');
        }
    }
    async componentDidMount() {
    }
    handleMouseEnter(key: any, item: any, event: any) {
    }
    render() {
        return (
            <div style={{ height: "50px", margin: "0px", padding: "0px" }}>
                <input type="text"
                    ref={x => this.input = x}
                    defaultValue={this.props.wd}
                    // onChange={this.handleChange.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                    placeholder='Search Bazar'
                    style={{ "padding": "0px 6px", width: "98%" }}
                />
            </div>
        )
    }
}
