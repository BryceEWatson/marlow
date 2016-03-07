var app = require('src/app');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getInitialState: function(input) {
        return {

        };
    },
    getTemplateData: function(state, input) {
        return {

        };
    },
    handleWelcomeClick: function(event){
        app.getWelcomeMsg();
        event.preventDefault();
    },
    init: function() {
        $('#new-name').keyup(function(event) {
            var name = $(this).val();
            app.setName(name);
        });
    }
});
