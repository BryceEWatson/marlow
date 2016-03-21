var app = require('../../app');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getInitialState: function(input) {
        return {
            mainData: input.mainData
        };
    },
    getTemplateData: function(state, input) {
        return {
            mainData: state.mainData
        };
    },
    downloadSampleProject: function(el) {
        var elements = el.originalTarget.elements;
        var installDir = elements['directory'].value;
        var sampleProject = elements['samples'].value;
        var start = elements['start'].value === 'on' ? true : false;
        app.downloadSampleProject({
            installDir: installDir,
            gitProject: sampleProject,
            generate: sampleProject,
            start: start
        });
    }
});