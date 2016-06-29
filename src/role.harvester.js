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

      var spawners = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
              structure.energy < structure.energyCapacity;
        }
      });
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_STORAGE ||
              structure.structureType == STRUCTURE_TOWER) &&
              structure.energy < structure.energyCapacity;
        }
      });
      if (spawners.length > 0) {
        var closestS = creep.pos.findClosestByPath(targets);
        if (creep.transfer(closestS, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestS);
        }
      } else if (targets.length > 0) {
        var closestT = creep.pos.findClosestByPath(targets);
        if (creep.transfer(closestT, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestT);
        }
      } else if (utils.containers('nFull', creep).length > 0) {
        var cloNFC = creep.pos.findClosestByPath(utils.containers('nFull', creep));
        if (creep.transfer(cloNFC, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(cloNFC);
        }
      } else if (_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
        if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.storage);
        }
      }
    }
  }
};

module.exports = roleHarvester;
