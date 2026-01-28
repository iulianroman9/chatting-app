const MESSAGES_KEY = 'yeet_messages';

export function getMessages() {
    try {
        return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
    }
    catch (error) {
        console.error("Error retrieving messages from local storage:", error);
        return [];
    }
}

export function saveMessage(text, type = 'sent') {
    const messages = getMessages();
    
    const newMessage = {
        text: text,
        type: type,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    messages.push(newMessage);
    
    try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
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
    timeStmp.textContent = `${msg.timestamp}`;

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = `${msg.text}`;

    msgContent.append(timeStmp, bubble);
    msgDiv.append(smallAvatar, msgContent);

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

export function renderAllMessages(container) {
    const messages = getMessages();

    if(messages.length > 0) {
        container.innerHTML = '';
        messages.forEach(msg => renderMessage(msg, container));
        container.scrollTop = container.scrollHeight;
    }
}