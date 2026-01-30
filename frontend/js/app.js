import { Connection } from './connection.js';
import { Chat } from './chat.js';
import { Sidebar } from './sidebar.js';

class App {
    constructor() {
        this.me = null;
        this.activeChat = null;

        this.connection = new Connection ('ws://localhost:5000/ws');
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
        //when we click on another chat, set the active chat to the new user, re render chat, and fetch the mesasge history between those 2 users
        this.sidebar.subscribe('sidebar-select', (newTarget) => {
            this.chat.clear();
            this.activeChat = newTarget;
            this.chat.updateHeader(newTarget);

            this.connection.send({
                type: 'fetch-history',
                target: newTarget
            });
        });

        //send message on the socket when we press enter on the msg input field
        this.chat.subscribe('chat-send', (text) => {
            if (!this.me || !this.activeChat) {
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

        //when we receive a message on the socket do something based on msg type
        this.connection.subscribe('connection-receive', (msg) => {
            if (msg.type === 'user-list') {
                this.sidebar.render(msg.users, this.me);
                
                if (!this.activeChat && msg.users.length > 0) {
                    const firstContact = msg.users.find(u => u !== this.me);
                    if (firstContact) {
                        this.activeChat = firstContact;
                        this.chat.updateHeader(firstContact);
                        this.connection.send({
                            type: 'fetch-history',
                            target: firstContact
                        });
                    }
                }

                if (this.activeChat) {
                    this.sidebar.setActive(this.activeChat);
                }
                
                return;
            }

            if (msg.type === 'history-data') {
                if (msg.target === this.activeChat) {
                    msg.messages.forEach(message => {
                        const type = message.sender === this.me ? 'sent' : 'received';
                        this.chat.renderMessage(message, type);
                    });
                }
                return;
            }

            if (msg.sender === this.me) {
                if (msg.target === this.activeChat) {
                    this.chat.renderMessage(msg, 'sent');
                }
            }
            else if (msg.target === this.me) {
                if (msg.sender === this.activeChat) {
                    this.chat.renderMessage(msg, 'received');
                }
            }
        });
    }
}

new App();