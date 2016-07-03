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

    function dropE(creep) {
      if (creep.transfer(storage, 'energy') === ERR_NOT_IN_RANGE) {
        creep.moveTo(storage);
      }
    }

    function getE(creep) {
      if (neConts.length > 0) {
        var nearCont = creep.pos.findClosestByPath(neConts);
        if (nearCont.transfer(creep, 'energy') === ERR_NOT_IN_RANGE) {
          creep.moveTo(nearCont);
        }
      } else {
        if (creep.room.find(FIND_DROPPED_ENERGY).length > 0) {
          var drop = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
          if (creep.pickup(drop) === ERR_NOT_IN_RANGE) {
            creep.moveTo(drop);
          }
        } else if (Game.flags.mules.length > 0) {
          creep.moveTo(Game.flags.mules);
        }
      }
    }
  }
};

module.exports = mule;
