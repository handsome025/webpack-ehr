//翻页
function pagingEvent(curr_page,total_pages,total){
	var url = window.location.href.split('?')[0];
	curr_page = parseInt(curr_page);
	var minpage = curr_page - 4;
	var maxpage = curr_page + 4;
	var pages = ''
	
	var first_pages = '<li><a href="'+url+'?curr_page=1">首页</a></li>';
	var last_pages = '<li><a href="'+url+'?curr_page='+total_pages+'">末页</a></li>';
	// var per_total = "<li>&nbsp;&nbsp;每页<select class='form-control'><option value=10>10</option><option value=20>20</option><option value=50>50</option></select>条</li>"
	var per_total = ""
	if(minpage < 1) minpage = 1;
	if(maxpage > total_pages) maxpage = total_pages;
	for(var i=minpage-1; i<maxpage; i++){
		if(i != curr_page-1){
			pages += '<li><a href="'+url+'?curr_page='+(i+1)+'">'+(i+1)+'</a></li>';
		}else{
			pages += '<li class="active"><a href="'+url+'?curr_page='+(i+1)+'">'+(i+1)+'</a></li>';
		}
	}
	$('.pagination').html('<li '+(curr_page==1 ? ' class="disabled"' : '')+'><a href="'+url+'?curr_page=1">首页</a></li><li'+(curr_page==1 ? ' class="disabled"' : '')+'><a href="'+url+'?curr_page='+(curr_page-1)+'"><span aria-hidden="true">上一页</span></a></li>'
        +pages
        +'<li'+(curr_page==total_pages ? ' class="disabled"' : '')+'><a href="'+url+'?curr_page='+(curr_page+1)+'"><span aria-hidden="true">下一页</span></a></li><li '+(curr_page==total_pages ? ' class="disabled"' : '')+'><a href="'+url+'?curr_page='+total_pages+'">末页</a></li>'+per_total);
	$('.pagination select').val(total)
}
module.exports = pagingEvent;