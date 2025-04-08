import { getFakeData, delProces } from "./fakeData.js";
class FakeSocket {
    constructor() {
        this.listeners = {
            message: [],
            open: [],
            error: [],
            close: [],
        };
    }

    runListener(event, data) {
        this.listeners[event].forEach((callback) => callback({ data }));
    }

    addEventListener(event, callback) {
        this.listeners[event].push(callback);
    }

    send(message) {
        delProces(message);
        this.sendToClient(JSON.stringify({ type: "kill_status", status: `Process ${message}, killed.` }));
    }

    sendToClient(data) {
        this.runListener("message", data);
    }

    open() {
        this.runListener("open");
    }
}

const socket = new FakeSocket();

setTimeout(() => {
    socket.open();
    socket.sendToClient(getFakeData());
}, 1000);

setInterval(() => {
    socket.sendToClient(getFakeData());
}, 1000);

export default socket;
