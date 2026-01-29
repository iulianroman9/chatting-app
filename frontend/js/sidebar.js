import { PubSub } from './pubsub.js';

export class Sidebar extends PubSub {
    constructor() {
        super();
        this.users = document.querySelectorAll('[data-user]');

        this.users.forEach(user => {
            user.addEventListener('click', (e) => {
                e.preventDefault();
                const username = user.getAttribute('data-user');
                this.publish('sidebar-select', username);
                this.users.forEach(u => u.classList.remove('active'));
                user.classList.add('active');
            });
        });
    }
}