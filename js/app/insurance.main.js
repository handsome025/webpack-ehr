require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
require("../libs/jquery.dataTables");
require("../libs/dataTables.bootstrap");

var queryName = require("../app/queryname"); //查询姓名
// alert($.query.get("company"))
var origin = "http://"+document.location.host;
var isNew = true
var modalTitle = ""
init();
function init () {
	// if($.trim($.query.get("company")) == "kuidianyun"){
	// 	modalTitle = "（葵典云）"
	// }else if($.trim($.query.get("company")) == "guotai"){
	// 	modalTitle = "（国泰）"
	// }else if($.trim($.query.get("company")) == "guozan"){
	// 	modalTitle = "（国赞）"
	// }else if($.trim($.query.get("company")) == "guotan"){
	// 	modalTitle = "（国檀）"
	// }else{
	// 	modalTitle = "（礼天下）"
	// }
	// $(".insurance .panel-title").text("五险一金"+modalTitle)
	bindEvent();
	index({page:1});
	// initDate();
}
function initDate(){//默认当天
	var d = new Date();
	var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
	var start_time = date +" 00:00:00";
	var end_time = date +" 23:59:59";
	$("#from").val(start_time);
	$("#to").val(end_time);
}

//查询
function index(data){
	Loading.show()
	webApi.insuranceList(data)
	.always(function(){
		Loading.hide()
	}).then(function(res){
		var result = res.result.datas;
      	var _html = '';
    	if(result.length!=0){
			for(var i=0; i<result.length; i++){
               _html +='<tr id='+result[i]._id+'>'
		          +'<td id="'+result[i].person_id+'">'+result[i].person_name+'</td>'
		          +'<td id="'+result[i].company_id+'">'+(result[i].company_name || "")+'</td>'
		          +'<td id="'+result[i].department_id+'">'+result[i].department_name+'</td>'
		          +'<td id="'+result[i].position_id+'">'+result[i].position_name+'</td>'
		          +'<td>'+result[i].basic_provident_fund+'</td>'
		          +'<td>'+result[i].supplementary_fund+'</td>'
		          +'<td>'+result[i].pension+'</td>'
		          +'<td>'+result[i].health_insurance+'</td>'
		          +'<td>'+result[i].unemployment_insurance+'</td>'
		          +'<td>'+result[i].dues+'</td>'
		          +'<td>'+result[i].start_day+'</td>'
		          +'<td>'+result[i].end_day+'</td><td class="operation none"><a href="javascript:;" class="editbtn" data-toggle="modal" data-target="#myModal" data-cid="">编辑</a></td>';
            }
            if(table){//清除排序栈
				table.fnClearTable();
				table.fnDestroy();
			}
			$('.insurance tbody').html(_html);
			pagingEvent(res.result.current_page,res.result.total_page);//翻页
			page();//翻页禁用
			
			// sortTable()
		}else{  
			$('.insurance tbody').html('<tr><td colspan="12">未搜索到符合条件的数据</td></tr>');
		}
		//操作权限控制
		var btnPer = res.result.permission;
		if(btnPer.create){
			$(".insurance .addbtn").removeClass('none');
		}
		if(btnPer.edit){
			$(".insurance .operation").removeClass('none');
		}
		if(btnPer.import){
			$(".insurance .intoBtn").removeClass('none');
		}
		if(btnPer.export){
			$(".insurance .exportbtn").removeClass('none');
		}
	},function(res){
		modalAlert(res.error_msg);
	})
}
function page(){
	$('.pagination a').on('click',function(){
		if($(this).parent().hasClass('disabled')) return false;
		var page = parseInt($(this).attr('href').split('curr_page=')[1]);
		var person_name = $("#person_name").val();
		var company_name = $("#company_name").val();
		var data = {
			page:page,
			name:person_name,
			company_name:company_name
		};

		index(data);
		return false;
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
       }else{
          modalAlert(data.error_msg);
       }
    })
    .fail(function() {
       modalAlert("网络错误,刷新重试!");
    });
}

function bindEvent(){
	//查询姓名
	queryName(".person_name")
	personEvent()

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
    			$(".department_name").val(personList[i].memo.department_name);
    			$(".position_name").val(personList[i].memo.position_name);
    			$(".company_name").val(personList[i].memo.company_name);
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
	    			$(".department_name").val(personList[i].memo.department_name);
	    			$(".position_name").val(personList[i].memo.position_name);
	    			// $(".department_name").focus()
	    		}
	    	}
	    	window.enter = false
			$(".searchinp").remove()
			return false
		}
	})

	$(".addbtn").on("click",function(){
		document.getElementById("popForm").reset(); 
		$("#myModal .modal-title").text("新增五险一金");
		$("#myModal .person_name").attr("disabled",false);
		isNew = true
		personEvent();
	});
	
	// 日历
	$(".form_datetime1_start").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd',
		autoclose: true,
	})/*.on("click",function(ev){
	    $(".form_datetime1_start").datetimepicker("setEndDate", $(".form_datetime1_end").val());
	});*/
	$(".form_datetime1_end").datetimepicker({
		minView: "month",
		format: 'yyyy-mm-dd',
		autoclose: true,
	}).on("click",function(ev){
	    $(".form_datetime1_end").datetimepicker("setStartDate", $(".form_datetime1_start").val());
	});

	$(".querybtn").on("click",function(){
		var name = $("#person_name").val();
		var company_name = $("#company_name").val();
		var data = {
			p:1,
			name:name,
			company_name:company_name
		}
		index(data);//查询
	}); 
	$(".exportbtn").on("click",function(){
		var name = $("#person_name").val();
		var company_name = $("#company_name").val();
		window.location.href = origin + '/salary/five-insurance/export?name='+name+"&company_name="+company_name
	})
	$(".exportbtn1").on("change",function(){
		$("body").append('<div class="fileLoading" style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;background: rgba(255,255,255,.8) url(images/loading.gif) no-repeat center;z-index: 9999;"></div>');
		$("#excelForm1").submit();
	})

	$(".saveBtn").on("click",function(){
		var person_id = $(".person_name").attr("attr");
		var position_name = $(".position_name").val();
		var company_name = $(".company_name").val();
		var department_name = $(".department_name").val();
		var start_day = $(".start_day").val();
		var end_day = $(".end_day").val();
		var basic_provident_fund = $(".basic_provident_fund").val();
		var supplementary_fund = $(".supplementary_fund").val();
		var pension = $(".pension").val();
		var health_insurance = $(".health_insurance").val();
		var unemployment_insurance = $(".unemployment_insurance").val();
		var dues = $(".dues").val();

		if($.trim(person_id)==""||$.trim(start_day)==""
			||$.trim(basic_provident_fund)==""||$.trim(supplementary_fund)==""||$.trim(pension)==""||$.trim(health_insurance)==""||$.trim(unemployment_insurance)==""||$.trim(dues)==""){
			return;
		}
		var data = {
			person_id:person_id,
			position_id:position_name,
			company_id:company_name,
			department_id:department_name,
			start_day:start_day,
			end_day:end_day,
			basic_provident_fund:basic_provident_fund,
			supplementary_fund:supplementary_fund,
			pension:pension,
			health_insurance:health_insurance,
			unemployment_insurance:unemployment_insurance,
			dues:dues
		};
		if(!isNew){
			data.id = id
		}
		Loading.show()
		webApi.insuranceSave(data)
		.always(function(){
			Loading.hide()
		}).then(function(res){
			window.location.reload();
		},function(res){
			modalAlert(res.error_msg);
		})
	});
	var id
	$(document).on("click",".editbtn",function(){
		isNew = false
		$("#myModal .modal-title").text("编辑五险一金");
		var tr = $(this).closest('tr')
		id = tr.attr('id');
		$("#myModal .person_name").attr({
			"attr":tr.find("td").eq(0).attr("id"),
			"disabled":"disabled"
		});
		$("#myModal .person_name").val(tr.find("td").eq(0).text());
		$("#myModal .company_name").attr("id",tr.find("td").eq(1).attr("id"));
		$("#myModal .company_name").val(tr.find("td").eq(1).text());
		$("#myModal .department_name").attr("id",tr.find("td").eq(2).attr("id"));
		$("#myModal .department_name").val(tr.find("td").eq(2).text());
		$("#myModal .position_name").attr("id",tr.find("td").eq(3).attr("id"));
		$("#myModal .position_name").val(tr.find("td").eq(3).text());
		$("#myModal .basic_provident_fund").val(tr.find("td").eq(4).text());
		$("#myModal .supplementary_fund").val(tr.find("td").eq(5).text());
		$("#myModal .pension").val(tr.find("td").eq(6).text());
		$("#myModal .health_insurance").val(tr.find("td").eq(7).text());
		$("#myModal .unemployment_insurance").val(tr.find("td").eq(8).text());
		$("#myModal .dues").val(tr.find("td").eq(9).text());
		$("#myModal .start_day").val(tr.find("td").eq(10).text());
		$("#myModal .end_day").val(tr.find("td").eq(11).text());
	});

}

var table 
function sortTable(){
	table = $('#sortTable').dataTable( {        				
		"bInfo" : false, //所下角信息
		"bFilter" : false, //过滤器
		"bPaginate" : false, //是否显示（应用）分页器 
		"aoColumnDefs": [{ "bSortable": false, "aTargets": [11]}],
	});
}