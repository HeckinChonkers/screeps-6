/* jshint esversion:6 */

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */
var utils = require('utils');

var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {
    creep.memory.currentTask = 'upgrade';

    utils.cFullCheck(creep);

    if (creep.memory.fullCheck) {
      if (creep.upgradeController(creep.room.controller) ===
        ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    } else {
      if(Boolean(creep.room.storage) && _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
        if (creep.room.storage.transfer(creep, 'energy') === ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.storage);
        }
      } else {
        utils.cHarvest(creep);
      }
    }
  }
};

module.exports = roleUpgrader;
