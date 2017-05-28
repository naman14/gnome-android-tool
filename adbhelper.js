
const GLib = imports.gi.GLib;

function findDevices() {
     let [res, out, error] = GLib.spawn_sync(null, ["bash", "-c", "adb devices -l | awk 'NR>1 {print $1}'"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);

        if(!isEmpty(error.toString())) {
            return {error: error.toString()};
        }

        if(!isEmpty(out.toString()))  {

            let devices = [];

            let array = out.toString().split('\n');

            for(var i = 0;i < array.length; i++) {

                let deviceId = array[i];

                if(!isEmpty(deviceId)) {

                    devices.push(getDeviceDetail(deviceId));
                }
            }
            return {
                devices : devices
            }
                
        } else {
            return {error: "No devices found"}
        }

       
}

function getDeviceDetail(deviceId) {
        let [res, out, error] = GLib.spawn_sync(null, ["bash", "-c", "adb -s "+ deviceId +" shell getprop ro.product.model"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);

        let device;

        if(!isEmpty(error.toString())) {
            return;
        }

        if(!isEmpty(out.toString()))  {
            device = {deviceId: deviceId, name : out.toString()}
            return device;
        }
}


function takeScreenshot(deviceId) {
        GLib.spawn_async(null, ["bash", "-c", "adb -s "+ deviceId +" shell screencap -p | sed 's/\r$//' > ~/Desktop/screen.png"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);
}

function isEmpty(str) {
        return (!str || str.length === 0 || !str.trim());
}