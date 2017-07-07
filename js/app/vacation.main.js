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
	index({});
	window.isFirst = true;
}

//查询
function index(data){
	$.ajax({
        url: origin +'/attendance/vacation/index',
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
			          +'<td>'+result[i].annual+'</td>'
			          +'<td>'+result[i].available_leave+'</td>' 
			          +'<td>'+(!result[i].used_leave ? '':result[i].used_leave)+'</td>'
			          +'<td>'+result[i].remaining_leave+'</td>'
			          +'<td>'+(!result[i].available_change_leave ? '':result[i].available_change_leave)+'</td>'
			          +'<td>'+(!result[i].used_change_leave ? '':result[i].used_change_leave)+'</td>'
			          +'<td>'+(!result[i].remaining_change_leave ? '':result[i].remaining_change_leave)+'</td>'
			          +'</tr>';
	            }
				$('.vacation tbody').html(_html);

				pagingEvent(data.result.current_page,data.result.total_pages);//翻页
				page();//翻页禁用
			}else{  
				$('.vacation tbody').html('<tr><td colspan="11">未搜索到符合条件的数据</td></tr>');
			}
			
			//操作权限控制
			var btnPer = data.result.button_per;
			if(btnPer.create_btn){
				$(".addbtn").removeClass('none');
			}if(btnPer.update_btn){
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
function page(){
	$('.pagination a').on('click',function(){
		if($(this).parent().hasClass('disabled')) return false;
		var p = parseInt($(this).attr('href').split('curr_page=')[1]);
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val()=='' ? '':$("#company_name option:selected").text();
		var position_name = $("#position_name").val()=='' ? '':$("#position_name option:selected").text();
		var annual = $("#annual").val();
		var data = {
			p:p,
			person_name:person_name,
			company_name:company_name,
			position_name:position_name,
			annual:annual
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
          	var position = data.result.position;
          	var c_html = '<option value="" selected>全部</option>';;
			var p_html = '<option value="" selected>请选择</option>';
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
          	var _html = '<option value="" disabled="" selected>请选择</option>';
	    	if(result.length!=0){
				for(var i=0; i<result.length; i++){
	               _html +='<option value='+result[i]._id+'>'+result[i].name+'</option>';
	            }
			$('.person_name').html(_html);
			}
       }else{
          modalAlert(data.error_msg);
       }
    })
    .fail(function() {
       modalAlert("网络错误,刷新重试!");
    });

    // $(".person_name").on("change",function(){
    $(".person_name").on("blur",function(){
    	var _id = $(this).val();
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
	    			// $(".company_name").focus()
	    		}
	    	}
	    	window.enter = false
			$(".searchinp").remove()
			return false
		}
		
	})
	var _id
	$(".addbtn").on("click",function(){
		document.getElementById("popForm").reset(); 
		$("#myModal .modal-title").text("新增假期");
		$(".person_name,.company_name,.position_name").prop("disabled",false);
		$("#myModal .annual").val(new Date().getFullYear());
		$(".saveBtn").show(); 
		$(".updateBtn").hide();
		_id = ""
		personEvent();
	});
	$(".editbtn").on("click",function(){
		if($(".checkboxClick").find('.checkboxBg').length==0){
			modalAlert("请勾选需要编辑的人员!");
			return false;
		}
		$(".saveBtn").hide();
		$(".updateBtn").show();
		
		$(".person_name,.company_name,.position_name").prop("disabled",true);

		var $tr=$(".checkboxClick").find('.checkboxBg');
		_id = $tr.attr('id');
		var person_name = $tr.find("td").eq(0).text()

		$.ajax({
	        url: origin+"/attendance/vacation/get-info",
	        type: 'post',
	        dataType: 'json',
	        data: {id:_id}
	    })
	    .done(function(data) {
	       if(data.success){
	       		$("#myModal .modal-title").text("编辑假期");
	          	var result = data.result;
				$("#myModal .person_name").val(person_name);
				$("#myModal .person_name").attr("attr",result.person_id);
				// var personInfo = '<option _id='+result._id+' value='+result.person_id+'>'+result.memo.person_name+'</option>';
				// $("#myModal .person_name").html(personInfo);
				$("#myModal .company_name").val(result.company_name);
				$("#myModal .position_name").val(result.position_name);
				$("#myModal .annual").val(result.annual);
				$("#myModal .available_leave").val(result.available_leave);
				$("#myModal .used_leave").val(result.used_leave);
				$("#myModal .remaining_leave").val(result.remaining_leave);
				$("#myModal .available_change_leave").val(result.available_change_leave);
				$("#myModal .used_change_leave").val(result.used_change_leave);
				$("#myModal .remaining_change_leave").val(result.remaining_change_leave);
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
		var company_name = $("#company_name").val() == ''? '':$("#company_name option:selected").text();
		var position_name = $("#position_name").val() == ''? '':$("#position_name option:selected").text();
		var annual = $("#annual").val();
		var data = {
			p:1,
			person_name:person_name,
			company_name:company_name,
			position_name:position_name,
			annual:annual
		};
		index(data);//查询
		window.isFirst = false;//是否第一次查询
	});

	$(".exportbtn").on("click",function(){
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val() == ''? '':$("#company_name option:selected").text();
		var position_name = $("#position_name").val() == ''? '':$("#position_name option:selected").text();
		var annual = $("#annual").val();
		window.location.href = origin + '/attendance/vacation/export?person_name='+person_name+'&company_name='+company_name+'&position_name='+position_name+'&annual='+annual;
	})

	$(".saveBtn,.updateBtn").on("click",function(){
		// var _id = $("#myModal .person_name option:selected").attr("_id");
		// var person_id = $("#myModal .person_name").val();
		var person_id = $("#myModal .person_name").attr("attr");
		var person_name = $(".person_name").val();
		var company_name = $(".company_name").val();
		var position_name = $(".position_name").val();
		var annual = $(".annual").val();
		var available_leave = $(".available_leave").val();
		var used_leave = $(".used_leave").val();
		var remaining_leave = $(".remaining_leave").val();
		var available_change_leave = $(".available_change_leave").val();
		var used_change_leave = $(".used_change_leave").val();
		var remaining_change_leave = $(".remaining_change_leave").val();

		if($.trim(person_name)==""||$.trim(company_name)==""||$.trim(position_name)==""||$.trim(annual)==""){
			return;
		}
		var data = {
			id:_id,
			person_id:person_id,
			// person_name:person_name,
			company_name:company_name,
			position_name:position_name,
			annual:annual,
			available_leave:available_leave,
			used_leave:used_leave,
			remaining_leave:remaining_leave,
			available_change_leave:available_change_leave,
			used_change_leave:used_change_leave,
			remaining_change_leave:remaining_change_leave
		};
		var url = origin+'/attendance/vacation/create';//新增项接口url
		if($(this).hasClass('updateBtn')){//编辑项接口url
			url = origin+'/attendance/vacation/update';
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
	    });

	});

}
