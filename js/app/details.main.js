require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
// var modalAlert = require("../app/modalAlert");
require("../libs/jquery.dataTables");
require("../libs/dataTables.bootstrap");
var origin = "http://"+document.location.host;
var per_total = 10
init();
function init () {
	bindEvent();
	getCompany();//获取公司岗位
	getHolidayType()//获取假期类别
	index({});
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
        url: origin +'/attendance/daily-attendance-record/index',
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
					// var memo = !result[i].memo ? '':result[i].memo;
					// if(memo != ""){
					// 	var company_name = !memo.company_name ? '': memo.company_name;
					// 	var position_name = !memo.position_name ? '': memo.position_name;
					// }else{
					// 	var company_name = '';
					// 	var position_name = '';
					// }
					
	               _html +='<tr id='+(!result[i]._id ? '':result[i]._id)+'><th class="text-center"><input type="checkbox" class="list-checkbox"></th>'
	               	  +'<td>'+(!result[i].attendance_no ? '':result[i].attendance_no)+'</td>'
			          +'<td>'+(!result[i].name ? '':result[i].name) +'</td>'
			          +'<td>'+(result[i].company_name || "")+'</td>'
			          +'<td>'+(result[i].position_name || "")+'</td>'
			          +'<td>'+(!result[i].attendance_date ? '': result[i].attendance_date)+'</td>'
			          +'<td>'+(!result[i].actual_punch_time_in_morning ? '': result[i].actual_punch_time_in_morning)+'</td>'
			          +'<td>'+(!result[i].actual_punch_time_in_afternoon ? '': result[i].actual_punch_time_in_afternoon)+'</td>'
			          +'<td>'+(!result[i].punch_time_should_be_morning ? '': result[i].punch_time_should_be_morning)+'</td>'
			          +'<td>'+(!result[i].punch_time_should_be_afternoon ? '': result[i].punch_time_should_be_afternoon)+'</td>'
			          +'<td value="'+(result[i].morning_state == "" ? '': result[i].morning_state)+'">'+(result[i].morning_state == "" ? '': leaveType[result[i].morning_state])+'</td>'
			          +'<td>'+(!result[i].late_minutes_in_morning ? '': result[i].late_minutes_in_morning)+'</td>'
			          +'<td>'+(!result[i].late_charge_in_morning ? '': result[i].late_charge_in_morning)+'</td>'
			          +'<td value="'+(result[i].noon_state == "" ? '': result[i].noon_state)+'">'+(result[i].noon_state == "" ? '': leaveType[result[i].noon_state])+'</td>'
			          +'<td value="'+(result[i].afternoon_state == "" ? '': result[i].afternoon_state)+'">'+(result[i].afternoon_state == "" ? '': leaveType[result[i].afternoon_state])+'</td>'
			          +'<td>'+(!result[i].leave_early_minutes ? '': result[i].leave_early_minutes)+'</td>';
	            }
	            if(table){
					table.fnClearTable();
					table.fnDestroy();
				}
				$('.details tbody').html(_html);
				// sortTable()
				pagingEvent(data.result.current_page,data.result.total_pages,per_total);//翻页
				page();//翻页禁用

			}else{  
				$('.details tbody').html('<tr><td colspan="16">未搜索到符合条件的数据</td></tr>');
			}

			//操作权限控制
			var btnPer = data.result.button_per;
			if(btnPer.import_morming_data_btn){
				$("#excelForm1 .intoBtn").removeClass('none');
			}if(btnPer.import_afternoon_data_btn){
				$("#excelForm2 .intoBtn").removeClass('none');
			}if(btnPer.update_btn){
				$(".editbtn").removeClass('none');
			}if(btnPer.export_btn){
				$(".exportbtn3").removeClass('none');
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
		var company_name = $("#company_name").val() == '' ? '':$("#company_name option:selected").text();
		var from = $("#from").val();
		var to = $("#to").val();
		var morning_state = $("#morning_state option:selected").text() == '' ? '请选择':$("#morning_state").val();
		var afternoon_state = $("#afternoon_state option:selected").text() == '请选择' ? '':$("#afternoon_state").val();
		
		var data = {
			p:p,
			person_name:person_name,
			company_name:company_name,
			from:from, 
			to:to,
			morning_state:morning_state,
			afternoon_state:afternoon_state
		};

		// index(data);//查询
		if(window.isFirst){
			index({p:p});
		}else{
			index(data);
		}
		return false;
	});
	$('.pagination select').on('change',function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val() == '' ? '':$("#company_name option:selected").text();
		var from = $("#from").val();
		var to = $("#to").val();
		var morning_state = $("#morning_state option:selected").text() == '' ? '请选择':$("#morning_state").val();
		var afternoon_state = $("#afternoon_state option:selected").text() == '请选择' ? '':$("#afternoon_state").val();
		per_total = $('.pagination select').val()
		var data = {
			p:1,
			person_name:person_name,
			company_name:company_name,
			from:from, 
			to:to,
			morning_state:morning_state,
			afternoon_state:afternoon_state,
			// per:$('.pagination select').val()
		};
		index(data);
	})
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
			// $("#from").val(data.result.start_time);
			// $("#to").val(data.result.end_time);
			}
       }else{
          modalAlert(data.error_msg);
       }
    })
    .fail(function() {
       modalAlert("网络错误,刷新重试!");
    });

}

function getHolidayType(){//获取假期类别
	$.ajax({
        url: origin +'/attendance/leave/holiday-type',
        type: 'post',
        dataType: 'json',
        data: {}
    })
    .done(function(data) {
       if(data.success){
          	var result = data.result;
          	var h_html = '';
	    	if(result.length!=0){
				for(var i=0; i<result.length; i++){
	               h_html +='<option value='+result[i].val+'>'+result[i].name+'</option>';
	            }
			$('#morning_state,#afternoon_state,.morning_state,.afternoon_state').append(h_html);
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
	$(".editbtn").on("click",function(){
		if($(".checkboxClick").find('.checkboxBg').length==0){
			modalAlert("请勾选需要编辑的人员!");
			return false;
		}
		var $tr=$(".checkboxClick").find('.checkboxBg');
		var id = $tr.attr('id');
		$.ajax({
	        url: origin+"/attendance/daily-attendance-record/get-info",
	        type: 'post',
	        dataType: 'json',
	        data: {id:id}
	    })
	    .done(function(data) {
	       if(data.success){
	       		$("#myModal .modal-title").text("编辑考勤流水");
	          	var result = data.result;
	          	$("#myModal .actual_punch_time_in_morning").attr("id",result._id);
				$("#myModal .actual_punch_time_in_morning").val(result.actual_punch_time_in_morning);
				$("#myModal .morning_state").val(result.morning_state);
				$("#myModal .actual_punch_time_in_afternoon").val(result.actual_punch_time_in_afternoon);
				$("#myModal .afternoon_state").val(result.afternoon_state);
				$("#myModal .noon_state").val(result.noon_state);
				$("#myModal .late_minutes_in_morning").val(result.late_minutes_in_morning);
				$("#myModal .late_charge_in_morning").val(result.late_charge_in_morning);
				
	       }else{
	          modalAlert(data.error_msg);
	          return false; 
	       }
	    })
	    .fail(function() {
	       modalAlert("网络错误,刷新重试!");
	       return false;
	    });
	});

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

	$(".form_datetime1_start").datetimepicker({
		format: 'yyyy-mm-dd hh:ii:00',
		autoclose: true,
		minView: 0,
		minuteStep: 1/*,
		startView:1,*/
		// startDate:new Date(year,month,day,'00','00'),//开始时间，在这时间之前都不可选
	})/*.on("click",function(ev){
	    $(".form_datetime1_start").datetimepicker("setEndDate", $(".form_datetime1_end").val());
	});*/
	$(".form_datetime1_end").datetimepicker({
		format: 'yyyy-mm-dd hh:ii:00',
		autoclose: true,
		minView: 0,
		minuteStep: 1 /*,
		startView:1,*/
		// startDate:new Date(year,month,day,'12','00'),//开始时间，在这时间之前都不可选
	}).on("click",function(ev){
	    $(".form_datetime1_end").datetimepicker("setStartDate", $(".form_datetime1_start").val());
	});
	 
	// 整行选择
	$(document).on("click",".checkboxClick tr",function(){
	    if( !$(this).hasClass('checkboxBg') ){
	        $(".checkboxClick tr").removeClass('checkboxBg');
	        $(".list-checkbox").removeAttr('checked');
	        $(this).addClass('checkboxBg').find(".list-checkbox").prop("checked",'checked');
	    }else{
	        $(".checkboxClick tr").removeClass('checkboxBg');
	        $(".list-checkbox").removeAttr('checked');
	    }
	});
	$(".exportbtn1").on("change",function(){
		$("body").append('<div class="fileLoading" style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;background: rgba(255,255,255,.8) url(images/loading.gif) no-repeat center;z-index: 9999;"></div>');
		$("#excelForm1").submit();
	})
	$(".exportbtn2").on("change",function(){
		$("body").append('<div class="fileLoading" style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;background: rgba(255,255,255,.8) url(images/loading.gif) no-repeat center;z-index: 9999;"></div>');
		$("#excelForm2").submit();
	})
	// $(".exportbtn3").on("change",function(){
	// 	$("body").append('<div class="fileLoading" style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;background: rgba(255,255,255,.8) url(images/loading.gif) no-repeat center;z-index: 9999;"></div>');
	// 	$("#excelForm3").submit();
	// })

	$(".querybtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val() == '' ? '':$("#company_name option:selected").text();
		var from = $("#from").val();
		var to = $("#to").val();
		var morning_state = $("#morning_state option:selected").text() == '请选择'? '':$("#morning_state").val();
		var afternoon_state = $("#afternoon_state option:selected").text() == '请选择' ? '':$("#afternoon_state").val();
		
		if($.trim(to)!=""&&!dataCompare(from,to)){
			modalAlert("结束时间不能小于开始时间！");
			return;
		}
		var data = {
			p:1,
			person_name:person_name,
			company_name:company_name,
			from:from,
			to:to,
			morning_state:morning_state,
			afternoon_state:afternoon_state
		};
		index(data);
		window.isFirst = false;//是否第一次查询
	});

	$(".exportbtn3").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val() == '' ? '':$("#company_name option:selected").text();
		var from = $("#from").val();
		var to = $("#to").val();
		var morning_state = $("#morning_state option:selected").text() == '请选择'? '':$("#morning_state").val();
		var afternoon_state = $("#afternoon_state option:selected").text() == '请选择' ? '':$("#afternoon_state").val();
		window.location.href = origin + '/attendance/daily-attendance-record/export?person_name='+person_name+'&company_name='+company_name+'&from='+from+'&to='+to+'&morning_state='+morning_state+'&afternoon_state='+afternoon_state;
	})

	$(".updateBtn").on("click",function(){
		var id = $(".actual_punch_time_in_morning").attr("id");
		var actual_punch_time_in_morning = $(".actual_punch_time_in_morning").val();
		var morning_state = $(".morning_state").val();
		var actual_punch_time_in_afternoon = $(".actual_punch_time_in_afternoon").val();
		var afternoon_state = $(".afternoon_state").val();
		var noon_state = $(".noon_state").val();
		var late_minutes_in_morning = $(".late_minutes_in_morning").val();
		var late_charge_in_morning = $(".late_charge_in_morning").val();
		
		
		if($.trim(actual_punch_time_in_morning)==""||$.trim(morning_state)==""){
			return;
		} 
		if($.trim(actual_punch_time_in_afternoon)!=""&&!dateCompare(actual_punch_time_in_morning,actual_punch_time_in_afternoon)){
			modalAlert("结束时间不能小于开始时间！");
			return;
		}
		var data = {
			id:id,
			actual_punch_time_in_morning:actual_punch_time_in_morning,
			morning_state:morning_state,
			actual_punch_time_in_afternoon:actual_punch_time_in_afternoon,
			afternoon_state:afternoon_state,
			noon_state:noon_state,
			late_charge_in_morning:late_charge_in_morning,
			late_minutes_in_morning:late_minutes_in_morning
		};
		$.ajax({
	        url: origin + '/attendance/daily-attendance-record/update',
	        type: 'post',
	        dataType: 'json',
	        data: data
	    })
	    .done(function(data) {
	       if(data.success){
	          window.location.reload();
	       }else{
	          modalAlert(data.error_msg);
	       }
	    })
	    .fail(function() {
	       modalAlert("网络错误,刷新重试!");
	    });

	});
}

function timeEvent(date,start_time,end_time){
	var year = date.split('/')[0];
	var month = date.split('/')[1];
	var day = date.split('/')[2];
	var start_hour = start_time.split(':')[0];
	var start_min = start_time.split(':')[1];
	var end_hour = end_time.split(':')[0];
	var end_min = end_time.split(':')[1];
	$(".form_datetime1_start").datetimepicker({
		format: 'hh:ii',
		autoclose: true,
		minView: 0,
		minuteStep: 1,
		startView:1,
		startDate:new Date(year,month,day,'00','00'),//开始时间，在这时间之前都不可选
	})/*.on("click",function(ev){
	    $(".form_datetime1_start").datetimepicker("setEndDate", $(".form_datetime1_end").val());
	});*/
	$(".form_datetime1_end").datetimepicker({
		format: 'hh:ii',
		autoclose: true,
		minView: 0,
		minuteStep: 1 ,
		startView:1,
		startDate:new Date(year,month,day,'12','00'),//开始时间，在这时间之前都不可选
	})/*.on("click",function(ev){
	    $(".form_datetime1_end").datetimepicker("setStartDate", $(".form_datetime1_start").val());
	});*/
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

function dateCompare(data1,data2){
	var datas1=data1.split(" ")[0].split("-");
	var datas2=data2.split(" ")[0].split("-");
	var datas3=data1.split(" ")[1].split(":");
	var datas4=data2.split(" ")[1].split(":");
	// var sec1= typeof(datas3[2])=="undefined" ? '00':datas3[2];
	// var sec2= typeof(datas4[2])=="undefined" ? '00':datas3[2];
	if(datas1[0]>datas2[0]){
		return false;
	}else if(datas1[0]<datas2[0]){
		return true;
	}else if(datas1[1]>datas2[1]){
		return false;
	}else if(datas1[1]<datas2[1]){
		return true;
	}else if(datas1[2]>datas2[2]){
		return false;
	}else if(datas1[2]<=datas2[2]){
		return true;
	}else if(datas3[0]>datas4[0]){
		return false;
	}else if(datas3[0]<datas4[0]){
		return true;
	}else if(datas3[1]>datas4[1]){
		return false;
	}else if(datas3[1]<datas4[1]){
		return true;
	}
}
var table 
function sortTable(){
	table =  $('#sortTable').dataTable( {        				
		"bInfo" : false, //所下角信息
		"bFilter" : false, //过滤器
		"bPaginate" : false, //是否显示（应用）分页器 
		"aoColumnDefs": [{ "bSortable": false, "aTargets": [0]}],
	}); 
	$(".dataTables_filter input[type=text]").addClass('form-control')
}