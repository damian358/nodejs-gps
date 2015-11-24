var socket = io();

socket.emit('login');

socket.on('new device', function (device_name) {
    add_device_tab(device_name);
});

socket.on('device message', function (msg) {
    var device_id = msg.device_name.replace(/\s+/g, '-');

    var $messages = $('#' + device_id + ' .messages');

    $messages.append($('<li>').text(msg.data));

    if ($messages.find('li').length > 500) {
        $messages.find('li:first').remove();
    }

    var content = $('#tabs-content')[0];
    content.scrollTop = content.scrollHeight
});

function add_device_tab(device_name) {
    var is_active = $('#tabs li').length <= 0;

    var variables = {
        device_name: device_name,
        device_id: device_name.replace(/\s+/g, '-'),
        is_active: is_active
    };

    var tab_template = _.template($('#tab-tpl').html());
    $('#tabs').append(tab_template(variables));

    var tab_content_template = _.template($('#tab-content-tpl').html());
    $('#tabs-content').append(tab_content_template(variables));
}
