/*jshint esversion:6*/

var conf = {

  statusTimer: 100,

  workers: {
    mule: 1,
    upgrader: 1,
    builder: 1,
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
      200: [WORK, CARRY, MOVE],
      300: [WORK, WORK, CARRY, MOVE],
      400: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      500: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      600: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      700: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      800: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      900: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      1000: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      1100: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1200: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1300: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },

    mules: {
      200: [CARRY, MOVE],
      300: [CARRY, CARRY, MOVE, MOVE],
      400: [CARRY, CARRY, MOVE, MOVE, MOVE],
      500: [CARRY, CARRY, MOVE, MOVE, MOVE],
      600: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      700: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      800: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    }
  }
};

module.exports = conf;
