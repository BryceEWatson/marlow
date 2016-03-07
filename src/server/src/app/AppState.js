var inherit = require('raptor-util/inherit');

function AppState(state) {
    if (!state) {
        state = {};
    }

    // Initialize the state based on the state object provided
    this.name = state.name || 'World';
    this.welcomeMsg = state.welcomeMsg || null;
}

AppState.prototype = {
    /**
     * Changes one of the state properties. If the provided
     * value is equal to the current value then nothing happens.
     * If the provided value is different then the state property
     * is updated and a "change" event is emitted.
     *
     *
     * @param {String} name The name of the state property to change
     * @param {Object} value The new value of the state property
     */
    set: function(name, value) {

        var curValue = this[name];

        if (curValue === value) {
            return;
        }

        this[name] = value;

        this.emit('change');
    }
};

// Inherit from EventEmitter
inherit(AppState, require('events').EventEmitter);

module.exports = AppState;