// This test is to check that roles kill things properly.
module.exports = () => {
  const {Game, roleMap} = require("../index"),
    killers = [
      roleMap["Serial Killer"],
      roleMap.Werewolf,
      roleMap.Vigilante,
      roleMap.Vampire,
      roleMap["Star Crossed Lover"],
      roleMap.Mafioso,
      roleMap.Jailor,
      roleMap.Godfather,
      roleMap.Arsonist,
      roleMap.Bodyguard,
      roleMap["Vampire Hunter"],
      roleMap.Veteran
    ];

  for (const killer of killers) {
    console.log(`Testing role ${killer.name}`);
    let game = new Game,
    killRole = new killer,
    target = new roleMap.Survivor;
    game.addPlayer("殺しています", 1);
    game.addPlayer("死んでいます", 2);
    game.startGame();
    const player1 = game.getPlayerById(1),
    player2 = game.getPlayerById(2);
    switch (killer) {
      case roleMap["Vampire Hunter"]: {
        target = new roleMap.Vampire;
        break;
      }
      case roleMap.Vampire: {
        target = new roleMap.Mafioso;
        break;
      }
      case roleMap.Arsonist:
      case roleMap.Werewolf: {
        game.addPlayer("Third", 3);
        const player = game.getPlayerById(3);
        player.role = new roleMap.Lookout;
        player.role.setPlayer(player);
        game.date = 1;
        break;
      }
      case roleMap.Vigilante: {
        game.date = 1;
        break;
      }
      case roleMap.Bodyguard: {
        game.addPlayer("Third", 3);
        game.date = 1;
        const player = game.getPlayerById(3);
        player.role = new roleMap.Vigilante;
        player.role.setPlayer(player);
        break;
      }
      case roleMap["Star Crossed Lover"]: {
        killRole.additionalInformation.hasFoundLove = true;
        break;
      }
      case roleMap.Veteran: {
        target = new roleMap.Mafioso;
        game.addPlayer("Third", 3);
        const player = game.getPlayerById(3);
        player.role = new roleMap.Sheriff;
        player.role.setPlayer(player);
        break;
      }
    }
    player1.role = killRole;
    killRole.setPlayer(player1);
    player2.role = target;
    target.setPlayer(player2);
    target.beforeGameSetup();
    killRole.beforeGameSetup();
    game.progressStage();
    switch (killer) {
      case roleMap.Werewolf: {
        game.getPlayerById(3).actions[0].setTarget(player2);
        player1.actions[0].setTarget(player2);
        break;
      }
      case roleMap.Veteran: {
        player1.actions[0].setTarget(player1);
        player2.actions[0].setTarget(player1);
        game.getPlayerById(3).actions[0].setTarget(player1);
        break;
      }
      case roleMap.Bodyguard: {
        const vigi = game.getPlayerById(3);
        vigi.actions[0].setTarget(player2);
        player1.actions[0][0].setTarget(player2);
        break;
      }
      case roleMap.Arsonist: {
        player2.effectData.doused = true;
        game.getPlayerById(3).effectData.doused = true;
        player1.actions[0][1].setTarget(player1);
        break;
      }
      default: {
        let [action] = player1.actions;
        if (Array.isArray(action)) {[action] = action;}
        player1.actions[0].setTarget(player2);
        break;
      }
    }
    game.progressStage();
    switch (killer) {
      case roleMap.Werewolf: {
        if (player2.isAlive() || game.getPlayerById(3).isAlive()) {
          throw `${killRole.getName(true)} failed to kill all visitors`;
        }
        break;
      }
      case roleMap.Veteran: {
        if (player2.isAlive() || game.getPlayerById(3).isAlive()) {
          throw `${killRole.getName(true)} failed to kill all visitors`;
        }
        break;
      }
      case roleMap.Bodyguard: {
        if (player2.isDead()) {
          throw `${killRole.getName(true)} failed to protect ${target.getName(true)}`;
        }
        if (game.getPlayerById(3).isAlive()) {
          throw `${killRole.getName(true)} failed to kill ${game.getPlayerById(3).role.getName(true)}`;
        }
        break;
      }
      case roleMap.Arsonist: {
        if (player2.isAlive() || game.getPlayerById(3).isAlive()) {
          throw `${killRole.getName(true)} failed to kill all doused targets`;
        }
        break;
      }
      default: {
        if (player2.isAlive()) {
          throw `${killRole.getName(true)} failed to kill ${target.getName(true)}`;
        }
        break;
      }
    }
  }

  console.log("[KILLING ROLES] - Passed.");
};
