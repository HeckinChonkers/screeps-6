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

  cLog: function (input) {
    console.log(JSON.stringify(input));
  },

  // tote Creeps aus dem Memory loeschen
  clearMem: function () {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  },

  cFullCheck: function (creep) {
    if (creep.memory.fullCheck && creep.carry.energy === 0) {
      creep.memory.fullCheck = false;
      creep.memory.currentTarget = '';
      if (Boolean(creep.memory.toDoList)) {
        creep.memory.toDoList = [];
      }
    }
    if (!creep.memory.fullCheck && creep.carry.energy === creep.carryCapacity) {
      creep.memory.fullCheck = true;
      creep.memory.currentTarget = '';
    }
  },

  // Energie-Ernte fuer unterschiedliche Rollen
  cHarvest: function (creep) {

    if (_.sum(creep.carry) < creep.carryCapacity && creep.room.find(RESOURCE_ENERGY).length !==
      0) {
      var _dropRes = creep.pos.findClosestByPath(RESOURCE_ENERGY);
      if (creep.pickup(_dropRes) == ERR_NOT_IN_RANGE) {
        creep.moveTo(_dropRes);
      }
    } else {
      if (!creep.memory.currentTarget || creep.memory.currentTarget === '') {
        if (creep.memory.role === 'upgrader') {
          creep.memory.currentTarget = creep.room.find(FIND_SOURCES)[0].id;
        } else {
          creep.memory.currentTarget = creep.pos.findClosestByRange(
            FIND_SOURCES_ACTIVE).id;
        }
      }
      var target = Game.getObjectById(creep.memory.currentTarget);

      if (target) {
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
        if (!target.amount || target.amount === 0) {
          creep.memory.currentTarget = '';
        }
      }
    }
  },

  // Reparatur mit Prioritaeten
  cRepair: function (creep) {
    function closest(targets) {
      return creep.pos.findClosestByPath(targets);
    }

    function createToDoList(creep) {
      creep.memory.toDoList = [];
      creep.memory.currentTarget = [];
      var _shortList = [];
      var _cache = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < Math.round(object.hitsMax * 0.9)
      });
      _cache.sort((a, b) => a.hits - b.hits);

      creep.memory.currentTarget = _cache.shift().id;

      for (var str in _cache) {
        _shortList.push(_cache[str].id);
      }
      if (_shortList.length > 20) {
        _shortList = _shortList.slice(0, 20);
      }
      creep.memory.toDoList = _shortList;
      console.log('new toDoList created');
    }
    // createToDoList(creep);

    function getTargetFromList(creep) {
      var _toDoListParsed = [],
        _toDoListLength = creep.memory.toDoList.length;
      for (var i = 0; i < _toDoListLength; i++) {
        _toDoListParsed.push(Game.getObjectById(creep.memory.toDoList[i]));
      }
      closestTarget = closest(_toDoListParsed);
      creep.memory.currentTarget = closestTarget.id;
    }

    function removeCurrentTargetFromList(creep) {
      var _removeIndex = creep.memory.toDoList.indexOf(creep.memory.currentTarget);

      creep.memory.toDoList.splice(_removeIndex, 1);
      creep.memory.currentTarget = {};
    }

    if (!creep.memory.toDoList || creep.memory.toDoList.length < 15) {
      createToDoList(creep);
    }
    if (!creep.memory.currentTarget) {
      getTargetFromList(creep);
    }

    var currentLiveTarget = Game.getObjectById(creep.memory.currentTarget);

    if (currentLiveTarget.hits < currentLiveTarget.hitsMax) {
      var targetID = creep.memory.currentTarget;
      liveTarget = Game.getObjectById(targetID);
      if (creep.repair(liveTarget) == ERR_NOT_IN_RANGE) {
        creep.moveTo(liveTarget);
      }
    } else if (currentLiveTarget.hits === currentLiveTarget.hitsMax) {
      console.log('target repaired');
      removeCurrentTargetFromList(creep);
      getTargetFromList(creep);
    } else {
      console.log('no target, getting new');
      getTargetFromList(creep);
    }

    // var targets = creep.room.find(FIND_STRUCTURES, {
    //   filter: object => object.hits < Math.round(object.hitsMax * 0.9)
    // });
    // targets.sort((a, b) => a.hits - b.hits);
    //
    // // ToDo: Clusterfuck aufloesen
    // var walls = creep.room.find(FIND_STRUCTURES, {
    //   filter: (structure) => {
    //     return structure.structureType === STRUCTURE_WALL;
    //   }
    // });
    // walls.sort((a, b) => a.hits - b.hits);
    //
    // var roads = creep.room.find(FIND_STRUCTURES, {
    //   filter: (structure) => {
    //     return structure.structureType === STRUCTURE_ROAD &&
    //       structure.hits < Math.round(structure.hitsMax * 0.7);
    //   }
    // });
    // roads.sort((a, b) => a.hits - b.hits);

    // var containers = _.filter(utils.containers('all'), (c) => c.hits <=
    //   Math.round(c.hitsMax * 0.9));
    // containers.sort((a, b) => a.hits - b.hits);

    // ToDo: Clusterfuck aufloesen
    // if (containers.length) {
    //   var closestCon = closest(containers);
    //   console.log('containersToRepair: ' + containers.length + ', ' +
    //     closestCon.hits + '|' + closestCon.hitsMax);
    //   if (creep.repair(closestCon) == ERR_NOT_IN_RANGE) {
    //     creep.moveTo(closestCon);
    //   }
    // } else if (roads.length) {
    //   var closestRd = closest(roads);
    //   console.log('roadsToRepair: ' + roads.length + ', ' + closestRd.hits +
    //     '|' + closestRd.hitsMax);
    //   if (creep.repair(closestRd) == ERR_NOT_IN_RANGE) {
    //     creep.moveTo(closestRd);
    //   }
    // } else {
    //   if (targets.length > 0) {
    //     var closestTopTgt = closest(targets.slice(1, 21));
    //     if (creep.repair(closestTopTgt) == ERR_NOT_IN_RANGE) {
    //       creep.moveTo(closestTopTgt);
    //     }
    //   }
    // }
  },

  // non-empty-Containers

  containers: function (type, creep) {
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

  status: function () {
    if (utils.GTC() % conf.statusTimer === 0) {
      console.log('status...');
    }
  },

  // Global Tick Counter
  _gtcCount: function () {
    var _gtc = Memory.GTC || 0;
    _gtc++;
    Memory.GTC = _gtc;
  },
  GTC: function (stuff) {
    return Memory.GTC;
  }
};

module.exports = utils;
