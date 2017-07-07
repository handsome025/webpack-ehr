require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
// var modalAlert = require("../app/modalAlert");
var queryName = require("../app/queryname"); //查询姓名

var origin = "http://"+document.location.host;
init();
function init () {
	bindEvent();
	getCompany();//获取公司岗位
	
	window.isFirst = true;//是否第一次查询

	initDate(); 
}
function initDate(){//默认当天
	var d = new Date();
	var month = d.getMonth()+1 < 10 ? "0"+(d.getMonth()+1) : d.getMonth()+1
	var day = d.getDate() < 10 ? "0"+d.getDate() : d.getDate()

	var date = d.getFullYear()+"-"+month+"-"+day

	var start_time = date;
	$("#attendance_date").val(start_time);

	index({attendance_date:start_time});
}

//查询
function index(data){
	Loading.show()
	$.ajax({
        url: origin +'/attendance/later/index',
        type: 'post',
        dataType: 'json',
        data: data
    })
    .done(function(data) {
       if(data.success){
          	var result = data.result.datas;
          	var _html = '';
	    	if(result.length!=0){
				for(var i=0; i<result.length; i++){
	               _html +='<tr id='+result[i]._id+'>'
			          +'<td>'+result[i].name+'</td>'
			          +'<td>'+result[i].memo.company_name+'</td>'
			          +'<td>'+result[i].memo.position_name+'</td>'
			          +'<td>'+result[i].attendance_date+'</td>'
			          +'<td>'+result[i].actual_punch_time_in_morning+'</td>'
			          +'<td>'+result[i].morning_type_dec+'</td>'
			          +'<td>'+result[i].morning_state_dec+'</td>';
	            }
				$('.late tbody').html(_html);

				pagingEvent(data.result.current_page,data.result.total_pages);//翻页
				page();//翻页禁用
			}else{  
				$('.late tbody').html('<tr><td colspan="7">未搜索到符合条件的数据</td></tr>');
			}
       }else{
          modalAlert(data.error_msg);
       }
    })
    .fail(function() {
       modalAlert("网络错误,刷新重试!");
    }).always(function(){
		Loading.hide()
	});
}
function page(){
	$('.pagination a').on('click',function(){
		if($(this).parent().hasClass('disabled')) return false;
		var p = parseInt($(this).attr('href').split('curr_page=')[1]);
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val() == ''? '':$("#company_name option:selected").text();
		var attendance_date = $("#attendance_date").val();
		var data = {
			p:p,
			person_name:person_name,
			company_name:company_name,
			attendance_date:attendance_date,
		};

		// index(data);//查询
		// if(window.isFirst){
		// 	index({p:p});
		// }else{
			index(data);
		// }
		return false;
	});
}
function getCompany(){
	$.ajax({
        url: origin +'/attendance/vacation/search-condition',
        type: 'post',
        dataType: 'json',
        data: {}
    })
    .done(function(data) {
       if(data.success){
          	var company = data.result.company;
          	var c_html = '<option value="" selected="">全部</option>';;
	    	if(company.length!=0){
				for(var i=0; i<company.length; i++){
	               c_html +='<option value='+company[i]._id+'>'+company[i].company_name+'</option>';
	            }
			$('#company_name').html(c_html);
			}
       }else{
          modalAlert(data.error_msg);
       }
    })
    .fail(function() {
       modalAlert("网络错误,刷新重试!");
    });

}
function bindEvent(){
	// 日历
	$(".form_datetime_start").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd',
		autoclose: true,
	})

	$(".exportbtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name option:selected").text() == '全部'? '':$("#company_name option:selected").text();
		var attendance_date = $("#attendance_date").val();
		window.location.href = origin + '/attendance/later/export?person_name='+person_name+'&company_name='+company_name+'&attendance_date='+attendance_date;
	})
	$(".querybtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name option:selected").text() == '全部'? '':$("#company_name option:selected").text();
		var attendance_date = $("#attendance_date").val();
		var data = {
			p:1,
			person_name:person_name,
			company_name:company_name,
			attendance_date:attendance_date,
		};

		index(data);
	})
}
