import * as Messaging from './messagingService.js';

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageFeed = document.querySelector('.message-feed');

Messaging.renderAllMessages(messageFeed);

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = messageInput.value.trim();

    if (text !== "") {
        const newMessage = Messaging.saveMessage(text, 'sent');
        Messaging.renderMessage(newMessage, messageFeed);
        messageInput.value = '';
    }
});