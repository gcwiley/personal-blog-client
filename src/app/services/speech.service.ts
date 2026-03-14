import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  public readonly isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  public isSpeaking = signal(false);

  public speak(text: string): void {
    if (!this.isSupported) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => this.isSpeaking.set(true);
    utterance.onend = () => this.isSpeaking.set(false);
    utterance.onerror = (event) => {
      this.isSpeaking.set(false);
      if (event.error !== 'interrupted') {
        console.error('SpeechSynthesis error:', event.error);
      }
    };

    // Chrome bug: speechSynthesis.speak() silently fails if called
    // synchronously after cancel(). A small delay resolves this.
    setTimeout(() => window.speechSynthesis.speak(utterance), 100);
  }

  public stop(): void {
    if (!this.isSupported) return;
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