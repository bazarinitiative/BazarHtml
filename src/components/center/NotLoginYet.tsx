import { Component } from "react";
import { sendUserInfo } from "../../api/impl/cmd/userinfo";
import { sendUserPic } from "../../api/impl/cmd/userpic";
import { Identity } from "../../facade/entity";
import { initialUser, initialUserPic } from "../../initdata/users";
import Divider from "../../utils/divider";
import { calculateUserID, genKeyPair, randomInt, restorePublicFromPrivate, verifyKeyPair } from "../../utils/encryption";
import { saveIdentity, clearIdentity } from "../../utils/identity-storage";
import { logger } from "../../utils/logger";

type PropsType = {
}

type StateType = {
	time: number,
	btnDisable: boolean,
	btnContent: string,
	curcode: string
}

export class NotLoginYet extends Component<PropsType, StateType> {

	constructor(props: PropsType) {
		super(props);

		this.state = {
			time: 60,
			btnDisable: false,
			btnContent: 'Send Code',
			curcode: '_notexists_'
		};
	}

	onCode(e: any) {
		var code = (document.querySelector('#code') as any).value;
		logger(code, this.state.curcode);
		if (code === this.state.curcode) {
			this.onNewAccount();
		}
		else {
			alert("code not match")
		}
	}

	async onNewAccount() {

		var pair = await genKeyPair();

		var userID = calculateUserID(pair.publicKey);
		let identityObj = {
			userID: userID,
			publicKey: pair.publicKey,
			privateKey: pair.privateKey
		} as Identity;
		saveIdentity(identityObj);

		var user = initialUser;
		user.userID = identityObj.userID;
		user.userName = 'user' + randomInt(111111111, 999999999).toString();
		user.publicKey = identityObj.publicKey;
		var ret2 = await sendUserInfo(identityObj, user.userID, user.publicKey, user.userName, user.website, user.location, user.biography);
		if (!ret2.success) {
			alert(ret2.msg)
			clearIdentity()
		}

		var userpic = initialUserPic
		var tt = await sendUserPic(identityObj, userpic)
		if (!tt.success) {
			alert(tt.msg)
			clearIdentity()
		}

		window.location.reload();
	}

	async onLogin() {

		try {
			// var publicKey = ((document.querySelector('#publicKey') as any).value as string).trim();
			var privateKey = ((document.querySelector('#privateKey') as any).value as string).trim();

			var publicKey = await restorePublicFromPrivate(privateKey);

			var userID = calculateUserID(publicKey);

			var ret = await verifyKeyPair(publicKey, privateKey);
			if (!ret.success) {
				alert('Fail to verify key pair, reason: ' + ret.msg)
				return;
			}

			let identityObj = {
				userID: userID,
				publicKey: publicKey,
				privateKey: privateKey
			} as Identity;
			saveIdentity(identityObj);

			window.location.reload();

		} catch (error) {
			logger('', error);
		}
	}

	async autoregister() {
		var sure = window.confirm('This will create a new account for you.\nYou will need to backup your private key manually.\nSure to contine?')
		if (!sure) {
			return
		}
		var pair = await genKeyPair();
		var userID = calculateUserID(pair.publicKey);
		let identityObj = {
			userID: userID,
			publicKey: pair.publicKey,
			privateKey: pair.privateKey
		} as Identity;
		saveIdentity(identityObj);

		var user = initialUser;
		user.userID = identityObj.userID;
		user.userName = 'user' + randomInt(111111111, 999999999).toString();
		user.publicKey = identityObj.publicKey;
		var ret = await sendUserInfo(identityObj, user.userID, user.publicKey, user.userName, user.website, user.location, user.biography);
		if (!ret.success) {
			alert(ret.msg)
			clearIdentity()
		}

		var userpic = initialUserPic
		var tt = await sendUserPic(identityObj, userpic)
		if (!tt.success) {
			alert(tt.msg)
			clearIdentity()
		}

		window.location.reload();
	}

	render() {
		return (
			<div className="">
				<br />
				<Divider text='Login' />
				<br />
				<div id='restore'>
					<div>
						<label style={{ textAlign: 'left', paddingLeft: '20px' }}>Your Private Key:</label>
						<textarea id='privateKey' className='lightsmall' style={{ marginBottom: '10px' }} />
						<button className="oneclickbutton" onClick={this.onLogin.bind(this)}>
							Login
						</button>
					</div>
					<br />
				</div>

				<br />
				<Divider text='Or' />
				<br />
				<div>
					<button className="oneclickbutton" onClick={this.autoregister.bind(this)}>
						Register
					</button>
				</div>
				<br />

				<br />
			</div>
		);
	}
}


