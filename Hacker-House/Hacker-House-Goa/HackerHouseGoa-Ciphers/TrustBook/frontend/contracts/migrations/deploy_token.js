const SocialFiToken = artifacts.require("SocialFiToken");

module.exports = function (deployer) {
  deployer.deploy(SocialFiToken, web3.utils.toWei('1000000', 'ether')); // Deploy with 1 million tokens
};