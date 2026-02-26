// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SocialNetwork {
    string public name;
    uint256 public postCount = 0;
    uint256 public commentCount = 0;

    struct Post {
        uint256 id;
        string content;
        string mediaHash;      // IPFS hash for media
        string mediaType;      // "text", "image", "video", "audio"
        uint256 tipAmount;
        uint256 likeCount;
        uint256 commentCount;
        address payable author;
        uint256 timestamp;
    }

    struct Comment {
        uint256 id;
        uint256 postId;
        string content;
        address author;
        uint256 timestamp;
    }

    struct UserProfile {
        string username;
        string avatarHash;     // IPFS hash for avatar
        bool exists;
    }

    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment) public comments;
    mapping(address => UserProfile) public profiles;
    mapping(uint256 => mapping(address => bool)) public postLikes;

    // Mapping to get comments by post
    mapping(uint256 => uint256[]) public postComments;

    event PostCreated(
        uint256 id,
        string content,
        string mediaHash,
        string mediaType,
        uint256 tipAmount,
        uint256 likeCount,
        address payable author,
        uint256 timestamp
    );

    event PostTipped(
        uint256 id,
        string content,
        string mediaHash,
        string mediaType,
        uint256 tipAmount,
        uint256 likeCount,
        address payable author,
        uint256 timestamp
    );

    event PostLiked(
        uint256 id,
        uint256 likeCount,
        address liker
    );

    event PostUnliked(
        uint256 id,
        uint256 likeCount,
        address unliker
    );

    event CommentCreated(
        uint256 id,
        uint256 postId,
        string content,
        address author,
        uint256 timestamp
    );

    event ProfileUpdated(
        address user,
        string username,
        string avatarHash
    );

    constructor() {
        name = "DChain Social Network";
    }

    function createPost(
        string memory _content,
        string memory _mediaHash,
        string memory _mediaType
    ) public {
        // At least content or media must exist
        require(
            bytes(_content).length > 0 || bytes(_mediaHash).length > 0,
            "Post must have content or media"
        );

        postCount++;

        posts[postCount] = Post(
            postCount,
            _content,
            _mediaHash,
            _mediaType,
            0,
            0,
            0,
            payable(msg.sender),
            block.timestamp
        );

        emit PostCreated(
            postCount,
            _content,
            _mediaHash,
            _mediaType,
            0,
            0,
            payable(msg.sender),
            block.timestamp
        );
    }

    function tipPost(uint256 _id) public payable {
        require(_id > 0 && _id <= postCount, "Post does not exist");
        require(msg.value > 0, "Tip must be greater than 0");

        Post storage _post = posts[_id];
        address payable _author = _post.author;

        // Transfer tip to author
        (bool success, ) = _author.call{value: msg.value}("");
        require(success, "Transfer failed");

        _post.tipAmount = _post.tipAmount + msg.value;

        emit PostTipped(
            _post.id,
            _post.content,
            _post.mediaHash,
            _post.mediaType,
            _post.tipAmount,
            _post.likeCount,
            _post.author,
            _post.timestamp
        );
    }

    function likePost(uint256 _id) public {
        require(_id > 0 && _id <= postCount, "Post does not exist");
        require(!postLikes[_id][msg.sender], "Already liked this post");

        posts[_id].likeCount++;
        postLikes[_id][msg.sender] = true;

        emit PostLiked(_id, posts[_id].likeCount, msg.sender);
    }

    function unlikePost(uint256 _id) public {
        require(_id > 0 && _id <= postCount, "Post does not exist");
        require(postLikes[_id][msg.sender], "You have not liked this post");

        posts[_id].likeCount--;
        postLikes[_id][msg.sender] = false;

        emit PostUnliked(_id, posts[_id].likeCount, msg.sender);
    }

    function addComment(uint256 _postId, string memory _content) public {
        require(_postId > 0 && _postId <= postCount, "Post does not exist");
        require(bytes(_content).length > 0, "Comment cannot be empty");

        commentCount++;

        comments[commentCount] = Comment(
            commentCount,
            _postId,
            _content,
            msg.sender,
            block.timestamp
        );

        posts[_postId].commentCount++;
        postComments[_postId].push(commentCount);

        emit CommentCreated(
            commentCount,
            _postId,
            _content,
            msg.sender,
            block.timestamp
        );
    }

    function updateProfile(
        string memory _username,
        string memory _avatarHash
    ) public {
        require(bytes(_username).length > 0, "Username cannot be empty");

        profiles[msg.sender] = UserProfile(_username, _avatarHash, true);

        emit ProfileUpdated(msg.sender, _username, _avatarHash);
    }

    function getPostComments(uint256 _postId)
        public
        view
        returns (uint256[] memory)
    {
        return postComments[_postId];
    }

    function hasLiked(uint256 _postId, address _user)
        public
        view
        returns (bool)
    {
        return postLikes[_postId][_user];
    }

    function getProfile(address _user)
        public
        view
        returns (string memory, string memory, bool)
    {
        UserProfile memory profile = profiles[_user];
        return (profile.username, profile.avatarHash, profile.exists);
    }
}