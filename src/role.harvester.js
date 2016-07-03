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
  run: function (creep) {
    creep.memory.currentTask = 'harvest';

    utils.cFullCheck(creep);

    if (!creep.memory.fullCheck) {
      utils.cHarvest(creep);
    } else {
      var target;

      // wenn Mules gespawnt sind, entfÃ¤llt die ganze Ziel-Suche
      if (Game.creeps, (creep) => creep.memory.role === 'mule') {
        var muleCapa = creep.room.find(FIND_MY_CREEPS, {
          filter: (creep) => {
            return (creep.memory.role === 'mule' && _.sum(creep.carry) < creep.carryCapacity);
          }
        });

        if (muleCapa.length === 0) {
          creep.say('no mules!');
          creep.drop(RESOURCE_ENERGY);
        } else {
          var closestMule = creep.pos.findClosestByRange(muleCapa);
          if (creep.transfer(closestMule, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(closestMule);
          }
        }
      }
      // Wenn keine Mules gespawnt sind, liefern harvester die E selbst ab
      else {
        if (!creep.memory.currentTarget || creep.memory.currentTarget === 0) {
          var spawners = creep.room.find(FIND_STRUCTURES, {

          });
          var towers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < Math.round(structure.energyCapacity * 0.95);
            }
          });
          var allTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_STORAGE ||
                  structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < Math.round(structure.energyCapacity * 0.95);
            }
          });
          if (spawners.length > 0) {
            creep.memory.currentTarget = creep.pos.findClosestByPath(spawners).id;
          } else {
            if (allTargets.length > 0) {
              creep.memory.currentTarget = creep.pos.findClosestByPath(allTargets).id;
            } else if (utils.containers('nFull', creep).length > 0) {
              creep.memory.currentTarget = creep.pos.findClosestByRange(utils.containers('nFull', creep)).id;
            } else if (_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
              creep.memory.currentTarget = creep.room.storage.id;
            }
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
  }
};

module.exports = roleHarvester;
