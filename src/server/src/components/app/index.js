var app = require('src/app');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getInitialState: function(input) {
        // Use the provided application state as the state for this top-level
        // UI component
        return input.state;
    },
    getTemplateData: function(state, input) {
        var name = state.name;
        var welcomeMsg = state.welcomeMsg;

        return {
            name: name,
            welcomeMsg: welcomeMsg
        };
    },
    init: function() {
        var self = this;

        // Subscribe to the change state event. In response
        // to a state change event we will rerender the entire
        // app using the new state.
        this.subscribeTo(app)
            .on('change', function(newState) {
                self.replaceState(newState);
            });
    }
});