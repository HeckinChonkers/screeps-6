/* jshint esversion:6 */

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var spawner = require('spawner');
var utils = require('utils');

var roleBuilder = {

  /** @param {Creep} creep **/
  run: function (creep) {

    utils.cFullCheck(creep);
    
    if (creep.memory.fullCheck) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        creep.memory.currentTask = 'build';
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      } else {
        creep.memory.currentTask = 'repair';
        utils.cRepair(creep);
      }
    } else {
      creep.memory.currentTask = 'refill';
      if (Boolean(creep.room.storage) && creep.room.storage.store.energy >= creep.carryCapacity) {
        if (creep.room.storage.transfer(creep, 'energy') === ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.storage);
        }
      } else if (utils.containers('nEmpty', creep).length > 0) {
        if (utils.containers('nEmpty', creep)[0].transfer(creep, 'energy') === ERR_NOT_IN_RANGE) {
          creep.moveTo(utils.containers('nEmpty', creep)[0]);
        }
      } else if (Game.spawns.Spawn1.energy > 200 &&
        !spawner.needCreeps('harvester') &&
        !spawner.needCreeps('upgrader') &&
        utils.containers('all').length === 0) {
        if (Game.spawns.Spawn1.transferEnergy(creep) === ERR_NOT_IN_RANGE) {
          creep.moveTo(Game.spawns.Spawn1);
        }
      } else {
        utils.cHarvest(creep);
      }
    }
  }
};

module.exports = roleBuilder;
