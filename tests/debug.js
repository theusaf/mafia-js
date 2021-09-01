const {Game} = require("../index"),
  game = new Game,
  readline = require("readline"),
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

rl.question("ready?", () => {
  ["Arianna", "Asuna", "Lyndis", "Lalatina", "Clarissa", "Rem"].forEach((a) => {
    game.addPlayer(a);
  });
  game.startGame();
  debugger;
});
