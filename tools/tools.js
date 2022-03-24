async function sendMoney(sender, receiver, amount){
    const txData = {
        to: receiver,
        value: amount
    }

    const tx = await sender.sendTransaction(txData)
    await tx.wait()
    return tx
}

module.exports.sendMoney = sendMoney