webpackJsonp([9],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {__webpack_require__(3);
	__webpack_require__(12);
	var ajaxLock = true;
	var $submit = $("#submitLogin");
	var keyCodeCheck = true;
	$submit.on('click',function(){
		var $this = $(this);
		var login_id = $("#name").val();
		var password = $("#inputPassword").val();
		if( login_id=='' ){
			modalAlert('用户名不能为空！');
			return;
		}
		if( password=='' ){
			modalAlert('密码不能为空！');
			return;
		}
		if( !ajaxLock ) return; ajaxLock = false; $this.addClass('disabled'); keyCodeCheck = false;
		$.ajax({
			url: windowOrigin+'/ehrlogin/login/sign',
			type: 'POST',
			dataType: 'json',
			data: { login_id:login_id, password:password },
		})
		.done(function(data) {
			console.log(data);
			if( data.success ){
				window.location.href = '/';
			}else{
				modalAlert(data.error_msg);
				$('#myAlert').on('hide.bs.modal', function (e) {
					keyCodeCheck = true;
				});
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
			ajaxLock = true; $this.removeClass('disabled');
		});
	}); 

	document.onkeydown = function (event){ 
	if( event.keyCode==13&&keyCodeCheck ) //回车键的键值为13 
		$("#submitLogin").click();
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);