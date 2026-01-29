const CHATS_KEY = 'yeet_chats';

export function getAllChats() {
    try {
        return JSON.parse(localStorage.getItem(CHATS_KEY)) || {};
    }
    catch (error) {
        console.error("Error loading chats:", error);
        return {};
    }
}

export function getMessages(user) {
    const allChats = getAllChats();
    return allChats[user] || [];
}

export function saveMessage(user, text, type = 'sent') {
    const allChats = getAllChats();
    
    if (!allChats[user]) {
        allChats[user] = [];
    }

    const newMessage = {
        text: text,
        type: type,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    allChats[user].push(newMessage);
    
    try {
        localStorage.setItem(CHATS_KEY, JSON.stringify(allChats));
    }
    catch (error) {
        console.error("Error saving message to local storage:", error);
    }
    
    return newMessage;
}

export function renderMessage(msg, container) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', msg.type);

    const smallAvatar = document.createElement('div');
    smallAvatar.classList.add('avatar-small');

    const msgContent = document.createElement('div');
    msgContent.classList.add('message-content');

    const timeStmp = document.createElement('span');
    timeStmp.classList.add('timestamp');
    timeStmp.textContent = msg.timestamp;

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = msg.text;

    msgContent.append(timeStmp, bubble);
    msgDiv.append(smallAvatar, msgContent);

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

export function renderChatHistory(user, container) {
    container.innerHTML = '';
    const messages = getMessages(user);

    if (messages.length > 0) {
        messages.forEach(msg => renderMessage(msg, container));
        container.scrollTop = container.scrollHeight;
    }
}