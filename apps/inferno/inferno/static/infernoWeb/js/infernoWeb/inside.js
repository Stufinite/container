$( document ).ready(function() {
    $('.ui.dropdown')
      .dropdown()
    ;

    $('#reply222').click(function(){
        if(window.res['id']==undefined){
            toastr.error('請登入後再留言')
            return
        }
        let emotion = $('#emotionDropdown').dropdown('get value')
        let comments = $('textarea').val()
        let payload = Object.assign(res, {'csrfmiddlewaretoken':getCookie('csrftoken'),'comments':comments, 'emotion':emotion})
        if (emotion==''){
            toastr.error('請選擇情緒')
            return
        }
        else if(comments.length<10){
            toastr.error('留言需要至少10個字')
            return
        }
        $.post(location.href, payload)
        .done(function(res) {
            if(res=='SORRY 目前只開放留言一次喔~~ 未來會再依照情況調整'){
                toastr.warning(res);                    
            }
            else{
                toastr.success('留言成功')
                setTimeout("location.reload();", 700)
            }
        })
        .fail(function() {
            toastr.error('請檢查是否登入或是重新整理頁面')
        })
        .always(function() {
            console.log( "reply finished" );
        });                
    })
})