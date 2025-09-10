import common from './common.js';
import gui from '../gui/gui.js';

export default {
    port: 0,

    async generate() {
        if (window.logOut) {
            window.logOut();
        }

        window.getRegistration();

        const cap = await this.captcha();
        const email = await this.email();

        window.$.post('system/action/registration.php', {
            password: common.genStr(13),
            username: common.genStr(10),
            email: email,
            age: '14',
            gender: '2',
            recaptcha: cap
        }, (res) => {
            this.register(res, email);
        });
    },

    async register(res, email) {
        if (res !== 1) {

            return;
        }

        const code = await this.verify(email);

        window.$.post('system/action/action_member.php', {
            valid_code: code,
            verify_code: 1
        }, (res) => {
            if (res !== 1) return;
            location.reload();
        });
    },

    async captcha() {
        return new Promise(res => {
            const check = setInterval(() => {
                const cap = window.getCaptcha();
                if (cap === undefined) return;
                if (!cap.startsWith('0.')) return;

                clearInterval(check);
                res(cap);
            }, 2000);
        });
    },

    async email() {
        try {
            const res = await fetch(`http://localhost:${this.port}/generate`);
            if (!res.ok) {
                gui.log(`server fetch not ok: ${res.status}`);
                return;
            }

            const json = await res.json();
            if (json.email) {
                gui.log('successfully generated email: ' + json.email);
                return json.email;
            } else {
                gui.log(json.error);
                return null;
            }
        } catch(e) {
            gui.log('error generating email: ' + e.message);
            return null;
        }
    },

    async verify(email) {
        try {
            const res = await fetch(`http://localhost:${this.port}/verify?email=${email}`);
            if (!res.ok) {
                gui.log(`server fetch not ok: ${res.status}`);
                return;
            }

            const json = await res.json();
            if (json.code) {
                gui.log('successfully got code: ' + json.code);
                return json.code;
            } else {
                gui.log(json.error);
                return null;
            }
        } catch(e) {
            gui.log('error getting code: ' + e.message);
            return null;
        }
    }
};