export interface Instruction {
  actor: string;
  conversation: Conversation | string;
  audio: string;
  }

export interface Conversation {
  content?: string;
  inputType?: string;
  options?: string[];
  correctAnswer?: string;
}

