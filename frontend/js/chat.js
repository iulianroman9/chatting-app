import { PubSub } from "./pubsub.js";

export class Chat extends PubSub {
    constructor() {
        super();

        this.form = document.getElementById('message-form');
        this.input = document.getElementById('message-input');
        this.feed = document.querySelector('.message-feed');
        this.headerTitle = document.querySelector('.chat-header .chat-info h3');

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.#handleFormSubmit();
        });
    }

    #handleFormSubmit() {
        const inputText = this.input.value.trim();

        if (!inputText) {
            return;
        }

        this.publish('chat-send', inputText);

        this.input.value = '';
    }

    clear() {
        this.feed.innerHTML = '';
    }

    updateHeader(username) {
        this.headerTitle.textContent = `@${username}`;
    }

    renderMessage(msg, type) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', type); 

        const smallAvatar = document.createElement('div');
        smallAvatar.classList.add('avatar-small');

        const msgContent = document.createElement('div');
        msgContent.classList.add('message-content');

        const timeStmp = document.createElement('span');
        timeStmp.classList.add('timestamp');
        timeStmp.textContent = msg.timestamp || new Date().toLocaleTimeString(); 

        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.textContent = msg.text;

        msgContent.append(timeStmp, bubble);
        msgDiv.append(smallAvatar, msgContent);

        this.feed.appendChild(msgDiv);
        this.feed.scrollTop = this.feed.scrollHeight;
    }
}