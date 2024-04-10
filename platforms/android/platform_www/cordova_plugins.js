cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "es6-promise-plugin.Promise",
      "file": "plugins/es6-promise-plugin/www/promise.js",
      "pluginId": "es6-promise-plugin",
      "runs": true
    },
    {
      "id": "cordova-plugin-screen-orientation.screenorientation",
      "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
      "pluginId": "cordova-plugin-screen-orientation",
      "clobbers": [
        "cordova.plugins.screenorientation",
        "screen.orientation"
      ]
    },
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    },
    {
      "id": "cordova-plugin-navigationbar.navigationbar",
      "file": "plugins/cordova-plugin-navigationbar/www/navigationbar.js",
      "pluginId": "cordova-plugin-navigationbar",
      "clobbers": [
        "window.navigationbar"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-device": "2.1.0",
    "cordova-plugin-viewport": "1.0.5",
    "es6-promise-plugin": "4.2.2",
    "cordova-plugin-screen-orientation": "3.0.4",
    "cordova-plugin-statusbar": "4.0.0",
    "cordova-plugin-navigationbar": "1.0.31"
  };
});