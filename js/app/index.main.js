require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");

// 日历
$(".form_datetime").datetimepicker({
	minView: "month",
	format: 'yyyy-mm-dd',
	autoclose: true
});

$(".group-manage").on("click",function(){
	$(".person-manage").show();
})

$(".manage-person").on("click",function(){
	if($(".checkboxClick").find('.checkboxBg').length==0){
		modalAlert("请勾选考勤组!");
		return false;
	}
	var $tr=$(".checkboxClick").find('.checkboxBg');
	var id = $tr.attr('id');
	window.location.href = "person-manage.html?attendance_group_id="+id;
});
