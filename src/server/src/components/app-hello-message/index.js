var app = require('src/app');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getInitialState: function(input) {
        return {
            name: input.name,
            welcomeMsg: input.welcomeMsg
        };
    },
    getTemplateData: function(state, input) {
        return {
            name: state.name,
            welcomeMsg: state.welcomeMsg
        };
    }
});