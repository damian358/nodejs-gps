_this = this;
this.enable = false;

exports.enable = function () {
    _this.enable = true;
};

exports.log = function (data) {
    if (_this.enable) {
        console.log(data);
    }
};
