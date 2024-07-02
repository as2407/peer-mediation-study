import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Instruction, Conversation} from "../../DTO/instruction";
import {HttpService} from "../../services/http.service";
import {Chat} from "../../DTO/chat";
import {count} from "rxjs";
import {response} from "express";


@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css'
})
export class ChatCardComponent implements OnInit, AfterViewChecked, OnChanges {

  @Output() answerCounter :EventEmitter<number> = new EventEmitter<number>();


  instructions: Instruction[] = [];
  currInstruction: Instruction = {
    actor:'',
    conversation:'',
    audio: ''
  }
  chatHistory: Chat[] = [];
  currentIndex:number = 0;
  endChat:boolean = false;

  audioToPlay: string | null = null;


  constructor(private http: HttpService, private cdr: ChangeDetectorRef) {}


  // passing the right and wrong counter
  handleAnswer(count: number) {
    this.answerCounter.emit(count)
  }

  ngOnInit(): void {
    this.http.getChat().subscribe(data => {
      this.instructions = data;
      // console.log('Instructions fetched:', this.instructions);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  // Scroll to the end
  ngAfterViewChecked(): void {
    this.scrollToBottom();
    if (this.audioToPlay) {
      this.playAudio(this.audioToPlay);
      this.audioToPlay = null;
    }
  }

  // getting the next chat
  getNext(response?: string):void {
    this.addHistory(response || null);
    if (this.instructions.length > this.currentIndex) {
      this.currInstruction = this.instructions[this.currentIndex];
      this.currentIndex++;
    }
    if (this.currentIndex == this.instructions.length) {
      this.endChat = true;
      return;
    }
  }

  addHistory(response: string | null):void {
    let message: string | null = '';
    let css: string | null;

    // for mediator
    if (this.isConversation(this.currInstruction.conversation)) {
      message = response || this.currInstruction.conversation.content || null;
    } else {
      // for blossoms
      message = this.currInstruction.conversation || null;
    }
    if (this.currInstruction.actor === 'Mediator') {
      css = 'mediator-class';
    } else if (this.currInstruction.actor === 'Jacob') {
      css = 'jacob-class';
    } else {
      css = 'caleb-class';
    }
    this.chatHistory.push({
      person: this.currInstruction.actor,
      response: message,
      cssClass: css
    });
    // playing the audio
    if (this.currInstruction.audio) {
      this.audioToPlay = this.currInstruction.audio;
      this.playAudioAfterViewUpdate();
    }

  }


  // checking if the chat belongs to mediator or blossom by comparing their conversation type
  isConversation(conversation: string | Conversation): conversation is Conversation {
    return typeof conversation === 'object';
  }

  playAudioAfterViewUpdate(): void {
    setTimeout(() => {
      if (this.audioToPlay) {
        this.playAudio(this.audioToPlay);
        this.audioToPlay = null;
      }
    }, 0);
  }


  private scrollToBottom(): void {
    const chatArea = document.querySelector('.chat-area') as HTMLElement | null;
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }

  private playAudio(audioUrl: string): void {
    const audio = new Audio(audioUrl);
    audio.play();
  }



}
