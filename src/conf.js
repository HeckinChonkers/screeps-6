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
      0: [WORK, CARRY, MOVE], //0:200|300
      1: [WORK, CARRY, MOVE],//1:200|350
      2: [WORK, WORK, CARRY, MOVE], //2:300|400
      3: [WORK, WORK, CARRY, MOVE, MOVE], //3:350|450
      4: [WORK, WORK, WORK, CARRY, MOVE, MOVE], //4:450|500
      5: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], //5:500|550
      6: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], //6:500|600
      7: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], //7:600|650
      8: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], //8:650|700
      9: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //9:700|750
      10: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //10:800|800
      11: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //11:800|850
      12: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //12:850|900
      13: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //13:900|950
      14: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //14:900|1000
      15: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] //15:1000|1050 */
    }
  }
};

module.exports = conf;
