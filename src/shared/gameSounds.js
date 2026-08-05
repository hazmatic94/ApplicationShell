import minesBombSound from "../../assets/mines-bomb.mp3?url";
import minesCashoutSound from "../../assets/mines-cashout.mp3?url";
import minesPlaceBetSound from "../../assets/mines-placebet.mp3?url";
import { playSound } from "./sounds.js";

export const gameSounds = {
  placeBet: minesPlaceBetSound,
  cashout: minesCashoutSound,
  loss: minesBombSound,
};

export function playPlaceBetSound() {
  playSound(gameSounds.placeBet);
}

export function playCashoutSound() {
  playSound(gameSounds.cashout);
}

export function playLossSound() {
  playSound(gameSounds.loss);
}
