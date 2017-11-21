 $(function () {
    var content = $('#content');
    var status = $('#status');
    var input = $('#input');
    var myName = false;

    //建立websocket连接
    socket = io.connect('http://47.95.209.24:3000');
    //收到server的连接确认
    socket.on('open',function(){
        status.text('请输入用户名:');
    });

    //监听system事件，判断welcome或者disconnect，打印系统消息信息
    socket.on('system',function(json){
        var p = '';
        if (json.type === 'welcome'){
            if(myName==json.text) status.text(myName + ': ').css('color', json.color);
            p = '<p style="background:'+json.color+'">系统消息(时间：'+ json.time+ '): ' + json.text +' 进入客服</p>';
        }else if(json.type == 'disconnect'){
            p = '<p style="background:'+json.color+'">系统消息(时间：'+ json.time+ '): ' + json.text +' 离开客服</p>';
        }
        content.prepend(p); 
    });

    //监听message事件，打印消息信息
    socket.on('message',function(json){
        var p = '<p><span style="color:'+json.color+';">' + json.author+'</span> @ '+ json.time+ ' : '+json.text+'</p>';
        content.prepend(p);
    });
    //通过“回车”提交聊天信息
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) return;
            socket.send(msg);
            $(this).val('');
            if (myName === false) {
                myName = msg;
            }
        }
    });
});