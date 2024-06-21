import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Conversation, Instruction} from "../../DTO/instruction";
import {NgForm} from "@angular/forms";


@Component({
  selector: 'app-instruction-card',
  templateUrl: './instruction-card.component.html',
  styleUrl: './instruction-card.component.css'
})
export class InstructionCardComponent implements OnChanges{
  textInput: string = '';
  selectedOption: string | null = null;

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
    let response = '';
    if (this.isConversation(this.instruction.conversation)) {
      if (this.instruction.conversation.inputType === 'text') {
        response = this.textInput;
      } else if (this.instruction.conversation.inputType === 'radio') {
        response = this.selectedOption || '';
      }
    }
    this.onComplete.emit(response);
    this.textInput = '';
    this.selectedOption = null;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
  }

  nextIns() {
    this.onComplete.emit('success');
  }


  // checking the instruction is correctly fetched or not
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.instruction);
  }
}
