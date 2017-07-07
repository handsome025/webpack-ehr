require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
// var modalAlert = require("../app/modalAlert");
require("../libs/jquery.dataTables");
require("../libs/dataTables.bootstrap");
var origin = "http://"+document.location.host;

init();
function init () {
	var curDate = new Date()
	var year = curDate.getFullYear()
	var month = parseInt(curDate.getMonth()+1) < 10 ? "0"+parseInt(curDate.getMonth()+1) : parseInt(curDate.getMonth()+1)
	$("#month").val(year+"-"+month)
	bindEvent();
	getCompany();//获取公司岗位
	index({month:$("#month").val()});
	window.isFirst = true;//是否第一次查询
}
//查询
function index(data){
	Loading.show()
	webApi.monthSalary(data)
	.always(function(){
		Loading.hide()
	}).then(function(res){
		var result = res.result.datas;
      	var _html = '';
    	if(result.length!=0){
			for(var i=0; i<result.length; i++){
               _html +='<tr id='+result[i]._id+'><th class="text-center"><input type="checkbox" class="list-checkbox"></th>'
		          +'<td id="'+result[i].person_id+'">'+result[i].person_name+'</td>'
		          +'<td>'+result[i].id_number+'</td>'
		          +'<td id="'+result[i].company_id+'">'+(result[i].company_name || "")+'</td>'
		          // +'<td id="'+result[i].department_id+'">'+result[i].department_name+'</td>'
		          // +'<td id="'+result[i].position_id+'">'+result[i].position_name+'</td>'
		          +'<td>'+result[i].month+'</td>'
		          +'<td>'+result[i].basic_salary+'</td>'
		          +'<td>'+result[i].late_charge+'</td>'
		          +'<td>'+result[i].leave_charge+'</td>'
		          +'<td>'+result[i].sick_charge+'</td>'
		          +'<td>'+result[i].absenteeism_charge+'</td>'
		          +'<td>'+result[i].meal_charge+'</td>'
		          +'<td>'+result[i].other_subtraction+'</td>'
		          +'<td>'+result[i].other_addition+'</td>'
		          +'<td>'+result[i].should_salary+'</td>'
		          +'<td>'+result[i].basic_provident_fund+'</td>'
		          +'<td>'+result[i].supplementary_fund+'</td>'
		          +'<td>'+result[i].pension+'</td>'
		          +'<td>'+result[i].health_insurance+'</td>'
		          +'<td>'+result[i].unemployment_insurance+'</td>'
		          +'<td>'+result[i].salary_before_tax+'</td>'
		          +'<td>'+result[i].taxes+'</td>'
		          +'<td>'+result[i].dues+'</td>'
		          +'<td>'+result[i].real_salary+'</td>'
		          +'<td>'+result[i].actual_salary_subtraction+'</td>'
		          +'<td>'+result[i].actual_salary+'</td>';
            }
			$('.month-salary tbody').html(_html);
			pagingEvent(res.result.current_page,res.result.total_page);//翻页
			page();//翻页禁用
		}else{  
			$('.month-salary tbody').html('<tr><td colspan="24">未搜索到符合条件的数据</td></tr>');
		}

		
		//操作权限控制
		var btnPer = res.result.permission;
		if(btnPer.create){
			$(".month-salary .addbtn").removeClass('none');
		}if(btnPer.edit){
			$(".month-salary .editbtn").removeClass('none');
		}if(btnPer.export){
			$(".month-salary .exportbtn").removeClass('none');
		}
	},function(res){
		modalAlert(res.error_msg);
	})
}
function page(){
	$('.pagination a').on('click',function(){
		if($(this).parent().hasClass('disabled')) return false;
		var p = parseInt($(this).attr('href').split('curr_page=')[1]);
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val() == '' ? '':$("#company_name option:selected").text();
		var month = $("#month").val();
		
		var data = {
			p:p,
			person_name:person_name,
			company_name:company_name,
			month:month
		};
		index(data);

		return false;
	});
} 
function getCompany(){
	webApi.searchCondition({})
	.always(function(){
	}).then(function(res){
		var company = res.result.company;
      	var c_html = '<option value="" selected>全部</option>';;
    	if(company.length!=0){
			for(var i=0; i<company.length; i++){
               c_html +='<option value='+company[i]._id+'>'+company[i].company_name+'</option>';
            }
			$('#company_name').html(c_html);
		}
	},function(res){
		modalAlert(res.error_msg);
	})
}

function bindEvent(){
	var curDate = new Date()
	// $("#month").val(curDate.getFullYear()+"-"+(curDate.getMonth()+1))
	// 日历
	$("#month").datetimepicker({
		minView: 4,
		startView:3,
		format: 'yyyy-mm',
		autoclose: true
	});
	var _id
	$(".editbtn").on("click",function(){
		if($(".checkboxClick").find('.checkboxBg').length==0){
			modalAlert("请勾选需要编辑的人员!");
			return false;
		}
		var $tr=$(".checkboxClick").find('.checkboxBg');
		_id = $tr.attr('id');

      	$("#myModal .person_name").val($tr.find('td').eq(0).text())
		$("#myModal .id_number").val($tr.find('td').eq(1).text())
		$("#myModal .company_name").val($tr.find('td').eq(2).text())
		$("#myModal .month").val($tr.find('td').eq(3).text())	
		$("#myModal .basic_salary").val($tr.find('td').eq(4).text())
		$("#myModal .late_charge").val($tr.find('td').eq(5).text())
		$("#myModal .leave_charge").val($tr.find('td').eq(6).text())
		$("#myModal .sick_charge").val($tr.find('td').eq(7).text())
		$("#myModal .other_subtraction").val($tr.find('td').eq(8).text())
		$("#myModal .meal_charge").val($tr.find('td').eq(9).text())
		$("#myModal .other_subtraction").val($tr.find('td').eq(10).text())
		$("#myModal .other_addition").val($tr.find('td').eq(11).text())
		$("#myModal .should_salary").val($tr.find('td').eq(12).text())
		$("#myModal .basic_provident_fund").val($tr.find('td').eq(13).text())
		$("#myModal .supplementary_fund").val($tr.find('td').eq(14).text())
		$("#myModal .pension").val($tr.find('td').eq(15).text())
		$("#myModal .health_insurance").val($tr.find('td').eq(16).text())
		$("#myModal .unemployment_insurance").val($tr.find('td').eq(17).text())
		$("#myModal .salary_before_tax").val($tr.find('td').eq(18).text())
		$("#myModal .taxes").val($tr.find('td').eq(19).text())
		$("#myModal .dues").val($tr.find('td').eq(20).text())
		$("#myModal .real_salary").val($tr.find('td').eq(21).text())
		$("#myModal .actual_salary_subtraction").val($tr.find('td').eq(22).text())
		$("#myModal .actual_salary").val($tr.find('td').eq(23).text()) 
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
		var company_name = $("#company_name").val() == '' ? '':$("#company_name option:selected").text();
		var month = $("#month").val();
		
		var data = {
			p:1,
			person_name:person_name,
			company_name:company_name,
			month:month
		};
		index(data);
		window.isFirst = false;//是否第一次查询
	});

	//重新计算
	$(".recount").on("click",function(){
		Loading.show()
		webApi.reMonthsalary({month:$("#month").val()})
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
		var company_name = $("#company_name").val() == '' ? '':$("#company_name option:selected").text();
		var month = $("#month").val();
		window.location.href = origin + '/salary/month-salary/export?person_name='+person_name+'&company_name='+company_name+'&month='+month
	})

	$(".updateBtn").on("click",function(){
		var data = { 
			id:_id,
			person_name:$("#myModal .person_name").val(),
			id_number:$("#myModal .id_number").val(),
			company_name:$("#myModal .company_name").val(),
			month:$("#myModal .month").val(),	
			basic_salary:$("#myModal .basic_salary").val(),
			late_charge:$("#myModal .late_charge").val(),
			leave_charge:$("#myModal .leave_charge").val(),
			sick_charge:$("#myModal .sick_charge").val(),
			absenteeism_charge:$("#myModal .absenteeism_charge").val(),
			meal_charge:$("#myModal .meal_charge").val(),
			other_subtraction:$("#myModal .other_subtraction").val(),
			other_addition:$("#myModal .other_addition").val(),
			should_salary:$("#myModal .should_salary").val(),
			basic_provident_fund:$("#myModal .basic_provident_fund").val(),
			supplementary_fund:$("#myModal .supplementary_fund").val(),
			pension:$("#myModal .pension").val(),
			health_insurance:$("#myModal .health_insurance").val(),
			unemployment_insurance:$("#myModal .unemployment_insurance").val(),
			salary_before_tax:$("#myModal .salary_before_tax").val(),
			taxes:$("#myModal .taxes").val(),
			dues:$("#myModal .dues").val(),
			real_salary:$("#myModal .real_salary").val(),
			actual_salary:$("#myModal .actual_salary").val(),
			actual_salary_subtraction:$("#myModal .actual_salary_subtraction").val(),
		}
		
		// if($.trim(actual_punch_time_in_morning)==""||$.trim(morning_state)==""){
		// 	return;
		// } 
		// if($.trim(actual_punch_time_in_afternoon)!=""&&!dateCompare(actual_punch_time_in_morning,actual_punch_time_in_afternoon)){
		// 	modalAlert("结束时间不能小于开始时间！");
		// 	return;
		// }
		
		Loading.show()
		webApi.monthSalSave(data)
		.always(function(){
			Loading.hide()
		}).then(function(res){
			 window.location.reload();
		},function(res){
			modalAlert(res.error_msg);
		})

	});
}

