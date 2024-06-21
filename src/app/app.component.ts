import { Component } from '@angular/core';
import {HttpService} from "./services/http.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private http:HttpService) {
  }

  instructionPresent:boolean = true;
  // startedIns:boolean = false;
  toggleSection:boolean = false;
  notToggleStart:boolean = true;
  showChat:boolean = false;
  startChatWindow:boolean =false;

  clickInstruction() {
    this.instructionPresent = !this.instructionPresent;
  }
  clickInstructionNext() {
    this.toggleSection = !this.toggleSection;
    this.notToggleStart = !this.notToggleStart;
    this.showChat = !this.showChat;
  }
  toggleInstructions() {
    this.toggleSection = !this.toggleSection;
  }

  startChat() {
    this.showChat = true;
    this.startChatWindow = true;

    setTimeout(() => {
      const chatArea = document.querySelector('.chat-area');
      if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
      }
    }, 0);
  }

}
