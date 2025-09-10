export default {
    chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',

    genStr(len) {
        let str = '';
        for (let i = 0; i < len; i++) {
            str += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
        }

        return str;
    }
};