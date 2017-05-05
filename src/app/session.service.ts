import { Injectable } from "@angular/core";

@Injectable()
export class SessionService {
  private userID: string;

  public setUserID(id: string): void{
    this.userID = id;
  }

  public getUserID(){
    return this.userID;
  }
}
