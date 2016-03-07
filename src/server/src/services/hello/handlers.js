var welcomeMsgs = [
    "Hope you're having a great day!",
    "It's a beautiful day.",
    "Lovely day, isn't it?",
    "Good day!"
];

function getRandomArrayIndex(){
    return Math.floor(Math.random() * (welcomeMsgs.length));
}

module.exports = {
    getWelcomeMsg: function(args, callback) {
        var r = getRandomArrayIndex();
        callback(null, {
            welcomeMsg: welcomeMsgs[r]
        });
    }
};
