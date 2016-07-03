/* jshint esversion:6 */

var grunt = {
  run: function(creep) {
    var targets = creep.room.find(Game.HOSTILE_CREEPS);
    if (targets.length) {
      creep.say('Waaagh!')
      creep.moveTo(targets[0]);
      creep.attack(targets[0]);
    }
    else {
      if (Game.flags.Grunts !== undefined) {
        creep.moveTo(Game.flags.Grunts);
      }
    }
  }
};

module.exports = grunt;
