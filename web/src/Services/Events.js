export class Events {
    static listeners = {
        count: 0,
        refs: {}
    };

    static on(event, callback) {
        Events.listeners.count++;
        const eventId = `e${Events.listeners.count}`;
        Events.listeners.refs[`e${Events.listeners.count}`] = {event, callback};
        return eventId;
    }

    static remove(eventId) {
        delete Events.listeners.refs[eventId];
    }

    static removeAll() {
        Events.listeners.refs = {};
    }

    static emit(event, ...args) {
        Object.keys(Events.listeners.refs).forEach(id => {
            if(Events.listeners.refs[id] && Events.listeners.refs[id].event === event) {
                Events.listeners.refs[id].callback(...args);
            }
        })
    }
}
