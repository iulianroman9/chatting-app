export class PubSub {

    #events = {}

    subscribe(event, fn) {
        if (!this.#events[event]) {
            this.#events[event] = [];
        }
        this.#events[event].push(fn);
    }

    // unsubscribe(event, fn) {
    //     if (this.#events[event]) {
    //         this.#events[event] = this.#events[event].filter(func => func !== fn);
    //     }
    // }

    publish(event, data) {
        if (this.#events[event]) {
            this.#events[event].forEach(fn => fn(data));
        }
    }
}