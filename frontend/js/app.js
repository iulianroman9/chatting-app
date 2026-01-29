import { Connection } from './connection.js';
import { Chat } from './chat.js';
import { Sidebar } from './sidebar.js';

class App {
    constructor() {
        this.me = 'null';
        this.activeChat = 'hollow';

        this.connection = new Connection ('ws://localhost:8080');
        this.chat = new Chat();
        this.sidebar = new Sidebar();

        this.login();
        this.setup();
    }

    login() {
        const modal = document.getElementById('login-modal');
        const form = document.getElementById('login-form');
        const input = document.getElementById('login-username');
        const usernameDisplay = document.querySelector('.user-profile .username');

        if (input) {
            input.focus();
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = input.value.trim();

            if (username) {
                this.me = username;
                
                if (usernameDisplay) {
                    usernameDisplay.textContent = `@${username}`;
                }

                this.connection.send({
                    type: 'login',
                    username: username
                });

                modal.style.display = 'none';
            }
        });
    }

    setup() {
        this.sidebar.subscribe('sidebar-select', (newTarget) => {
            this.chat.clear();
            this.activeChat = newTarget;
            this.chat.updateHeader(newTarget);
        });

        this.chat.subscribe('chat-send', (text) => {
            if (!this.me) {
                return;
            }

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