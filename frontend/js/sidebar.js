import { PubSub } from './pubsub.js';

export class Sidebar extends PubSub {
    constructor() {
        super();
        this.listContainer = document.querySelector('.friend-list');
    }

    render(users, myUsername) {
        //take the user list and render it in the side bar(besides active user)
        this.listContainer.innerHTML = '';

        users.forEach(username => {
            if (username === myUsername) return;

            const li = document.createElement('li');
            li.classList.add('friend-item');
            li.setAttribute('data-user', username);

            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('avatar');

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('info');

            const usernameSpan = document.createElement('span');
            usernameSpan.classList.add('username');
            usernameSpan.textContent = `@${username}`;

            const statusSpan = document.createElement('span');
            statusSpan.classList.add('status');
            statusSpan.textContent = 'some status';

            infoDiv.appendChild(usernameSpan);
            infoDiv.appendChild(statusSpan);

            li.appendChild(avatarDiv);
            li.appendChild(infoDiv);

            //highlight selected user in the sidebar
            li.addEventListener('click', () => {
                this.publish('sidebar-select', username);
                
                this.listContainer.querySelectorAll('.friend-item').forEach(u => u.classList.remove('active'));
                li.classList.add('active');
            });

            this.listContainer.appendChild(li);
        });
    }

    //set active (folosit doar pentru initial setup atm)
    setActive(username) {
        const items = this.listContainer.querySelectorAll('.friend-item');
        items.forEach(item => {
            if (item.getAttribute('data-user') === username) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}