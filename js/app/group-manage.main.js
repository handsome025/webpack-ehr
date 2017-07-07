require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
// var modalAlert = require("../app/modalAlert");

var origin = "http://"+document.location.host;
init();
function init () {
	bindEvent();
	index({});
}
//查询
function index(data){
	$.ajax({
        url: origin +'/attendance/attendance-group/index',
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
	               _html +='<tr id='+result[i]._id+'><th class="text-center"><input type="checkbox" class="list-checkbox"></th>'
			          +'<td>'+result[i].group_name+'</td>'
			          +'<td>'+result[i].morning_punch_begin_time+'</td>'
			          +'<td>'+result[i].morning_punch_end_time+'</td>'
			          +'<td>'+result[i].first_day_after_holiday_morning_punch_time+'</td>'
			          +'<td>'+result[i].afternoon_punch_begin_time+'</td>'
			          +'<td>'+result[i].afternoon_punch_end_time+'</td>'
			          +'<td>'+result[i].first_day_after_holiday_afternoon_punch_time+'</td>'
			          +'<td>'+(result[i].is_defer_next_day?"是":"否")+'</td>'
			          +'<td>'+result[i].is_enable+'</td><td class="operation none"><a href="javascript:;" class="editbtn" data-toggle="modal" data-target="#myModal" data-cid="">编辑</a></td>';
	            }
	            $('.group-manage tbody').html(_html);
				pagingEvent(data.result.current_page,data.result.total_pages);//翻页
				page();//翻页禁用
			}else{  
				$('.group-manage tbody').html('<tr><td colspan="10">未搜索到符合条件的数据</td></tr>');
			}
			//操作权限控制
			var btnPer = data.result.button_per;
			if(btnPer.update_btn){
				$(".operation").removeClass('none');
			}if(btnPer.create_btn){
				$(".addbtn").removeClass('none');
			}if(btnPer.mannage_group_btn){
				$(".manage-person").removeClass('none');
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
		var data = {
			p:p,
		};

		index(data);//查询
		return false;
	});
}

function bindEvent(){

	form_datetime()

	$(".addbtn").on("click",function(){
		document.getElementById("popForm").reset(); 
		$("#myModal .modal-title").text("新增考勤组");
		$(".saveBtn").show();
		$(".updateBtn").hide();
		$(".shunyan").removeClass('none')
	});
	$(".is_defer_next_day").on("change",function(){
		if($(this).val() == 1){
			$(".shunyan").removeClass('none')
		}else{
			$(".shunyan").addClass('none')
		}
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

	$('.manage-person').click(function(){//iframe 获取父容器点击事件
		if($(".checkboxClick").find('.checkboxBg').length==0){
			modalAlert("请勾选考勤组!");
			return false;
		}
		var $tr=$(".checkboxClick").find('.checkboxBg');
		var id = $tr.attr('id');
		window.location.href = "person-manage.html?attendance_group_id="+id;
	})

	$('#clickPerson', parent.document).click(function(){//iframe 获取父容器点击事件
		if($(".checkboxClick").find('.checkboxBg').length==0){
			modalAlert("请勾选考勤组!");
			return false;
		}
		var $tr=$(".checkboxClick").find('.checkboxBg');
		var id = $tr.attr('id');
		window.location.href = "person-manage.html?attendance_group_id="+id;
	})

	$(".saveBtn,.updateBtn").on("click",function(){
		var group_name = $(".group_name").val();
		var id = $(".group_name").attr("id");
		var morning_punch_begin_time = $(".morning_punch_begin_time").val();
		var morning_punch_end_time = $(".morning_punch_end_time").val();
		var first_day_after_holiday_morning_punch_time = $(".first_day_after_holiday_morning_punch_time").val();
		var afternoon_punch_begin_time = $(".afternoon_punch_begin_time").val();
		var afternoon_punch_end_time = $(".afternoon_punch_end_time").val();
		var first_day_after_holiday_afternoon_punch_time = $(".first_day_after_holiday_afternoon_punch_time").val();
		var is_enable = $(".is_enable").val();
		var is_defer_next_day = $(".is_defer_next_day").val()
		var defer_time = $(".defer_time").val()
		if($.trim(group_name)==""||$.trim(morning_punch_begin_time)==""||$.trim(morning_punch_end_time)==""||$.trim(first_day_after_holiday_morning_punch_time)==""||$.trim(afternoon_punch_begin_time)==""||$.trim(afternoon_punch_end_time)==""||$.trim(first_day_after_holiday_afternoon_punch_time)==""||$.trim(is_enable)==""){
			return;
		}
		Loading.show()
		var data = {
			id:id,
			group_name:group_name,
			morning_punch_begin_time:morning_punch_begin_time,
			morning_punch_end_time:morning_punch_end_time,
			first_day_after_holiday_morning_punch_time:first_day_after_holiday_morning_punch_time,
			afternoon_punch_begin_time:afternoon_punch_begin_time,
			afternoon_punch_end_time:afternoon_punch_end_time,
			first_day_after_holiday_afternoon_punch_time:first_day_after_holiday_afternoon_punch_time,
			is_enable:is_enable,
			is_defer_next_day:is_defer_next_day,
			defer_time:defer_time
		};
		var url = origin+'/attendance/attendance-group/create';//新增项接口url
		if($(this).hasClass('updateBtn')){//编辑项接口url
			url = origin+'/attendance/attendance-group/update';
		}
		$.ajax({
	        url: url,
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
	    })
	    .complete(function(){
	    	Loading.hide()
	    })

	});
$(document).on("click",".editbtn",function(){
	$(".saveBtn").hide();
	$(".updateBtn").show();
	// $("#myModal .modal-title").text("编辑请假");
	$(".person_name,.company_name,.position_name").prop("disabled",true);

	$(".updateBtn").attr("data-cid",$(this).attr("data-cid"));
	var id = $(this).parents('tr').attr('id');

	$.ajax({
        url: origin+"/attendance/attendance-group/get-info",
        type: 'post',
        dataType: 'json',
        data: {id:id}
    })
    .done(function(data) {
       if(data.success){
       		$("#myModal .modal-title").text("编辑考勤组");
          	var result = data.result;
			// var personInfo = '<option _id='+result._id+' value='+result.person_id+'>'+result.memo.person_name+'</option>';
			// $("#myModal .person_name").html(personInfo);
			$("#myModal .group_name").val(result.group_name);
			$("#myModal .group_name").attr("id",result._id);
			$("#myModal .morning_punch_begin_time").val(result.morning_punch_begin_time);
			$("#myModal .morning_punch_end_time").val(result.morning_punch_end_time);
			$("#myModal .first_day_after_holiday_morning_punch_time").val(result.first_day_after_holiday_morning_punch_time);
			$("#myModal .afternoon_punch_begin_time").val(result.afternoon_punch_begin_time);
			$("#myModal .afternoon_punch_end_time").val(result.afternoon_punch_end_time);
			$("#myModal .first_day_after_holiday_afternoon_punch_time").val(result.first_day_after_holiday_afternoon_punch_time);
			if(result.is_defer_next_day){
				$("#myModal .is_defer_next_day").val("1")
				$(".shunyan").removeClass('none')
			}else{
				$("#myModal .is_defer_next_day").val("0")
				$(".shunyan").addClass('none')
			}
			if(result.defer_time != undefined){
				$("#myModal .defer_time").val(result.defer_time)
			}
			
			if(result.is_enable){
				$("#myModal .is_enable").val('1');
			}else{
				$("#myModal .is_enable").val('0');
			}
			
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

function form_datetime(){
	$("#time1,#time2,#time3,#time4,#time5,#time6,#time7").datetimepicker({
		format: 'hh:ii',
		autoclose: true,
		minView: 0,
		minuteStep: 1,
		startView:1,
		// startDate:new Date(year,month,day,'00','00'),//开始时间，在这时间之前都不可选
	})
}
	
}
