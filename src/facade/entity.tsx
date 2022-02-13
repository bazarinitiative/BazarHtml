
export interface Identity {
    userID: string,
    /**
     * base64 encoded public key
     */
    publicKey: string,
    /**
     * base64 encoded private key
     */
    privateKey: string
}

export interface UserInfo {
    userID: string,
    userName: string,
    biography: string,
    website: string,
    location: string,
    publicKey: string
}

