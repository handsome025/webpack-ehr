webpackJsonp([18],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {__webpack_require__(3);
	__webpack_require__(5);
	var ajaxLock = true;

	$("#passwordFindSubmit").on('click',function(){
		var $this = $(this);
		var name = $("#name").val();
		var loginId = $("#loginId").val();
		if( name=='' ){
			modalAlert('姓名不能为空！');
			return;
		}
		if( loginId=='' ){
			modalAlert('账户不能为空！');
			return;
		}
		if( !ajaxLock ) return; ajaxLock = false; $this.addClass('disabled');
		$.ajax({
			url: windowOrigin+'/ehrlogin/login/forgetpwd',
			type: 'POST',
			dataType: 'json',
			data: { name:name, login_id:loginId },
		})
		.done(function(data) {
			console.log(data);
			if( data.success ){
				modalAlert('发送成功，注意查收邮箱！');
			}else{
				modalAlert(data.error_msg);
			}
		})
		.fail(function() {
			console.log("error");
			modalAlert("网络错误，刷新重试！");
		})
		.always(function() {
			console.log("complete");
			ajaxLock = true; $this.removeClass('disabled');
		});
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);