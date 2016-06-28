/* jshint esversion:6 */

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util');
 * mod.thing == 'a thing'; // true
 */
conf = require('conf');

var utils = {

  cLog: function(input) {
    console.log(JSON.stringify(input));
  },

  // tote Creeps aus dem Memory löschen
  clearMem: function() {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  },


  cFullCheck: function(creep) {
    if (creep.memory.fullCheck && creep.carry.energy === 0) {
      creep.memory.fullCheck = false;
    }
    if (!creep.memory.fullCheck && creep.carry.energy === creep.carryCapacity) {
      creep.memory.fullCheck = true;
    }
  },

  // Energie-Ernte für unterschiedliche Rollen
  cHarvest: function(creep) {
    var target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (creep.memory.role === 'upgrader' || creep.memory.role === 'builder') {
      target = creep.room.find(FIND_SOURCES)[0];
    }
    if (target) {
      if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
  },

  // Reparatur mit Prioritäten
  cRepair: function(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: object => object.hits < object.hitsMax
    });
    targets.sort((a, b) => a.hits - b.hits);

    // ToDo: Clusterfuck auflösen
    var walls = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_WALL;
      }
    });
    walls.sort((a, b) => a.hits - b.hits);

    var roads = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_ROAD &&
          structure.hits < Math.round(structure.hitsMax * 0.7);
      }
    });
    roads.sort((a, b) => a.hits - b.hits);

    var containers = _.filter(utils.containers('all'), (c) => c.hits <=
      Math.round(c.hitsMax * 0.9));
    containers.sort((a, b) => a.hits - b.hits);

    // ToDo: Clusterfuck auflösen
    if (containers.length) {
      console.log('containersToRepair: ' + containers.length + ', ' +
        containers[0].hits + '|' + containers[0].hitsMax);
      if (creep.repair(containers[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(containers[0]);
      }
    } else if (roads.length) {
      console.log('roadsToRepair: ' + roads.length + ', ' + roads[0].hits +
        '|' + roads[0].hitsMax);
      if (creep.repair(roads[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(roads[0]);
      }
    } else {
      if (targets.length > 0) {
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    }
  },

  // non-empty-Containers

  containers: function(type, creep) {
    /*
     * 'all'/() -> alle
     * 'empty' -> empty
     * 'full'  -> Full
     * nEmpty  -> not Empty
     * nFull   -> not Full
     */
    var _type = type || 'all',
      myRoom = creep ? creep.room : Game.spawns.Spawn1.room,
      conts = myRoom.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_CONTAINER);
        }
      });
    switch (_type) {
      case 'full':
        return _.filter(conts, (c) => _.sum(c.store) === c.storeCapacity);
      case 'nFull':
        return _.filter(conts, (c) => _.sum(c.store) < c.storeCapacity);
      case 'empty':
        return _.filter(conts, (c) => _.sum(c.store) === 0);
      case 'nEmpty':
        return _.filter(conts, (c) => _.sum(c.store) > 0);
      case 'all':
        return conts;
    }
  },

  status: function() {
    if (utils.GTC() % conf.statusTimer === 0) {
      console.log('ping');
    }
  },

  // Global Tick Counter
  _gtcCount: function() {
    var _gtc = Memory.GTC || 0;
    _gtc++;
    Memory.GTC = _gtc;
  },
  GTC: function(stuff) {
    return Memory.GTC;
  }
};

module.exports = utils;
