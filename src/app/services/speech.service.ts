import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  public readonly isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  public readonly isSpeaking = signal(false);

  private speakTimeout: ReturnType<typeof setTimeout> | null = null;

  public speak(text: string): void {
    if (!this.isSupported) return;

    this.stop(); // cancels any active speech

    // also cancel any pending (not-yet-submitted) speak
    if (this.speakTimeout !== null) {
      clearTimeout(this.speakTimeout);
      this.speakTimeout = null;
    }

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