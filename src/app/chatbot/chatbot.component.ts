import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ChatService } from '../chatbot-service/chatbot.service';
import { ChatMessage } from '../modele/chat-message.model'; // Adjust the import path as necessary
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chatbot.component.html',
  standalone: false,
  providers: [ChatService]
})
export class ChatBotComponent implements OnInit, OnDestroy {  isOpen = false;
  messages: ChatMessage[] = [];
  newMessage = '';
  hasUnreadMessages = false;
  isTyping = false;
  private subscription: Subscription | null = null;
  private typingTimeout: any;
  
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  constructor(private chatService: ChatService) {}
  
  ngOnInit(): void {
    this.subscription = this.chatService.getMessages().subscribe(messages => {
      this.messages = messages;
      
      // Set unread flag if new message and chat is closed
      if (!this.isOpen && messages.length > 0 && messages[messages.length - 1].sender === 'bot') {
        this.hasUnreadMessages = true;
      }
      
      // Scroll to bottom on new message
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });
  }
    ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    // Clear any pending timeouts
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }
    toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.hasUnreadMessages = false;
      // Focus input when opened
      setTimeout(() => {
        const inputElement = document.querySelector('input[name="newMessage"]') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        }
        this.scrollToBottom();
      }, 100);
    } else {
      // Clear typing indicator when chat is closed
      this.isTyping = false;
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
    }
  }
  
  isSending = false;
  async sendMessage(): Promise<void> {
    const message = this.newMessage.trim();
    if (message && !this.isSending) {
      this.isSending = true;
      this.newMessage = '';
      
      try {
        await this.chatService.addMessage(message, 'user');
        
        // Show typing indicator for a more realistic experience
        this.isTyping = true;
        
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
        }
        
        // Simulate bot typing for 1-2 seconds before responding
        this.typingTimeout = setTimeout(() => {
          this.isTyping = false;
          // The service will handle the bot response
          this.scrollToBottom();
        }, Math.random() * 1000 + 1000);
        
      } catch (error) {
        console.error('Error sending message:', error);
        this.isTyping = false;
        // Optionally show an error message to the user
      } finally {
        this.isSending = false;
      }
    }
  }
  
  private scrollToBottom(): void {
    if (this.messageContainer) {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}