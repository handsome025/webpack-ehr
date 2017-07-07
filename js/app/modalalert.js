// /**
//  * 初始化modal
//  */
// function initModal() {
//     var body = $(document.body);

//     if ($('#modal-alert').size() == 0) {
//         // 添加alert框
//         body.append('<div class="modal fade" style="z-index: 999999" id="modal-alert" tabindex="-1" role="dialog" data-keyboard="false" aria-hidden="true" data-backdrop="static"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">提示</h4> </div> <div class="modal-body" style="font-size: 16px;"> </div> <div class="modal-footer"> <button type="button" class="btn btn-primary btn-confirm" data-dismiss="modal">确定</button> </div> </div> </div> </div>');
//     }

//     if ($('#modal-confirm').size() == 0) {
//         // 添加confirm框
//         body.append('<div class="modal fade" style="z-index: 999999" id="modal-confirm" tabindex="-1" role="dialog" data-keyboard="false" aria-hidden="true" data-backdrop="static"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">提示</h4> </div> <div class="modal-body" style="font-size: 16px;"> </div> <div class="modal-footer"> <button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">取消</button> <button type="button" class="btn btn-primary btn-confirm" data-dismiss="modal">确定</button> </div> </div> </div> </div>');
//     }
// }

//     /**
//  * 自定义alert
//  * @param  {String}   text 提示文本
//  * @param  {Function} cb   回调函数
//  */
// function modalAlert(text, cb) {
//     var modal = $('#modal-alert');
//     modal.find('.modal-body').empty().text(text);
//     if (typeof cb === 'function') {
//         modal.find('.btn-confirm').one('click', function() {
//             cb();
//         });
//         modal.on('hidden.bs.modal', function() {
//             modal.find('.btn-confirm').off('click');
//         });
//     }
//     modal.modal('show');
// }


// function modalalert(text, cb){
//         initModal();
//         modalAlert(text, cb);
//         // modalConfirm(text, cb);
//     };

//     module.exports = modalalert;

function modalAlert(text){
    $("#myAlert").remove();
    $("body").append('<div class="modal fade bs-example-modal-sm myAlert" id="myAlert" tabindex="-1" role="dialog" aria-labelledby="myAlert">'
      +'<div class="modal-dialog modal-sm" role="document">'
        +'<div class="modal-content">'
          +'<div class="modal-header">'
            +'<h5 class="modal-title text-center" id="myAlertTitle" style="padding:5px 0;">'+text+'</h4>'
          +'</div>'
          +'<div class="modalClose">'
            +'<a href="javascript:;" data-dismiss="modal">确&nbsp;认</a>'
        +'</div>'
        +'</div>'
      +'</div>'
    +'</div>');
    $('#myAlert').modal('show');
    $(".modal-backdrop:last").css({'z-index':"9998"});
}
module.exports = modalAlert;