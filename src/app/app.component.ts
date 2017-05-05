import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { SessionService } from './session.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private readonly sendTime = 200;
  private coords: number[];
  constructor(private webSocketService: WebSocketService, private sessionService: SessionService) {
    const mouseMove$ = Observable.fromEvent<MouseEvent>(document, 'mousemove');
    const mouseMoveEachSecond$ = mouseMove$.sampleTime(this.sendTime);
    this.webSocketService.start('ws://localhost:8080');

    mouseMoveEachSecond$
      .subscribe(event => {
        const [x, y] = this.coords = [event.clientX, event.clientY];
        const userID = this.sessionService.getUserID();
        const message = JSON.stringify({x, y, userID});
        console.log('sending: %s', message);
        this.webSocketService.sendMessage(message);
      });
  }

  ngOnDestroy(): void {
    this.webSocketService.close();
  }
}
