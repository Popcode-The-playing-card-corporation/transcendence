const ip = window.location.host;
const pos = ip.search(/:/);
const res = ip.substring(0, pos);

export default {
	http: 'http://' + res + ':8000/',
	ws:  'ws://' + res + ':8000/',
}