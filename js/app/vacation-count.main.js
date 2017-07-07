require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
// var modalAlert = require("../app/modalAlert");

var origin = "http://"+document.location.host;

init();
function init () {
	bindEvent();
	getCompany();//获取公司岗位
	index({p:1});
	window.isFirst = true;//是否第一次查询

	initDate();
	
}
function initDate(){//默认当天
	var d = new Date();
	var month = d.getMonth()+1 < 10 ? "0"+(d.getMonth()+1) : d.getMonth()+1
	var day = d.getDate() < 10 ? "0"+d.getDate() : d.getDate()

	var date = d.getFullYear()+"-"+month+"-"+day
	var start_time = date +" 00:00:00";
	var end_time = date +" 23:59:59";
	$("#from").val(start_time);
	$("#to").val(end_time);
}
//查询
function index(data){ 
	$.ajax({
        url: origin +'/attendance/leave/levstc',
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
	               _html +='<tr id='+result[i].value._id+'>'
			          +'<td>'+result[i]._id.person_name+'</td>'
			          +'<td>'+result[i].value.company_name+'</td>'
			          +'<td>'+result[i].value.position_name+'</td>'
			          +'<td>'+leaveType[result[i]._id.leave_type]+'</td>'
			          +'<td>'+result[i].leave_time_sum+'</td>'
			          +'<td>'+result[i].total+'</td>'
	            }
				$('.vacation-count tbody').html(_html);
				
				pagingEvent(data.result.current_page,data.result.total_pages);//翻页
				page();//翻页禁用
			}else{  
				$('.vacation-count tbody').html('<tr><td colspan="8">未搜索到符合条件的数据</td></tr>');
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
		var from = $("#from").val();
		var to = $("#to").val();
		var data = {
			p:p,
			person_name:person_name,
			company_name:company_name,
			from:from,
			to:to
		};

		// index(data);//查询
		if(window.isFirst){
			index({p:p});
		}else{
			index(data);
		}
		return false;
	});
}

function bindEvent(){
	// 日历
	$(".form_datetime_start").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd 00:00:00',
		autoclose: true,
	})/*.on("click",function(ev){
	    $(".form_datetime_start").datetimepicker("setEndDate", $(".form_datetime_end").val());
	});*/
	$(".form_datetime_end").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd 23:59:59',
		autoclose: true,
	}).on("click",function(ev){
	    $(".form_datetime_end").datetimepicker("setStartDate", $(".form_datetime_start").val());
	});

	$(".querybtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val()=="" ? "":$("#company_name option:selected").text();
		var from = $("#from").val();
		var to = $("#to").val();
		if($.trim('person_name')==''&&$.trim('company_name')==''&&$.trim('from')==''&&$.trim('to')==''){
			modalAlert("至少输入一个查询条件!");
			return;
		}
		if($.trim(to)!=""&&!dataCompare(from,to)){
			modalAlert("结束时间不能小于开始时间！");
			return;
		}
		var data = {
			p:1,
			person_name:person_name,
			company_name:company_name,
			from:from,
			to:to
		};

		index(data);
		window.isFirst = false;//是否第一次查询
	});
	$(".exportbtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val()=="" ? "":$("#company_name option:selected").text();
		var from = $("#from").val();
		var to = $("#to").val();
		window.location.href = origin + '/attendance/leave/levexport?person_name='+person_name+'&company_name='+company_name+'&from='+from+'&to='+to;
	})
}

//data1<data2 true else false
function dataCompare(data1,data2){
	var datas1=data1.split(" ")[0].split("-");
	var datas2=data2.split(" ")[0].split("-");
	if(parseInt(datas1[0])>parseInt(datas2[0])){
		return false;
	}else if(parseInt(datas1[0])<parseInt(datas2[0])){
		return true;
	}else if(parseInt(datas1[1])>parseInt(datas2[1])){
		return false;
	}else if(parseInt(datas1[1])<parseInt(datas2[1])){
		return true;
	}else if(parseInt(datas1[2])>parseInt(datas2[2])){
		return false;
	}else if(parseInt(datas1[2])<=parseInt(datas2[2])){
		return true;
	}
}