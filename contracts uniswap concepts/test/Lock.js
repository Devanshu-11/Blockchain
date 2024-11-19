const {expect}=require('chai');
const {Signature}=require("ethers");

describe("UniswapV2Router02",function(){
    let owner1,owner2,tokenA,tokenB,tokenC,factoryAddress,wethAddress,pairAddress,routerAddress;

    beforeEach(async function(){
        [owner1]=await ethers.getSigners();
        console.log("Address of owner1 is: ",owner1.address);

        tokenA=await ethers.deployContract("TokenA");
        console.log("Address of token A is: ",tokenA.target);

        tokenB=await ethers.deployContract("TokenB");
        console.log("Address of token B is: ",tokenB.target);

        tokenC=await ethers.deployContract("TokenC");
        console.log("Address of token C is: ",tokenC.target);

        // address of the factory
        factoryAddress=await ethers.deployContract("UniswapV2Factory",[owner1.address]);
        console.log("Address of Factory is: ",factoryAddress.target);

        // address of the weth
        wethAddress=await ethers.deployContract("WETH9");
        console.log("Address of Weth is: ", wethAddress.target);

        // address of pair
        pairAddress=await ethers.deployContract("UniswapV2Pair");
        console.log("Address of pair is: ",pairAddress.target);

        // router address
        routerAddress=await ethers.deployContract("UniswapV2Router02",[factoryAddress,wethAddress]);
        console.log("Address of router is: ",routerAddress.target);
    });

    // In this we will add the tokens and tokens in the liquidity pool
    it("In this function,we will add in the liquidity pool and get to know about the liquidity pool",async function(){

        // now mint token A and token B
        await tokenA.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance before updating the token A is: ",await ethers.formatUnits(tokenABalanceInitial));

        await tokenB.mint(owner1.address,ethers.parseUnits("50000"));
        const tokenBBalanceInitial=await tokenB.balanceOf(owner1.address);
        console.log("Initial balance before updating the token B is: ",await ethers.formatUnits(tokenBBalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("10000"));
        await tokenB.approve(routerAddress.target,ethers.parseUnits("50000"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("800"),ethers.parseUnits("2400"),0,0,owner1.address,time+(12000*10));

        await routerAddress.addLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("700"),ethers.parseUnits("2100"),ethers.parseUnits("700"),ethers.parseUnits("2100"),owner1.address,time+(120*10));

        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        const tokenBBalanceFinal=await tokenB.balanceOf(owner1.address);

        // final balance
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
        console.log("Final balance after updating the token B is: ",await ethers.formatUnits(tokenBBalanceFinal));
    });

    // In this we will add the tokens and ethers in the liquidity pool
    it("In this function,we will add tokens and ethers in the liquidity pool",async function(){

        // now mint token A and token B
        await tokenA.mint(owner1.address,ethers.parseUnits("700"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance of token A before add tokens in pool is: ",await ethers.formatUnits(tokenABalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("700"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidityETH(tokenA.target,ethers.parseUnits("350"),0,0,owner1.address,time+(12000*10),{value:ethers.parseUnits("0.6")});

        const tokenABalancePool=await tokenA.balanceOf(owner1.address); 
        console.log("balance of token A after add tokens in pool is: ",await ethers.formatUnits(tokenABalancePool));

        await routerAddress.addLiquidityETH(tokenA.target,ethers.parseUnits("250"),ethers.parseUnits("50"),ethers.parseUnits("0.3"),owner1.address,time+(12000*10),{value:ethers.parseUnits("0.2")});

        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
    });

    // In this we get to know about how we remove the liquidity of the tokens
    it("In this we get to know about how we remove the liquidity of the tokens",async function(){

        // now mint token A and token B
        await tokenA.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance before updating the token A is: ",await ethers.formatUnits(tokenABalanceInitial));

        await tokenB.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenBBalanceInitial=await tokenB.balanceOf(owner1.address);
        console.log("Initial balance before updating the token B is: ",await ethers.formatUnits(tokenBBalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("10000"));
        await tokenB.approve(routerAddress.target,ethers.parseUnits("10000"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("800"),ethers.parseUnits("2400"),0,0,owner1.address,time+(12000*10));

        await routerAddress.addLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("700"),ethers.parseUnits("2100"),0,0,owner1.address,time+(120*10));

        const pairAddress=await factoryAddress.getPair(tokenA.target,tokenB.target);
        const pair=await ethers.getContractAt("IUniswapV2Pair", pairAddress);
        const liquidity=await pair.balanceOf(await owner1.getAddress());

        console.log("the total liquidity tokens is: ",ethers.formatUnits(liquidity));
        const myLiquidity=liquidity.toString();

        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        const tokenBBalanceFinal=await tokenB.balanceOf(owner1.address);

        // final balance
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
        console.log("Final balance after updating the token B is: ",await ethers.formatUnits(tokenBBalanceFinal));

        await pair.connect(owner1).approve(routerAddress.target,myLiquidity);
        await routerAddress.removeLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("200"),0,0,owner1.address,time+(12000*10));

        const liquidityAgain=await pair.balanceOf(await owner1.getAddress());

        console.log("the total liquidity tokens is: ",ethers.formatUnits(liquidityAgain));
        const myLiquidityAgain=liquidityAgain.toString();

        const tokenABalanceFinalAfterLiquidity=await tokenA.balanceOf(owner1.address);
        const tokenBBalanceFinalAfterLiquidity=await tokenB.balanceOf(owner1.address);

        // final balance
        console.log("Final balance after updating the liquidity in the token A is: ",await ethers.formatUnits(tokenABalanceFinalAfterLiquidity));
        console.log("Final balance after updating the liquidity in the token B is: ",await ethers.formatUnits(tokenBBalanceFinalAfterLiquidity));

        await routerAddress.removeLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("300"),0,0,owner1.address,time+(12000*10));

        const tokenABalanceFinalAfterLiquidityAgain=await tokenA.balanceOf(owner1.address);
        const tokenBBalanceFinalAfterLiquidityAgain=await tokenB.balanceOf(owner1.address);

        // final balance
        console.log("Final balance after updating the liquidity again in the token A is: ",await ethers.formatUnits(tokenABalanceFinalAfterLiquidityAgain));
        console.log("Final balance after updating the liquidity again in the token B is: ",await ethers.formatUnits(tokenBBalanceFinalAfterLiquidityAgain));
    });

    // In this we get to know about how we remove the liquidity of the tokens and eth
    it("In this we get to know about how we remove the liquidity of the tokens and the eth",async function(){

        // now mint token A and token B
        await tokenA.mint(owner1.address,ethers.parseUnits("700"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance of token A before add tokens in pool is: ",await ethers.formatUnits(tokenABalanceInitial));
 
        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("700"));
 
        // in case of date and time
        const d=new Date();
        let time=d.getTime();
 
        await routerAddress.addLiquidityETH(tokenA.target,ethers.parseUnits("350"),0,0,owner1.address,time+(12000*10),{value:ethers.parseUnits("0.6")});
 
        const pairAddress=await factoryAddress.getPair(tokenA.target,wethAddress.target);
        const pair=await ethers.getContractAt("IUniswapV2Pair", pairAddress);
        const liquidity=await pair.balanceOf(await owner1.getAddress());

        console.log("the total liquidity tokens is: ",ethers.formatUnits(liquidity));
        const myLiquidity=liquidity.toString();

        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
 
        await pair.approve(routerAddress.target,myLiquidity);
        await routerAddress.removeLiquidityETH(tokenA.getAddress(),liquidity,0,0,owner1.address,time + 10 * 60);
 
        const tokenABalanceFinalAfterLiquidity=await tokenA.balanceOf(owner1.address);
        console.log("Final balance after updating the liquidity in the token A is: ",await ethers.formatUnits(tokenABalanceFinalAfterLiquidity));
    });

    // In this we will remove the liquidity with the permit
    it("In this function,we will remove the liquidity with the permit in the pool",async function(){

        // now mint token A and token B
        await tokenA.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance before updating the token A is: ",await ethers.formatUnits(tokenABalanceInitial));

        await tokenB.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenBBalanceInitial=await tokenB.balanceOf(owner1.address);
        console.log("Initial balance before updating the token B is: ",await ethers.formatUnits(tokenBBalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("10000"));
        await tokenB.approve(routerAddress.target,ethers.parseUnits("10000"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("800"),ethers.parseUnits("2400"),0,0,owner1.address,time+(12000*10));

        await routerAddress.addLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("700"),ethers.parseUnits("2100"),0,0,owner1.address,time+(120*10));

        const pairAddress=await factoryAddress.getPair(tokenA.target,tokenB.target);
        const pair=await ethers.getContractAt("IUniswapV2Pair", pairAddress);
        const liquidity=await pair.balanceOf(await owner1.getAddress());
        console.log("the total liquidity tokens is: ",ethers.formatUnits(liquidity));

        const nonce=await pair.nonces(await owner1.address);
        console.log("the value of nonce is: ",nonce);
        const deadline=Math.floor(Date.now()/1000)+3600;

        // Get the chain ID
        const chainId=await ethers.provider.getNetwork().then(network=>network.chainId);
        console.log("chain id:",chainId);

        // now we will prepare the permit signature
        const permitData={owner:owner1.address,spender:routerAddress.target,value:liquidity,nonce:nonce,deadline:deadline};
        console.log("the permit data is: ",permitData);

        const signature=await owner1.signTypedData({name:'Uniswap V2',version:'1',chainId:chainId,verifyingContract:await pairAddress},{Permit:[{name:'owner',type:'address'},{name:'spender',type:'address'},{name:'value',type:'uint256'},{name:'nonce',type:'uint256'},{name:'deadline',type:'uint256'}]},permitData);
        console.log("Print signature",signature);

        // Create a Signature object
        const sig=Signature.from(signature);
        const {v,r,s}=sig;
        console.log("print v: ",v);
        console.log("print r: ",r);
        console.log("print s: ",s);

        const tokenABalanceFinal=await tokenA.balanceOf(owner1.getAddress());
        const tokenBBalanceFinal=await tokenB.balanceOf(owner1.getAddress());

        // final balance
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
        console.log("Final balance after updating the token B is: ",await ethers.formatUnits(tokenBBalanceFinal));
    });

    // In this we will swap exact tokens for tokens in the liquidity pool
    it("In this we get to know about the swap exact tokens for tokens in the pool",async function(){
        
        // now we will mint the tokens A and token B
        await tokenA.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance before updating the token A is: ",await ethers.formatUnits(tokenABalanceInitial));

        await tokenB.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenBBalanceInitial=await tokenB.balanceOf(owner1.address);
        console.log("Initial balance before updating the token B is: ",await ethers.formatUnits(tokenBBalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("10000"));
        await tokenB.approve(routerAddress.target,ethers.parseUnits("10000"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("2367"),ethers.parseUnits("3256"),0,0,owner1.address,time+(12000*10));

        const tokenABalanceAfterLiquidity=await tokenA.balanceOf(owner1.address); 
        console.log("balance after adding the liquidity in the token A is: ",await ethers.formatUnits(tokenABalanceAfterLiquidity));

        const tokenBBalanceAfterLiquidity=await tokenB.balanceOf(owner1.address);
        console.log("balance after adding the liquidity in the token B is: ",await ethers.formatUnits(tokenBBalanceAfterLiquidity));

        const addressPath=[tokenA.target,tokenB.target];
        await routerAddress.swapExactTokensForTokens(ethers.parseUnits("2300"),ethers.parseUnits("1000"),addressPath,owner1.address,time+(12000*10));

        // final balance
        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        const tokenBBalanceFinal=await tokenB.balanceOf(owner1.address);

        // final balance
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
        console.log("Final balance after updating the token B is: ",await ethers.formatUnits(tokenBBalanceFinal));
    });

    // In this we will swap tokens for exact tokens in the liquidity pool
    it("In this we get to know about the swap tokens for exact tokens in the pool",async function(){
        
        // now we will mint the tokens A and token B
        await tokenA.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance before updating the token A is: ",await ethers.formatUnits(tokenABalanceInitial));

        await tokenB.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenBBalanceInitial=await tokenB.balanceOf(owner1.address);
        console.log("Initial balance before updating the token B is: ",await ethers.formatUnits(tokenBBalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("10000"));
        await tokenB.approve(routerAddress.target,ethers.parseUnits("10000"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("2367"),ethers.parseUnits("3256"),0,0,owner1.address,time+(12000*10));

        const tokenABalanceAfterLiquidity=await tokenA.balanceOf(owner1.address); 
        console.log("balance after adding the liquidity in the token A is: ",await ethers.formatUnits(tokenABalanceAfterLiquidity));

        const tokenBBalanceAfterLiquidity=await tokenB.balanceOf(owner1.address);
        console.log("balance after adding the liquidity in the token B is: ",await ethers.formatUnits(tokenBBalanceAfterLiquidity));

        const addressPath=[tokenA.target,tokenB.target];
        await routerAddress.swapTokensForExactTokens(ethers.parseUnits("2300"),ethers.parseUnits("5712"),addressPath,owner1.address,time+(12000*10));

        // final balance
        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        const tokenBBalanceFinal=await tokenB.balanceOf(owner1.address);

        // final balance
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
        console.log("Final balance after updating the token B is: ",await ethers.formatUnits(tokenBBalanceFinal));
    });

    // In this we will swap exact eth for tokens in the liquidity pool
    it("In this we get to know about the swap exact eth for tokens in the pool",async function(){
        
        // now we will mint the tokens A
        await tokenA.mint(owner1.address,ethers.parseUnits("700"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance before updating the token A is: ",await ethers.formatUnits(tokenABalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("700"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidityETH(tokenA.target,ethers.parseUnits("350"),ethers.parseUnits("120"),0,owner1.address,time+(12000*10),{value:ethers.parseUnits("0.6")});

        const tokenABalanceAfterLiquidity=await tokenA.balanceOf(owner1.address); 
        console.log("balance after adding the liquidity in the token A is: ",await ethers.formatUnits(tokenABalanceAfterLiquidity));

        const addressPath=[wethAddress.target,tokenA.target];
        await routerAddress.swapExactETHForTokens(ethers.parseUnits("80"),addressPath,owner1.address,time+(12000*10),{value:ethers.parseUnits("0.2")});

        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
    });

    // In this we will swap tokens for exact eth in the liquidity pool
    it("In this we get to know about the swap tokens for exact eth in the pool",async function(){
        
        // now we will mint the tokens A
        await tokenA.mint(owner1.address,ethers.parseUnits("700"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance before updating the token A is: ",await ethers.formatUnits(tokenABalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("700"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidityETH(tokenA.target,ethers.parseUnits("350"),0,0,owner1.address,time+(12000*10),{value:ethers.parseUnits("0.8")});

        const tokenABalanceAfterLiquidity=await tokenA.balanceOf(owner1.address); 
        console.log("balance after adding the liquidity in the token A is: ",await ethers.formatUnits(tokenABalanceAfterLiquidity));

        const addressPath=[tokenA.target,wethAddress.target];
        await routerAddress.swapTokensForExactETH(ethers.parseUnits("0.2"),ethers.parseUnits("200"),addressPath,owner1.address,time+(12000*10));

        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
    });

    // In this we will swap exact tokens for eth in the liquidity pool
    it("In this we get to know about the swap exact tokens for eth in the pool",async function(){
        
        // now we will mint the tokens A
        await tokenA.mint(owner1.address,ethers.parseUnits("700"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance before updating the token A is: ",await ethers.formatUnits(tokenABalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("700"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidityETH(tokenA.target,ethers.parseUnits("350"),0,0,owner1.address,time+(12000*10),{value:ethers.parseUnits("5.6")});

        const tokenABalanceAfterLiquidity=await tokenA.balanceOf(owner1.address); 
        console.log("balance after adding the liquidity in the token A is: ",await ethers.formatUnits(tokenABalanceAfterLiquidity));

        const addressPath=[tokenA.target,wethAddress.target];
        await routerAddress.swapExactTokensForETH(ethers.parseUnits("190"),ethers.parseUnits("0.4"),addressPath,owner1.address,time+(12000*10));

        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
    });

    // In this we will swap eth for exact tokens in the liquidity pool
    it("In this we get to know about the swap eth for exact tokens in the pool",async function(){
        
        // now we will mint the tokens A
        await tokenA.mint(owner1.address,ethers.parseUnits("700"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance before updating the token A is: ",await ethers.formatUnits(tokenABalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("700"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidityETH(tokenA.target,ethers.parseUnits("350"),ethers.parseUnits("120"),0,owner1.address,time+(12000*10),{value:ethers.parseUnits("3.4")});

        const tokenABalanceAfterLiquidity=await tokenA.balanceOf(owner1.address); 
        console.log("balance after adding the liquidity in the token A is: ",await ethers.formatUnits(tokenABalanceAfterLiquidity));

        const addressPath=[wethAddress.target,tokenA.target];
        await routerAddress.swapETHForExactTokens(ethers.parseUnits("50"),addressPath,owner1.address,time+(12000*10),{value:ethers.parseUnits("0.57")});

        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
    });

    // In this we will swap exact tokens for tokens in case of the fee
    it("In this we get to know about the swap exact tokens for tokens on the supporting fee in the pool",async function(){
        
        // now we will mint the tokens A and token B
        await tokenA.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenABalanceInitial=await tokenA.balanceOf(owner1.address); 
        console.log("Initial balance before updating the token A is: ",await ethers.formatUnits(tokenABalanceInitial));

        await tokenB.mint(owner1.address,ethers.parseUnits("10000"));
        const tokenBBalanceInitial=await tokenB.balanceOf(owner1.address);
        console.log("Initial balance before updating the token B is: ",await ethers.formatUnits(tokenBBalanceInitial));

        // for approve
        await tokenA.approve(routerAddress.target,ethers.parseUnits("10000"));
        await tokenB.approve(routerAddress.target,ethers.parseUnits("10000"));

        // in case of date and time
        const d=new Date();
        let time=d.getTime();

        await routerAddress.addLiquidity(tokenA.target,tokenB.target,ethers.parseUnits("6500"),ethers.parseUnits("9000"),0,0,owner1.address,time+(12000*10));

        const tokenABalanceAfterLiquidity=await tokenA.balanceOf(owner1.address); 
        console.log("balance after adding the liquidity in the token A is: ",await ethers.formatUnits(tokenABalanceAfterLiquidity));

        const tokenBBalanceAfterLiquidity=await tokenB.balanceOf(owner1.address);
        console.log("balance after adding the liquidity in the token B is: ",await ethers.formatUnits(tokenBBalanceAfterLiquidity));

        const addressPath=[tokenA.target,tokenB.target];
        await routerAddress.swapExactTokensForTokensSupportingFeeOnTransferTokens(ethers.parseUnits("1000"),ethers.parseUnits("1000"),addressPath,owner1.address,time+(12000*10));

        // final balance
        const tokenABalanceFinal=await tokenA.balanceOf(owner1.address);
        const tokenBBalanceFinal=await tokenB.balanceOf(owner1.address);

        // final balance
        console.log("Final balance after updating the token A is: ",await ethers.formatUnits(tokenABalanceFinal));
        console.log("Final balance after updating the token B is: ",await ethers.formatUnits(tokenBBalanceFinal));
    });
});