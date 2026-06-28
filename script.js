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
  team1: "Team 1",
  team2: "Team 2",
  team3: "Team 3",
  team4: "Team 4"
};

const teamOrder = ["team1", "team2", "team3", "team4"];

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
          { item: "Elder maul", points: 32 },
          { item: "Dragon hunter crossbow", points: 25 },
          { item: "Ancestral robe top", points: 24 },
          { item: "Ancestral robe bottom", points: 24 },
          { item: "Dragon claws", points: 22 },
          { item: "Ancestral hat", points: 18 },
          { item: "Dinh's bulwark", points: 15 },
          { item: "Dexterous prayer scroll", points: 15 },
          { item: "Arcane prayer scroll", points: 15 },
          { item: "Twisted buckler", points: 15 }
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
      },
      {
        name: "Vardorvis",
        drops: [
          { item: "Ultor vestige", points: 25 },
          { item: "Executioner's axe head", points: 22 },
          { item: "Virtus mask", points: 18 },
          { item: "Virtus robe top", points: 18 },
          { item: "Virtus robe bottom", points: 18 },
          { item: "Blood quartz", points: 12 },
          { item: "Chromium ingot", points: 8 }
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
          { item: "Moons piece", points: 6 }
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
          { item: "Skeletal visage", points: 25 },
          { item: "Draconic visage", points: 22 },
          { item: "Jar of decay", points: 12 },
          { item: "Vorkath's head", points: 8 }
        ]
      },
      {
        name: "Dagannoth Kings",
        drops: [
          { item: "Berserker ring", points: 10 },
          { item: "Archers ring", points: 10 },
          { item: "Seers ring", points: 10 },
          { item: "Warrior ring", points: 10 },
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
      },
      {
        name: "Duke Sucellus",
        drops: [
          { item: "Magus vestige", points: 25 },
          { item: "Eye of the duke", points: 22 },
          { item: "Virtus mask", points: 18 },
          { item: "Virtus robe top", points: 18 },
          { item: "Virtus robe bottom", points: 18 },
          { item: "Ice quartz", points: 12 },
          { item: "Chromium ingot", points: 8 }
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
          { item: "Draconic visage", points: 25 },
          { item: "Kbd heads", points: 8 }
        ]
      },
      {
        name: "Callisto / Artio",
        drops: [
          { item: "Voidwaker hilt", points: 30 },
          { item: "Tyrannical ring", points: 12 },
          { item: "Dragon pickaxe", points: 10 },
          { item: "Dragon 2h sword", points: 6 }
        ]
      },
      {
        name: "Vet'ion / Calvar'ion",
        drops: [
          { item: "Voidwaker blade", points: 30 },
          { item: "Ring of the gods", points: 12 },
          { item: "Dragon pickaxe", points: 10 },
          { item: "Dragon 2h sword", points: 6 }
        ]
      },
      {
        name: "Venenatis / Spindel",
        drops: [
          { item: "Voidwaker gem", points: 30 },
          { item: "Treasonous ring", points: 12 },
          { item: "Dragon pickaxe", points: 10 },
          { item: "Dragon 2h sword", points: 6 }
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
          { item: "Kraken tentacle", points: 10 },
          { item: "Trident of the seas", points: 8 },
          { item: "Jar of dirt", points: 8 }
        ]
      },
      {
        name: "Thermonuclear Smoke Devil",
        drops: [
          { item: "Occult necklace", points: 12 },
          { item: "Smoke battlestaff", points: 8 },
          { item: "Jar of smoke", points: 8 }
        ]
      },
      {
        name: "Demonic Gorillas",
        drops: [
          { item: "Zenyte shard", points: 18 },
          { item: "Ballista piece", points: 8 },
          { item: "Ballista spring", points: 8 },
          { item: "Ballista limbs", points: 8 }
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
      },
      {
        name: "The Whisperer",
        drops: [
          { item: "Bellator vestige", points: 25 },
          { item: "Siren's staff", points: 22 },
          { item: "Virtus mask", points: 18 },
          { item: "Virtus robe top", points: 18 },
          { item: "Virtus robe bottom", points: 18 },
          { item: "Shadow quartz", points: 12 },
          { item: "Chromium ingot", points: 8 }
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
      name: "Tormented Demons",
      drops: [
        { item: "Tormented synapse", points: 20 },
        { item: "Burning claw", points: 10 }
      ]
    },
    {
      name: "The Leviathan",
      drops: [
        { item: "Venator vestige", points: 25 },
        { item: "Leviathan's lure", points: 22 },
        { item: "Virtus mask", points: 18 },
        { item: "Virtus robe top", points: 18 },
        { item: "Virtus robe bottom", points: 18 },
        { item: "Smoke quartz", points: 12 },
        { item: "Chromium ingot", points: 8 }
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
        { item: "Sanguinesti staff", points: 35 },
        { item: "Ghrazi rapier", points: 30 },
        { item: "Avernic defender hilt", points: 20 },
        { item: "Justiciar piece", points: 15 }
      ]
    },
    {
      name: "Grotesque Guardians",
      drops: [
        { item: "Black tourmaline core", points: 10 },
        { item: "Granite hammer", points: 8 },
        { item: "Granite gloves", points: 6 },
        { item: "Granite ring", points: 6 },
        { item: "Jar of stone", points: 8 }
      ]
    },
    {
      name: "Araxxor",
      drops: [
        { item: "Noxious halberd piece", points: 18 },
        { item: "Amulet of rancour", points: 18 },
        { item: "Araxyte venom sack", points: 8 }
      ]
    }
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

  karamja: {
    name: "Karamja",
    bosses: [
      {
        name: "TzHaar Challenges",
        drops: [
          { item: "Fire cape", points: 10 },
          { item: "Infernal cape", points: 35 }
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
          { item: "Masori piece", points: 20 },
          { item: "Osmumten's fang", points: 18 },
          { item: "Lightbearer", points: 15 },
          { item: "Elidinis' ward", points: 15 },
          { item: "Thread of elidinis", points: 8 }
        ]
      },
      {
        name: "Kalphite Queen",
        drops: [
          { item: "Dragon chainbody", points: 8 },
          { item: "Dragon 2h sword", points: 8 },
          { item: "Kq head", points: 6 }
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
