const hre = require('hardhat')
const ethers = hre.ethers

async function main() {
    const [signer] = await ethers.getSigners()
    const Auction = await ethers.getContractFactory('Auction', signer)
    const auction = await Auction.deploy()
    await auction.deployed()
    console.log(auction.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });