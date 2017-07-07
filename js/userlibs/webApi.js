define(function (require, exports) {
	var uRequest = require('../userlibs/uRequest');
	var webApi = {}
	var origin = "http://"+document.location.host;

	//葵典云\国泰\国赞\国檀\礼天下
	var salary_url
	var insurance_url
	// if($.trim($.query.get("company")) == "kuidianyun"){
	// 	salary_url = "/salary/basic-salary/kuidianyun"
	// 	insurance_url = "/salary/five-insurance/kuidianyun"
	// }else if($.trim($.query.get("company")) == "guotai"){
	// 	salary_url = "/salary/basic-salary/guotai"
	// 	insurance_url = "/salary/five-insurance/guotai"
	// }else if($.trim($.query.get("company")) == "guozan"){
	// 	salary_url = "/salary/basic-salary/guozan"
	// 	insurance_url = "/salary/five-insurance/guozan"
	// }else if($.trim($.query.get("company")) == "guotan"){
	// 	salary_url = "/salary/basic-salary/guotan"
	// 	insurance_url = "/salary/five-insurance/guotan"
	// }else{
	// 	salary_url = "/salary/basic-salary/litianxia"
	// 	insurance_url = "/salary/five-insurance/litianxia"
	// }
	

	// 查询公司
	webApi.searchCondition = function(data){
		return uRequest.post(origin + '/attendance/vacation/search-condition',data);
	}

	// 计薪天数列表
	webApi.payList = function(data){
		return uRequest.post(origin + '/salary/pay-days/pay-days',data);
	}
	//计薪天数新增修改
	webApi.paySave = function(data){
		return uRequest.post(origin + '/salary/pay-days/pay-days-save',data);
	}
	//底薪列表 葵典云\国泰\国赞\国檀\礼天下
	webApi.salaryList = function(data){
		return uRequest.post(origin + '/salary/basic-salary/basic-salary',data);
	}
	//底薪 添加or编辑底薪
	webApi.salarySave = function(data){
		return uRequest.post(origin + "/salary/basic-salary/basic-salary-save",data);
	}
	//五险一金列表
	webApi.insuranceList = function(data){
		return uRequest.post(origin + '/salary/five-insurance/five-insurance',data);
	}
	//五险一金 添加or编辑
	webApi.insuranceSave = function(data){
		return uRequest.post(origin + "/salary/five-insurance/five-insurance-save",data);
	}

	//月度薪酬列表
	webApi.monthSalary = function(data){
		return uRequest.post(origin + "/salary/month-salary/month-salary",data);
	}
	//月度薪酬列表
	webApi.monthSalSave = function(data){
		return uRequest.post(origin + "/salary/month-salary/month-salary-save",data);
	}
	//加班统计
	webApi.overtimeList = function(data){
		return uRequest.post(origin + "/attendance/overtime/index",data);
	}
	//早退统计
	webApi.earlyList = function(data){
		return uRequest.post(origin + "/attendance/offearly/index",data);
	}
	//请假管理删除
	webApi.leaveDelete = function(data){
		return uRequest.post(origin + "/attendance/leave/delete",data);
	}
	//外出管理删除
	webApi.gooutDelete = function(data){
		return uRequest.post(origin + "/attendance/goout/delete",data);
	}
	//月度薪酬重新计算
	webApi.reMonthsalary = function(data){
		return uRequest.post(origin + "/salary/month-salary/re-calc-month-salary",data);
	}
	//月度考勤重新计算
	webApi.reMonthrecord = function(data){
		return uRequest.post(origin + "/attendance/monthly-record/re-calc-month-record",data);
	}

	//更新人员状态
	webApi.updateStatus = function(data){
		return uRequest.post(origin + "/ehradmin/cron/update-person-status",data);
	}

	return webApi
})