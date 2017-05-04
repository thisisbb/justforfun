import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';
const sendTime = 200;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  coords: number[];
  constructor(private webSocketService: WebSocketService) {
    const mouseMove$ = Observable.fromEvent<MouseEvent>(document, 'mousemove');
    const mouseMoveEachSecond$ = mouseMove$.sampleTime(sendTime);
    this.webSocketService.start('ws://localhost:8080');

    mouseMoveEachSecond$
      .subscribe(event => {
        const [x, y] = this.coords = [event.clientX, event.clientY];
        const message = JSON.stringify({x, y});
        console.log('sending: %s', message);
        this.webSocketService.sendMessage(message);
      });
  }

  ngOnDestroy(): void {
    this.webSocketService.close();
  }
}
