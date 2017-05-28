
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const PanelMenu = imports.ui.panelMenu;
const Shell = imports.gi.Shell;
const PopupMenu = imports.ui.popupMenu;
const Clutter = imports.gi.Clutter;
const Panel = imports.ui.panel;
const Lang = imports.lang;
const Util = imports.misc.util;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

let button;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const AdbHelper = Me.imports.adbhelper;


const AndroidMenuItem = new Lang.Class({
    Name: 'AndroidMenuItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(item) {

        this.parent();

        this._icon = new St.Icon({ icon_name: 'system-run-symbolic',
                                   icon_size: 16 });

        this.actor.add_child(this._icon);

        this._label = new St.Label({ text: item.label });
        this.actor.add_child(this._label);

    },

    destroy: function() {
        this.parent();
    },

    activate: function(event) {
        this.parent(event);
    }

});

const AndroidMenu = new Lang.Class({
    Name: 'AndroidMenu.AndroidMenu',
    Extends: PanelMenu.Button,

    _init: function() {
         this.parent(0.0, "Android Menu", false);

        let hbox = new St.BoxLayout({style_class: 'panel-status-menu-box'});
        let label = new St.Label({
            text: _("AndroidTool"),
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        hbox.add_child(label);
        hbox.add_child(PopupMenu.arrowIcon(St.Side.BOTTOM));
        this.actor.add_actor(hbox);

        this.actor.connect('button-press-event', Lang.bind(this,this._findDevices));

        this._addErrorItem("No devices found");
    
    },

    _findDevices: function() {

        let result = AdbHelper.findDevices();

        if(result.error != null) {
            global.log(result.error);
            this._addErrorItem(result.error);
        } else {

        if(result.devices != null && result.devices.length!=0) {
            this._addMenuItems(result.devices);
        } else {
            this._addErrorItem("No devices found");
        }

        }

    },

    _screenshotClicked: function(device) {

        AdbHelper.takeScreenshot(device.deviceId);
    
    },

    _recordScreen: function(device) {

    },

    _addMenuItems: function(devices) {

            this.menu.removeAll();

            for(var i=0; i < devices.length; i++) {

                let device = devices[i];

                if(device != null) {

                    let screenshotItem = new AndroidMenuItem({label: "Take screenshot"});
                    screenshotItem.connect('activate', Lang.bind(this, function() {
                        this._screenshotClicked(device)
                    }));
                    this.menu.addMenuItem(screenshotItem);

                    let recordScreenItem = new AndroidMenuItem({label: "Record screen"});
                    recordScreenItem.connect('activate', Lang.bind(this, function() {
                        this._recordScreen(device)
                    }));
                    this.menu.addMenuItem(recordScreenItem);
            }

            
            }

      
    },

    _addErrorItem: function(error) {

            this.menu.removeAll();
            let errorItem = new AndroidMenuItem({label: error});
            this.menu.addMenuItem(errorItem);

    },


    _toArray: function(str) {
        let arr = str.split(" ");
        return arr;
    }


});


function init() {
  
}


let _indicator;


function enable() {
    _indicator = new AndroidMenu;
 
    Main.panel.addToStatusArea('android-menu', _indicator);

}

function disable() {
    _indicator.destroy();
}

