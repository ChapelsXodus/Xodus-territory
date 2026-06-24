* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #111;
  color: #f5e6b8;
  font-family: Arial, sans-serif;
}

header {
  text-align: center;
  padding: 18px;
  background: #1b1b1b;
  border-bottom: 2px solid #c89b3c;
}

header h1 {
  margin: 0;
  color: #f1c75b;
}

header p {
  margin-top: 6px;
  color: #ddd;
  font-size: 0.95rem;
}

.map-layout {
  display: flex;
  gap: 20px;
  padding: 20px;
  align-items: flex-start;
}

.map-container {
  position: relative;
  width: 72%;
  max-width: 1200px;
  border: 3px solid #c89b3c;
  background: #000;
  flex-shrink: 0;
}

.world-map {
  width: 100%;
  height: auto;
  display: block;
}

.owner-zone {
  position: absolute;
  cursor: pointer;
  background: transparent;
  border: 2px solid transparent;
  transition: 0.2s ease;
}

.owner-zone:hover {
  border-color: rgba(241, 199, 91, 0.8);
  box-shadow: 0 0 10px rgba(241, 199, 91, 0.7);
}

.owner-neutral {
  background: transparent;
}

.owner-team1 {
  background: rgba(0, 120, 255, 0.25);
}

.owner-team2 {
  background: rgba(255, 50, 50, 0.25);
}

.owner-team3 {
  background: rgba(60, 220, 100, 0.25);
}

.owner-team4 {
  background: rgba(180, 80, 255, 0.25);
}

.great-kourend {
  top: 6%;
  left: 7%;
  width: 22%;
  height: 32%;
}

.kebos-lowlands {
  top: 22%;
  left: 1%;
  width: 13%;
  height: 28%;
}

.varlamore {
  top: 51%;
  left: 2%;
  width: 23%;
  height: 25%;
}

.fremennik {
  top: 11%;
  left: 39%;
  width: 20%;
  height: 25%;
}

.wilderness {
  top: 6%;
  left: 58%;
  width: 26%;
  height: 33%;
}

.tirannwn {
  top: 40%;
  left: 32%;
  width: 14%;
  height: 28%;
}

.kandarin {
  top: 36%;
  left: 44%;
  width: 16%;
  height: 32%;
}

.asgarnia {
  top: 36%;
  left: 57%;
  width: 16%;
  height: 27%;
}

.misthalin {
  top: 36%;
  left: 70%;
  width: 16%;
  height: 27%;
}

.morytania {
  top: 36%;
  left: 83%;
  width: 15%;
  height: 27%;
}

.karamja {
  top: 62%;
  left: 54%;
  width: 18%;
  height: 20%;
}

.desert {
  top: 61%;
  left: 70%;
  width: 20%;
  height: 31%;
}

.info-panel {
  width: 28%;
  min-width: 330px;
  background: #1b1b1b;
  border: 2px solid #c89b3c;
  padding: 12px;
  max-height: 84vh;
  overflow-y: auto;
  font-size: 0.82rem;
}

.info-panel h2 {
  color: #f1c75b;
  margin-top: 0;
  margin-bottom: 6px;
  font-size: 1.25rem;
}

.info-panel p {
  color: #ddd;
  margin-top: 0;
}

.owner-label {
  font-weight: bold;
  margin-bottom: 6px;
}

.owner-label.neutral {
  color: #aaa;
}

.owner-label.team1 {
  color: #4aa3ff;
}

.owner-label.team2 {
  color: #ff6666;
}

.owner-label.team3 {
  color: #62e68d;
}

.owner-label.team4 {
  color: #c77dff;
}

.owner-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin: 10px 0 12px;
}

.owner-controls button {
  background: #222;
  color: #f5e6b8;
  border: 1px solid #c89b3c;
  padding: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}

.owner-controls button:hover {
  background: #333;
}

.region-total {
  color: #b56cff;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.boss {
  margin-top: 8px;
  padding-top: 7px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.boss:first-of-type {
  border-top: none;
  padding-top: 0;
}

.boss h3 {
  margin: 0 0 4px 0;
  color: #fff;
  font-size: 0.92rem;
}

.drop-list {
  margin: 0;
  padding-left: 15px;
}

.drop-list li {
  margin-bottom: 2px;
  line-height: 1.18;
}
