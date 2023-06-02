import { Component } from 'react';
import Modal from 'react-modal';
import { getUserDto, getUserImgUrl } from '../../facade/userfacade';
import { initialUser } from '../../initdata/users';
import { getIdentity } from '../../utils/identity-storage';
import { removeLocalUser } from '../../utils/user-storage';
import { sendUserInfo } from '../../api/impl/cmd/userinfo';
import { sendUserPic } from '../../api/impl/cmd/userpic';
import { logger } from '../../utils/logger';
import { compressImg } from '../../utils/image';
import { Identity, UserDto } from '../../facade/entity';
import { randomInt } from '../../utils/encryption'
import { getUserProfile } from '../../api/impl/userprofile';
import { HOST_CONCIG } from '../../bazar-config';
import '../../App.css'
import { ProfileCenter } from './ProfileCenter';
import { ProfileTab } from './ProfileTab';
import './Profile.css'

type PropsType = {
    identityObj: Identity,
    refreshMainCourse: any
}

type StateType = {
    userObj: UserDto | null,
    isShowModal: boolean,
    isShowModal2: boolean,
    picstrModal: string | null,
    profile: any,
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-40%',
        transform: 'translate(-50%, -50%)',
    },
};

const customStyles3 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
    },
};

/**
 * profile of user himself
 */
export class ProfileSelf extends Component<PropsType, StateType> {
    userNameCtl: any;
    bioCtl: any;
    websiteCtl: any;
    locationCtl: any;
    backupEmailCtl: HTMLInputElement | null | undefined;

    constructor(props: PropsType) {
        super(props);

        this.state = {
            userObj: null,
            isShowModal: false,
            isShowModal2: false,
            picstrModal: null,
            profile: null,
        }
    }

    componentDidMount() {
        this.setState({
        })
        this.refreshUser();
    }

    async refreshUser() {
        var identityObj = this.props.identityObj;

        var userObj = await getUserDto(identityObj.userID);
        if (userObj == null) {
            var user = initialUser;
            user.userID = identityObj.userID;
            user.userName = 'user' + randomInt(111111111, 999999999).toString();
            user.publicKey = identityObj.publicKey;
            var ret = await sendUserInfo(identityObj, user.userID, user.publicKey, user.userName, user.website, user.location, user.biography);
            if (!ret.success) {

            }

            userObj = await getUserDto(identityObj.userID);
        }

        var profile = (await getUserProfile(identityObj.userID)).data

        this.setState({
            userObj: userObj,
            profile: profile,
        });
    }

    showModal() {
        this.setState({
            isShowModal: true
        });
    }

    showModal2() {
        this.setState({
            isShowModal2: true
        });
    }

    async closeModalSave() {
        this.setState({
            isShowModal: false
        });

        var identityObj = getIdentity();
        if (identityObj == null) {
            return;
        }

        removeLocalUser(identityObj.userID);
        var userName = this.userNameCtl.value;
        var bio = this.bioCtl.value;
        var website = this.websiteCtl.value;
        var location = this.locationCtl.value;
        var ret = await sendUserInfo(identityObj, identityObj.userID, identityObj.publicKey, userName, website, location, bio);
        if (!ret.success) {
            logger('sendUserInfo', ret)
            alert(ret.msg);
            return;
        }

        if (this.state.picstrModal != null) {
            var ret2 = await sendUserPic(identityObj, this.state.picstrModal);
            if (!ret2.success) {
                logger('sendUserPic', ret2);
                alert(ret2.msg);
                return;
            }
        }

        this.refreshUser();

        logger('Profile', 'modal save ok')
    }

    closeModalCancel() {
        this.setState({
            isShowModal: false
        });

        this.refreshUser();
    }

    closeModalCancel2() {
        this.setState({
            isShowModal2: false
        });

        this.refreshUser();
    }

    isSafari() {
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("safari") > -1 && userAgent.indexOf("chrome") === -1) {
            return true;
        }
    }

    onSelectPic(e: any) {
        const img = new Image();
        const reader = new FileReader();
        var file = e.target.files[0] as File
        if (file.type.indexOf("tiff") >= 0 && !this.isSafari()) {
            alert('Tiff image is not supported. Please try another image.')
            return
        }
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            if (e.target?.result == null) {
                return;
            }
            var srcdata = e.target.result as string;
            console.info(srcdata)
            img.src = srcdata;

            //img may need a chance to render
            setTimeout(() => {
                if (img.width > img.height) {
                    img.width = img.height;
                } else {
                    img.height = img.width;
                }
                var dataUrl = compressImg(img, null, 100, 100)
                var picstr = (dataUrl as string).split(',')[1]
                if (picstr.length > 0) {
                    this.setState({ picstrModal: picstr });
                } else {
                    logger('onSelectPic', 'result empty');
                }
            }, 50);
        }
    }

    clickFollowees() {
        window.location.href = '/followees/' + this.props.identityObj.userID
    }

    clickFollowers() {
        window.location.href = '/followers/' + this.props.identityObj.userID
    }

    getPosts() {

    }

    render() {
        if (!this.state.profile || !this.state.userObj) {
            return <div>
                Loading user data...
            </div>
        }

        var identityObj = this.props.identityObj;
        var userInfo = this.state.userObj.userInfo
        var userDto = this.state.userObj;
        var picstr2 = this.state.picstrModal;

        var stat = this.state.profile.userStatistic;

        Modal.setAppElement("#root");

        var realnameurl = HOST_CONCIG.realname

        // var s1 = 'UserID: ' + identityObj.userID + '\n';
        // var s2 = 'PublicKey: ' + identityObj.publicKey + '\n';
        // var s3 = 'PrivateKey: ' + identityObj.privateKey + '\n';
        // var strpair = s1 + s2 + s3;
		var strpriv = identityObj.privateKey;

        return (
            <div className="profile-info">

                <Modal
                    /** edit profile modal */
                    isOpen={this.state.isShowModal}
                    style={customStyles}
                >
                    <div className='container'>
                        <div className='row'>
                            <div className='twelve columns'>
                                <div>
                                    <p>UserPic<br />
                                        <img src={'data:image/gif;base64,' + picstr2} alt='' />
                                        <input id='userPic' type='file' accept="image/*" onChange={this.onSelectPic.bind(this)} />
                                    </p>
                                    <p />
                                    <p />
                                    <p>UserName<input ref={(x) => this.userNameCtl = x} type='text' defaultValue={userInfo.userName} /></p>
                                    <p>Biography  <input ref={(x) => this.bioCtl = x} type='text' defaultValue={userInfo.biography} /></p>
                                    <p>Website<input ref={(x) => this.websiteCtl = x} type='text' defaultValue={userInfo.website} /></p>
                                    <p>Location<input ref={(x) => this.locationCtl = x} type='text' defaultValue={userInfo.location} /></p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='four columns'>
                                    <br />
                                </div>
                                <div className='four columns'>
                                    <button onClick={this.closeModalSave.bind(this)}>Save</button>
                                </div>
                                <div className='four columns'>
                                    <button onClick={this.closeModalCancel.bind(this)}>Cancal</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal
                    /** backup account modal */
                    isOpen={this.state.isShowModal2}
                    style={customStyles}
                >
                    <div className='container'>
                        <div>
                            <br />
                            <p className='lightsmall keypairhint'>
                                * Bazar blog system is built on public/private key algorithm, your private-key is your sole passport to this distributed system.
                            </p>
                            <br />
							<textarea style={{fontSize:"11px", width:"100%", height:"120px"}}>{strpriv}</textarea>
                            <br />
                        </div>
						<br/>
						<button onClick={this.closeModalCancel2.bind(this)}>Close</button>
                    </div>
                </Modal>

                <div className='content'>
                    <div>
                        <p>
                            <img className='profile-info-img' src={getUserImgUrl(userDto)} alt="" />
                            <button className='profilebutton' style={{ "width": "80px" }}
                                onClick={this.showModal.bind(this)}>Edit profile</button>

                            <button
                                onClick={this.showModal2.bind(this)}
                                className='profilebutton'
                                style={{ "marginLeft": "60px", "width": "110px" }}
                            >
                                Private Key
                            </button>
                        </p>
                    </div>

                    <ProfileCenter
                        userObj={userDto}
                        stat={stat}
                    />

                    <ProfileTab
                        identityObj={this.props.identityObj}
                        refreshMainCourse={this.props.refreshMainCourse}
                        userID={this.props.identityObj.userID}
                    />

                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>

            </div>
        );
    }
}


