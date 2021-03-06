import { Component } from "react";
import "./sidebarLink.css";

type PropsType = {
    text: any,
    Icon: any,
    href: string,
    refreshMainCourse: any
}

type StateType = {
}

export class SidebarLink extends Component<PropsType, StateType> {

    go() {
        window.history.pushState('', '', this.props.href);
        setTimeout(() => {
            this.props.refreshMainCourse();
        }, 50)
    }

    render() {
        return (
            <div className="link" onClick={this.go.bind(this)} >
                {this.props.Icon}
                <h2>{this.props.text}</h2>
            </div>
        );
    }

}
export default SidebarLink;
