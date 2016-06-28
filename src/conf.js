/*jshint esversion:6*/

var conf = {

  statusTimer: 100,

  workers: {
    builder: 1,
    upgrader: 2,
    harvester: 3
  },

  repairPrio: {
    STRUCTURE_ROAD: 0.7,
    STRUCTURE_CONTAINER: 0.9
  },

  creepBodies: {
    // TOUGH          10
    // MOVE           50
    // CARRY          50
    // ATTACK         80
    // WORK           100
    // RANGED_ATTACK  150
    // HEAL           200
    workers: {
      0: [WORK, CARRY, MOVE], //200|300
      1: [WORK, CARRY, MOVE], //200|350
      2: [WORK, WORK, CARRY, MOVE], //300|400
      3: [WORK, WORK, CARRY, MOVE, MOVE], //350|450
      4: [WORK, WORK, WORK, CARRY, MOVE, MOVE], //450|500
      5: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], //500|550
      6: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], //500|600
      7: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], //600|650
      8: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], //650|700
      9: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //700|750
      10: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] //800|800
    }
  }

};

module.exports = conf;
