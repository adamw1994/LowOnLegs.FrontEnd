import { Player } from "./player";

export interface MatchStateDto {
    player1Score: number;
    player2Score: number;
    player1: Player | null;
    player2: Player | null;
    currentServer: 'Player1' | 'Player2' | null;
  }
  