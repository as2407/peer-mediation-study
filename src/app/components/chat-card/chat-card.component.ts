import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Instruction, Conversation} from "../../DTO/instruction";
import {HttpService} from "../../services/http.service";
import {Chat} from "../../DTO/chat";


@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css'
})
export class ChatCardComponent implements OnInit{


  instructions: Instruction[] = [];
  currInstruction: Instruction = {
    actor:'',
    conversation:''
  }
  chatHistory: Chat[] = [];
  currentIndex = 0;
  // showInstructionCard = false;
  // question: string = '';

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http.getChat().subscribe(data => {
      this.instructions = data;
      console.log('Instructions fetched:', this.instructions);
    });
  }
  // getting the next chat
  getNext() {
    this.addHistory();
    if (this.instructions.length > this.currentIndex) {
      this.currInstruction = this.instructions[this.currentIndex];
    }
    this.currentIndex++;
  }

  addHistory(): void {
    let response: string | null;
    let css:string | null;
    // for mediator
    if (this.isConversation(this.currInstruction.conversation)) {
      response = this.currInstruction.conversation.content || null;
    }
    else {
      // for blossom
      response = this.currInstruction.conversation || null;
    }
    // assigning the cssClass
    if (this.currInstruction.actor === 'Mediator') {
      css = 'mediator-class';
    }
    else if (this.currInstruction.actor === 'Jacob') {
      css = 'jacob-class';
    }
    else {
      css = 'caleb-class';
    }
    this.chatHistory.push({
      person: this.currInstruction.actor,
      response: response,
      cssClass:css
    });
    console.log('Chat History:', this.chatHistory);

    setTimeout(() => {
      const chatArea = document.querySelector('.chat-area');
      if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
      }
    }, 0);
  }

  // checking if the chat belongs to mediator or blossom by comparing their conversation type
  isConversation(conversation: string | Conversation): conversation is Conversation {
    return typeof conversation === 'object';
  }


}
