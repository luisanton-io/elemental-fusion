// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// import ERC1155 contract
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./Init.sol";

struct Elemental {
    uint256 id;
    string name;
    uint8[] tributes;
    bool cooldown;
}

struct ElementalResponse {
    Elemental elemental;
    uint256 balance;
    uint256 cooldownTimer;
}

contract ElementalFusion is ERC1155, ERC1155Burnable {
    Elemental[7] elementals;

    constructor()
        ERC1155(
            "ipfs://Qmee8m3jtGuJf6Fzf1cC8Y8AYUr1EEWxXYNE3vUaNE8p7T/{id}.json"
        )
    {
        init(elementals);
    }

    mapping(address => mapping(uint256 => uint256)) cooldownTimers;

    error CooldownRequired(); // Saving gas with custom error - possibly the most commonly thrown
    error InsufficientTributes(uint8 id);

    function forge(uint256 id) public {
        address account = msg.sender;
        if (
            elementals[id].cooldown &&
            cooldownTimers[account][id] > block.timestamp
            // cooldownTimers[account][id] > block.number
        ) {
            revert CooldownRequired();
        }

        for (uint8 i = 0; i < elementals[id].tributes.length; i++) {
            _burn(account, elementals[id].tributes[i], 1);
        }

        _mint(account, id, 1, "");

        if (elementals[id].cooldown) {
            cooldownTimers[account][id] = block.timestamp + 1 minutes;
            // cooldownTimers[account][id] = block.number + 5; // 1 block every ~12 sec
        }
    }

    function viewElementalsData()
        public
        view
        returns (ElementalResponse[7] memory)
    {
        // with a single function call we are returning all the Elementals data
        // as well as the users balances and cooldown timers
        ElementalResponse[7] memory elementalsData;

        for (uint8 i = 0; i < elementals.length; i++) {
            elementalsData[i].elemental = elementals[i];
            elementalsData[i].balance = balanceOf(msg.sender, i);
            elementalsData[i].cooldownTimer = elementals[i].cooldown
                ? cooldownTimers[msg.sender][i]
                : 0;
        }

        return elementalsData;
    }
}
