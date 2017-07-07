require("../app/global");
require("../libs/bootstrap.min");
require("../libs/bootstrap-datetimepicker.min");
require("../libs/jquery.dataTables");
require("../libs/dataTables.bootstrap");

var webApi = require("../userlibs/webApi");
var queryName = require("../app/queryname"); //查询姓名
// Loading.show()
var origin = "http://"+document.location.host;
var isNew = true
init();
function init () {
	bindEvent();
	index({page:1});
}

//查询
function index(data){
	Loading.show()
	webApi.payList(data)
	.always(function(){
		Loading.hide()
	}).then(function(res){
		var result = res.result.datas;
      	var _html = '';
    	if(result.length!=0){
			for(var i=0; i<result.length; i++){
               _html +='<tr id='+result[i]._id+'>'
		          +'<td>'+result[i].month+'</td>'
		          +'<td>'+result[i].days+'</td><td class="operation none"><a href="javascript:;" class="editbtn" data-toggle="modal" data-target="#myModal" data-cid="">编辑</a></td>';
            }
            if(table){//清除排序栈
				table.fnClearTable();
				table.fnDestroy();
			}
			$('.pay-day tbody').html(_html);
			pagingEvent(res.result.current_page,res.result.total_page);//翻页
			page();//翻页禁用
			
			// sortTable()
		}else{  
			$('.pay-day tbody').html('<tr><td colspan="3">未搜索到符合条件的数据</td></tr>');
		}
		//操作权限控制
		var btnPer = res.result.permission;
		if(btnPer.create){
			$(".pay-day .addbtn").removeClass('none');
		}
		if(btnPer.edit){
			$(".pay-day .operation").removeClass('none');
		}
	},function(res){
		modalAlert(res.error_msg);
	})
}
function page(){
	$('.pagination a').on('click',function(){
		if($(this).parent().hasClass('disabled')) return false;
		var page = parseInt($(this).attr('href').split('curr_page=')[1]);
		index({page:page});
		return false;
	});
}

function bindEvent(){
	var d = new Date();
	var date = d.getFullYear()+"-"+(d.getMonth()+1)
	$("#month").val(date);

	$(".addbtn").on("click",function(){
		document.getElementById("popForm").reset(); 
		$("#myModal .modal-title").text("新增计薪天数");
		isNew = true
	});
	
	// 日历
	$("#month").datetimepicker({
		minView: 4,
		startView:3,
		format: 'yyyy-mm',
		autoclose: true
	});
	var id
	$(".saveBtn").on("click",function(){
		var month = $("#month").val();
		var days = $("#days").val();
		if($.trim(month)==""||$.trim(days)==""){
			return;
		}
		var data = {
			month:month,
			days:days
		};
		if(!isNew){
			data.id = id
		}

	    Loading.show()
		webApi.paySave(data)
		.always(function(){
			Loading.hide()
		}).then(function(res){
			 window.location.reload();
		},function(res){
			modalAlert(res.error_msg);
		})
	});

	$(document).on("click",".editbtn",function(){
		isNew = false
		var tr = $(this).closest('tr')
		id = tr.attr("id")
		$("#month").val(tr.find("td").eq(0).text());
		$("#days").val(tr.find("td").eq(1).text());
		$("#myModal .modal-title").text("编辑计薪天数");
	});

}

var table 
function sortTable(){
	table = $('#sortTable').dataTable( {        				
		"bInfo" : false, //所下角信息
		"bFilter" : false, //过滤器
		"bPaginate" : false, //是否显示（应用）分页器 
		"aoColumnDefs": [{ "bSortable": false, "aTargets": [2]}],
	});
}