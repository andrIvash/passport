/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	console.log('hello there !!!');
	
	const status = document.querySelector('.status');
	const del = document.querySelector('.del');
	const form = document.querySelector('#form');
	
	form.addEventListener('submit',(e) => {
	    e.preventDefault();
	    let data = {
	      username : form.username.value,
	      password : form.password.value
	    };
	    sendData('/submit', data);
	});
	
	del.addEventListener('click',(e) => {
	    e.preventDefault();
	    sendData('/del', {});
	});
	
	function sendData(url, data) {
	    let xhr = new XMLHttpRequest();
	    xhr.open("POST", url, true);
	    xhr.setRequestHeader('Content-Type', 'application/json');
	    xhr.send(JSON.stringify(data));
	
	    xhr.onreadystatechange = function() {
	        if (this.readyState != 4) return;
	
	        if (xhr.status != 200) {
	            console.warn( xhr.status + ': ' + xhr.statusText );
	        }
	        let result = JSON.parse(xhr.responseText );
	        status.innerHTML =  result.status ;
	    }
	}


/***/ }
/******/ ]);
//# sourceMappingURL=app.map