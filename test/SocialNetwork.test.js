const SocialNetwork = artifacts.require('./SocialNetwork.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('SocialNetwork', ([deployer, author, tipper, commenter]) => {
  let socialNetwork;

  before(async () => {
    socialNetwork = await SocialNetwork.deployed();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await socialNetwork.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a name', async () => {
      const name = await socialNetwork.name();
      assert.equal(name, 'DChain Social Network');
    });
  });

  describe('posts', async () => {
    let result, postCount;

    before(async () => {
      result = await socialNetwork.createPost('This is my first post', '', 'text', { from: author });
      postCount = await socialNetwork.postCount();
    });

    it('creates text posts', async () => {
      assert.equal(postCount.toString(), '1');
      const event = result.logs[0].args;
      assert.equal(event.id.toString(), postCount.toString(), 'id is correct');
      assert.equal(event.content, 'This is my first post', 'content is correct');
      assert.equal(event.mediaHash, '', 'media hash is correct');
      assert.equal(event.mediaType, 'text', 'media type is correct');
      assert.equal(event.tipAmount.toString(), '0', 'tip amount is correct');
      assert.equal(event.author, author, 'author is correct');

      // FAILURE: Post must have content or media
      await socialNetwork.createPost('', '', 'text', { from: author }).should.be.rejected;
    });

    it('creates media posts', async () => {
      result = await socialNetwork.createPost('Check this out!', 'QmTestHash123', 'image', { from: author });
      postCount = await socialNetwork.postCount();
      assert.equal(postCount.toString(), '2');

      const event = result.logs[0].args;
      assert.equal(event.mediaHash, 'QmTestHash123', 'media hash is correct');
      assert.equal(event.mediaType, 'image', 'media type is correct');
    });

    it('allows media-only posts', async () => {
      result = await socialNetwork.createPost('', 'QmAudioHash456', 'audio', { from: author });
      postCount = await socialNetwork.postCount();
      assert.equal(postCount.toString(), '3');
    });

    it('lists posts', async () => {
      const post = await socialNetwork.posts(1);
      assert.equal(post.id.toString(), '1', 'id is correct');
      assert.equal(post.content, 'This is my first post', 'content is correct');
      assert.equal(post.author, author, 'author is correct');
    });

    it('allows users to tip posts', async () => {
      let oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      result = await socialNetwork.tipPost(1, {
        from: tipper,
        value: web3.utils.toWei('1', 'Ether')
      });

      const event = result.logs[0].args;
      assert.equal(event.id.toString(), '1', 'id is correct');
      assert.equal(event.tipAmount.toString(), web3.utils.toWei('1', 'Ether'), 'tip amount is correct');

      let newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      let tipAmount = web3.utils.toWei('1', 'Ether');
      tipAmount = new web3.utils.BN(tipAmount);

      const expectedBalance = oldAuthorBalance.add(tipAmount);
      assert.equal(newAuthorBalance.toString(), expectedBalance.toString());

      // FAILURE: Tries to tip a post that does not exist
      await socialNetwork.tipPost(99, {
        from: tipper,
        value: web3.utils.toWei('1', 'Ether')
      }).should.be.rejected;
    });
  });

  describe('likes', async () => {
    it('allows users to like posts', async () => {
      await socialNetwork.likePost(1, { from: tipper });
      const post = await socialNetwork.posts(1);
      assert.equal(post.likeCount.toString(), '1');

      const hasLiked = await socialNetwork.hasLiked(1, tipper);
      assert.equal(hasLiked, true);
    });

    it('prevents double liking', async () => {
      await socialNetwork.likePost(1, { from: tipper }).should.be.rejected;
    });

    it('allows users to unlike posts', async () => {
      await socialNetwork.unlikePost(1, { from: tipper });
      const post = await socialNetwork.posts(1);
      assert.equal(post.likeCount.toString(), '0');
    });
  });

  describe('comments', async () => {
    it('allows users to comment on posts', async () => {
      const result = await socialNetwork.addComment(1, 'Great post!', { from: commenter });
      const event = result.logs[0].args;
      assert.equal(event.postId.toString(), '1');
      assert.equal(event.content, 'Great post!');
      assert.equal(event.author, commenter);

      const post = await socialNetwork.posts(1);
      assert.equal(post.commentCount.toString(), '1');
    });

    it('rejects empty comments', async () => {
      await socialNetwork.addComment(1, '', { from: commenter }).should.be.rejected;
    });
  });

  describe('profiles', async () => {
    it('allows users to set a profile', async () => {
      await socialNetwork.updateProfile('Alice', '', { from: author });
      const profile = await socialNetwork.getProfile(author);
      assert.equal(profile[0], 'Alice');
      assert.equal(profile[2], true);
    });

    it('rejects empty usernames', async () => {
      await socialNetwork.updateProfile('', '', { from: author }).should.be.rejected;
    });
  });
});