var scripts = { };
module.exports = {
    // TODO: Add multiple binding support.
    on: function(intentName, callback) {
        if (scripts[intentName]) {
            console.warn("Script already bound to '%s'. Skipping.", intentName);
        } else {
            console.log("Binding callback to %s", intentName);
            scripts[intentName] = callback;
        }
    },
    logger: { 
        debug: function(data) { console.log(data); },
        info:  function(data) { console.log(data); },
        warn:  function(data) { console.warn(data); },
        error: function(data) { console.error(data); }
    }
};
