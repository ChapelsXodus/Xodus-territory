import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc
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
   TEAM NAMES / OWNERSHIP
========================= */
const teams = {
  neutral: "Neutral",
  team1: "Team 1",
  team2: "Team 2",
  team3: "Team 3",
  team4: "Team 4"
};

let territoryOwners = {};
let selectedRegion = null;

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
          { item: "Ancestral robe top", points: 22 },
          { item: "Ancestral robe bottom", points: 22 },
          { item: "Ancestral hat", points: 18 },
          { item: "Dragon claws", points: 18 },
          { item: "Dinh's bulwark", points: 14 },
          { item: "Dexterous prayer scroll", points: 12 },
          { item: "Arcane prayer scroll", points: 8 },
          { item: "Twisted buckler", points: 8 }
        ]
      },
      {
        name: "Sarachnis",
        drops: [
          { item: "Sarachnis cudgel", points: 8 },
          { item: "Jar of eyes", points: 8 }
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
          { item: "Hydra's claw", points: 35 },
          { item: "Hydra leather", points: 18 },
          { item: "Hydra tail", points: 10 },
          { item: "Hydra's eye", points: 8 },
          { item: "Hydra's fang", points: 8 },
          { item: "Hydra's heart", points: 8 },
          { item: "Dragon knife", points: 4 },
          { item: "Dragon thrownaxe", points: 4 }
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
          { item: "Dizana's quiver", points: 50 },
          { item: "Sunfire fanatic helm", points: 12 },
          { item: "Sunfire fanatic cuirass", points: 12 },
          { item: "Sunfire fanatic chausses", points: 12 },
          { item: "Echo crystal", points: 10 }
        ]
      },
      {
        name: "Hueycoatl",
        drops: [
          { item: "Dragon hunter wand", points: 25 },
          { item: "Hueycoatl hide", points: 12 },
          { item: "Tome of earth", points: 15 }
        ]
      },
      {
        name: "Yama",
        drops: [
          { item: "Oathplate helm", points: 20 },
          { item: "Oathplate chest", points: 20 },
          { item: "Oathplate legs", points: 20 }
        ]
      },
      {
        name: "Doom of Mokhaiotl",
        drops: [
          { item: "Mokhaiotl cloth", points: 18 },
          { item: "Eye of Ayak", points: 20 },
          { item: "Avernic treads", points: 16 }
        ]
      },
      {
        name: "Moons of Peril",
        drops: [
          { item: "Blood moon helm", points: 6 },
          { item: "Blood moon chestplate", points: 6 },
          { item: "Blood moon tassets", points: 6 },
          { item: "Dual macuahuitl", points: 6 },
          { item: "Blue moon helm", points: 6 },
          { item: "Blue moon chestplate", points: 6 },
          { item: "Blue moon tassets", points: 6 },
          { item: "Blue moon spear", points: 6 },
          { item: "Eclipse moon helm", points: 6 },
          { item: "Eclipse moon chestplate", points: 6 },
          { item: "Eclipse moon tassets", points: 6 },
          { item: "Eclipse atlatl", points: 6 }
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
          { item: "Vorkath's head", points: 8 },
          { item: "Draconic visage", points: 20 },
          { item: "Skeletal visage", points: 25 },
          { item: "Jar of decay", points: 10 }
        ]
      },
      {
        name: "Dagannoth Kings",
        drops: [
          { item: "Berserker ring", points: 10 },
          { item: "Archers ring", points: 8 },
          { item: "Seers ring", points: 6 },
          { item: "Warrior ring", points: 4 },
          { item: "Dragon axe", points: 4 },
          { item: "Seercull", points: 4 },
          { item: "Mud battlestaff", points: 4 }
        ]
      },
      {
        name: "Phantom Muspah",
        drops: [
          { item: "Venator shard", points: 15 },
          { item: "Ancient icon", points: 8 },
          { item: "Frozen cache", points: 5 }
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
          { item: "Draconic visage", points: 20 },
          { item: "Kbd heads", points: 8 }
        ]
      },
      {
        name: "Callisto / Artio",
        drops: [
          { item: "Voidwaker hilt", points: 30 },
          { item: "Tyrannical ring", points: 10 },
          { item: "Dragon pickaxe", points: 8 }
        ]
      },
      {
        name: "Vet'ion / Calvar'ion",
        drops: [
          { item: "Voidwaker blade", points: 30 },
          { item: "Ring of the gods", points: 10 },
          { item: "Dragon pickaxe", points: 8 }
        ]
      },
      {
        name: "Venenatis / Spindel",
        drops: [
          { item: "Voidwaker gem", points: 30 },
          { item: "Treasonous ring", points: 10 },
          { item: "Dragon pickaxe", points: 8 }
        ]
      },
      {
        name: "Voidwaker Completion",
        drops: [
          { item: "Voidwaker hilt + blade + gem", points: 30 }
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
          { item: "Tanzanite fang", points: 12 },
          { item: "Magic fang", points: 12 },
          { item: "Serpentine visage", points: 12 },
          { item: "Uncut onyx", points: 8 },
          { item: "Jar of swamp", points: 8 }
        ]
      },
      {
        name: "Corrupted Gauntlet",
        drops: [
          { item: "Enhanced crystal weapon seed", points: 35 },
          { item: "Crystal armour seed", points: 12 },
          { item: "Crystal weapon seed", points: 8 }
        ]
      },
      {
        name: "Zalcano",
        drops: [
          { item: "Crystal tool seed", points: 12 },
          { item: "Zalcano shard", points: 8 }
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
          { item: "Kraken tentacle", points: 8 },
          { item: "Trident of the seas", points: 6 },
          { item: "Jar of dirt", points: 8 }
        ]
      },
      {
        name: "Thermonuclear Smoke Devil",
        drops: [
          { item: "Occult necklace", points: 8 },
          { item: "Smoke battlestaff", points: 6 },
          { item: "Jar of smoke", points: 8 }
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
          { item: "Bandos chestplate", points: 12 },
          { item: "Bandos tassets", points: 12 },
          { item: "Bandos boots", points: 6 },
          { item: "Bandos hilt", points: 10 }
        ]
      },
      {
        name: "Commander Zilyana",
        drops: [
          { item: "Armadyl crossbow", points: 15 },
          { item: "Saradomin hilt", points: 10 },
          { item: "Saradomin sword", points: 6 },
          { item: "Saradomin's light", points: 6 }
        ]
      },
      {
        name: "Kree'arra",
        drops: [
          { item: "Armadyl helmet", points: 10 },
          { item: "Armadyl chestplate", points: 12 },
          { item: "Armadyl chainskirt", points: 12 },
          { item: "Armadyl hilt", points: 10 }
        ]
      },
      {
        name: "K'ril Tsutsaroth",
        drops: [
          { item: "Zamorakian spear", points: 10 },
          { item: "Staff of the dead", points: 10 },
          { item: "Zamorak hilt", points: 10 },
          { item: "Steam battlestaff", points: 6 }
        ]
      },
      {
        name: "Nex",
        drops: [
          { item: "Torva full helm", points: 25 },
          { item: "Torva platebody", points: 30 },
          { item: "Torva platelegs", points: 30 },
          { item: "Nihil horn", points: 25 },
          { item: "Zaryte vambraces", points: 20 },
          { item: "Ancient hilt", points: 15 }
        ]
      },
      {
        name: "Cerberus",
        drops: [
          { item: "Primordial crystal", points: 18 },
          { item: "Pegasian crystal", points: 15 },
          { item: "Eternal crystal", points: 12 },
          { item: "Smouldering stone", points: 8 }
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
        name: "Araxxor",
        drops: [
          { item: "Noxious halberd piece", points: 18 },
          { item: "Amulet of rancour", points: 18 },
          { item: "Araxyte venom sack", points: 8 }
        ]
      },
      {
        name: "Tormented Demons",
        drops: [
          { item: "Tormented synapse", points: 20 },
          { item: "Burning claw", points: 10 }
        ]
      },
      {
        name: "Desert Treasure II Bosses",
        drops: [
          { item: "Ultor vestige", points: 20 },
          { item: "Magus vestige", points: 20 },
          { item: "Venator vestige", points: 20 },
          { item: "Bellator vestige", points: 20 },
          { item: "Virtus mask", points: 18 },
          { item: "Virtus robe top", points: 18 },
          { item: "Virtus robe bottom", points: 18 },
          { item: "Any DT2 boss quartz", points: 12 },
          { item: "Any Soulreaper axe piece", points: 20 }
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
          { item: "Ghrazi rapier", points: 25 },
          { item: "Avernic defender hilt", points: 15 },
          { item: "Justiciar faceguard", points: 12 },
          { item: "Justiciar chestguard", points: 12 },
          { item: "Justiciar legguards", points: 12 }
        ]
      },
      {
        name: "Grotesque Guardians",
        drops: [
          { item: "Granite gloves", points: 6 },
          { item: "Granite ring", points: 6 },
          { item: "Granite hammer", points: 8 },
          { item: "Black tourmaline core", points: 10 },
          { item: "Jar of stone", points: 8 }
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
          { item: "Fire cape", points: 10 },
          { item: "Infernal cape", points: 30 }
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
          { item: "Masori body", points: 25 },
          { item: "Masori chaps", points: 25 },
          { item: "Masori mask", points: 20 },
          { item: "Osmumten's fang", points: 15 },
          { item: "Lightbearer", points: 10 },
          { item: "Elidinis' ward", points: 10 },
          { item: "Thread of elidinis", points: 5 }
        ]
      }
    ]
  }
};

/* =========================
   DOM
========================= */
const infoPanel = document.getElementById("infoPanel");
const ownerZones = document.querySelectorAll(".owner-zone");

/* =========================
   FIRESTORE LIVE LISTENER
========================= */
onSnapshot(stateRef, (snapshot) => {
  if (snapshot.exists()) {
    territoryOwners = snapshot.data();
    applyOwnershipColors();

    if (selectedRegion) {
      displayRegionInfo(selectedRegion);
    }
  }
});

/* =========================
   MAP EVENTS
========================= */
ownerZones.forEach((zone) => {
  zone.addEventListener("mouseenter", () => {
    selectedRegion = zone.dataset.region;
    displayRegionInfo(selectedRegion);
  });

  zone.addEventListener("click", () => {
    selectedRegion = zone.dataset.region;
    displayRegionInfo(selectedRegion);
  });
});

/* =========================
   OWNERSHIP COLORS
========================= */
function applyOwnershipColors() {
  ownerZones.forEach((zone) => {
    const regionKey = zone.dataset.region;
    const owner = territoryOwners[regionKey] || "neutral";

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
   FIRESTORE UPDATE
========================= */
async function setOwner(regionKey, owner) {
  try {
    await updateDoc(stateRef, {
      [regionKey]: owner
    });
  } catch (error) {
    console.error("Error updating owner:", error);
    alert("Failed to update territory owner.");
  }
}

window.setOwner = setOwner;

/* =========================
   INFO PANEL RENDER
========================= */
function displayRegionInfo(regionKey) {
  const region = regions[regionKey];

  if (!region) {
    infoPanel.innerHTML = `
      <h2>Region Not Found</h2>
      <p>No data exists for this territory yet.</p>
    `;
    return;
  }

  const owner = territoryOwners[regionKey] || "neutral";
  const ownerName = teams[owner] || "Neutral";

  const totalPoints = region.bosses.reduce((sum, boss) => {
    return sum + boss.drops.reduce((dropSum, drop) => dropSum + drop.points, 0);
  }, 0);

  let html = `
    <h2>${region.name}</h2>
    <p class="owner-label ${owner}">Owner: ${ownerName}</p>

    <div class="owner-controls">
      <button onclick="setOwner('${regionKey}', 'neutral')">Neutral</button>
      <button onclick="setOwner('${regionKey}', 'team1')">Team 1</button>
      <button onclick="setOwner('${regionKey}', 'team2')">Team 2</button>
      <button onclick="setOwner('${regionKey}', 'team3')">Team 3</button>
      <button onclick="setOwner('${regionKey}', 'team4')">Team 4</button>
    </div>

    <p class="region-total">Total listed points: ${totalPoints}</p>
  `;

  region.bosses.forEach((boss) => {
    html += `
      <div class="boss">
        <h3>${boss.name}</h3>
        <ul class="drop-list">
          ${boss.drops
            .map((drop) => `<li>${drop.item} — ${drop.points} pts</li>`)
            .join("")}
        </ul>
      </div>
    `;
  });

  infoPanel.innerHTML = html;
}
