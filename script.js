import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* =========================
   FIREBASE SETUP
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyDQWCD6KHlsZpEJ9bq4r4CKWql5tC1lTzE",
  authDomain: "xodus-territory-war.firebaseapp.com",
  projectId: "xodus-territory-war",
  storageBucket: "xodus-territory-war.firebasestorage.app",
  messagingSenderId: "375483707701",
  appId: "1:375483707701:web:e020203f842b7ad9419c7c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const stateRef = doc(db, "territoryWar", "state");

/* =========================
   TEAM NAMES
========================= */
const teams = {
  neutral: "Neutral",
  team1: "Blue Team",
  team2: "Red Team"
};

const teamOrder = ["team1", "team2"];

let territoryOwners = {};
let territoryProgress = {};
let selectedRegion = null;
let editModeUnlocked = false;

/* =========================
   REGION DATA
========================= */
const regions = {
greatKourend: {
  name: "Great Kourend",
  bosses: [
    {
  name: "Chambers of Xeric",
  drops: [
    { item: "Twisted bow", points: 60 },
    { item: "Kodai insignia", points: 35 },
    { item: "Elder maul", points: 30 },
    { item: "Dragon hunter crossbow", points: 25 },
    { item: "Ancestral robe top", points: 25 },
    { item: "Ancestral robe bottom", points: 25 },
    { item: "Dragon claws", points: 25 },
    { item: "Ancestral hat", points: 20 },
    { item: "Dinh's bulwark", points: 15 },
    { item: "Dexterous prayer scroll", points: 15 },
    { item: "Arcane prayer scroll", points: 15 },
    { item: "Twisted buckler", points: 15 },
    { item: "Twisted ancestral colour kit", points: 20 },
    { item: "Metamorphic dust", points: 35 },
    { item: "olm Pet", points: 20 }
  ]
},

    {
      name: "Sarachnis",
      drops: [
        { item: "Sarachnis cudgel", points: 10 },
        { item: "Jar of eyes", points: 8 },
        { item: "Pristine Spider Silk", points: 5},
        { item: "Sarachnis Pet", points: 20 }
      ]
    },

    {
      name: "Skotizo",
      drops: [
        { item: "Dark claw", points: 8 },
        { item: "Jar of darkness", points: 10 },
        { item: "Skotizo Pet", points: 10 }
      ]
    },

    {
      name: "Wintertodt",
      drops: [
        { item: "Pyromancer piece", points: 2 },
        { item: "Bruma torch", points: 4 },
        { item: "Warm gloves", points: 2 },
        { item: "Tome of fire", points: 15 },
        { item: "Dragon axe", points: 20 },
        { item: "Pheonix Pet", points: 20 }
      ]
    }
  ]
},

  kebosLowlands: {
  name: "Kebos Lowlands",
  bosses: [
    {
      name: "Alchemical Hydra",
      drops: [
        { item: "Hydra's claw", points: 25 },
        { item: "Hydra leather", points: 18 },
        { item: "Hydra tail", points: 18 },
        { item: "Hydra's eye", points: 8 },
        { item: "Hydra's fang", points: 8 },
        { item: "Hydra's heart", points: 8 },
        { item: "Dragon knife", points: 6 },
        { item: "Dragon thrownaxe", points: 6 },
        { item: "Hydra Heads", points: 10},
        { item: "Hydra Pet", points: 20 }
      ]
    },
    {
      name: "Vardorvis",
      drops: [
        { item: "Ultor vestige", points: 25 },
        { item: "Executioner's axe head", points: 25 },
        { item: "Virtus mask", points: 25 },
        { item: "Virtus robe top", points: 25 },
        { item: "Virtus robe bottom", points: 25 },
        { item: "Blood quartz", points: 8 },
        { item: "Chromium ingot", points: 8 },
        { item: "Vardorvis Pet", points: 20 }
      ]
    }
  ]
},

  varlamore: {
  name: "Varlamore",
  bosses: [
    {
      name: "Fortis Colosseum",
      drops: [
        { item: "Smol heredit", points: 35 },
        { item: "Tonalztics of ralos", points: 35 },
        { item: "Sunfire fanatic helm", points: 15 },
        { item: "Sunfire fanatic cuirass", points: 15 },
        { item: "Sunfire fanatic chausses", points: 15 },
        { item: "Echo crystal", points: 12 }
      ]
    },
    {
      name: "Hueycoatl",
      drops: [
        { item: "Dragon hunter wand", points: 25 },
        { item: "Tome of earth", points: 15 },
        { item: "Hueycoatl hide", points: 12 },
        { item: "Hueycoatl Pet", points: 20 }
      ]
    },
    {
      name: "Yama",
      drops: [
        { item: "Oathplate helm", points: 25 },
        { item: "Oathplate chest", points: 25 },
        { item: "Oathplate legs", points: 25 },
        { item: "Yama Pet", points: 20 }
      ]
    },
    {
      name: "Doom of Mokhaiotl",
      drops: [
        { item: "Eye of Ayak", points: 30 },
        { item: "Avernic treads", points: 30 },
        { item: "Mokhaiotl cloth", points: 30 },
        { item: "Doom Pet", points: 20 }
      ]
    },
    {
      name: "Moons of Peril",
      drops: [
        { item: "Moons piece", points: 8 }
      ]
    },
    {
      name: "Amoxliatl",
      drops: [
        { item: "Glacial temotli", points: 15 },
        { item: "Pendant of ates (inert)", points: 6 },
        { item: "Amox Pet", points: 20 }
      ]
    }
  ]
},

  fremennik: {
  name: "Fremennik Province",
  bosses: [
    {
      name: "Vorkath",
      drops: [
        { item: "Skeletal visage", points: 35 },
        { item: "Draconic visage", points: 35 },
        { item: "Jar of decay", points: 30 },
        { item: "Vork Pet", points: 20 }
      ]
    },
    {
      name: "Dagannoth Kings",
      drops: [
        { item: "Berserker ring", points: 10 },
        { item: "Archers ring", points: 10 },
        { item: "Seers ring", points: 10 },
        { item: "Warrior ring", points: 10 },
        { item: "Dragon axe", points: 6 },
        { item: "Seercull", points: 6 },
        { item: "Mud battlestaff", points: 6 },
        { item: "DK Pet", points: 20 }
      ]
    },
    {
      name: "Phantom Muspah",
      drops: [
        { item: "Venator shard", points: 15 },
        { item: "Ancient icon", points: 8 },
        { item: "Frozen cache", points: 4 },
        { item: "Muspah Pet", points: 20 }
      ]
    },
    {
      name: "Duke Sucellus",
      drops: [
        { item: "Magus vestige", points: 25 },
        { item: "Eye of the duke", points: 25 },
        { item: "Virtus mask", points: 25 },
        { item: "Virtus robe top", points: 25 },
        { item: "Virtus robe bottom", points: 25 },
        { item: "Ice quartz", points: 8 },
        { item: "Chromium ingot", points: 8 },
        { item: "Duke Pet", points: 20 }
      ]
    }
  ]
},

  wilderness: {
  name: "Wilderness",
  bosses: [
    {
      name: "King Black Dragon",
      drops: [
        { item: "Draconic visage", points: 35 },
        { item: "Kbd heads", points: 8 },
        { item: "KBD Pet", points: 20 }
      ]
    },
    {
      name: "Chaos Elemental",
      drops: [
        { item: "Dragon pickaxe", points: 10 },
        { item: "Dragon 2h sword", points: 8 },
        { item: "Chaos Elemental Pet", points: 20 }
      ]
    },
    {
      name: "Chaos Fanatic",
      drops: [
        { item: "Odium shard 1", points: 10 },
        { item: "Malediction shard 1", points: 10 } 
      ]
    },
    {
      name: "Crazy Archaeologist",
      drops: [
        { item: "Odium shard 2", points: 10 },
        { item: "Malediction shard 2", points: 10 },
        { item: "Fedora", points: 4 }
      ]
    },
    {
      name: "Scorpia",
      drops: [
        { item: "Odium shard 3", points: 10 },
        { item: "Malediction shard 3", points: 10 },
        { item: "Scorpia Pet", points: 20 }
      ]
    },
    {
      name: "Corporeal Beast",
      drops: [
        { item: "Spectral sigil", points: 40 },
        { item: "Arcane sigil", points: 40 },
        { item: "Elysian sigil", points: 40 },
        { item: "Holy elixir", points: 12 },
        { item: "Spirit shield", points: 6 },
        { item: "Corp Pet", points: 20 }
      ]
    },
    {
      name: "Callisto / Artio",
      drops: [
        { item: "Voidwaker hilt", points: 25 },
        { item: "Tyrannical ring", points: 12 },
        { item: "Dragon pickaxe", points: 10 },
        { item: "Dragon 2h sword", points: 6 },
        { item: "Bear Pet", points: 20 }
      ]
    },
    {
      name: "Vet'ion / Calvar'ion",
      drops: [
        { item: "Voidwaker blade", points: 25 },
        { item: "Ring of the gods", points: 12 },
        { item: "Dragon pickaxe", points: 10 },
        { item: "Dragon 2h sword", points: 6 },
        { item: "Vet'ion Pet", points: 20 }
      ]
    },
    {
      name: "Venenatis / Spindel",
      drops: [
        { item: "Voidwaker gem", points: 25 },
        { item: "Treasonous ring", points: 12 },
        { item: "Dragon pickaxe", points: 10 },
        { item: "Dragon 2h sword", points: 6 },
        { item: "Venenatis Pet", points: 20 }
      ]
    },
    {
      name: "Revenants",
      drops: [
        { item: "Craw's bow", points: 30 },
        { item: "Viggora's chainmace", points: 30 },
        { item: "Thammaron's sceptre", points: 30 },
        { item: "Amulet of avarice", points: 15 },
        { item: "Ancient crystal", points: 10 }
      ]
    }
  ]
},

 tirannwn: {
  name: "Tirannwn",
  bosses: [
    {
      name: "Zulrah",
      drops: [
        { item: "Tanzanite fang", points: 15 },
        { item: "Magic fang", points: 15 },
        { item: "Serpentine visage", points: 15 },
        { item: "Uncut onyx", points: 10 },
        { item: "Jar of swamp", points: 30 },
        { item: "Snake Pet", points: 20 }
      ]
    },
    {
      name: "Corrupted Gauntlet",
      drops: [
        { item: "Enhanced crystal weapon seed", points: 35 },
        { item: "Crystal armour seed", points: 12 },
        { item: "Crystal weapon seed", points: 8 },
        { item: "Gauntlet Pet", points: 20 }
      ]
    },
    {
      name: "Zalcano",
      drops: [
        { item: "Crystal tool seed", points: 25 },
        { item: "Zalcano shard", points: 10 },
        { item: "Zolcano Pet", points: 20 }
      ]
    }
  ]
},

  kandarin: {
  name: "Kandarin",
  bosses: [
    {
      name: "Kraken",
      drops: [
        { item: "Kraken tentacle", points: 10 },
        { item: "Trident of the seas", points: 8 },
        { item: "Jar of dirt", points: 15 },
        { item: "Kraken Pet", points: 20 }
      ]
    },
    {
      name: "Thermonuclear Smoke Devil",
      drops: [
        { item: "Occult necklace", points: 10 },
        { item: "Smoke battlestaff", points: 12 },
        { item: "Jar of smoke", points: 20 },
        { item: "Thermy Pet", points: 20 }
      ]
    },
    {
      name: "Demonic Gorillas",
      drops: [
        { item: "Zenyte shard", points: 18 },
        { item: "Ballista piece", points: 8 }
      ]
    }
  ]
},
  asgarnia: {
  name: "Asgarnia",
  bosses: [
    {
      name: "General Graardor",
      drops: [
        { item: "Bandos chestplate", points: 15 },
        { item: "Bandos tassets", points: 15 },
        { item: "Bandos boots", points: 15 },
        { item: "Bandos hilt", points: 20 },
        { item: "Bandos Pet", points: 20 }
      ]
    },
    {
      name: "Commander Zilyana",
      drops: [
        { item: "Armadyl crossbow", points: 20 },
        { item: "Saradomin hilt", points: 20 },
        { item: "Saradomin sword", points: 10 },
        { item: "Saradomin's light", points: 15 },
        { item: "Saradomin Pet", points: 20 }
      ]
    },
    {
      name: "Kree'arra",
      drops: [
        { item: "Armadyl helmet", points: 15 },
        { item: "Armadyl chestplate", points: 15 },
        { item: "Armadyl chainskirt", points: 15 },
        { item: "Armadyl hilt", points: 20 },
        { item: "Armadyl Pet", points: 20 }
      ]
    },
    {
      name: "K'ril Tsutsaroth",
      drops: [
        { item: "Zamorakian spear", points: 10 },
        { item: "Steam battlestaff", points: 10 },
        { item: "Staff of the dead", points: 20 },
        { item: "Zamorak hilt", points: 20 },
        { item: "Zammy Pet", points: 20 }
      ]
    },
    {
      name: "Nex",
      drops: [
        { item: "Torva full helm", points: 25 },
        { item: "Torva platebody", points: 25 },
        { item: "Torva platelegs", points: 25 },
        { item: "Nihil horn", points: 25 },
        { item: "Zaryte vambraces", points: 20 },
        { item: "Ancient hilt", points: 30 },
        { item: "Nex Pet", points: 20 }
      ]
    },
    {
      name: "Giant Mole",
      drops: [
        { item: "Immaculate Mole skin", points: 5 },
        { item: "Mole Pet", points: 20 }
      ]
    },
    {
  name: "Royal Titans",
  drops: [
    { item: "Deadeye prayer scroll", points: 10 },
    { item: "Mystic vigour prayer scroll", points: 10 },
    { item: "Fire element staff crown", points: 10 },
    { item: "Ice element staff crown", points: 10 },
    { item: "Giantsoul amulet", points: 6 },
    { item: "Royal Titans Pet", points: 20 }
  ]
},
    {
      name: "Cerberus",
      drops: [
        { item: "Primordial crystal", points: 18 },
        { item: "Pegasian crystal", points: 18 },
        { item: "Eternal crystal", points: 18 },
        { item: "Smouldering stone", points: 18 },
        { item: "Cerberus Pet", points: 20 }
      ]
    },
    {
      name: "The Whisperer",
      drops: [
        { item: "Bellator vestige", points: 25 },
        { item: "Siren's staff", points: 25 },
        { item: "Virtus mask", points: 25 },
        { item: "Virtus robe top", points: 25 },
        { item: "Virtus robe bottom", points: 25 },
        { item: "Shadow quartz", points: 8 },
        { item: "Chromium ingot", points: 8 },
        { item: "Whisperer Pet", points: 20 }
      ]
    }
  ]
},

misthalin: {
  name: "Misthalin",
  bosses: [
    {
      name: "Obor / Bryophyta",
      drops: [
        { item: "Hill giant club", points: 6 },
        { item: "Bryophyta's essence", points: 8 }
      ]
    },
    {
      name: "Brutus",
      drops: [
        { item: "Mooleta", points: 4 },
        { item: "Bottomless milk bucket", points: 4 },
        { item: "Cow slippers", points: 4 },
        { item: "BEEEEEF Pet", points: 10 }
      ]
    },
    {
      name: "Scurrius",
      drops: [
        { item: "Scurrius spine", points: 4 },
        { item: "RAT Pet", points: 20 }
      ]
    },
    {
      name: "Tormented Demons",
      drops: [
        { item: "Tormented synapse", points: 25 },
        { item: "Burning claw", points: 25 }
      ]
    },
    {
      name: "The Leviathan",
      drops: [
        { item: "Venator vestige", points: 25 },
        { item: "Leviathan's lure", points: 25 },
        { item: "Virtus mask", points: 25 },
        { item: "Virtus robe top", points: 25 },
        { item: "Virtus robe bottom", points: 25 },
        { item: "Smoke quartz", points: 8 },
        { item: "Chromium ingot", points: 8 },
        { item: "Leviathan Pet", points: 20 }
      ]
    }
  ]
},

morytania: {
  name: "Morytania",
  bosses: [
  {
  name: "Theatre of Blood",
  drops: [
    { item: "Scythe of vitur", points: 60 },
    { item: "Sanguinesti staff", points: 30 },
    { item: "Ghrazi rapier", points: 30 },
    { item: "Justiciar piece", points: 30 },
    { item: "Avernic defender hilt", points: 15 },
    { item: "Holy ornament kit", points: 20 },
    { item: "Sanguine ornament kit", points: 25 },
    { item: "Sanguine dust", points: 30 },
    { item: "TOB Pet", points: 20 }
  ]
},

    {
      name: "Grotesque Guardians",
      drops: [
        { item: "Black tourmaline core", points: 20 },
        { item: "Granite hammer", points: 15 },
        { item: "Granite gloves", points: 10 },
        { item: "Granite ring", points: 10 },
        { item: "Jar of stone", points: 15 },
        { item: "Guardians Pet", points: 20 }
      ]
    },

    {
      name: "Barrows",
      drops: [
        { item: "Barrows piece", points: 2 }
      ]
    },

    {
      name: "Araxxor",
      drops: [
        { item: "Noxious halberd piece", points: 15 },
        { item: "Araxyte fang", points: 25 },
        { item: "Araxyte head", points: 10 },
        { item: "Jar of venom", points: 15 },
        { item: "Araxxor Pet", points: 20 }
      ]
    },

    {
      name: "Maggot King",
      drops: [
        { item: "Crimson kisten", points: 25 },
        { item: "Necklace of Rupture", points: 25 },
        { item: "Maggot Pet", points: 20 }
      ]
    },

    {
      name: "The Nightmare",
      drops: [
        { item: "Nightmare staff", points: 15 },
        { item: "Inquisitor's great helm", points: 20 },
        { item: "Inquisitor's hauberk", points: 20 },
        { item: "Inquisitor's plateskirt", points: 20 },
        { item: "Inquisitor's mace", points: 30 },
        { item: "Eldritch orb", points: 35 },
        { item: "Volatile orb", points: 35 },
        { item: "Harmonised orb", points: 35 },
        { item: "Nightmare Pet", points: 20 }
      ]
    }
  ]
},

 karamja: {
  name: "Karamja",
  bosses: [
    {
      name: "TzHaar Challenges",
      drops: [
        { item: "TzRek-Jad", points: 35 },
        { item: "Jal-nib-rek", points: 35 }
      ]
    },

    {
      name: "Shellbane Gryphon",
      drops: [
        { item: "Belle's Folly", points: 15 },
        { item: "Jar of feathers", points: 10 },
        { item: "Gryphon Pet", points: 20 }
      ]
    },

    {
      name: "Abyssal Sire",
      drops: [
        { item: "Abyssal bludgeon piece", points: 20 },
        { item: "Abyssal dagger", points: 18 },
        { item: "Abyssal head", points: 10 },
        { item: "Jar of miasma", points: 15 },
        { item: "Abyssal Pet", points: 20 }
      ]
    }
  ]
},

  desert: {
  name: "Kharidian Desert",
  bosses: [
    {
      name: "Tombs of Amascut",
      drops: [
        { item: "Tumeken's shadow", points: 60 },
        { item: "Masori piece", points: 25 },
        { item: "Elidinis' ward", points: 20 },
        { item: "Osmumten's fang", points: 15 },
        { item: "Lightbearer", points: 15 },
        { item: "Thread of elidinis", points: 8 },
        { item: "TOA Pet", points: 20 }
      ]
    },
    {
      name: "Kalphite Queen",
      drops: [
        { item: "Dragon chainbody", points: 8 },
        { item: "Dragon 2h sword", points: 8 },
        { item: "Dragon Pickaxe", points: 8 }, 
        { item: "Kq head", points: 6 },
        { item: "KQ Pet", points: 20 }
      ]
    },
    {
      name: "Tempoross",
      drops: [
        { item: "Dragon harpoon", points: 30 },
        { item: "Tome of water", points: 15 },
        { item: "Big harpoonfish", points: 15 },
        { item: "Fish barrel", points: 10 },
        { item: "Tackle box", points: 10 },
        { item: "Tempoross Pet", points: 20 }
      ]
    }
  ]
},
};

/* =========================
   DOM
========================= */
const infoPanel = document.getElementById("infoPanel");
const ownerZones = document.querySelectorAll(".owner-zone");

/* =========================
   PROGRESS HELPERS
========================= */
function makeDropId(itemName) {
  return itemName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getDropCount(regionKey, teamKey, dropId, progressSource = territoryProgress) {
  return progressSource?.[regionKey]?.[teamKey]?.[dropId] || 0;
}

function getTeamRegionPoints(regionKey, teamKey, progressSource = territoryProgress) {
  const region = regions[regionKey];
  if (!region) return 0;

  let total = 0;

  region.bosses.forEach((boss) => {
    boss.drops.forEach((drop) => {
      const dropId = makeDropId(drop.item);
      const count = getDropCount(regionKey, teamKey, dropId, progressSource);
      total += count * drop.points;
    });
  });

  return total;
}

function getTeamRegionUniqueCount(regionKey, teamKey, progressSource = territoryProgress) {
  const region = regions[regionKey];
  if (!region) return 0;

  let total = 0;

  region.bosses.forEach((boss) => {
    boss.drops.forEach((drop) => {
      const dropId = makeDropId(drop.item);
      total += getDropCount(regionKey, teamKey, dropId, progressSource);
    });
  });

  return total;
}

function getRegionController(regionKey, progressSource = territoryProgress, ownerSource = territoryOwners) {
  const scores = teamOrder.map((teamKey) => ({
    teamKey,
    points: getTeamRegionPoints(regionKey, teamKey, progressSource)
  }));

  const highestScore = Math.max(...scores.map((score) => score.points));

  if (highestScore <= 0) {
    return "neutral";
  }

  const tiedTeams = scores
    .filter((score) => score.points === highestScore)
    .map((score) => score.teamKey);

  if (tiedTeams.length === 1) {
    return tiedTeams[0];
  }

  const currentOwner = ownerSource[regionKey] || "neutral";

  if (tiedTeams.includes(currentOwner)) {
    return currentOwner;
  }

  return "neutral";
}

function previewProgressChange(regionKey, teamKey, dropId, amount) {
  const progressCopy = structuredClone(territoryProgress || {});

  if (!progressCopy[regionKey]) progressCopy[regionKey] = {};
  if (!progressCopy[regionKey][teamKey]) progressCopy[regionKey][teamKey] = {};

  const current = progressCopy[regionKey][teamKey][dropId] || 0;
  const next = Math.max(0, current + amount);

  progressCopy[regionKey][teamKey][dropId] = next;

  return progressCopy;
}

async function changeDropCount(regionKey, bossIndex, dropIndex, teamKey, amount) {
  if (!editModeUnlocked) {
    alert("Unlock leader edit mode first.");
    return;
  }

  const drop = regions[regionKey]?.bosses?.[bossIndex]?.drops?.[dropIndex];
  if (!drop) return;

  const dropId = makeDropId(drop.item);
  const currentCount = getDropCount(regionKey, teamKey, dropId);

  if (amount < 0 && currentCount <= 0) return;

  const previewProgress = previewProgressChange(regionKey, teamKey, dropId, amount);
  const newController = getRegionController(regionKey, previewProgress, territoryOwners);

  try {
    await updateDoc(stateRef, {
      [`progress.${regionKey}.${teamKey}.${dropId}`]: increment(amount),
      [regionKey]: newController
    });
  } catch (error) {
    console.error("Error updating drop count:", error);
    alert("Failed to update drop count.");
  }
}

window.changeDropCount = changeDropCount;

/* =========================
   FIRESTORE LIVE LISTENER
========================= */
onSnapshot(stateRef, (snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.data();

    territoryProgress = data.progress || {};

    territoryOwners = { ...data };
    delete territoryOwners.progress;

    applyOwnershipColors();
    updateSelectedRegionUI();

    if (selectedRegion) {
      displayRegionInfo(selectedRegion);
    }
  }
});

/* =========================
   MAP EVENTS
========================= */
ownerZones.forEach((zone) => {
  zone.addEventListener("click", () => {
    selectedRegion = zone.dataset.region;
    updateSelectedRegionUI();
    displayRegionInfo(selectedRegion);
  });
});

/* =========================
   SELECTED REGION UI
========================= */
function updateSelectedRegionUI() {
  ownerZones.forEach((zone) => {
    zone.classList.toggle(
      "selected-region",
      zone.dataset.region === selectedRegion
    );
  });
}

/* =========================
   OWNERSHIP COLORS
========================= */
function applyOwnershipColors() {
  ownerZones.forEach((zone) => {
    const regionKey = zone.dataset.region;
    const owner = getRegionController(regionKey);

    zone.classList.remove(
      "owner-neutral",
      "owner-team1",
      "owner-team2",
      "owner-team3",
      "owner-team4"
    );

    zone.classList.add(`owner-${owner}`);
  });
}

/* =========================
   EDIT MODE
========================= */
function unlockEditMode() {
  const password = prompt("Enter leader password:");

  if (password === "xodus123") {
    editModeUnlocked = true;
    if (selectedRegion) displayRegionInfo(selectedRegion);
  } else {
    alert("Incorrect password.");
  }
}

function lockEditMode() {
  editModeUnlocked = false;
  if (selectedRegion) displayRegionInfo(selectedRegion);
}

window.unlockEditMode = unlockEditMode;
window.lockEditMode = lockEditMode;

/* =========================
   INFO PANEL RENDER
========================= */
function displayRegionInfo(regionKey) {
  if (!regionKey) {
    infoPanel.innerHTML = `
      <h2>Select a Territory</h2>
      <p>Click a region to see owner, bosses, drops, and point values.</p>
    `;
    return;
  }

  const region = regions[regionKey];

  if (!region) {
    infoPanel.innerHTML = `
      <h2>Region Not Found</h2>
      <p>No data exists for this territory yet.</p>
    `;
    return;
  }

  const owner = getRegionController(regionKey);
  const ownerName = teams[owner] || "Neutral";

  const totalListedPoints = region.bosses.reduce((sum, boss) => {
    return sum + boss.drops.reduce((dropSum, drop) => dropSum + drop.points, 0);
  }, 0);

  let html = `
    <h2>${region.name}</h2>
    <p class="owner-label ${owner}">Controlled by: ${ownerName}</p>

    <div class="edit-mode-actions">
      ${
        editModeUnlocked
          ? `<button onclick="lockEditMode()">Lock Edit Mode</button>`
          : `<button onclick="unlockEditMode()">Unlock Edit Mode</button>`
      }
    </div>
  `;

  if (editModeUnlocked) {
    html += `<div class="edit-mode-banner">Leader Edit Mode Active</div>`;
  }

  html += `
    <p class="region-total">Total listed points: ${totalListedPoints}</p>

    <div class="team-region-points">
      <h3>Region Progress</h3>
      ${teamOrder
        .map((teamKey) => {
          const points = getTeamRegionPoints(regionKey, teamKey);
          const uniques = getTeamRegionUniqueCount(regionKey, teamKey);

          return `
            <div class="team-region-row">
              <strong>${teams[teamKey]}</strong>: ${uniques} uniques | ${points} pts
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  region.bosses.forEach((boss, bossIndex) => {
    html += `
      <div class="boss">
        <h3>${boss.name}</h3>
        <ul class="drop-list">
    `;

    boss.drops.forEach((drop, dropIndex) => {
      const dropId = makeDropId(drop.item);

      html += `
        <li>
          <div class="drop-row">
            <div class="drop-title"><strong>${drop.item}</strong> — ${drop.points} pts</div>
      `;

      teamOrder.forEach((teamKey) => {
        const count = getDropCount(regionKey, teamKey, dropId);
        const earnedPoints = count * drop.points;

        html += `
          <div class="drop-tracker">
            <span>${teams[teamKey]}: ${count} earned | ${earnedPoints} pts</span>
            ${
              editModeUnlocked
                ? `
                  <div class="drop-buttons">
                    <button onclick="changeDropCount('${regionKey}', ${bossIndex}, ${dropIndex}, '${teamKey}', -1)">-</button>
                    <button onclick="changeDropCount('${regionKey}', ${bossIndex}, ${dropIndex}, '${teamKey}', 1)">+</button>
                  </div>
                `
                : ""
            }
          </div>
        `;
      });

      html += `
          </div>
        </li>
      `;
    });

    html += `
        </ul>
      </div>
    `;
  });

  infoPanel.innerHTML = html;
}

/* =========================
   TEMP SVG POINT TRACER
   Hold SHIFT + click map points
========================= */
const tracerOverlay = document.querySelector(".territory-overlay");
let tracePoints = [];

if (tracerOverlay) {
  tracerOverlay.addEventListener(
    "click",
    (event) => {
      if (!event.shiftKey) return;

      event.preventDefault();
      event.stopPropagation();

      const point = tracerOverlay.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;

      const svgPoint = point.matrixTransform(
        tracerOverlay.getScreenCTM().inverse()
      );

      const x = Math.round(svgPoint.x);
      const y = Math.round(svgPoint.y);

      tracePoints.push(`${x},${y}`);

      console.clear();
      console.log("Current polygon points:");
      console.log(tracePoints.join(" "));
    },
    true
  );
}

window.clearTracePoints = function () {
  tracePoints = [];
  console.clear();
  console.log("Trace points cleared.");
};

window.showTracePoints = function () {
  console.log(tracePoints.join(" "));
};
