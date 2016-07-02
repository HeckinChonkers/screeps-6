/* jshint esversion:6 */

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var utils = require('utils');

var roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {
    creep.memory.currentTask = 'harvest';

    utils.cFullCheck(creep);

    if (!creep.memory.fullCheck) {
      utils.cHarvest(creep);
    } else {
      var target;

      if (!creep.memory.currentTarget || creep.memory.currentTarget === 0) {
        var spawners = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
              structure.energy < structure.energyCapacity;
          }
        });
        var allTargets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE ||
              structure.structureType == STRUCTURE_TOWER) &&
              structure.energy < Math.round(structure.energyCapacity*0.95);
          }
        });

        if (spawners.length > 0) {
          creep.memory.currentTarget = creep.pos.findClosestByPath(spawners).id;
        } else if (allTargets.length > 0) {
          creep.memory.currentTarget = creep.pos.findClosestByPath(allTargets).id;
        } else if (utils.containers('nFull', creep).length > 0) {
          creep.memory.currentTarget = creep.pos.findClosestByRange(utils.containers('nFull', creep)).id;
        } else if (_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
          creep.memory.currentTarget = creep.room.storage.id;
        }

      } else {
        target = Game.getObjectById(creep.memory.currentTarget);
        if ((target.structureType === STRUCTURE_STORAGE && _.sum(target.store) === target.storeCapacity) ||
            (target.energy === target.energyCapacity)) {
          creep.memory.currentTarget = '';
        }
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }



    }
  }
};

module.exports = roleHarvester;
