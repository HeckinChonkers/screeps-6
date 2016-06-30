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
  eAvail: Game.spawns.Spawn1.room.energyAvailable,
  eCapa: Game.spawns.Spawn1.room.energyCapacityAvailable,
  needCreeps: function(cRole) {
    function filterCreeps(cRole) {
      return _.filter(Game.creeps, (creep) => creep.memory.role === cRole);
    }
    if (filterCreeps(cRole).length < conf.workers[cRole]) {
      return true;
    } else {
      return false;
    }
  },
  controller: function () {

    var mySpawn = Game.spawns.Spawn1;

    function spawnCreep(cRole) {
      return mySpawn.createCreep(bodyChooser(), getName(cRole), {role: cRole});
    }

    function getName(cRole) {
      var d = new Date();
      return cRole + String(d.getTime()).substring(6);
    }
    function bodyChooser(){
      var bodyType = Math.floor(spawner.eAvail/100)*100,
          bodyConf = conf.creepBodies.workers
      if (Boolean(bodyConf[bodyType])) {
        console.log('Bodytype:' + bodyType + '|eAvail:' + spawner.eAvail);
        return bodyConf[bodyType]
      } else { //letztes Element ausgeben
        console.log('lastBodytype:' + bodyConf[Object.keys(bodyConf)[Object.keys(bodyConf).length-1]] + '|eAvail:' + spawner.eAvail);
        return bodyConf[Object.keys(bodyConf)[Object.keys(bodyConf).length-1]];
      }
      return conf.creepBodies.workers[bodyType];
    }

    for (var cRole in conf.workers) {
      if (spawner.needCreeps(cRole) && spawner.eAvail >= 200) {
          var newName = spawnCreep(cRole) ;
          console.log('Spawning new ' + cRole + ': ' + newName);
      }
    }
  },
  status: function () {
    console.log('Energy ' + spawner.eAvail+'|'+spawner.eCapa);
    //console.log(spawner.harvesters().length());
  }

};
module.exports = spawner;
