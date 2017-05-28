
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

        if(item.icon != null) {
            this._icon = new St.Icon({ icon_name: item.icon,
                                       icon_size: 16 });

            this.actor.add_child(this._icon);
        }

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

        this._icon = new St.Icon({ icon_name: 'android_icon',
                                    style_class: 'system-status-icon'
        });
        hbox.add_child(this._icon);
        hbox.add_child(PopupMenu.arrowIcon(St.Side.BOTTOM));
        this.actor.add_actor(hbox);
        this.actor.add_style_class_name('panel-status-button');


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
        Main.notify("Screenshot saved in Desktop")
    
    },

    _recordScreen: function(device) {

    },

    _addMenuItems: function(devices) {

            this.menu.removeAll();

            for(var i=0; i < devices.length; i++) {

                let device = devices[i];

                if(device != null) {

                    let section = new PopupMenu.PopupMenuSection();

                    let deviceItem = new AndroidMenuItem({label: device.name.trim() + " - " + device.deviceId.trim()});
                    section.addMenuItem(deviceItem);

                    let screenshotItem = new AndroidMenuItem({label: "Take screenshot", icon: 'screenshot_icon'});
                    screenshotItem.connect('activate', Lang.bind(this, function() {
                        this._screenshotClicked(device)
                    }));
                    section.addMenuItem(screenshotItem);

                    let recordScreenItem = new AndroidMenuItem({label: "Record screen", icon: 'record_icon'});
                    recordScreenItem.connect('activate', Lang.bind(this, function() {
                        this._recordScreen(device)
                    }));
                    section.addMenuItem(recordScreenItem);

                    this.menu.addMenuItem(section)
                    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

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


function init(extensionMeta) {
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(extensionMeta.path + "/icons");
}


let _indicator;


function enable() {
    _indicator = new AndroidMenu;
 
    Main.panel.addToStatusArea('android-menu', _indicator);

}

function disable() {
    _indicator.destroy();
}

