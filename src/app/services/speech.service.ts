import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private utterance: SpeechSynthesisUtterance | null = null;
  public isSpeaking = signal(false);

  public speak(text: string): void {
    this.stop();
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.onstart = () => this.isSpeaking.set(true);
    this.utterance.onend = () => this.isSpeaking.set(false);
    this.utterance.onerror = () => this.isSpeaking.set(false);
    window.speechSynthesis.speak(this.utterance);
  }

  public stop(): void {
    window.speechSynthesis.cancel();
    this.isSpeaking.set(false);
  }

  public toggle(text: string): void {
    if (this.isSpeaking()) {
      this.stop();
    } else {
      this.speak(text);
    }
  }
}