import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private scoreSubject = new BehaviorSubject<{ player1: number; player2: number }>({ player1: 0, player2: 0 });

  score$ = this.scoreSubject.asObservable(); // Observable, który możemy subskrybować

  constructor() {
    this.startConnection();
  }

  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44375/scoreboardHub') // <-- Zmień na swój adres API
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected!'))
      .catch(err => console.error('SignalR Error: ', err));
  }
}
