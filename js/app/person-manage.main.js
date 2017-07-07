require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
// var modalAlert = require("../app/modalAlert");

var origin = "http://"+document.location.host;
var group_id = window.location.href.split("attendance_group_id=")[1];
init();
function init () {
	bindEvent();
	getCompany();//获取公司岗位
	index({attendance_group_id:group_id});
	window.isFirst = true;//是否第一次查询
}
//查询
function index(data){
	$.ajax({
        url: origin +'/attendance/attendance-group/manager-person',
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
	               _html +='<tr id='+result[i].person_id+'>'
			          +'<td>'+result[i].name+'</td>'
			          +'<td>'+result[i].id_card+'</td>'
			          +'<td>'+result[i].company+'</td>'
			          +'<td>'+result[i].dept+'</td>'
			          +'<td>'+result[i].post+'</td><td class="operation none"><a href="javascript:;" class="deletebtn">删除</a></td>';
	            }
				$('.person-manage tbody').html(_html);

				pagingEvent(data.result.current_page,data.result.total_pages);//翻页
				page();//翻页禁用
			}else{  
				$('.person-manage tbody').html('<tr><td colspan="9">未搜索到符合条件的数据</td></tr>');
			}
			//操作权限控制
			var btnPer = data.result.button_per;
			if(btnPer.create_btn){
				$(".addbtn").removeClass('none');
			}if(btnPer.delete_btn){
				$(".operation").removeClass('none');
			}
       }else{
          modalAlert(data.error_code+":"+data.error_msg);
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
          	var position = data.result.position;
          	var department = data.result.department;
          	var c_html = '<option value="" selected="">全部</option>';;
			var p_html = '<option value="" selected="">请选择</option>';
			var d_html = '<option value="" selected="">请选择</option>';
	    	if(company.length!=0){
				for(var i=0; i<company.length; i++){
	               c_html +='<option value='+company[i]._id+'>'+company[i].company_name+'</option>';
	            }
				$('#company_name').html(c_html);
			}

			if(position.length!=0){
				for(var i=0; i<position.length; i++){
	               p_html +='<option value='+position[i]._id+'>'+position[i].position_name+'</option>';
	            }
				$('#position_name').html(p_html);
			}
			if(department.length!=0){
				for(var i=0; i<department.length; i++){
	               d_html +='<option value='+department[i]._id+'>'+department[i].department_name+'</option>';
	            }
				$('#department_name').html(d_html);
			}
       }else{
          modalAlert(data.error_code+":"+data.error_msg);
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
		var company_name = $("#company_name").val()=="" ? "":$("#company_name").val();
		var id_card = $("#id_card").val();
		var department_name = $("#department_name").val()=="" ? "":$("#department_name").val();
		var position_name = $("#position_name").val()=="" ? "":$("#position_name").val();
		var data = {
			p:p,
			name:person_name,
			company_id:company_name,
			id_card:id_card,
			department_id:department_name,
			position_id:position_name,
			attendance_group_id:group_id
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
	$(".addbtn").on("click",function(){
		document.getElementById("popForm").reset(); 
		$("#myModal .modal-title").text("新增管理人员");
		$(".saveBtn").show();
		$(".updateBtn").hide();
	});
	// 日历
	$(".form_datetime_start").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd',
		autoclose: true,
	})/*.on("click",function(ev){
	    $(".form_datetime_start").datetimepicker("setEndDate", $(".form_datetime_end").val());
	});*/
	$(".form_datetime_end").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd',
		autoclose: true,
	}).on("click",function(ev){
	    $(".form_datetime_end").datetimepicker("setStartDate", $(".form_datetime_start").val());
	});

	$(document).on("click",".deletebtn",function(){
		var $this = $(this);
		modalConfirm('删除不可恢复是否删除？',function(cb){
		    if (cb) {
				console.log("删除");
				$.ajax({
			        url: origin + '/attendance/attendance-group/remove-person',
			        type: 'post',
			        dataType: 'json',
			        data: {id:$this.parents("tr").attr("id")}
			    })
			    .done(function(data) {
			       if(data.success){
			          // window.location.reload();
			          $this.parents('tr').remove();
			       }else{
			          modalAlert(data.error_code+":"+data.error_msg);
			       }
			    })
			    .fail(function() {
			       modalAlert("网络错误,刷新重试!");
			    });
			}else{
				console.log("取消删除");
			}
		});
	});

	$(".querybtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val()=="" ? "":$("#company_name").val();
		var id_card = $("#id_card").val();
		var department_name = $("#department_name").val()=="" ? "":$("#department_name").val();
		var position_name = $("#position_name").val()=="" ? "":$("#position_name").val();
		var data = {
			p:1,
			name:person_name,
			company_id:company_name,
			id_card:id_card,
			department_id:department_name,
			position_id:position_name,
			attendance_group_id:group_id
		};
		index(data);
		window.isFirst = false;//是否第一次查询
	});

	$(".saveBtn").on("click",function(){
		var person_name = $(".person_name").val();
		var id_card = $(".id_card").val();
		if($.trim(person_name)==""){
			modalAlert("请输入姓名！");
			return;
		} 
		if(!isCardNo.test(id_card)){
			modalAlert("请输入正确的身份证号码！");
			return;
		}
		var data = {
			person_name:person_name,
			id_card:id_card,
			attendance_group_id:group_id
		};
		$.ajax({
	        url: origin + '/attendance/attendance-group/allot-user',
	        type: 'post',
	        dataType: 'json',
	        data: data
	    })
	    .done(function(data) {
	       if(data.success){
	          window.location.reload();
	       }else{
	          modalAlert(data.error_code+":"+data.error_msg);
	       }
	    })
	    .fail(function() {
	       modalAlert("网络错误,刷新重试!");
	    });

	});
}
