
const api_router_config = {
    command: '/UserCommand/Command',
    publictimeline: '/UserQuery/PublicTimeline',
    homeline: '/UserQuery/HomeLine',
    backupaccount: '/Email/BackupAccount',
    sendCode: '/Email/SendCode',
    userinfo: '/UserQuery/GetUserInfo',
    userpic: '/UserQuery/GetUserPic',
    postdetail: '/UserQuery/GetPostDetail',
    getpostsimple: '/UserQuery/GetPostSimple',
    userprofile: '/UserQuery/GetProfile',
    userposts: '/UserQuery/GetPosts',
    getfollowing: '/UserQuery/GetFollowing',
    getfollowers: '/UserQuery/GetFollowers',
    getfollowees: '/UserQuery/GetFollowees',
    getnotifications: '/UserQuery/GetNotifies',
    mightLike: '/Bubble/MightLike',
    trending: '/Bubble/Trending',
    search: '/Bubble/Search',
    publicsearch: '/Bubble/PublicSearch'
}

export const API_ROUTER_CONFIG = api_router_config
export const DEBUG = false
