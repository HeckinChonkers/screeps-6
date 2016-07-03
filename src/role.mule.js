/* jshint esversion:6 */

var utils = require('utils');

var mule = {
  run: function (creep) {
    var storage = creep.room.storage,
      neConts = utils.containers('nEmpty');
    utils.cFullCheck(creep);

    if (creep.memory.fullCheck) {
      dropE(creep);
    } else {
      getE(creep);
    }

    function deliver(creep, target) {
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }

    function dropE(creep) {
      var towers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_TOWER) &&
            structure.energy < Math.round(structure.energyCapacity * 0.95);
        }
      });

      if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
        var spawners = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN) &&
              structure.energy < structure.energyCapacity;
          }
        });
        var closestSpawner = creep.pos.findClosestByRange(spawners);
        deliver(creep, closestSpawner);
      } else if (towers.length > 0) {
        deliver(creep, towers[0]);
      } else {
        deliver(creep, storage);
      }
    }

    function getE(creep) {
      if (neConts.length > 0) {
        var nearCont = creep.pos.findClosestByPath(neConts);
        if (nearCont.transfer(creep, 'energy') === ERR_NOT_IN_RANGE) {
          creep.moveTo(nearCont);
        }
      } else {
        var fullHarvesters = creep.room.find(FIND_MY_CREEPS, {
          filter: (creep) => {
            return creep.memory.role === 'harvester' && _.sum(creep.carry) === creep.carryCapacity;
          }
        });

        if (creep.room.find(FIND_DROPPED_ENERGY).length > 0) {
          var drop = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
          if (creep.pickup(drop) === ERR_NOT_IN_RANGE) {
            creep.moveTo(drop);
          }
        } else if (fullHarvesters.length > 0) {
          creep.moveTo(fullHarvesters[0]);
        } else if (Game.flags.mules.length > 0) {
          creep.moveTo(Game.flags.mules);
        }
      }
    }
  }
};

module.exports = mule;
