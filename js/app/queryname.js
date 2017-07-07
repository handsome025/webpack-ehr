function queryName(dom) {
	var enable
	$(dom).on("input focus",function(ev){
		var $this = $(this)
		var oldvalue = $(this).val()
		// clearTimeout(d)
		// var d = setTimeout(function(){
			var enable = true
			
			ev.stopPropagation();
			var parent = $this.closest('.copy')
			if($.trim($this.val()).length <1){
				$(".searchinp").remove()
				enable = true
				return
			}
			// if($.trim(oldvalue) == $.trim($this.val()))return
			if(!enable)return
			enable = false
			$.ajax({
				url: windowOrigin + "/ehradmin/structure/get-user-by-name",
				type: 'POST',
				dataType: 'json',
				data: {name:$.trim($this.val())},
			})
			.done(function(data) {
				console.log(data);
				if(data.success){
					var result = data.result
					$(".searchinp").remove()
					if(result.length != 0){
						var html = "<ul class='searchinp'>"
						for (var i = 0; i < result.length; i++) {
							html += "<li attr='"+result[i]._id.$id+"'>"+result[i].name+"</li>"
						}
						html += "</ul>"
						if(parent.length == 0){
							$(dom).after(html)
						}else{
							parent.find(dom).after(html)
						}
					}
				}else{
					$(".searchinp").remove()
					modalAlert(data.error_msg);
				}
			})
			.fail(function() {
				$(".searchinp").remove()
				
				modalAlert("网络错误，刷新重试！");
			})
			.always(function() {
				enable = true
				console.log("complete");
				searchhide(dom)
			});
		// },2000)
	});
	window.enter = false
	function searchhide(dom){
		$(".searchinp").on('mouseenter', function() {
			if(!window.enter){
				$(".searchinp").show()
				window.enter = true
			}
		})
		$(".searchinp").on('mouseleave', function() {
			window.enter = false
		})
		$(dom).on('blur', function() {
			if(!window.enter){
				$(".searchinp").hide()
				window.enter = false
			}
		})
		
	}
	
	// $(document).on('click', function() {
	// 	if(enable){
	// 		$(".searchinp").remove()
	// 	}
	// })
	
	$(document).on('keydown', function(e) {
		e = window.event||e;
		if($(".searchinp").css("display") == 'block' &&  (e.keyCode == 38 || e.keyCode == 40)){
			keyEvent(e.keyCode);
		}
	})

	function keyEvent(code){
		var index = 0
		var show_li = $(".searchinp")[0]
		// console.info($(".li-curr").position().top)
		if(code == 38){
			if($(".searchinp .li-curr").length == 0){
				$(".searchinp").find('li').eq(0).addClass('li-curr')
				return 
			}
			if($(".searchinp").find('li-curr').index() == 0){
				$(".searchinp").find('li').eq(0).addClass('li-curr')
				$(".searchinp").find('li').eq($(".searchinp li").length - 1).addClass('li-curr')
				show_li.scrollTop = show_li.scrollheight
			}else{
				$(".searchinp .li-curr").prev("li").addClass('li-curr').siblings('li').removeClass('li-curr')
			}
			console.info($(".li-curr").position().top)
			index --
			if($(".li-curr").position().top<=300){
				show_li.scrollTop = show_li.scrollTop - 20;
			}
		}else if(code == 40){
			if($(".searchinp .li-curr").length == 0){
				$(".searchinp").find('li').eq(0).addClass('li-curr')
				return 
			}
			
			if($(".searchinp").find('li-curr').index() == 0){
				$(".searchinp").find('li').eq(0).addClass('li-curr')
			}else{
				$(".searchinp .li-curr").next("li").addClass('li-curr').siblings('li').removeClass('li-curr')
			}
			index ++
			if($(".li-curr").position().top>=300){
				show_li.scrollTop = show_li.scrollTop + 20;
			}
		}
	}
	
}

module.exports = queryName;
