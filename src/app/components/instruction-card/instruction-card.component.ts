import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Conversation, Instruction} from "../../DTO/instruction";
import {NgForm} from "@angular/forms";


@Component({
  selector: 'app-instruction-card',
  templateUrl: './instruction-card.component.html',
  styleUrl: './instruction-card.component.css'
})
export class InstructionCardComponent implements OnChanges {
  textInput: string = '';
  selectedOption: string | null = null;

  attempts: number = 0;
  showCorrectAnswer: boolean = false;

  answer: string = '';
  correctAnswer:boolean = false;
  showTryAgainDiv:boolean = false;

  @Input() instruction: Instruction = {
    actor: '',
    conversation: {
      content: '',
      inputType: '',
      options: [],
      correctAnswer: ''
    }
  };

  @Output() onComplete = new EventEmitter<string>();

  isConversation(conversation: string | Conversation): conversation is Conversation {
    return typeof conversation === 'object';

  }

  submitForm(submitForm: NgForm) {
    let response: string = '';

    if (this.isConversation(this.instruction.conversation)) {
      if (this.instruction.conversation.inputType === 'text') {
        response = this.textInput;
        if (this.isConversation(this.instruction.conversation) && this.instruction.conversation.content) {
          this.answer = this.instruction.conversation.content.replace('___', response);
        }
        this.onComplete.emit(this.answer);

      }
      else if (this.instruction.conversation.inputType === 'radio') {
        response = this.selectedOption || '';
      }
      this.attempts++;
      if (this.isConversation(this.instruction.conversation) && response === this.instruction.conversation.correctAnswer) {

        if (this.isConversation(this.instruction.conversation) && this.instruction.conversation.content) {
          this.answer = this.instruction.conversation.content.replace('___', response);
        }
        this.correctAnswer = true;

      }
      else if (this.attempts === 3) {
        this.showCorrectAnswer = true;
        if (this.isConversation(this.instruction.conversation) && this.instruction.conversation.content) {
          const val: string = this.instruction.conversation.correctAnswer || '';
          this.answer = this.instruction.conversation.content.replace('___', val);
          this.showTryAgainDiv = false;
        }
        this.correctAnswer = true;
        // this.onComplete.emit(answer);
        // this.resetForm();
      }
      else {
        this.showTryAgainDiv = true;
      }
    }

  }

  getNextChat() {
    this.resetForm();
    this.onComplete.emit(this.answer);
    this.attempts = 0;
    this.showTryAgainDiv = false;
    this.correctAnswer = false;

  }

  selectOption(option: string): void {
    console.log(this.showTryAgainDiv)
    this.showTryAgainDiv = false;
    this.selectedOption = option;

     // Reset the "try again" message when a new option is selected
  }

  nextIns() {
    let response: string | undefined = '';
    if (this.isConversation(this.instruction.conversation)) {
      response = this.instruction.conversation.content;
    }
    this.onComplete.emit(response);
    this.resetForm();
  }

  // checking the instruction is correctly fetched or not
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.instruction);
  }

  resetForm(): void {
    this.showTryAgainDiv = false;

    this.textInput = '';
    this.selectedOption = null;
  }
}
