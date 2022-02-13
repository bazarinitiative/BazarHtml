const initialPosts = {

    post1: {
        blogPost: "aa",
        date: "date",
        image: "img/girl-1.png",
        author: "Kate"
    },

    post2: {
        blogPost: "aa",
        date: "date",
        image: "img/boy.png",
        author: 'Mike'
    },


}

const defaultPostM = {
    "post": {
        "postID": "111",
        "userID": "222",
        "commandID": "333",
        "commandTime": 0,
        "threadID": "111",
        "replyTo": "",
        "isRepost": false,
        "content": "",
        "contentLang": "en-US",
        "foldingText": "",
        "mediaType": "",
        "mediaUrls": "",
        "deleted": false
    },
    "ps": {
        "postID": "111",
        "replyCount": 0,
        "repostCount": 0,
        "likeCount": 0
    },
    "liked": false
}

export { initialPosts };
export { defaultPostM };