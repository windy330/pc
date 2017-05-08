// 默认当前页为第0页
var current_page = 1;

// total 当前多少条记录, cur_page 当前页码, 当前tabid 
var renderPager = function(pager_class, cur_page, limit, total, renderDatafunc) {
	var selector;
	if (pager_class.indexOf(".") == -1) {
		selector = '.' + pager_class + " ul";
	} else {
		selector = pager_class + " ul";
	}
	var $mod_pagenav_main = $(selector);
	cur_page = cur_page || 0;
	limit = limit || 5;
	var totalPageNum = Math.ceil(total / limit);
	//<div class="pagination">
	// <ul>
    //
	//    <li class="disabled"><span>上一页</span></li><li class="active"><span>1</span></li><li><a start="10" href="/admin/buy/goodslist.jsp?start=10&amp;limit=10">2</a></li><li><a start="10" href="/admin/buy/goodslist.jsp?start=10&amp;limit=10">下一页</a></li>
	//  </ul>
	  
	// </div>
	var prev = '<li><a href="javascript:prevPage('+ renderDatafunc +');" title="上一页">«</a></li>';
	var next = '<li><a href="javascript:nextPage('+ renderDatafunc +');" title="下一页" class="next">»</a></li>';
	var prevDisable = '<li class="disabled"><span>«</span></li>';
	var nextDisable = '<li class="disabled"><span>»</span></li>';
	var current = '<li class="active"><span>{0}</span><li>';
	var number = '<li><a href="javascript:page({0}, ' + renderDatafunc + ');" title="{0}">{0}</a></li>';
	var ellipsis = '<li class="disabled"><span>...</span></li>';
	var pagerHtml = '{0}';
	var numberHtml = '';
	var currentPageNum = cur_page;
	current_page = cur_page;
	if (totalPageNum > 1) {
		if (totalPageNum > 7) {
			if (currentPageNum < 5) {
				for ( var i = 0; i != 6; i++) {
					var pageNum = i + 1;
					if (pageNum == currentPageNum) {
						numberHtml += String.format(current, pageNum);
					} else {
						numberHtml += String.format(number, pageNum);
					}
				}
				numberHtml = numberHtml + ellipsis
						+ String.format(number, totalPageNum);
			} else if (totalPageNum - currentPageNum < 5) {
				numberHtml = String.format(number, 1) + ellipsis;
				for ( var i = 0; i != 6; i++) {
					var pageNum = totalPageNum - 6 + i + 1;
					if (pageNum == currentPageNum) {
						numberHtml += String.format(current, pageNum);
					} else {
						numberHtml += String.format(number, pageNum);
					}
				}
			} else {
				numberHtml = String.format(number, 1) + ellipsis;
				for ( var i = 0; i != 5; i++) {
					var pageNum = currentPageNum - 2 + i;
					if (pageNum == currentPageNum) {
						numberHtml += String.format(current, pageNum);
					} else {
						numberHtml += String.format(number, pageNum);
					}
				}
				numberHtml = numberHtml + ellipsis
						+ String.format(number, totalPageNum);
			}
		} else {
			for ( var i = 0; i != totalPageNum; i++) {
				var pageNum = i + 1;
				if (pageNum == currentPageNum) {
					numberHtml += String.format(current, pageNum);
				} else {
					numberHtml += String.format(number, pageNum);
				}
			}
		}
		if (currentPageNum == 1) {
			pagerHtml = prevDisable + String.format(pagerHtml, numberHtml)
					+ next;
		} else if (currentPageNum == totalPageNum) {
			pagerHtml = prev + String.format(pagerHtml, numberHtml)
					+ nextDisable;
		} else {
			pagerHtml = prev + String.format(pagerHtml, numberHtml) + next;
		}
		$mod_pagenav_main.html(pagerHtml);
	} else {
		$mod_pagenav_main.html('');
	}
};

var nextPage = function(func) {
	current_page = current_page + 1;
	page(current_page, func);
};
var prevPage = function(func) {
	current_page = current_page - 1;
	page(current_page, func);
};
var page = function(pageNum, func) {
	current_page = pageNum;
	if (func && typeof func == "function") {
		func(pageNum);
	} else if (window["renderPageData"] && typeof window["renderPageData"] == "function") {
		window.renderPageData(pageNum);
	}
};
String.format = function() {
	if (arguments.length == 0)
		return null;
	var str = arguments[0];
	for ( var i = 1; i < arguments.length; i++) {
		var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
		str = str.replace(re, arguments[i]);
	}
	return str;
};