import React, { Component } from 'react';
import '../../App.css';
import { Identity } from '../../facade/entity';
import { calculateUserID, verifyKeyPair } from '../../utils/encryption';
import { getExtendIdentity, saveExtendIdentity } from '../../utils/identity-storage';

type PropsType = {
    closeModal: any
}

type StateType = {
}

export class UserbarAddAccount extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    async saveAccount() {
        var publicKey = ((document.querySelector('#publicKey') as any).value as string).trim();
        var privateKey = ((document.querySelector('#privateKey') as any).value as string).trim();
        var userID = calculateUserID(publicKey);

        var ret = await verifyKeyPair(publicKey, privateKey);
        if (!ret.success) {
            alert('Fail to verify key pair, reason: ' + ret.msg)
            return;
        }

        let newid = {
            userID: userID,
            publicKey: publicKey,
            privateKey: privateKey
        } as Identity;

        var ay = getExtendIdentity();
        if (ay === null) {
            ay = []
        }
        var idx = ay.findIndex(x => x.userID === newid.userID);
        if (idx !== -1) {
            alert('user already exist')
            return
        }
        ay.push(newid)
        saveExtendIdentity(ay)
        alert('succeed add account')
        this.props.closeModal();
    }

    render() {

        return <div>
            <h4><p>Add an existing account</p></h4>
            <div>
                <div>
                    <textarea id='publicKey' placeholder='PublicKey' className='keytxt1'
                    ></textarea>
                </div>
                <div>
                    <textarea id='privateKey' placeholder='PrivateKey' className='keytxt2'
                    ></textarea>
                </div>
            </div>
            <div style={{ "textAlign": "center" }}>
                <button className="followbutton" onClick={this.saveAccount.bind(this)}>&nbsp;&nbsp;Add&nbsp;&nbsp;</button>
            </div>
        </div>
    }
}
