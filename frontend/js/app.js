import { Connection } from './connection.js';
import { Chat } from './chat.js';
import { Sidebar } from './sidebar.js';

class App {
    constructor() {
        this.me = 'gojo';
        this.activeChat = 'hollow';

        this.connection = new Connection ('ws://localhost:8080');
        this.chat = new Chat();
        this.sidebar = new Sidebar();

        this.setup();
    }

    setup() {
        this.sidebar.subscribe('sidebar-select', (newTarget) => {
            this.chat.clear();
            this.activeChat = newTarget;
            this.chat.updateHeader(newTarget);
        });

        this.chat.subscribe('chat-send', (text) => {
            const message = {
                sender: this.me,
                target: this.activeChat,
                text: text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            
            this.connection.send(message);
        });

        this.connection.subscribe('connection-receive', (msg) => {
            if (msg.sender === this.me) {
                if (msg.target === this.activeChat) {
                    this.chat.renderMessage(msg, 'sent');
                }
            }
            else if (msg.target === this.me) {
                if (msg.sender === this.activeChat) {
                    this.chat.renderMessage(msg, 'received');
                }
                // else {
                //     console.log(`message: ${msg.sender} was ignored.`);
                // }
            }
        });
    }
}

new App();