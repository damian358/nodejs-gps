var enable = false;

exports.enable = function () {
    enable = true;
};

exports.log = function (data) {
    if (enable) {
        console.log(data);
    }
};
