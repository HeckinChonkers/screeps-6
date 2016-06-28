/* jshint esversion:6 */

var roleHarvester = require('role.harvester'),
  roleUpgrader = require('role.upgrader'),
  roleBuilder = require('role.builder'),
  spawner = require('spawner'),
  utils = require('utils');

module.exports.loop = function() {

  // var tower = Game.getObjectById('id943380');
  // if (tower) {
  //   var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
  //       filter: (structure) => structure.hits < structure.hitsMax
  // })
  //   ;
  //   if (closestDamagedStructure) {
  //     tower.repair(closestDamagedStructure);
  //   }
  //
  //   var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  //   if (closestHostile) {
  //     tower.attack(closestHostile);
  //   }
  // }
  utils._gtcCount();
  utils.clearMem();
  console.log(utils.GTC());

  var myRoom = Game.spawns.Spawn1.room;

  if (Game.spawns.Spawn1.energy >= 200) {
    spawner.controller();
  }


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
