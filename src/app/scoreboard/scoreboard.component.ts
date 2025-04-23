import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatchStateDto } from '../models/match-state-dto';
import { Player, PlayerEnum } from '../models/player';
import { MatMenuModule } from '@angular/material/menu';
import { SignalRService } from '../services/signalr.service';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatSelectModule, 
    MatFormFieldModule, 
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})

export class ScoreboardComponent implements OnInit {
  PlayerEnum = PlayerEnum;
  players: Player[] = []; 
  defaultPlayer: Player = {
    id: 0,
    name: "Default",
    surname: "Player",
    nickname: "Brak",
    imagePath: "assets/images/default-avatar.png",
    attribute: "Brak"
  };
  
  selectedPlayer1: Player | null = null;
  selectedPlayer2: Player | null = null;
  currentServer: PlayerEnum | null = null;
  score1 = 0;
  score2 = 0;

  constructor(private http: HttpClient, private signalRService: SignalRService) {}

  ngOnInit() {
    this.startMatch();
    this.loadPlayers().subscribe({
      next: (data) => {
        this.players = data;
        console.log("Pobrani gracze:", this.players);
      },
      error: (err) => console.error('Błąd pobierania graczy', err)
    });

    this.signalRService.score$.subscribe(newScore => {
      console.log('Aktualizacja wyniku z SignalR:', newScore);
      this.score1 = newScore.player1;
      this.score2 = newScore.player2;
    });
  }

  loadPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>('https://localhost:44375/api/Players');
  }

  startMatch() {
    this.http.post<MatchStateDto>('https://localhost:44375/api/Matches/start', {}).subscribe({
      next: (match) => {
        console.log("Mecz rozpoczęty:", match);
        this.score1 = match.leftPlayerScore;
        this.score2 = match.rightPlayerScore;
        this.selectedPlayer1 = match.leftPlayer || null;
        this.selectedPlayer2 = match.rightPlayer || null;
        this.currentServer = match.currentServer;
      },
      error: (err) => console.error("Błąd przy starcie meczu", err)
    });
  }
  
  

  increaseScore(player: PlayerEnum) {
    const url = `https://localhost:44375/api/Matches/add-point?player=${player}`;
  
    this.http.post<MatchStateDto>(url, {}).subscribe({
      next: (match) => {
        console.log("Aktualizacja meczu:", match); // 🔥 Logowanie pełnego DTO
        this.score1 = match.leftPlayerScore; // Aktualizacja wyniku
        this.score2 = match.rightPlayerScore;
        this.currentServer = match.currentServer;
      },
      error: (err) => console.error("Błąd przy dodawaniu punktu", err)
    });
  }
  

  decreaseScore(player: number) {
    const url = `https://localhost:44375/api/Matches/subtract-point?player=${player}`;
  
    this.http.post<MatchStateDto>(url, {}).subscribe({
      next: (match) => {
        console.log("Aktualizacja meczu:", match); // 🔥 Logowanie pełnego DTO
        this.score1 = match.leftPlayerScore; // Aktualizacja wyniku
        this.score2 = match.rightPlayerScore;
        this.currentServer = match.currentServer;
      },
      error: (err) => console.error("Błąd przy dodawaniu punktu", err)
    });
  }

  resetScore() {
    this.http.post<MatchStateDto>('https://localhost:44375/api/Matches/reset', {}).subscribe({
      next: (match) => {
        this.score1 = match.leftPlayerScore;
        this.score2 = match.rightPlayerScore;
        this.selectedPlayer1 = match.leftPlayer || null;
        this.selectedPlayer2 = match.rightPlayer || null;
        this.currentServer = match.currentServer;
      },
      error: (err) => console.error("Błąd przy starcie meczu", err)
    });
  }

  finishMatch() {
    this.http.post<MatchStateDto>('https://localhost:44375/api/Matches/finish', {}).subscribe({
      next: (match) => {
        console.log("Mecz rozpoczęty:", match);
        this.score1 = match.leftPlayerScore;
        this.score2 = match.rightPlayerScore;
        this.selectedPlayer1 = match.leftPlayer || null;
        this.selectedPlayer2 = match.rightPlayer || null;
        this.currentServer = match.currentServer;
      },
      error: (err) => console.error("Błąd przy starcie meczu", err)
    });
  }

  setPlayer(player: Player, playerNumber: number) {
    if (!player) return;
    console.log(playerNumber);
    const url = `https://localhost:44375/api/Matches/${playerNumber === 1 ? 'set-player1' : 'set-player2'}/${player.id}`;
  
    this.http.post<MatchStateDto>(url, {}).subscribe({
      next: (match) => {
        console.log(`Gracz ${playerNumber} ustawiony:`, match);
        if (playerNumber === 1) {
          this.selectedPlayer1 = match.leftPlayer || null;
        } else {
          this.selectedPlayer2 = match.rightPlayer|| null;
        }
      },
      error: (err) => console.error(`Błąd ustawiania gracza ${playerNumber}`, err)
    });
  }
}
