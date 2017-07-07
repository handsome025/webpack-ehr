windowOrigin = window.location.origin;
modalAlert = require("../app/modalalert");
modalConfirm = require("../app/modalconfirm");
pagingEvent = require("../app/pagination");
checkPhone = /^1[3|4|5|7|8]\d{9}$/;
isCardNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

require("../userlibs/jquery-query");

Loading = require("../libs/component-loading");

webApi = require('../userlibs/webApi');//接口api

tableSort = require('../userlibs/tableSort');//排序

leaveType ={
	"annual_leave":"年假",
	"casual_leave":"事假",
	"sick_leave":"病假",
	"public_leave":"公休假",
	"change_leave":"换休假",
	"marriage_leave":"婚假",
	"maternity_leave":"产假",
	"small_summer_leave":"小暑假",
	"week_leave":"度假周",
	"visiting_family_leave":"探亲路程假",
	"tourism_leave":"旅游假",
	"tb_leave":"TB假",
	"paternity_leave":"陪产假",
	"nomal":"正常",
	"not_punch_card":"未打卡",
	"late":"迟到",
	"goout":"外出",
	"early_retirement":"早退",
	"nursing_leave":"哺乳假",
	"funeral_leave":"丧假",
	"public_leave":"其他",
	"small_summer_leave":"小暑假",
	"week_leave":"度假周",
	"visiting_family_leave":"探亲路程假",
	"medallion":"免死金牌",
	"antenatal_leave":"产前假",
	"absenteeism":"旷工"
};