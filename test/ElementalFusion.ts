import "@nomicfoundation/hardhat-chai-matchers"
import { expect } from "chai";
import { ethers } from "hardhat";
import { ElementalFusion } from "../typechain-types";

describe("Elemental Fusion", function () {

  let elementalFusion: ElementalFusion;

  before(async () => {

    // Deploy contract
    const ElementalFusion = await ethers.getContractFactory("ElementalFusion");
    elementalFusion = await ElementalFusion.deploy();

    // Wait for deployment
    await elementalFusion.deployed();
    console.log("ElementalFusion deployed at:", elementalFusion.address);
  })

  describe("Forging Elementals", () => {
    const anon = ethers.provider.getSigner(0)
    const anonAddress = anon.getAddress()

    // const gasLimit = 1000000

    it("should let anyone mint tokens with id 0, 1, 2", async () => {
      for (const id of [0, 1, 2]) {
        // Mint tokens
        await elementalFusion.connect(anon).forge(id)

        // Check balance
        expect(await elementalFusion.balanceOf(anonAddress, id)).to.equal(1)
      }
    })

    it("should give an error if minting tokens with the same id without respecting 1 minute cooldown", async () => {
      const tx = await elementalFusion.connect(anon).forge(0, { gasLimit: 100000 })
      expect(tx).to.be.revertedWithCustomError(elementalFusion, "CooldownRequired")
    })

    const cooldown = async () => {
      await ethers.provider.send("evm_increaseTime", [60]);
      await ethers.provider.send("evm_mine", []);
    }

    it("should let mint again when respecting 1 minute cooldown", async () => {

      await cooldown()

      const tx = await elementalFusion.connect(anon).forge(0)

      await expect(tx).not.to.be.reverted

      // Check balance
      expect(await elementalFusion.balanceOf(anonAddress, 0)).to.equal(2)

    })

    it("should not let users mint tokens 3, 4, 5, 6 if they don't have the proper tributes", async () => {

      const anon1 = ethers.provider.getSigner(1)
      // help wanted: how do I access data from custom error?
      expect(
        await elementalFusion.connect(anon1).forge(3, { gasLimit: 100000 })
      ).to.be.revertedWithCustomError(elementalFusion, "InsufficientTributes");
      // Not to mention that this test doesn't really check that the tx actually gets reverted with this error:
      // it just checks that it is reverted AND that the error is in the contract interface.
      // ----------------------------------------------------------------
      // expect(tx).to.be.revertedWithCustomError(elementalFusion, "CooldownRequired"); 
      expect(
        await elementalFusion.connect(anon1).forge(4, { gasLimit: 100000 })
      ).to.be.reverted

      expect(
        await elementalFusion.connect(anon1).forge(5, { gasLimit: 100000 })
      ).to.be.reverted

      // console.log(
      //   elementalFusion.interface.parseTransaction({ data: tx.data })
      // )
    })

    it("should let users 'tribute' tokens 0-2 to forge token 3, 4, 5, 6", async () => {
      await elementalFusion.connect(anon).forge(3)

      // Check balance
      expect(await elementalFusion.balanceOf(anonAddress, 3)).to.equal(1)
      expect(await elementalFusion.balanceOf(anonAddress, 0)).to.equal(1) // we had 2
      expect(await elementalFusion.balanceOf(anonAddress, 1)).to.equal(0)

      const gasLimit = 1_000_000

      await expect(
        await elementalFusion.connect(anon).forge(5, { gasLimit })
      ).not.to.be.reverted

      await elementalFusion.connect(anon).forge(1, { gasLimit })
      await elementalFusion.connect(anon).forge(2, { gasLimit })
      await expect(
        await elementalFusion.connect(anon).forge(4, { gasLimit })
      ).not.to.be.reverted

      await cooldown()

      await elementalFusion.connect(anon).forge(0, { gasLimit })
      await elementalFusion.connect(anon).forge(1, { gasLimit })
      await elementalFusion.connect(anon).forge(2, { gasLimit })

      await expect(
        await elementalFusion.connect(anon).forge(6, { gasLimit })
      ).not.to.be.reverted

      // console.log(await elementalFusion.balanceOfBatch([anonAddress, anonAddress, anonAddress, anonAddress, anonAddress, anonAddress, anonAddress], [0, 1, 2, 3, 4, 5, 6]))

    })

    it("should let the users forge 3, 4, 5, 6 without cooldown constraints", async () => {

      // Cooling down from previous tests
      await cooldown()

      const gasLimit = 1_000_000

      const tributesByToken: Record<number, number[]> = {
        3: [0, 1],
        4: [1, 2],
        5: [0, 2],
        6: [0, 1, 2]
      }

      for (const tokenId in tributesByToken) {
        const tributes = tributesByToken[tokenId]

        // Mint twice and check that the second time there is no cooldown needed for these tokens

        for (let i = 0; i < 2; i++) {
          for (const tribute of tributes) {
            await (await elementalFusion.connect(anon).forge(tribute, { gasLimit })).wait()
          }

          await cooldown()
        }

        await (await elementalFusion.connect(anon).forge(tokenId, { gasLimit })).wait()

        // Do it again without cooldown:
        await expect(
          await elementalFusion.connect(anon).forge(tokenId, { gasLimit })
        ).not.to.be.reverted
      }

    })

    it("should let the users retrieve the list of elementals together with their user related data", async () => {
      const anyAnon = ethers.provider.getSigner(7)

      await (await elementalFusion.connect(anyAnon).forge(0)).wait()
      await (await elementalFusion.connect(anyAnon).forge(1)).wait()
      await (await elementalFusion.connect(anyAnon).forge(2)).wait()

      const elementalsData = await elementalFusion.connect(anyAnon).viewElementalsData()

      expect(elementalsData.length).to.equal(7)
      expect(elementalsData[0].balance).to.equal(1)
      expect(elementalsData[1].balance).to.equal(1)
      expect(elementalsData[2].balance).to.equal(1)
    })

  })
});
