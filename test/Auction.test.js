const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Auction", function(){
    let owner;
    let seller;
    let account1;
    let account2;
    let auction;

    beforeEach(async function(){
        [owner, seller, account1, account2] = await ethers.getSigners()
        const Fund = await ethers.getContractFactory("Auction", owner)
        auction = await Fund.deploy()
        await auction.deployed()
    })

    it("should auction creatable", async function(){
        const currentLot = "Mona Lisa"
        const startPrice = 1000000
        const sellerAddr = seller.address
        const tx = await auction.beginAuction(currentLot, startPrice, sellerAddr)
        expect(currentLot).to.eq(await auction.currentLot())
        expect(startPrice).to.eq(await auction.bidPrice())
        expect(sellerAddr).to.eq(await auction.sellerAddr())
    })
})