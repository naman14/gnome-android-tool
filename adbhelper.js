
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

//start adb daemon on init
function startDaemon() {
    GLib.spawn_async(null, ["bash", "-c", "adb devices"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);

}

function takeScreenshot(deviceId) {

    //current time
    let time = '$(date +%Y-%m-%d-%H:%M)'

    GLib.spawn_async(null, ["bash", "-c", "adb -s "+ deviceId +" shell screencap -p | sed 's/\r$//' > ~/Desktop/screen"+ time +".png"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);
}

function recordScreen(deviceId) {
    let time = '$(date +%Y-%m-%d-%H:%M)'
    GLib.spawn_async(null, ["bash", "-c", "adb -s "+ deviceId +" shell screenrecord /sdcard/screenrecord.mp4"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);

}

function stopScreenRecording(deviceId, pid) {
    let time = '$(date +%Y-%m-%d-%H:%M)'

    GLib.spawn_sync(null, ["bash", "-c", "adb -s "+ deviceId +" shell pkill -INT screenrecord"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);
    GLib.spawn_sync(null, ["bash", "-c", "adb -s "+ deviceId +" pull /sdcard/screenrecord.mp4 ~/Desktop/record"+ time +".mp4"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);

}

function establishTCPConnection(deviceId) {

    let deviceIp = getDeviceIp(deviceId);

    GLib.spawn_sync(null, ["bash", "-c", "adb -s "+ deviceId + " tcpip 5555"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);
    let [res, out, error] = GLib.spawn_sync(null, ["bash", "-c", "adb -s "+ deviceId + " connect " + deviceIp+":5555"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);

    return out.toString().trim();

}

function useUsb() {
    let [res, out, error] = GLib.spawn_async(null, ["bash", "-c", "adb usb"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);

}

function captureBugReport(deviceId) {
    let time = '$(date +%Y-%m-%d-%H:%M)'
    let [res, out, error] = GLib.spawn_async(null, ["bash", "-c", "adb -s "+ deviceId +" bugreport > ~/Desktop/bugreport"+ time +".txt"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);
}

function getDeviceIp(deviceId) {
    let [res, out, error] = GLib.spawn_sync(null, ["bash", "-c", "adb -s "+ deviceId +" shell ip route | awk '{print $9}'"], null, GLib.SpawnFlags.SEARCH_PATH, null, null);
    return out.toString().trim();

}


function isEmpty(str) {
    return (!str || str.length === 0 || !str.trim());
}