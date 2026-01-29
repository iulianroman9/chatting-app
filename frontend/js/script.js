import * as Messaging from './messagingService.js';

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageFeed = document.querySelector('.message-feed');
const chatHeaderTitle = document.querySelector('.chat-info h3');
const friendItems = document.querySelectorAll('.friend-item');

let currentUser = 'hollow';
Messaging.renderChatHistory(currentUser, messageFeed);

friendItems.forEach(item => {
    item.addEventListener('click', () => {
        friendItems.forEach(friend => friend.classList.remove('active'));
        item.classList.add('active');

        const newUserId = item.getAttribute('data-user');
        currentUser = newUserId;

        chatHeaderTitle.innerText = `@${currentUser}`;

        Messaging.renderChatHistory(currentUser, messageFeed);
    });
});

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = messageInput.value.trim();

    if (text !== "") {
        const newMessage = Messaging.saveMessage(currentUser, text, 'sent');
        Messaging.renderMessage(newMessage, messageFeed);
        messageInput.value = '';
    }
});