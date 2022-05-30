var EHR = artifacts.require("./EHR.sol");

module.exports = function(deployer) {
  deployer.deploy(EHR);
  // deployer.deploy(EHR, {overwrite: false});
};