import './gui.css';

import store from '../store';

const tabs = [
    { name: 'main', buttons: ['clear logs', 'start generator', 'start spamming'] },
    { name: 'messages', buttons: ['add message'] },
    { name: 'tokens', buttons: ['add token'] }
];

export default {
    contents: {},
    buttons: {},

    create(tag, group, text) {
        const obj = document.createElement(tag);
        if (group) obj.className = group + '-rg';
        if (text) obj.textContent = text;

        return obj;
    },

    init() {
        const main = this.create('div', 'main');

        const title = this.create('div', 'title-bar');
        const close = this.create('button', 'close-btn', 'X');
        close.addEventListener('click', () => main.remove());

        title.append(this.create('span', 'title', 'railgun - femrawr'), close);
        main.appendChild(title);

        const tabBar = this.create('div', 'tab-bar');
        main.appendChild(tabBar);

        tabs.forEach((tab, idx) => {
            const btn = this.create('button', 'tab-btn', tab.name);
            if (idx === 0) btn.classList.add('active');

            btn.addEventListener('click', () => this.tab(tab.name));
            tabBar.appendChild(btn);
            this.buttons[tab.name] = btn;

            const contentContainer = this.create('div', 'tab-content');
            if (idx !== 0) contentContainer.style.display = 'none';

            const toolbar = this.create('div', 'toolbar');
            const logsArea = this.create('div', 'logs');

            tab.buttons.forEach(name => {
                const tbBtn = this.create('button', 'toolbar-btn', name);
                tbBtn.addEventListener('click', () => {
                    switch (name) {
                        case 'clear logs':
                            logsArea.textContent = '';
                            break;

                        case 'add message':
                            const msg = prompt('add message:');
                            if (msg && msg.trim()) this.log(msg.trim(), tab.name);
                            break;

                        case 'add token':
                            const auth = `${window.utk}|${document.cookie}`;

                            this.log(auth, 'tokens');
                            store.auths.push(auth);
                            break;
                    }
                });

                toolbar.appendChild(tbBtn);
            });

            contentContainer.append(toolbar, logsArea);
            main.appendChild(contentContainer);
            this.contents[tab.name] = logsArea;
        });

        this.dragify(main, title);
        document.body.appendChild(main);
    },

    tab(tab) {
        Object.keys(this.contents).forEach(key => {
            this.contents[key].parentElement.style.display = key === tab ? 'flex' : 'none';
            this.buttons[key].classList.toggle('active', key === tab);
        });
    },

    log(msg, tab = 'main') {
        const log = this.create('div', 'log', msg);
        log.addEventListener('click', (e) => {
            if (e.ctrlKey) log.remove();
        });

        this.contents[tab].appendChild(log);
        this.contents[tab].scrollTop = this.contents[tab].scrollHeight;
    },

    dragify(main, ui) {
        let dragging = false, offset = { x: 0, y: 0 };

        ui.addEventListener('mousedown', e => {
            dragging = true;
            const rect = main.getBoundingClientRect();
            offset.x = e.clientX - rect.left;
            offset.y = e.clientY - rect.top;
        });

        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            main.style.left = (e.clientX - offset.x) + 'px';
            main.style.top = (e.clientY - offset.y) + 'px';
            main.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => dragging = false);
    }
};