import React, { Component } from 'react';
import '../App.css';
import { Greeting } from './left/Greeting'
import { getIdentity } from '../utils/identity-storage';
import { logger } from '../utils/logger';
import { MainCourse } from './center/MainCourse';
import { Recommend } from './right/Recommend';
import { getUserDto } from '../facade/userfacade';
import { UserDto } from '../facade/entity';
import { handleLogout } from '../utils/bazar-utils';
import { HOST_CONCIG } from '../bazar-config';
import { BottomLine } from './BottomLine';

type PropsType = {
}

type StateType = {
  owner: UserDto | null
}

class App extends Component<PropsType, StateType> {
  PostList: any;
  MainCourse: MainCourse | null | undefined;
  Recommend: Recommend | null | undefined;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      owner: null,
    }
  }

  async componentDidMount() {
    logger('App', 'host=' + window.location.host)
    if (window.location.host.startsWith('www.')) {
      var newhost = window.location.host.substring(4);
      var url = window.location.href.replace(window.location.host, newhost);
      window.location.href = url
      return
    }

    logger('App', "protocol=[" + window.location.protocol + "]");
    if (window.location.protocol === "http:" && !window.location.host.startsWith('localhost')) {
      var url2 = window.location.href.replace('http://', 'https://');
      window.location.href = url2
    }

    window.onpopstate = () => {
      logger('app', 'onpopstate')
      this.refreshMainCourse()
    }

    var identityObj = getIdentity();
    var userID = '';
    if (identityObj) {
      userID = identityObj.userID;

      var user = await getUserDto(userID);

      this.setState({
        owner: user,
      })
    }
  }

  logout() {
    var out = window.confirm("Sure to logout?")
    if (out) {
      handleLogout();
    }
  }

  onClearCache() {
    for (let index = 0; index < localStorage.length; index++) {
      var key = localStorage.key(index)
      if (key == null || key === 'identity' || key === 'extendidentity') {
        continue;
      }
      localStorage.removeItem(key);
      logger('clearCache', key)
      index = -1;
    }
  }

  refreshMainCourse() {
    this.MainCourse?.refreshMainCourse();
    this.Recommend?.refreshPage();
  }

  render() {
    try {
      var identityObj = getIdentity();

      logger('app_apihost', HOST_CONCIG.apihost);

      var localdev = null;
      if (window.location.hostname === 'localhost') {
        localdev = <button onClick={this.onClearCache.bind(this)}>clear cache</button>;
      }

      var mobile = (window.screen.width < 1000);
      var top, left, right, bottom;

      if (mobile) {
        bottom = <BottomLine
          refreshMainCourse={this.refreshMainCourse.bind(this)}
        />
      }

      if (!mobile) {

        top = <header>
        </header>;

        left = <div className="three columns">
          <div style={{ "position": "fixed", "width": "240px" }}>
            <Greeting
              identityObj={identityObj}
              refreshMainCourse={this.refreshMainCourse.bind(this)}
            />
            <br />
            {localdev}
          </div>
          <br />
        </div>;

        right = <div className='three columns'>
          <div className='content'>
            <Recommend ref={x => this.Recommend = x}
              identityObj={identityObj}
              refreshMainCourse={this.refreshMainCourse.bind(this)}
            />
          </div>
          <div className="row container">
            <div className="eleven columns">
              <p className="footer">
                Official site:
                <a href="https://bazarinitiative.org/" target="_blank" rel="noreferrer">bazarinitiative.org</a> <br />
                Github:
                <a href="https://github.com/bazarinitiative" target="_blank" rel="noreferrer">github.com/bazarinitiative</a></p>
            </div>
          </div>
        </div>;

        if (!identityObj) {
          left = <div className='seven columns'>
            <img className='loginimg' src='/img/scene3.jpg' alt="" />
          </div>
          right = ''
        }
      }

      var padside = mobile ? "0" : "null";
      var middles = mobile ? "null" : "five columns"

      return (
        <div className="App">
          {top}
          <div className="container" style={{ paddingLeft: padside, paddingRight: padside }}>
            <div className="row">
              {left}
              <div id='middleBlock' className={middles}>
                <div className="content" style={{ "marginLeft": "2px" }}>
                  <MainCourse ref={x => this.MainCourse = x}
                    identityObj={identityObj}
                    ownerDto={this.state.owner}
                  />
                </div>
              </div>
              {right}
            </div>
          </div>
          {bottom}
        </div>
      );
    } catch (error) {
      logger('app', error);
    }

  }

}

export default App;
