import React, { Component } from "react";
import Row from "./Row";
import GameList from "./GameList";
import Leaders from "./Leaders";
import Room from "./Room";

//fill this with loot
let gameStore = [];

const FOUNTAIN = ["max heal", "monster", "level-up", "healing potion"];

const COBWEBS = [
  "level-up",
  "level-up",
  "level-up",
  "monster",
  "monster",
  "monster",
];

const STATUE = [
  "monster",
  "monster",
  "monster",
  "monster",
  "monster",
  "treasure",
  "healing potion",
  "max_heal",
  "level-up",
  "stairs",
];

const TOMB = [
  "healing potion",
  "healing potion",
  "monster",
  "monster",
  "monster",
  "treasure",
  "treasure",
  "stairs",
  "treasure",
];

const STAIRS = ["stairs", "stairs", "stairs", "stairs", "monster"];

const ENTRANCE = ["monster"];

const LOCATIONS = {
  stairs: STAIRS,
  tomb: TOMB,
  fountain: FOUNTAIN,
  statue: STATUE,
  cobwebs: COBWEBS,
  entrance: ENTRANCE,
};

const LOCNAMES = ["stairs", "tomb", "fountain", "statue", "cobwebs"];

/*
1d6+3 hp

XP: use WWN table

Stats: 

Rooms:
Random enemy


Actions:
Go Forward
Attack


*/

function getInitialState() {
  return {
    /*
    state has:
    random monster
    current health

    */

    currentLocation: "entrance",
    currentDetails: "SEARCH not here. Outside the Labyrinth, there are only Monsters.",
    currentHealth: 8,
    maxHealth: 8,
    level: 1,
    dungeonLevel: 1,
    leveledUp: false,
    ascendPossible: false,
    currentMonster: null,
    /*
    Original code below, left functional
    */

    rows: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    turn: "X",
    winner: undefined,
    gameList: gameStore,
  };
}

function checkWin(rows) {
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const flattened = rows.reduce((acc, row) => acc.concat(row), []);

  return combos.find(
    (combo) =>
      flattened[combo[0]] !== "" &&
      flattened[combo[0]] === flattened[combo[1]] &&
      flattened[combo[1]] === flattened[combo[2]]
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = getInitialState();
  }
  //returns a monster object: hp, name
  setMonster() {
    const MONSTERS = ["Minotaur", "Dragon", "Bunyip", "Gorgon"];
    // const ATTACKS = [
    //   (state) => {number - (1+Math.floor(Math.random(this.state.dungeonLevel/2)))},
    //   "Dragon",
    //   "Bunyip",
    //   "Gorgon",
    // ];
    const name = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    const hp = this.rollDice(this.state.dungeonLevel);
    this.setState({
      currentMonster: { name, hp },
    });
  }
  //get a random new destination
  getRandomLocation(newDetails) {
    if (!this.state.currentMonster) {
      let getLocation = function (obj) {
        var keys = Object.keys(obj);
        return obj[keys[(keys.length * Math.random()) << 0]];
      };
      // const newPath = LOCATIONS[location][Math.floor(Math.random()*LOCATIONS[location].length)];
      this.setState({
        currentLocation: getLocation(LOCNAMES),
        currentDetails: newDetails,
      });
    }
  }
  handleClick(row, square) {
    let { turn, winner } = this.state;
    const { rows } = this.state;
    const squareInQuestion = rows[row][square];

    if (this.state.winner) return;
    if (squareInQuestion) return;

    rows[row][square] = turn;
    turn = turn === "X" ? "O" : "X";
    winner = checkWin(rows);

    this.setState({
      rows,
      turn,
      winner,
    });
  }

  //roll an event from the destination table
  getEvent(location) {
    let getRandomEvent = function (obj) {
      var keys = Object.keys(obj);
      return obj[keys[(keys.length * Math.random()) << 0]];
    };
    if (null === this.state.currentMonster) {
      // const newPath = LOCATIONS[location][Math.floor(Math.random()*LOCATIONS[location].length)];
      const currentEvent = getRandomEvent(LOCATIONS[location]);

      console.log(location + " generates random events!");
      console.log(currentEvent + " was generated!");
      switch (currentEvent) {
        case "stairs":
          this.setState({
            ascendPossible: true,
            currentDetails:
              "You find yourself gazing up a grand staircase - was it there a moment ago? You may ASCEND here to proceed upwards.",
          });
          break;
        case "healing potion":
          this.setState({
            currentHealth: Math.min(
              this.state.currentHealth + Math.floor(Math.random() * 6) + 1,
              this.state.maxHealth
            ),
            currentDetails:
              "There is a cot here, not quite yet fallen to ruin and mold. You rest a little. A small respite will do you good.",
          });
          break;
        case "treasure":
          this.setState({
            currentDetails: "Trinkles and baubles.",
          });
          break;
        case "max heal":
          this.setState({
            currentHealth: this.state.maxHealth + 0,
            currentDetails:
              "From an area bathed in strange light, you disturb a flutter of butterflies hidden within. You feel intensely regenerated!",
          });
          break;
        case "monster":
          this.setState({
            currentDetails:
              "A growl pursues you from the dark. You draw your blade and stare into the shadows.",
          });
          this.setMonster();
          break;
        case "level-up":
          if (!this.state.leveledUp) {
            this.setState({
              level: this.state.level + 1,
              leveledUp: true,
              currentDetails:
                "A dust-cloaked wraith clings to you as you walk. It whispers of ancient secrets and forbidden lore, the power you came to this desolate region to seek.",
            });
            this.recalculateMaxHP();
          } else {
            this.setState({
              currentDetails:
                "You search, but find only the dismal silence of abandonment.",
            });
          }

          break;
        default:
          this.setState({
            currentDetails:
              "You search, but find only the dismal silence of abandonment.",
          });
      }
    }
  }

  recalculateMaxHP() {
    this.setState({
      maxHealth: Math.max(
        this.state.maxHealth + 1,
        this.rollDice(this.state.level)
      ),
    });
  }

  rollPlayerDamage() {
    return this.rollDice(1) + this.state.level;
  }

  rollMonsterDamage() {
    return Math.max(1, this.rollDice(1) + this.state.dungeonLevel - 3);
  }

  rollDice(count) {
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += Math.floor(Math.random() * 8);
    }
    return sum;
  }

  resolveRound() {
    const playerDamage = this.rollPlayerDamage();
    const monsterDamage = this.rollMonsterDamage();
    let updatedMonster = {
      name: this.state.currentMonster.name,
      hp: this.state.currentMonster.hp - playerDamage,
    };

    let updateString = `You strike a mighty blow! ( ${playerDamage} ) 
    The ${this.state.currentMonster.name} counterattacks with its own horrible claws! ( ${monsterDamage} ) 
    `;

    if (updatedMonster.hp <= 0) {
      updateString += `Slain at last, the loathsome enemy falls! `;
      updatedMonster = null;
    }

    if (this.state.currentHealth - monsterDamage <= 0) {
      updateString += `Sadly, you are mortally wounded. Your journey ends... `;
    }
    this.setState({
      currentHealth: this.state.currentHealth - monsterDamage,
      currentMonster: updatedMonster,
      currentDetails: updateString,
    });
  }

  ascend() {
    console.log("attempting ascension " + this.state.ascendPossible);
    if (this.state.ascendPossible) {
      this.setState({
        dungeonLevel: this.state.dungeonLevel + 1,
        leveledUp: false,
        ascendPossible: false,
      });
      this.getRandomLocation("Despite the trepidation, you proceed upwards.");
    }
  }

  render() {
    const { rows, turn, winner, gameList } = this.state;

    let infoDiv;

    if (this.state.currentMonster !== null) {
      infoDiv = (
        <div>
          <div>
            Current HP: {this.state.currentHealth} / {this.state.maxHealth}
            <p />
            You are a Level {this.state.level} Wanderer.
            <p />
            You are on Level {this.state.dungeonLevel} of the dungeon.
            <p />A glaring {this.state.currentMonster.name} of the dungeon faces
            you! ( {this.state.currentMonster.hp} in strength!).
          </div>
        </div>
      );
    } else {
      infoDiv = (
        <div>
          <div>
            Current HP: {this.state.currentHealth} / {this.state.maxHealth}
            <p />
            You are a Level {this.state.level} Wanderer.
            <p />
            You are on Level {this.state.dungeonLevel} of the dungeon.
          </div>
        </div>
      );
    }

    let movementButtons;

    if (this.state.currentHealth > 0) {
      movementButtons = (
        <div>
          <button class="nav-button" id="ascend" onClick={() => this.ascend()}>
            Ascend
          </button>
          <button
            id="search"
            class="nav-button"
            onClick={() => this.getEvent(this.state.currentLocation)}
          >
            Search
          </button>
          <button
            id="flee"
            class="nav-button"
            onClick={() => this.getRandomLocation("")}
          >
            Sneak forward
          </button>
          <button
            id="attack"
            class="nav-button"
            onClick={() => this.resolveRound()}
          >
            Attack!
          </button>
        </div>
      );
    } else {
      movementButtons = (
        <div>
          A corpse can no longer proceed.
          <button
            id="reset"
            class="death-button"
            onClick={() => this.setState(getInitialState())}
          >
            Reset Game
          </button>
        </div>
      );
    }

    return (
      <div>
        {movementButtons}
        {infoDiv}
        <div id="board">
          <Room
            locationName={this.state.currentLocation}
            letters={this.state.currentDetails}
          />
        </div>
        <div>
          SEARCH for treasure, succor, or the way up, but beware Monsters - then
          your only option is to FIGHT
        </div>
        <p />
        <div>
          Mislike the room? Then SNEAK through it in search of greener pastures.
        </div>
      </div>
    );
  }
}

export default App;
