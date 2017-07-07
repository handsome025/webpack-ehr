require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
require("../libs/jquery.dataTables");
require("../libs/dataTables.bootstrap");
var webApi = require("../userlibs/webApi");
// Loading.show()
var origin = "http://"+document.location.host;

bindEvent()

function bindEvent(){
	$(".updateBtn").on("click",function(){
	    Loading.show()
		webApi.updateStatus({})
		.always(function(){
			Loading.hide()
		}).then(function(res){
			modalAlert("更新成功")
		},function(res){
			modalAlert(res.error_msg);
		})
	});
}

