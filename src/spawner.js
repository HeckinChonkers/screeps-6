/* jshint esversion:6 */

/* Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */
var conf = require('conf');

var spawner = {

  needCreeps: function (cRole) {
    function filterCreeps(cRole) {
      return _.filter(Game.creeps, (creep) => creep.memory.role === cRole);
    }
    return filterCreeps(cRole).length < conf.workers[cRole];
  },
  controller: function () {

    var mySpawn = Game.spawns.Spawn1,
      eAvail = mySpawn.room.energyAvailable,
      eCapa = mySpawn.room.energyCapacityAvailable;

    function spawnCreep(cRole) {
      console.log(eAvail + '|' + eCapa);
      return mySpawn.createCreep(bodyChooser(cRole), getName(cRole), {
        role: cRole
      });
    }

    function getName(cRole) {
      var d = new Date();
      return cRole + String(d.getTime()).substring(6);
    }

    function bodyChooser(cRole) {
      var bodyType = Math.floor(eAvail / 100) * 100,
        bodyConf;
      if (cRole === 'mule') {
        bodyConf = conf.creepBodies.mules;
      } else {
        bodyConf = conf.creepBodies.workers;
      }

      if (Boolean(bodyConf[bodyType])) {
        console.log('Bodytype:' + bodyType + '|eAvail:' + eAvail);
        return bodyConf[bodyType];
      } else { //letztes Element ausgeben
        console.log('lastBodytype:' + bodyConf[Object.keys(bodyConf)[Object
          .keys(bodyConf).length - 1]] + '|eAvail:' + eAvail);
        return bodyConf[Object.keys(bodyConf)[Object.keys(bodyConf).length -
          1]];
      }
    }

    for (var cRole in conf.workers) {
      if (spawner.needCreeps(cRole) && eAvail >= 200) {
        var newName = spawnCreep(cRole);
        console.log('Spawning new ' + cRole + ': ' + newName);
      }
    }
  },
  status: function () {
    // console.log('Energy ' + spawner.eAvail + '|' + spawner.eCapa);
    //console.log(spawner.harvesters().length());
  }

};
module.exports = spawner;
