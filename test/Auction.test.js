const { expect } = require("chai");
const { ethers } = require("hardhat");
const tools = require("../tools/tools")

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

    it("should be bidable", async function(){
        const bidPrice = 10000
        const bidAddress = account1.address
        const bidPrice2 = 15000
        const bidAddress2 = account2.address
        const currentLot = "Mona Lisa"
        const startPrice = 1000
        const sellerAddr = seller.address
        const txBeginAuction = await auction.beginAuction(currentLot, startPrice, sellerAddr)
        const txMakeBid = await auction.connect(account1).makeBid({value: bidPrice})
        expect(bidAddress).to.eq(await auction.bidAddress())
        expect(bidPrice).to.eq(await auction.bidPrice())
        const txMakeBid2 = await auction.connect(account2).makeBid({value: bidPrice2})
        expect(bidAddress2).to.eq(await auction.bidAddress())
        expect(bidPrice2).to.eq(await auction.bidPrice())
    })

    it("should catch error if auction did not begin", async function(){
        const bidPrice = 10000
        const auctionNotBeginRevertedMessage = "The auction has not yet begun!"
        await expect(auction.connect(account1).makeBid({value: bidPrice})).to.be.revertedWith(auctionNotBeginRevertedMessage)
    })
})