
const GLib = imports.gi.GLib;

function findDevices() {
	 let [res, out, error] = GLib.spawn_sync(null, ["bash", "-c", "adb devices | awk 'NR>1 {print $1}'"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);

 		if(!isEmpty(error.toString())) {
         	return {error: error.toString()};
 		}

        if(!isEmpty(out.toString()))  {

        	let devices = [];

        	let array = out.toString().split('\n');

        	for(var i = 0;i < array.length; i++) {

        		let deviceId = array[i];

        		if(!isEmpty(deviceId)) {
        			devices.push(deviceId);
        		}
			}
        	return {
        		devices : devices
			}
        	    
        } else {
        	return {error: "No devices found"}
        }

       
}

function isEmpty(str) {
	    return (!str || str.length === 0 || !str.trim());
}