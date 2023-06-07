// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ElementalFusion.sol";

function init(Elemental[7] storage elementals) {
    elementals[0] = Elemental({
        id: 0,
        name: "Fire Sprite",
        tributes: new uint8[](0),
        cooldown: true
    });

    elementals[1] = Elemental({
        id: 1,
        name: "Aqua Delfin",
        tributes: new uint8[](0),
        cooldown: true
    });

    elementals[2] = Elemental({
        id: 2,
        name: "Earth Golem",
        tributes: new uint8[](0),
        cooldown: true
    });

    elementals[3] = Elemental({
        id: 3,
        name: "Steam Serpent",
        tributes: new uint8[](2),
        cooldown: false
    });
    elementals[3].tributes[0] = 0;
    elementals[3].tributes[1] = 1;

    elementals[4] = Elemental({
        id: 4,
        name: "Mud Titan",
        tributes: new uint8[](2),
        cooldown: false
    });
    elementals[4].tributes[0] = 1;
    elementals[4].tributes[1] = 2;

    elementals[5] = Elemental({
        id: 5,
        name: "Lava Fiend",
        tributes: new uint8[](2),
        cooldown: false
    });
    elementals[5].tributes[0] = 0;
    elementals[5].tributes[1] = 2;

    elementals[6] = Elemental({
        id: 6,
        name: "Elemental Phoenix",
        tributes: new uint8[](3),
        cooldown: false
    });

    elementals[6].tributes[0] = 0;
    elementals[6].tributes[1] = 1;
    elementals[6].tributes[2] = 2;
}
