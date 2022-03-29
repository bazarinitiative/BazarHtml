import React, { Component } from 'react';
import '../App.css';
import { Greeting } from './left/Greeting'
import { getIdentity } from '../utils/identity-storage';
import { logger } from '../utils/logger';
import { MainCourse } from './center/MainCourse';
import { Recommend } from './right/Recommend';
import { getUserInfo } from '../facade/userfacade';
import { UserInfo } from '../facade/entity';
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from '@material-ui/icons/Explore';
import PublicIcon from '@material-ui/icons/Public';
import { Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { goURL, handleLogout } from '../utils/bazar-utils';
import { HOST_CONCIG } from '../bazar-config';

type PropsType = {
}

type StateType = {
  user: UserInfo | null
}

class App extends Component<PropsType, StateType> {
  PostList: any;
  MainCourse: MainCourse | null | undefined;
  Recommend: Recommend | null | undefined;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      user: null,
    }
  }

  async componentDidMount() {
    logger('App', window.location.host)
    if (window.location.host.startsWith('www.')) {
      var newhost = window.location.host.substring(4);
      var url = window.location.href.replace(window.location.host, newhost);
      window.location.href = url
      return
    }

    window.onpopstate = () => {
      logger('app', 'onpopstate')
      this.refreshMainCourse()
    }

    var identityObj = getIdentity();
    var userID = '';
    if (identityObj) {
      userID = identityObj.userID;

      var user = await getUserInfo(userID);

      this.setState({
        user: user,
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
      if (key == null || key === 'identity') {
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
        var vb = "0,0,24,24"
        bottom = <div className='bottomline'>
          <div className='myline'>
            {/* <hr /> */}
            <div className=''>
              <div className='mycell'>
                <HomeIcon viewBox={vb} className='lineicon' />
                <Button onClick={() => goURL('/', this.refreshMainCourse.bind(this))}>Home</Button>
              </div>
              <div className='mycell'>
                <PublicIcon viewBox={vb} className='lineicon' />
                <Button onClick={() => goURL('/timeline', this.refreshMainCourse.bind(this))}>Public</Button>
              </div>
              <div className='mycell'>
                <ExploreIcon viewBox={vb} className='lineicon' />
                <Button onClick={() => goURL('/explore/', this.refreshMainCourse.bind(this))}>Explore</Button>
              </div>
              <div className='mycell'>
                <SearchIcon viewBox={vb} className='lineicon' />
                <Button onClick={() => goURL('/search/', this.refreshMainCourse.bind(this))}>Search</Button>
              </div>
            </div>
          </div>

        </div>;
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
                <a href="https://bazarinitiative.org/">bazarinitiative.org</a> <br />
                Github:
                <a href="https://github.com/bazarinitiative">github.com/bazarinitiative</a></p>
            </div>
          </div>
        </div>;

        if (!identityObj) {
          left = <div className='seven columns'>
            {/* <img className='profile-info-img' src={logo} alt="" /> */}
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
