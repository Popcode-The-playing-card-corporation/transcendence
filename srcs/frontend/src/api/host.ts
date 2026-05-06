const ip = window.location.host;
const pos = ip.search(/:/);
const res = ip.substring(0, pos);

export default {
	host_ip:  res,
}