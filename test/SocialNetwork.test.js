const SocialNetwork = artifacts.require('./SocialNetwork.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('SocialNetwork', ([deployer, author, tipper, commenter]) => {
  let socialNetwork;

  before(async () => {
    socialNetwork = await SocialNetwork.deployed();
  });

  describe('deployment', () => {
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

  describe('profiles', () => {
    it('creates a profile', async () => {
      await socialNetwork.createProfile('Alice', 'Hello world', '', { from: author });
      const profile = await socialNetwork.getProfile(author);
      assert.equal(profile.username, 'Alice');
      assert.equal(profile.bio, 'Hello world');
      assert.equal(profile.exists, true);
    });

    it('prevents duplicate profiles', async () => {
      await socialNetwork.createProfile('Alice2', '', '', { from: author }).should.be.rejected;
    });

    it('prevents duplicate usernames', async () => {
      await socialNetwork.createProfile('alice', '', '', { from: tipper }).should.be.rejected;
    });

    it('creates second user profile', async () => {
      await socialNetwork.createProfile('Bob', 'Tipper', '', { from: tipper });
      const profile = await socialNetwork.getProfile(tipper);
      assert.equal(profile.username, 'Bob');
    });

    it('creates third user profile', async () => {
      await socialNetwork.createProfile('Charlie', '', '', { from: commenter });
    });

    it('checks username availability', async () => {
      const taken = await socialNetwork.isUsernameAvailable('alice');
      assert.equal(taken, false);

      const available = await socialNetwork.isUsernameAvailable('newuser');
      assert.equal(available, true);
    });

    it('updates profile', async () => {
      await socialNetwork.updateProfile('AliceUpdated', 'New bio', 'QmHash', { from: author });
      const profile = await socialNetwork.getProfile(author);
      assert.equal(profile.username, 'AliceUpdated');
      assert.equal(profile.bio, 'New bio');
    });

    it('tracks user count', async () => {
      const count = await socialNetwork.getUserCount();
      assert.equal(count.toString(), '3');
    });
  });

  describe('posts', () => {
    it('requires profile to post', async () => {
      await socialNetwork.createPost('test', '', 'text', { from: deployer }).should.be.rejected;
    });

    it('creates text post', async () => {
      const result = await socialNetwork.createPost('First post!', '', 'text', { from: author });
      const event = result.logs[0].args;
      assert.equal(event.content, 'First post!');
      assert.equal(event.mediaType, 'text');
    });

    it('creates media post', async () => {
      await socialNetwork.createPost('With image', 'QmImageHash', 'image', { from: author });
      const postCount = await socialNetwork.postCount();
      assert.equal(postCount.toString(), '2');
    });

    it('tips post', async () => {
      let oldBalance = await web3.eth.getBalance(author);
      oldBalance = new web3.utils.BN(oldBalance);

      await socialNetwork.tipPost(1, { from: tipper, value: web3.utils.toWei('1', 'Ether') });

      let newBalance = await web3.eth.getBalance(author);
      newBalance = new web3.utils.BN(newBalance);

      const tip = new web3.utils.BN(web3.utils.toWei('1', 'Ether'));
      const expected = oldBalance.add(tip);
      assert.equal(newBalance.toString(), expected.toString());
    });

    it('prevents self-tipping', async () => {
      await socialNetwork.tipPost(1, { from: author, value: web3.utils.toWei('0.1', 'Ether') }).should.be.rejected;
    });

    it('likes and unlikes', async () => {
      await socialNetwork.likePost(1, { from: tipper });
      let post = await socialNetwork.posts(1);
      assert.equal(post.likeCount.toString(), '1');

      await socialNetwork.unlikePost(1, { from: tipper });
      post = await socialNetwork.posts(1);
      assert.equal(post.likeCount.toString(), '0');
    });

    it('comments on post', async () => {
      await socialNetwork.addComment(1, 'Nice!', { from: commenter });
      const post = await socialNetwork.posts(1);
      assert.equal(post.commentCount.toString(), '1');
    });
  });
});