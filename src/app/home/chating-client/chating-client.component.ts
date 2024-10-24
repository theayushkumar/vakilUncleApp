import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-chating-client',
  templateUrl: './chating-client.component.html',
  styleUrls: ['./chating-client.component.scss'],
})
export class ChatingClientComponent implements OnDestroy, OnInit {
  private ws: WebSocket | null = null;
  connectionStatus: string = 'Disconnected';
  chatMessages: Array<{ Message: string; MsgAt: string; sendBy: string }> = [];
  messageContent: string = '';

  senderId: any;
  receiverId: any;
  UserId: any;
  user_id: any;
  img_url: any;
  mrs: any;
  sendby: string = 'Client';

  constructor(
    private _router: Router,
    private _shared: SharedService,
    private _crud: CrudService
  ) {
    this.UserId = localStorage.getItem('clientChat');
    this.user_id = JSON.parse(this.UserId);
    console.log(this.user_id, 'id');

    this.senderId = this.user_id?.SenderUserId;
    this.receiverId = this.user_id?.ReceiverUserId;

    this._shared.img_url.subscribe(
      (data) => {
        this.img_url = data;
      }
    )

    this._crud.get_chating_data(this.senderId, this.receiverId, this.sendby).subscribe(
      (res: any) => {
        this.chatMessages = res.data;
      }
    )
  }
  ngOnInit() {
    this.connectionStatus = 'Connecting...';
    const wsUrl = `wss://vakiluncle.in/api/chat?senderId=${this.senderId}&recieverId=${this.receiverId}&sendby=Client`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.connectionStatus = 'Connected';
        console.log('WebSocket connection established');
      };

      this.ws.onmessage = (event) => {
        console.log(event);

        const receivedData = JSON.parse(event.data);
        this.chatMessages.push({
          Message: receivedData.Message,
          MsgAt: receivedData.MsgAt,
          sendBy: 'Reciver',
        });
        this.autoScrollChat();
      };

      this.ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        this.connectionStatus = 'Error connecting to WebSocket';
      };

      this.ws.onclose = () => {
        this.connectionStatus = 'Disconnected';
        console.log('WebSocket connection closed');
      };
    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
      this.connectionStatus = 'Failed to connect';
    }
  }

  sendMessage() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const trimmedMessage = this.messageContent.trim();
      if (trimmedMessage) {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

        const chatMessage = {
          SenderUserId: this.senderId,
          ReceiverUserId: this.receiverId,
          Message: trimmedMessage,
          sendBy: 'Client',
          MsgAt: formattedDate,
        };

        try {
          this.ws.send(JSON.stringify(chatMessage));
          this.chatMessages.push({
            Message: trimmedMessage,
            MsgAt: chatMessage.MsgAt,
            sendBy: 'Client',
          });
          this.messageContent = '';
          console.log(this.chatMessages, 'new mes');

          this.autoScrollChat();
        } catch (error) {
          console.error('Failed to send message:', error);
          this.connectionStatus = 'Error sending message';
        }
      } else {
        this.connectionStatus = 'Message cannot be empty';
      }
    } else {
      this.connectionStatus = 'Connection is closed';
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connectionStatus = 'Disconnected';
    }
    localStorage.removeItem('clientChat');
    this._router.navigate(['/user/home/contact']);
  }

  ngAfterViewChecked() {
    this.autoScrollChat();
  }

  autoScrollChat() {
    const chatContainer = document.getElementById('chatMessages');
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
      }, 10); // Delay to ensure content is rendered
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
