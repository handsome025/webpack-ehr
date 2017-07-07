require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
// var modalAlert = require("../app/modalAlert");

var origin = "http://"+document.location.host;
init();
function init () {
	var d = new Date();
	var month = d.getMonth()+1 < 10 ? "0"+(d.getMonth()+1) : d.getMonth()+1
	var day = d.getDate() < 10 ? "0"+d.getDate() : d.getDate()

	var date1 = d.getFullYear()+"-"+month
	$("#month").val(date1)
	bindEvent();
	getCompany();//获取公司岗位
	index({});
	window.isFirst = true;//是否第一次查询
}
//查询
function index(data){
	$.ajax({
        url: origin +'/attendance/monthly-record/index',
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
			          +'<td>'+result[i].memo.person_name+'</td>'
			          +'<td>'+result[i].company_name+'</td>'
			          +'<td>'+result[i].position_name+'</td>'
			          +'<td>'+result[i].month+'</td>'
			          +'<td>'+result[i].annual_leave+'</td>'
			          +'<td>'+result[i].public_leave+'</td>'
			          +'<td>'+result[i].sick_leave+'</td>'
			          +'<td>'+result[i].casual_leave+'</td>'
			          +'<td>'+result[i].absenteeism_hours+'</td>'
			          +'<td>'+result[i].late_charge+'</td>'
			          +'<td>'+result[i].attendance_times+'</td>'
			          +'<td>'+result[i].late_times+'</td>'
			          

	            }
				$('.month-count tbody').html(_html);
		
				pagingEvent(data.result.current_page,data.result.total_pages);//翻页
				page();//翻页禁用
			}else{  
				$('.month-count tbody').html('<tr><td colspan="11">未搜索到符合条件的数据</td></tr>');
			}
				
			//操作权限控制
			var btnPer = data.result.button_per;
			if(btnPer.update_btn){
				$(".editbtn").removeClass('none');
			}if(btnPer.export_btn){
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
		var company_name = $("#company_name").val()=="" ? '':$("#company_name option:selected").text();
		var month = $("#month").val();
		var data = {
			p:p,
			person_name:person_name,
			company_name:company_name,
			month:month
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
	$(".editbtn").on("click",function(){
		if($(".checkboxClick").find('.checkboxBg').length==0){
			modalAlert("请勾选需要编辑的人员!");
			return false;
		}
		$(".saveBtn").hide();
		$(".updateBtn").show();
		
		$(".person_name,.company_name,.position_name").prop("disabled",true);

		var $tr=$(".checkboxClick").find('.checkboxBg').closest('tr');
		var id = $tr.attr('id');

		$.ajax({
	        url: origin+"/attendance/monthly-record/get-info",
	        type: 'post',
	        dataType: 'json',
	        data: {id:id}
	    })
	    .done(function(data) {
	       if(data.success){
	       		$("#myModal .modal-title").text("编辑月度考勤");
	          	var result = data.result;
				$("#myModal .sick_leave").attr("id",result._id);
				$("#myModal .sick_leave").val(result.sick_leave);
				$("#myModal .casual_leave").val(result.casual_leave);
				$("#myModal .public_leave").val(result.public_leave);
				$("#myModal .annual_leave").val(result.annual_leave);
				$("#myModal .late_charge").val(result.late_charge);
				$("#myModal .attendance_times").val(result.attendance_times);
				$("#myModal .late_times").val(result.late_times);

				$("#myModal .absenteeism_hours").val($tr.find("td").eq(8).text());
				
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
	$(".form_datetime").datetimepicker({
		minView: 4,
		startView:3,
		format: 'yyyy-mm',
		autoclose: true
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

	$(".querybtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val()=="" ? '':$("#company_name option:selected").text();
		var month = $("#month").val();
		var data = {
			p:1,
			person_name:person_name,
			company_name:company_name,
			month:month
		};
		index(data)//查询
		window.isFirst = false;//是否第一次查询
	});

	//重新计算
	$(".recount").on("click",function(){
		Loading.show()
		webApi.reMonthrecord({month:$("#month").val()})
		.always(function(){
			Loading.hide()
		}).then(function(res){
	      	modalAlert("计算成功！");
	    },function(res){
			modalAlert(res.error_msg);
		})
	});

	$(".exportbtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val()=="" ? '':$("#company_name option:selected").text();
		var month = $("#month").val();
		window.location.href = origin + '/attendance/monthly-record/export?person_name='+person_name+'&company_name='+company_name+'&month='+month;
	})

	$(".updateBtn").on("click",function(){
		var id = $(".sick_leave").attr("id");
		var sick_leave = $(".sick_leave").val();
		var casual_leave = $(".casual_leave").val();
		// var change_leave = $(".change_leave").val();
		var public_leave = $(".public_leave").val();
		var annual_leave = $(".annual_leave").val();
		var late_charge = $(".late_charge").val();
		var attendance_times = $(".attendance_times").val();
		var late_times = $(".late_times").val();
		var absenteeism_hours = $(".absenteeism_hours").val();
		var data = {
			id:id,
			sick_leave:sick_leave,
			casual_leave:casual_leave,
			public_leave:public_leave,
			annual_leave:annual_leave,
			late_charge:late_charge,
			attendance_times:attendance_times,
			late_times:late_times,
			absenteeism_hours:absenteeism_hours
		};

		$.ajax({
	        url: origin + '/attendance/monthly-record/update',
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
