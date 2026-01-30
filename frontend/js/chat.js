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

        //embed for yt links
        if (msg.text.includes('youtube.com')) {
            const embed = msg.text.replace('watch?v=', 'embed/');   
            const iframe = document.createElement('iframe');
            iframe.src = embed;
            iframe.style.width = "300px";
            iframe.style.height = "200px";
            iframe.style.marginTop = "10px";
            iframe.style.border = "1px solid #1e1f22"; 
            iframe.style.borderRadius = "8px";
            bubble.appendChild(iframe);
        }

        msgContent.append(timeStmp, bubble);
        msgDiv.append(smallAvatar, msgContent);

        this.feed.appendChild(msgDiv);
        this.feed.scrollTop = this.feed.scrollHeight;
    }
}