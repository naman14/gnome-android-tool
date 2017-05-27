
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const PanelMenu = imports.ui.panelMenu;
const Shell = imports.gi.Shell;
const PopupMenu = imports.ui.popupMenu;
const Clutter = imports.gi.Clutter;
const Panel = imports.ui.panel;
const Lang = imports.lang;


let button;

const AndroidMenuItem = new Lang.Class({
    Name: 'AndroidMenuItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(type) {

    this.parent();

    this.type = type;

        this._icon = new St.Icon({ icon_name: 'system-run-symbolic',
                                   icon_size: 16 });

    this.actor.add_child(this._icon);

        this._label = new St.Label({ text: "Take Screenshot" });
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
    
        this.menu.addMenuItem(new AndroidMenuItem("Devices"))
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    
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

