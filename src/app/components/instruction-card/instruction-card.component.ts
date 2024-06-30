import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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

  @Output() onComplete:EventEmitter<string> = new EventEmitter<string>();
  @Output() incrementCorrectOrWrong:EventEmitter<number> = new EventEmitter<number>();

  emitValue:number = 0;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audioUrl: string | null = null;
  isRecording: boolean = false;
  showAudio:boolean = false;
  currentAnswer:string = '';

  isConversation(conversation: string | Conversation): conversation is Conversation {
    return typeof conversation === 'object';
  }

  // todo:
  //  sync of the audio - no next button - Message Queue (call to run the scripts)
  //  IOT device
  //  push the code in new github
  // scroll to the end
  // a button to record the audio and end it
  // fix the 'try again' bug
  // end the chat properly
  // implement the count of right and wrong
  // update the json file (script) as well


  submitForm(submitForm: NgForm) {
    let response: string = '';
    if (this.isConversation(this.instruction.conversation)) {
      if (this.instruction.conversation.inputType === 'text') {
        response = this.textInput;
        if (this.isConversation(this.instruction.conversation) && this.instruction.conversation.content) {
          this.answer = this.instruction.conversation.content.replace('___', response);
        }
        this.currentAnswer = this.answer;
        this.showAudio = true;
      }
      else if (this.instruction.conversation.inputType === 'radio') {
        // if  {
          response = this.selectedOption || '';
        // }
        this.attempts++;
        if (this.isConversation(this.instruction.conversation) && response === this.instruction.conversation.correctAnswer) {
          if (this.isConversation(this.instruction.conversation) && this.instruction.conversation.content) {
            this.answer = this.instruction.conversation.content.replace('___', response);
            this.emitValue = 1;
            this.currentAnswer = this.answer;
            this.showAudio = true;
            this.correctAnswer = false;
          }
          this.correctAnswer = true;
        } else if (this.attempts === 3) {
          this.showCorrectAnswer = true;
          if (this.isConversation(this.instruction.conversation) && this.instruction.conversation.content) {
            const val: string = this.instruction.conversation.correctAnswer || '';
            this.answer = this.instruction.conversation.content.replace('___', val);
            this.emitValue = 2;
            this.currentAnswer = this.answer;
            this.showAudio = true;
            this.showTryAgainDiv = false;
          }
          this.correctAnswer = true;
          // this.onComplete.emit(answer);
          // this.resetForm();
        } else {
          this.showTryAgainDiv = true;
        }
      }
    }
  }

  getNextChat() {
    this.resetForm();
    // 1 -> correct answer, 2 -> wrong answer
    if (this.emitValue === 2) {
      this.incrementCorrectOrWrong.emit(2);
    }
    if (this.emitValue === 1) {
      this.incrementCorrectOrWrong.emit(1);
    }
    this.onComplete.emit(this.answer);
    this.attempts = 0;
    this.showTryAgainDiv = false;
    this.correctAnswer = false;
  }

  selectOption(option: string): void {
    console.log(this.showTryAgainDiv)
    this.showTryAgainDiv = false;
    this.selectedOption = option;
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
    this.showAudio = false;
    this.textInput = '';
    this.selectedOption = null;
    this.clearAudio();
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true;
        this.audioChunks = [];
        this.mediaRecorder.addEventListener("dataavailable", event => {
          this.audioChunks.push(event.data);
        });
      })
      .catch(error => {
        console.error("Error accessing microphone:", error);
      });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioChunks);
        this.audioUrl = URL.createObjectURL(audioBlob);
        this.isRecording = false;
      });
    }
  }

  clearAudio() {
    this.audioUrl = null;
    this.audioChunks = [];
  }

}
