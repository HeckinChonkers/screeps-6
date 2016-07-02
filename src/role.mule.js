var utils = require('utils');

var mule = {
  run: function (creep) {
    var storage = creep.room.storage,
        neConts = utils.containers(nEmpty)

    utils.cFullCheck(creep);

    if (creep.memory.fullCheck) {
      dropE(creep);
    } else {
      getE(creep);
    }

    function dropE(creep){
      if (creep.transfer(storage, 'energy') === ERR_NOT_IN_RANGE) {
        creep.moveTo(storage);
      }
    };

    function getE(creep) {
      if (neConts.length > 0) {
        var nearCont = creep.pos.findClosestByPath(neConts);
        if (nearCont.transfer(creep, 'energy') === ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.storage);
        }
      }
    };
  }
}

module.exports = mule;