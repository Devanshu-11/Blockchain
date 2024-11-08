const {buildModule}=require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule=buildModule("MyContract",(m)=>{
  const token=m.contract("MyContract",['0x5FbDB2315678afecb367f032d93F642f64180aa3']);
  return {token};
});

// const erc20Module=buildModule("ERC20",(m)=>{
//   const myErcToken=m.contract("ERC20",["tokenA","tokenA",18]);
//   return {myErcToken};
// });

module.exports=TokenModule;