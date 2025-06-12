import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../modele/chat-message.model'; // Adjust the import path as necessary
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { __param } from 'tslib';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages = new BehaviorSubject<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  constructor(private readonly http: HttpClient) {}

  getMessages(): Observable<ChatMessage[]> {
    return this.messages.asObservable();
  }

  addMessage(content: string, sender: 'user' | 'bot'): void {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date()
    };

    const currentMessages = this.messages.getValue();
    this.messages.next([...currentMessages, newMessage]);
    this.getBotResponse(content).subscribe(response => {
      if (response && response.response) {
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          content: response.response,
          sender: 'bot',
          timestamp: new Date()
        };
        const updatedMessages = [...this.messages.getValue(), botMessage];
        this.messages.next(updatedMessages);
      }
    }
    );
  }
   private getBotResponse(userMessage: string): Observable<any> {
    const message = userMessage.toLowerCase();
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return this.http.post(
      `/${environment.apiUrl}api/gemini/chat?request=${message}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );}
}
