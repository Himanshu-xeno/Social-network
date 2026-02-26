// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SocialNetwork {
    string public name;
    uint256 public postCount = 0;
    uint256 public commentCount = 0;
    uint256 public userCount = 0;

    struct Post {
        uint256 id;
        string content;
        string mediaHash;
        string mediaType;
        uint256 tipAmount;
        uint256 likeCount;
        uint256 commentCount;
        address payable author;
        uint256 timestamp;
        bool exists;
    }

    struct Comment {
        uint256 id;
        uint256 postId;
        string content;
        address author;
        uint256 timestamp;
    }

    struct UserProfile {
        address userAddress;
        string username;
        string bio;
        string avatarHash;
        uint256 postCount;
        uint256 totalTipsReceived;
        uint256 joinedAt;
        bool exists;
    }

    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment) public comments;
    mapping(address => UserProfile) public profiles;
    mapping(uint256 => mapping(address => bool)) public postLikes;
    mapping(uint256 => uint256[]) public postCommentIds;
    mapping(string => bool) private usernameTaken;
    
    address[] public allUsers;

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

    event ProfileCreated(
        address userAddress,
        string username,
        string bio,
        string avatarHash,
        uint256 joinedAt
    );

    event ProfileUpdated(
        address userAddress,
        string username,
        string bio,
        string avatarHash
    );

    constructor() {
        name = "DChain Social Network";
    }

    // ========== PROFILE FUNCTIONS ==========

    function createProfile(
        string memory _username,
        string memory _bio,
        string memory _avatarHash
    ) public {
        require(!profiles[msg.sender].exists, "Profile already exists");
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_username).length <= 30, "Username too long");
        require(!usernameTaken[_toLower(_username)], "Username already taken");

        userCount++;

        profiles[msg.sender] = UserProfile(
            msg.sender,
            _username,
            _bio,
            _avatarHash,
            0,
            0,
            block.timestamp,
            true
        );

        usernameTaken[_toLower(_username)] = true;
        allUsers.push(msg.sender);

        emit ProfileCreated(
            msg.sender,
            _username,
            _bio,
            _avatarHash,
            block.timestamp
        );
    }

    function updateProfile(
        string memory _username,
        string memory _bio,
        string memory _avatarHash
    ) public {
        require(profiles[msg.sender].exists, "Profile does not exist");
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_username).length <= 30, "Username too long");

        string memory oldUsername = profiles[msg.sender].username;
        
        if (keccak256(bytes(_toLower(_username))) != keccak256(bytes(_toLower(oldUsername)))) {
            require(!usernameTaken[_toLower(_username)], "Username already taken");
            usernameTaken[_toLower(oldUsername)] = false;
            usernameTaken[_toLower(_username)] = true;
        }

        profiles[msg.sender].username = _username;
        profiles[msg.sender].bio = _bio;
        profiles[msg.sender].avatarHash = _avatarHash;

        emit ProfileUpdated(msg.sender, _username, _bio, _avatarHash);
    }

    // ========== POST FUNCTIONS ==========

    function createPost(
        string memory _content,
        string memory _mediaHash,
        string memory _mediaType
    ) public {
        require(profiles[msg.sender].exists, "Must create profile first");
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
            block.timestamp,
            true
        );

        profiles[msg.sender].postCount++;

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
        require(posts[_id].exists, "Post does not exist");
        require(msg.value > 0, "Tip must be greater than 0");
        require(msg.sender != posts[_id].author, "Cannot tip your own post");

        Post storage _post = posts[_id];
        address payable _author = _post.author;

        (bool success, ) = _author.call{value: msg.value}("");
        require(success, "Transfer failed");

        _post.tipAmount = _post.tipAmount + msg.value;
        profiles[_author].totalTipsReceived += msg.value;

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
        require(posts[_id].exists, "Post does not exist");
        require(!postLikes[_id][msg.sender], "Already liked");

        posts[_id].likeCount++;
        postLikes[_id][msg.sender] = true;

        emit PostLiked(_id, posts[_id].likeCount, msg.sender);
    }

    function unlikePost(uint256 _id) public {
        require(_id > 0 && _id <= postCount, "Post does not exist");
        require(posts[_id].exists, "Post does not exist");
        require(postLikes[_id][msg.sender], "Not liked");

        posts[_id].likeCount--;
        postLikes[_id][msg.sender] = false;

        emit PostUnliked(_id, posts[_id].likeCount, msg.sender);
    }

    function addComment(uint256 _postId, string memory _content) public {
        require(_postId > 0 && _postId <= postCount, "Post does not exist");
        require(posts[_postId].exists, "Post does not exist");
        require(bytes(_content).length > 0, "Comment cannot be empty");
        require(profiles[msg.sender].exists, "Must create profile first");

        commentCount++;

        comments[commentCount] = Comment(
            commentCount,
            _postId,
            _content,
            msg.sender,
            block.timestamp
        );

        posts[_postId].commentCount++;
        postCommentIds[_postId].push(commentCount);

        emit CommentCreated(
            commentCount,
            _postId,
            _content,
            msg.sender,
            block.timestamp
        );
    }

    // ========== VIEW FUNCTIONS ==========

    function getPostComments(uint256 _postId) public view returns (uint256[] memory) {
        return postCommentIds[_postId];
    }

    function hasLiked(uint256 _postId, address _user) public view returns (bool) {
        return postLikes[_postId][_user];
    }

    function getProfile(address _user) public view returns (
        string memory username,
        string memory bio,
        string memory avatarHash,
        uint256 userPostCount,
        uint256 totalTipsReceived,
        uint256 joinedAt,
        bool exists
    ) {
        UserProfile memory p = profiles[_user];
        return (p.username, p.bio, p.avatarHash, p.postCount, p.totalTipsReceived, p.joinedAt, p.exists);
    }

    function isUsernameAvailable(string memory _username) public view returns (bool) {
        return !usernameTaken[_toLower(_username)];
    }

    function getUserCount() public view returns (uint256) {
        return userCount;
    }

    function getAllUsers() public view returns (address[] memory) {
        return allUsers;
    }

    // ========== HELPER FUNCTIONS ==========

    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint256 i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }
}