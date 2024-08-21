const SocialFiDapp = artifacts.require("SocialFiDapp");
const SocialFiToken = artifacts.require("SocialFiToken");

module.exports = function (deployer) {
  deployer.deploy(SocialFiDapp, SocialFiToken.address);
};