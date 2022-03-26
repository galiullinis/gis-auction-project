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

    it("should catch error if not seller call stopAuction", async function(){
        const currentLot = "Mona Lisa"
        const startPrice = 1000000
        const bidPrice = 1500000
        const sellerAddr = seller.address
        const notSellerRevertedMessage = "Permission denied! You are not the lot seller."
        const tx = await auction.beginAuction(currentLot, startPrice, sellerAddr)
        const txMakeBid = await auction.connect(account1).makeBid({value: bidPrice})
        await expect(auction.stopAuction()).to.be.revertedWith(notSellerRevertedMessage)
    })

    it("should be stopable for seller", async function(){
        const currentLot = "Mona Lisa"
        const startPrice = 1000000
        const bidPrice = 1500000
        const sellerAddr = seller.address
        const tx = await auction.beginAuction(currentLot, startPrice, sellerAddr)
        const txMakeBid = await auction.connect(account1).makeBid({value: bidPrice})
        expect(await auction.connect(seller).stopAuction()).to.changeEtherBalance(seller, 1500000)
    })

    it("should return prev bid to prev bider", async function(){
        const currentLot = "Mona Lisa"
        const startPrice = 1000000
        const bidPrice = 1500000
        const bidPrice2 = 2000000
        const sellerAddr = seller.address
        const tx = await auction.beginAuction(currentLot, startPrice, sellerAddr)
        const txMakeBid = await auction.connect(account1).makeBid({value: bidPrice})
        const txMakeBid2 = await auction.connect(account2).makeBid({value: bidPrice2})
        expect(txMakeBid2).to.changeEtherBalance(account1, bidPrice)
    })

    it("should check lot activiity before begin auction", async function(){
        const currentLot = "Mona Lisa"
        const startPrice = 5000
        const sellerAddr = seller.address
        const currentLot2 = "Mona Lisa duplicate"
        const startPrice2 = 10000
        const sellerAddr2 = seller.address
        const activeAuctionRevertedMessage = "Auction is active!"
        const tx = auction.beginAuction(currentLot, startPrice, sellerAddr)
        const tx2 = auction.beginAuction(currentLot2, startPrice2, sellerAddr2)
        await expect(tx2).to.be.revertedWith(activeAuctionRevertedMessage)
    })

    it("bid should be grater than prev bid", async function(){
        const currentLot = "Mona Lisa"
        const startPrice = 1000000
        const bidPrice = 1500000
        const bidPrice2 = 1500000
        const sellerAddr = seller.address
        const lowBidRevertedMessage = "Current bid price should be greater than last bid price!"
        const tx = await auction.beginAuction(currentLot, startPrice, sellerAddr)
        const txMakeBid = await auction.connect(account1).makeBid({value: bidPrice})
        const txMakeBid2 = auction.connect(account2).makeBid({value: bidPrice2})
        await expect(txMakeBid2).to.be.revertedWith(lowBidRevertedMessage)
    })


    it("should create auction only owner", async function(){
        const currentLot = "Mona Lisa"
        const startPrice = 1000000
        const sellerAddr = seller.address
        const notOwnerRevertedMessage = "Permission denied! You are not an owner."
        const tx = auction.connect(account1).beginAuction(currentLot, startPrice, sellerAddr)
        await expect(tx).to.be.revertedWith(notOwnerRevertedMessage)
    })


})