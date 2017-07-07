require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
// var modalAlert = require("../app/modalAlert");
var d = new Date();
var month = d.getMonth()+1 < 10 ? "0"+(d.getMonth()+1) : d.getMonth()+1
var day = d.getDate() < 10 ? "0"+d.getDate() : d.getDate()

var date1 = d.getFullYear()+"-"+month+"-"+day
var origin = "http://"+document.location.host;

init();
function init () {
	bindEvent();
	getCompany();//获取公司岗位
	
	window.isFirst = true;//是否第一次查询
	
	index({day:date1},leaveType);
}
//查询
function index(data,leaveType){
	$.ajax({
        url: origin +'/attendance/daily-attendance-record/curdayexc',
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

					// if(result[i].morning_state == 'late'){
					// 	var type = "迟到";
					// 	var status = result[i].leave_early_minutes;
					// }else if(result[i].morning_state == 'casual_leave'){
					// 	var type = "事假";
					// 	var status = result[i].memo.leave_hour;
					// }else{
					// 	for(var item in leaveType){
					// 		if(item == result[i].morning_state){
					// 			var type = leaveType[item];
					// 			var status = "0.5小时";
					// 		}
					// 	}
					// }

	               _html +='<tr id='+result[i]._id+'>'
			          +'<td>'+result[i].name+'</td>'
			          +'<td>'+result[i].memo.company_name+'</td>'
			          +'<td>'+result[i].memo.position_name+'</td>'
			          +'<td>'+result[i].attendance_date+'</td>'
			          +'<td>'+result[i].morning_type_dec+'</td>'
			          +'<td>'+result[i].morning_state_dec+'</td>';
	            }
				$('.day-count tbody').html(_html);
				pagingEvent(data.result.current_page,data.result.total_pages);//翻页
				page();//翻页禁用
			}else{  
				$('.day-count tbody').html('<tr><td colspan="8">未搜索到符合条件的数据</td></tr>');
			}
			//操作权限控制
			var btnPer = data.result.button_per;
			if(btnPer.export_btn){
				$(".exportbtn").removeClass('none');
			}
       }else{
          modalAlert(data.error_msg);
       }
    })
    .fail(function() {
       modalAlert("网络错误,刷新重试!");
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
          	var c_html = '<option value="" selected>全部</option>';;
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
function page(){
	$('.pagination a').on('click',function(){
		if($(this).parent().hasClass('disabled')) return false;
		var p = parseInt($(this).attr('href').split('curr_page=')[1]);
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val()=="" ? "":$("#company_name option:selected").text();
		var day = $("#date").val()
		var data = {
			p:p,
			person_name:person_name,
			company_name:company_name,
			day:day
		};

		// index(data);//查询
		if(window.isFirst){
			index({p:p},leaveType);
		}else{
			index(data,leaveType);
		}
		return false;
	});
}

function bindEvent(){
	
	$("#date").val(date1)
	// 日历
	$("#date").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd',
		autoclose: true,
	})/*.on("click",function(ev){
	    $(".form_datetime_start").datetimepicker("setEndDate", $(".form_datetime_end").val());
	});*/
	// $(".form_datetime_end").datetimepicker({
	// 	minView: "month",
	// 	format: 'yyyy-mm-dd',
	// 	autoclose: true,
	// }).on("click",function(ev){
	//     $(".form_datetime_end").datetimepicker("setStartDate", $(".form_datetime_start").val());
	// });

	$(".querybtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val()=="" ? "":$("#company_name option:selected").text();
		var day = $("#date").val()
		var data = {
			p:1,
			person_name:person_name,
			company_name:company_name,
			day:day
		};
		index(data,leaveType);
		window.isFirst = false;//是否第一次查询
	});
	$(".exportbtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val()=="" ? "":$("#company_name option:selected").text();
		var day = $("#date").val();
		window.location.href = origin + '/attendance/daily-attendance-record/curdayexc-export?person_name='+person_name+'&company_name='+company_name+'&day='+day;
	})
	
}
