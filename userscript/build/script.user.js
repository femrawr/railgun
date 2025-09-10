// ==UserScript==
// @name         railgun
// @version      10/9/2025
// @description  multipurpose account manager for teenchat
// @author       femrawr
// @match        https://www.teen-chat.org/
// ==/UserScript==

(() => {
	'use strict';

	fetch('https://raw.githubusercontent.com/femrawr/railgun/refs/heads/main/userscript/build/main.min.js')
		.then(res => {
			if (!res.ok) throw new Error(`http error, status: ${res.status}`);
			return res.text();
		})
		.then(src => new Function(src)())
		.catch(_ => console.error('an error occurred while executing'));
})();