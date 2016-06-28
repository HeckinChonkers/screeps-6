/* jshint esversion:6 */

var roleHarvester = require('role.harvester'),
  roleUpgrader = require('role.upgrader'),
  roleBuilder = require('role.builder'),
  roleTower = require('role.tower'),
  spawner = require('spawner'),
  utils = require('utils');

module.exports.loop = function() {

  var myRoom = Game.spawns.Spawn1.room;

  utils._gtcCount();
  utils.clearMem();

  if (Game.spawns.Spawn1.energy >= 200) {
    spawner.controller();
  }

  // roleTower._init();


  for (var cName in Game.creeps) {
    var creep = Game.creeps[cName];


    if (creep.memory.role === 'harvester') {
      if (myRoom.energyAvailable === myRoom.energyCapacityAvailable && utils.containers(
          'nFull', creep).length === 0) {
        roleUpgrader.run(creep);
      } else {
        roleHarvester.run(creep);
      }
    }

    if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep);
    }

    if (creep.memory.role === 'builder') {
      if (spawner.needCreeps('harvester')) {
        roleHarvester.run(creep);
      } else {
        roleBuilder.run(creep);
      }
    }
  }
};
