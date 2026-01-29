import { PubSub } from "./pubsub.js";

export class Connection extends PubSub {
    constructor(url) {
        super();
        
        this.socket = new WebSocket(url);

        this.socket.addEventListener('open', () => {
            console.log('connected to server.');
        });

        this.socket.addEventListener('close', () => {
            console.warn('connection closed.');
        });

        this.socket.addEventListener('error', (error) => {
            console.error('error:', error);
        });

        this.socket.addEventListener('message', (event) => this.#messageHandler(event));
    }
    
    #messageHandler(event) {
        let message;

        try {
            message = JSON.parse(event.data);
            console.log(message);
        }
        catch (error) {
            console.warn('received non-json response from server.', event.data);
            message = { content: event.data };
        }

        this.publish('connection-receive', message);
    }

    send(message) {
        this.socket.send(
            typeof message === 'object'
            ? JSON.stringify(message)
            : message
        )
    }
}