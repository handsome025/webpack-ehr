require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");

require("../libs/jquery.dataTables");
require("../libs/dataTables.bootstrap");

// var modalAlert = require("../app/modalAlert");
var queryName = require("../app/queryname"); //查询姓名
// Loading.show()
var origin = "http://"+document.location.host;

init();
function init () {
	bindEvent();
	getCompany();//获取公司岗位
	getHolidayType();//获取假期类别
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
	Loading.show()
	$.ajax({
        url: origin +'/attendance/leave/index',
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
			          +'<td>'+result[i].memo.person_name+'</td>'
			          +'<td>'+result[i].company_name+'</td>'
			          +'<td>'+result[i].position_name+'</td>'
			          +'<td>'+result[i].leave_type+'</td>'
			          +'<td>'+result[i].start_time+'</td>'
			          +'<td>'+result[i].end_time+'</td>'
			          +'<td>'+result[i].leave_time+'</td>'
			          +'<td class="ws_break">'+result[i].reason+'</td><td class="operation none"><a href="javascript:;" class="editbtn" data-toggle="modal" data-target="#myModal" data-cid="">编辑</a>&nbsp;&nbsp;<a href="javascript:;" class="deletebtn" id="'+result[i]._id+'">删除</a></td>';
	            }
	            if(table){//清除排序栈
					table.fnClearTable();
					table.fnDestroy();
				}
				$('.leave tbody').html(_html);
				// tableSort(".leave table")//表格排序
				pagingEvent(data.result.current_page,data.result.total_pages);//翻页
				page();//翻页禁用
				// sortTable()
			}else{  
				$('.leave tbody').html('<tr><td colspan="9">未搜索到符合条件的数据</td></tr>');
			}
			//操作权限控制
			var btnPer = data.result.button_per;
			if(btnPer.create_btn){
				$(".addbtn").removeClass('none');
			}if(btnPer.update_btn){
				$(".operation").removeClass('none');
			}

       }else{
          modalAlert(data.error_msg);
       }
       Loading.hide()
    })
    .fail(function() {
    	Loading.hide()
        modalAlert("网络错误,刷新重试!");
    });
}
function page(){
	$('.pagination a').on('click',function(){
		if($(this).parent().hasClass('disabled')) return false;
		var p = parseInt($(this).attr('href').split('curr_page=')[1]);
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val() == ''? '':$("#company_name option:selected").text();
		var from = $("#from").val();
		var to = $("#to").val();
		var leave_type = $("#leave_type").val();
		var data = {
			p:p,
			person_name:person_name,
			company_name:company_name,
			from:from,
			to:to,
			leave_type:leave_type
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
          	var h_html = '<option value="" selected>全部</option>';;
	    	if(result.length!=0){
				for(var i=0; i<result.length; i++){
	               h_html +='<option value='+result[i].val+'>'+result[i].name+'</option>';
	            }
			$('#leave_type,.leave_type').html(h_html);
			}
       }else{
          modalAlert(data.error_msg);
       }
    })
    .fail(function() {
       modalAlert("网络错误,刷新重试!");
    });
}
function personEvent(){
	$.ajax({
        url: origin +'/attendance/vacation/person-list',
        type: 'post',
        dataType: 'json',
        data: {}
    })
    .done(function(data) {
       if(data.success){
          	var result = data.result;
          	window.personList = data.result;
   //        	var _html = '<option value="" disabled="" selected>请选择</option>';
	  //   	if(result.length!=0){
			// 	for(var i=0; i<result.length; i++){
	  //              _html +='<option value='+result[i]._id+'>'+result[i].name+'</option>';
	  //           }
			// $('.person_name').html(_html);
			// }
       }else{
          modalAlert(data.error_msg);
       }
    })
    .fail(function() {
       modalAlert("网络错误,刷新重试!");
    });

    // $(".person_name").on("change",function(){
    $(".person_name").on("blur",function(){
    	// var _id = $(this).val();
    	$(".company_name").val("");
    	$(".position_name").val("");
    	var _id = $(this).attr("attr");
    	var personList = window.personList;
    	for(var i=0; i<personList.length; i++){
    		if(_id == personList[i]._id){
    			$(".company_name").val(personList[i].memo.company_name);
    			$(".position_name").val(personList[i].memo.position_name);
    		}
    	}
	})
}

function bindEvent(){
	//查询姓名
	queryName(".person_name")

	$(document).on('click','.searchinp li', function(ev) {
		ev.stopPropagation();
		var id = $(this).attr("attr")
		var name = $(this).html()
		var _input = $(this).closest('div').children('input')
		_input.attr("attr",id)
		_input.val(name)
		var personList = window.personList;
    	for(var i=0; i<personList.length; i++){
    		if(id == personList[i]._id){
    			$(".company_name").val(personList[i].memo.company_name);
    			$(".position_name").val(personList[i].memo.position_name);
    		}
    	}
    	window.enter = false
    	
		$(".searchinp").remove()
	})

	$(document).on('keydown', function(e) {
		e = window.event||e;
		if($(".searchinp").css("display") == 'block' && e.keyCode == 13){
			var id = $(".searchinp .li-curr").attr("attr")
			var name = $(".searchinp .li-curr").html()
			var _input = $(".searchinp .li-curr").closest('div').children('input')
			_input.attr("attr",id)
			_input.val(name)
			var personList = window.personList;
	    	for(var i=0; i<personList.length; i++){
	    		if(id == personList[i]._id){
	    			$(".company_name").val(personList[i].memo.company_name);
	    			$(".position_name").val(personList[i].memo.position_name);
	    			// $(".person_name").focus()
	    		}
	    	}
	    	window.enter = false
			$(".searchinp").remove()
			return false
		}
	})



	$(".addbtn").on("click",function(){
		document.getElementById("popForm").reset(); 
		$("#myModal .modal-title").text("新增请假");
		$(".person_name,.company_name,.position_name").prop("disabled",false);
		$(".saveBtn").show();
		$(".updateBtn").hide();
		personEvent();
	});
	$(".exportbtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val() == ''? '':$("#company_name option:selected").text();
		var from = $("#from").val();
		var to = $("#to").val();
		var leave_type = $("#leave_type").val();
		window.location.href = origin + '/attendance/leave/export?person_name='+person_name+'&company_name='+company_name+'&from='+from+'&to='+to+'&leave_type='+leave_type;
	})
	
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
		minView: "month",
		format: 'yyyy-mm-dd hh:ii:00',
		autoclose: true,
		minView: 0,
		minuteStep: 1
	})/*.on("click",function(ev){
	    $(".form_datetime1_start").datetimepicker("setEndDate", $(".form_datetime1_end").val());
	});*/
	$(".form_datetime1_end").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd hh:ii:00',
		autoclose: true,
		minView: 0,
		minuteStep: 1
	}).on("click",function(ev){
	    $(".form_datetime1_end").datetimepicker("setStartDate", $(".form_datetime1_start").val());
	});

	$(".querybtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val() == ''? '':$("#company_name option:selected").text();
		var from = $("#from").val();
		var to = $("#to").val();
		var leave_type = $("#leave_type").val();
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
			leave_type:leave_type
		};
		index(data);//查询
		window.isFirst = false;//是否第一次查询
	}); 

	$(".saveBtn,.updateBtn").on("click",function(){
		// var _id = $(".person_name option:selected").attr("_id");
		// var person_id = $(".person_name").val();
		// var person_name = $(".person_name").val();
		var _id = $(".person_name").attr("_id");
		var person_id = $(".person_name").attr("attr");
		// var person_name = $(".person_name").val();

		var company_name = $(".company_name").val();
		var position_name = $(".position_name").val();
		var start_time = $(".start_time").val();
		var end_time = $(".end_time").val();
		var leave_type = $(".leave_type").val();
		var leave_time = $(".leave_time").val();
		var reason = $(".reason").val();
		if($.trim(person_id)==""||$.trim(company_name)==""||$.trim(position_name)==""||$.trim(start_time)==""||$.trim(end_time)==""||$.trim(leave_type)==""||$.trim(leave_time)==""||$.trim(reason)==""){
			return;
		}
		if($.trim(reason)==""){
			modalAlert("请填写公出事由");
			return;
		}
		Loading.show()
		var data = {
			id:_id,
			person_id:person_id,
			position_name:position_name,
			company_name:company_name,
			start_time:start_time,
			end_time:end_time,
			leave_type:leave_type,
			leave_time:leave_time,
			reason:reason
		};
		var url = origin+'/attendance/leave/create';//新增项接口url
		if($(this).hasClass('updateBtn')){//编辑项接口url
			url = origin+'/attendance/leave/update';
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
	       Loading.hide()
	    })
	    .fail(function() {
	    	Loading.hide()
	       modalAlert("网络错误,刷新重试!");
	    });

	});
	$(document).on("click",".deletebtn",function(){
		var id = $(this).attr('id');
		var $this = $(this)
		modalConfirm('删除不可恢复是否删除？',function(cb){
		    if (cb) {
				webApi.leaveDelete({id:id})
				.always(function(){
					Loading.hide()
				}).then(function(res){
			      	$this.closest('tr').remove()
			    },function(res){
					modalAlert(res.error_msg);
				})
			}
		})
	})
	

	$(document).on("click",".editbtn",function(){
		$(".saveBtn").hide();
		$(".updateBtn").show();
		// $("#myModal .modal-title").text("编辑请假");
		$(".person_name,.company_name,.position_name").prop("disabled",true);

		$(".updateBtn").attr("data-cid",$(this).attr("data-cid"));
		var id = $(this).parents('tr').attr('id');

		$.ajax({
	        url: origin+"/attendance/leave/get-info",
	        type: 'post',
	        dataType: 'json',
	        data: {id:id}
	    })
	    .done(function(data) {
	       if(data.success){
	       		$("#myModal .modal-title").text("编辑请假");
	          	var result = data.result;
	          	// 20170412
				$("#myModal .person_name").attr("_id",result._id);
				$("#myModal .person_name").attr("attr",result.person_id);
				$("#myModal .person_name").val(result.memo.person_name);
				// var personInfo = '<option _id='+result._id+' value='+result.person_id+'>'+result.memo.person_name+'</option>';
				// $("#myModal .person_name").html(personInfo);
				$("#myModal .company_name").val(result.company_name);
				$("#myModal .position_name").val(result.position_name);
				$("#myModal .leave_type").val(result.leave_type);
				$("#myModal .start_time").val(result.start_time);
				$("#myModal .end_time").val(result.end_time);
				$("#myModal .leave_time").val(result.leave_time);
				$("#myModal .reason").val(result.reason);
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
var table 
function sortTable(){
	table = $('#sortTable').dataTable( {        				
		"bInfo" : false, //所下角信息
		"bFilter" : false, //过滤器
		"bPaginate" : true, //是否显示（应用）分页器 
		"bStateSave" : true,
		"sPaginationType": "full_numbers",
		"aoColumnDefs": [{ "bSortable": true, "aTargets": [8]}],
	});
}