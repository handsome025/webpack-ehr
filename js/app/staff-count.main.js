require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
// var modalAlert = require("../app/modalAlert");

var origin = "http://"+document.location.host;

var curDate = new Date();
var preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
var month = preDate.getMonth()+1 < 10 ? "0"+(preDate.getMonth()+1) : preDate.getMonth()+1
var day = preDate.getDate() < 10 ? "0"+preDate.getDate() : preDate.getDate()

var queryDate = preDate.getFullYear()+"-"+month+"-"+day

init();
function init () {
	
	bindEvent();
	getCompany()//获取公司岗位
	window.isFirst = true;//是否第一次查询
	
	index({page:1,start:queryDate +" 00:00:00",end:queryDate+" 23:59:59",type:1});
}
//查询
function index(data1){
	$.ajax({
        url: origin +'/attendance/entryleave/index',
        type: 'post',
        dataType: 'json',
        data: data1
    })
    .done(function(data) {
       if(data.success){
          	var result = data.result.datas;
          	var _html = '';
	    	if(result.length!=0){
				for(var i=0; i<result.length; i++){
					var pur = ""
					if(result[i].purchase_conditions == "already_purchase"){
						pur = "已购房"
					}
					if(result[i].purchase_conditions == "not_urchase"){
						pur = "未购房"
					}
	               _html +='<tr>'
			          +'<td>'+result[i].name+'</td>'
			          +'<td>'+result[i].id_number+'</td>'
			          +'<td>'+(result[i].company_name || "")+'</td>'
			          +'<td>'+(result[i].department_name || "")+'</td>'
			          +'<td>'+(result[i].position_name || "")+'</td>'
			          +'<td>'+result[i].accumulation_fund+'</td>'
			          +'<td>'+pur+'</td>'
			          +'<td>'+result[i].hire_date+'</td>'
			          +'<td>'+result[i].actual_resign_date+'</td><tr>'
	            }
				$('.staff-count tbody').html(_html);
				pagingEvent(data1.page,data.result.total_pages);//翻页
				page();//翻页禁用
			}else{  
				$('.staff-count tbody').html('<tr><td colspan="8">未搜索到符合条件的数据</td></tr>');
			}
			// //操作权限控制
			// var btnPer = data.result.button_per;
			// if(btnPer.export_btn){
			// 	$(".exportbtn").removeClass('none');
			// }
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
		// var person_name = $("#person_name").val();
		var company_name = $("#company_name").val()=="" ? "":$("#company_name option:selected").text();
		if($("#date").val() == "day"){
			start = $("#day").val() + " 00:00:00"
			end = $("#day").val()+" 23:59:59"
		}
		if($("#date").val() == "month"){
			var value = $.trim($("#month").val())
			start = value + "-01 00:00:00"
			end = value +"-"+count_date(value)+" 23:59:59"
		}
		if($("#date").val() == "other"){
			start = $("#start").val() + " 00:00:00"
			end = $("#end").val()+" 23:59:59"
		}
		var data = {
			page:p,
			start:start,
			end:end,
			type:$("#type").val(),
			company_name:company_name
		};

		// index(data);//查询
		// if(window.isFirst){
		// 	index({page:p});
		// }else{
			index(data);
		// }
		return false;
	});
	function count_date(mon){
		// var value = $.trim($("#month").val())
		var month = parseInt(mon.split("-")[1])-1
		var year = parseInt(mon.split("-")[0])
		var day_num = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		if((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)){
			day_num = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		}
		
		var day = day_num[month]
		return day
	}
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
	var curDate = new Date();
	$("#day").val(queryDate)
	$("#date").val("day")
	$("#start").val(queryDate)
	$("#end").val(queryDate)
	$("#month").val(curDate.getFullYear()+"-"+(curDate.getMonth()+1))
	
	// 日历
	$("#day").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd',
		autoclose: true,
	})

	$("#month").datetimepicker({
		minView: 4,
		startView:3,
		format: 'yyyy-mm',
		autoclose: true
	});

	$("#start").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd',
		autoclose: true,
	})/*.on("click",function(ev){
	    $(".form_datetime_start").datetimepicker("setEndDate", $(".form_datetime_end").val());
	});*/
	$("#end").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd',
		autoclose: true,
	}).on("click",function(ev){
	    $("#end").datetimepicker("setStartDate", $("#start").val());
	});

	
	$("#date").on("change",function(){
		if($(this).val() == "day"){
			$(".select-day").removeClass('none').siblings('.select').addClass('none')
		}
		if($(this).val() == "month"){
			$(".select-month").removeClass('none').siblings('.select').addClass('none')
		}
		if($(this).val() == "other"){
			$(".select-other").removeClass('none').siblings('.select').addClass('none')
		}
	});
	

	$(".querybtn").on("click",function(){
		var start
		var end 
		if($("#date").val() == "day"){
			start = $("#day").val() + " 00:00:00"
			end = $("#day").val()+" 23:59:59"
		}
		if($("#date").val() == "month"){
			var value = $.trim($("#month").val())
			start = value + "-01 00:00:00"
			end = value +"-"+count_date(value)+" 23:59:59"
		}
		if($("#date").val() == "other"){
			start = $("#start").val() + " 00:00:00"
			end = $("#end").val()+" 23:59:59"
		}
		var company_name = $("#company_name").val()=="" ? "":$("#company_name option:selected").text();
		var data = {
			page:1,
			start:start,
			end:end,
			type:$("#type").val(),
			company_name:company_name
		};
		index(data);
		window.isFirst = false;//是否第一次查询
	});
	$(".exportbtn").on("click",function(){
		var start
		var end 
		if($("#date").val() == "day"){
			start = $("#day").val() + " 00:00:00"
			end = $("#day").val()+" 23:59:59"
		}
		if($("#date").val() == "month"){
			var value = $.trim($("#month").val())
			start = value + "-01 00:00:00"
			end = value +"-"+count_date(value)+" 23:59:59"
		}
		if($("#date").val() == "other"){
			start = $("#start").val() + " 00:00:00"
			end = $("#end").val()+" 23:59:59"
		}
		window.location.href = origin + '/attendance/entryleave/export?start='+start+'&end='+end+"&type="+$("#type").val();
	})

	function count_date(mon){
		// var value = $.trim($("#month").val())
		var month = parseInt(mon.split("-")[1])-1
		var year = parseInt(mon.split("-")[0])
		var day_num = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		if((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)){
			day_num = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		}
		
		var day = day_num[month]
		return day
	}
	
}
