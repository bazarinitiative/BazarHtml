
export interface Identity {
    userID: string;
    /**
     * base64 encoded public key
     */
    publicKey: string;
    /**
     * base64 encoded private key
     */
    privateKey: string;
}

export interface UserInfoCmd {
    userID: string;
    userName: string;
    biography: string;
    website: string;
    location: string;
    publicKey: string;
}

export interface UserInfo {
    userID: string;
    userName: string;
    biography: string;
    website: string;
    location: string;
    publicKey: string;
    createTime: number;
}

export interface UserStatistic {
    userID: string;
    postCount: number;
    likedCount: number;
    followingCount: number;
    followedCount: number;
}

export interface UserDto {
    userID: string;
    userInfo: UserInfo;
    userStatistic: UserStatistic;
    lastPicTime: Number;
}

export interface Post {
    postID: string;
    userID: string;
    commandID: string;
    commandTime: number;
    threadID: string;
    replyTo: string;
    isRepost: boolean;
    content: string;
    contentLang: string;
    foldingText: string;
    mediaType: string;
    mediaUrls: string;
    deleted: boolean;
}

export interface PostStatistic {
    postID: string;
    replyCount: number;
    repostCount: number;
    likeCount: number;
}

export interface PostDto {
    post: Post;
    ps: PostStatistic;
    liked: boolean;
    replyToUser: string;
}

