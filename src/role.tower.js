/* jshint esversion:6 */

var roleTower = {

  _init: function() {
    var towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_TOWER;
      }
    });

    if (towers.length > 0) {
      for (var tower in towers) {
        roleTower.towerControl(tower);
      }
    }
  },

  towerControl: function(tower) {

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS),
      closestDamagedStructure = tower.pos.findClosestByRange(
        FIND_STRUCTURES, {
          filter: (structure) => structure.hits < structure.hitsMax
        });

    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }
};

module.exports = roleTower;
