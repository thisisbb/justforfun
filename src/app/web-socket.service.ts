import { Injectable } from "@angular/core";
import { Subject, Observable, Subscription } from 'rxjs/Rx';
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import { SessionService } from './session.service';

@Injectable()
export class WebSocketService {

  private ws: WebSocketSubject<Object>;
  private socket: Subscription;
  private url: string;

  public message: Subject<Object> = new Subject();
  public opened: Subject<boolean> = new Subject();

  constructor(private sessionService: SessionService){}

  public close(): void {
    this.socket.unsubscribe();
    this.ws.complete();
  }

  public sendMessage(message: string): void {
    this.ws.next(message);
  }

  public start(url: string): void {
    this.url = url;
    this.ws = Observable.webSocket(this.url);
    this.socket = this.ws.subscribe({
      next: (data: MessageEvent) => {
        if (data['status'] === 'ok') {
          this.sessionService.setUserID(data['userID']);
          this.opened.next(true);
        }
        this.message.next(data);
      },
      error: () => {
        this.opened.next(false);
        this.message.next({type: 'closed'});
        this.socket.unsubscribe();
        setTimeout(() => {
          this.start(this.url);
        }, 1000);

      },
      complete: () => {
        this.message.next({type: 'closed'});
      }
    });

  }
}
