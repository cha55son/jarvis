var LifxClient = require('node-lifx').Client;
var client = new LifxClient();
client.init();

var handleAllLights = function(data) {
    var action;
    if (data.entities.on_off.value === 'on')  action = 'on';
    if (data.entities.on_off.value === 'off') action = 'off';
    if (action === undefined) {
        console.log("Unknown action %s, exiting.", action);
        return false;
    }
    console.log('Turning %s all the lights', action);
    client.lights().forEach(function(light) {
        client.light(light.address)[action]();
    });
    return "Turned all the lights " + action;
};

module.exports = function(robot) {
    robot.on('control_lights', function(data) {
        console.log(data);
        if (data.confidence < 0.5) {
            return "I'm not very confident in what you said. Please try again.";
        } else if (data.entities === undefined || Object.keys(data.entities).length === 0) {
            return "Sorry, could you be more descriptive? Please try again.";
        } else if (data.entities.light && data.entities.light.value === 'lights') {
            return handleAllLights(data);
        } else {
            return "Sorry, i'm having a problem determining what you want. Please try again.";
        }
    });
};
