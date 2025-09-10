import gui from './gui/gui.js';

const PORT = 5845;

class Main {
    constructor(port) {
        this.port = port;
        this.init();
    }

    async init() {
        gui.init();
        gui.log('connecting to server...');

        try {
            const res = await fetch(`http://localhost:${this.port}/check`);
            if (!res.ok) {
                gui.log(`server fetch not ok: ${res.status}`);
                return;
            }

            const json = await res.json();
            if (json.msg === 'railgun') {
                gui.log('successfully connected to server!');
            } else {
                gui.log('invalid server response from check');
            }
        } catch(e) {
            gui.log(`failed to connect to server port ${this.port}: ${e.message}`);
        }
    }
};

export default new Main(PORT);