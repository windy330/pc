<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.weixinjia.recreation.account.constant.AccountPackageType"%>
<%@page import="com.weixinjia.recreation.account.entity.Account"%>
<%@page import="com.weixinjia.recreation.context.WebContext"%>
<%@page import="com.weixinjia.recreation.gameservice.service.ManageActivityService"%>
<%@page import="com.weixinjia.recreation.playrule.entity.PlayRule"%>
<%@page import="com.weixinjia.recreation.common.context.SpringContextManager"%>
<%@page import="com.weixinjia.recreation.account.service.AccountPackageService"%>
<%@page import="com.weixinjia.recreation.common.util.PlatformUtils"%>
<%@page import="com.weixinjia.recreation.common.constant.PlatformURL"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="wxj" uri="http://www.weixinjia.com/jstl/wxj" %>
<%
	PlatformURL platformURL = PlatformUtils.getPlatformUrl();
%>

<%
/* 	AccountPackageService accountPackageService = SpringContextManager.getBean(AccountPackageService.class);
	ManageActivityService manageActivityService = SpringContextManager.getBean(ManageActivityService.class);
	Account account = WebContext.getCurrentUser(request);
	PlatformURL platform = PlatformUtils.getPlatformUrl();
	int uid = account.getUnionId();
	int activityid = Integer.parseInt(request.getParameter("aid"));
	PlayRule rule =  manageActivityService.queryPlayRule(activityid);
	int packageType = accountPackageService.getPackageInMobile(uid).getPackageType(); */
	
	String from = "publish";
    if(StringUtils.isNotBlank(request.getParameter("from"))){
    	from = request.getParameter("from");
    }
%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>投票支付列表</title>
	<link rel="icon" href="<%=platformURL.getJsCssDomain() %>image/page/index/favicon.ico" type="image/x-icon" />
	<wxj:cssresource src="/bootstrap/css/bootstrap.css"/>
	<wxj:cssresource src="/bootstrap/css/style.css"/>
	<wxj:cssresource src="/css/admin/admin.css"/>
		

	<style type="text/css">
		.hide { display: none;}
		.empty-data{ width: 100%; text-align: center;}
		.header{ margin-bottom: 20px; border-bottom: 1px solid #f0f0f0;}
		.header>p{ margin: 20px 0; font-size: 16px;}
		.table .headimg{ display: block; width: 50px; height: 50px; border-radius: 50%;}
		input[type="radio"], input[type="checkbox"] {
		    margin: 0px 5px 0 0;
		}
	</style>
</head>
<body>
	<div class="mp_loading_clip" id="loading_clip" style="z-index: 2002;display: block;"><div class="mp_loading_bar"></div></div>
	<div class="mp_loading_cover" style="z-index:2000;display: block;"></div>
	<div class="header">
		<%if("publish".equals(from)){ %>
		<h3><a href="publish.jsp">&lt;&lt;返回活动列表</a></h3>
		<%}else{ %>
		<h3><a href="unpublish.jsp">&lt;&lt;返回活动列表</a></h3>
		<%} %>
	</div>
	<div class="content">
		<div >
		<table class="table">
			<thead>
				<tr>
					<th>订单号</th>
					<th>支付时间</th>
					<th>微信头像</th>
					<th>支付人昵称</th>
					<th>支付方式</th>
					<th>支付金额/元</th>
					<th>商品</th>
					<th>服务佣金/元</th>
					<th>实收/元</th>
				</tr>
			</thead>
			<tbody id="list_container">
			</tbody>
		</table>
		</div>
		<div class="page_div pagination">
	        <ul class="">
	        </ul>
	    </div>
	   	<div id="empty_data" class="empty-data hide">
	   		<p>当前活动暂无支付订单信息~~</p>
	   	</div>
	</div>
	<script type="text/x-template" id="record_list_tpl">
			{{#each list as record index}}
				<tr>
					<td>{{record.orderId}}</td>
					<td>{{new Date(record.payTime).Format('yyyy-MM-dd HH:mm')}}</td>
					<td><img class="headimg" src="{{record.headImg}}" alt="玩家头像"></td>
					<td>{{record.nickname}}</td>
					<td>微信支付</td>
					<td>{{formatMoneyToShow(record.totalMoney)}}</td>
					<td>{{record.goodsName}}</td>
					<td>{{formatMoneyToShow(record.feeMoney)}}</td>
					<td>{{formatMoneyToShow(record.validMoney)}}</td>
				</tr>
			{{/each}}
	</script>
	<wxj:jsresource src="/js/plugin/jquery-1.7.2.min.js"/>
	<wxj:jsresource src="/js/plugin/jquery.template.js"/>
	<wxj:jsresource src="/bootstrap/js/bootstrap.min.js" />
	<wxj:jsresource src="/js/plugin/pager.bootstrap.js"/>
	
	<wxj:jsresource src="/js/plugin/jquery.deparam.js"/>
	<script type="text/javascript">
	<%-- var activityId = <%=activityid %>; --%>
	var params = $.deparam(window.location.search.substring(1));
	</script>
	<script>
		// 获取url参数
		function getQueryVariable(variable) {
	        var query = window.location.search.substring(1);
	        var vars = query.split("&");
	        for (var i = 0; i < vars.length; i++) {
	            var pair = vars[i].split("=");
	            if (pair[0] == variable) {
	                return pair[1];
	            }
	        }
	        return false;
	    }
		// 获取参数
		// key: keyversion,
		// start: (page - 1) * size,
		// size: size-1
		//var params = $.deparam(window.location.search.substring(1));
		var key = params['key'] || 0;
		
		function loadData(){
			window["renderPageData"] = function(page) {
				$("#list_container").html("");
		        $.ajax({
		        	url: "/admin/game_account/votePayRecord",
		    		type: "GET",
		    		dataType: "json",
		    		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		            data: {
		            	key: key,
		            	start: (page - 1) * size,
		            	size: size-1
		            },
		            success: function(data) {
		            	$(".mp_loading_clip").hide();
		            	$(".mp_loading_cover").hide();
		                if (data.ret == 0) {
		                	recordTotal = data.model.total; 
		                	if (data.model.total > 0) {
		                		$("#list_container").removeClass("loading");
		                		var record_list_tpl = document.getElementById("record_list_tpl").text;
		                        var record_list_html = $.template(record_list_tpl).render(data.model);
		                        $("#list_container").html(record_list_html);
		                        renderPager("page_div", page, size, data.model.total);
		                	} else {
		                		$(".page_div>ul").html("");
		                		$("#empty_data").show();
		                	}
		                } else {
		                	$(".page_div>ul").html("");
		                	alert("服务器繁忙，请稍候重试~~");
		                }
		            }
		        });
		    };
		    renderPageData(1);
		}
		Date.prototype.Format = function(fmt){ 
		  var o = {   
		    "M+" : this.getMonth()+1,                 //月份   
		    "d+" : this.getDate(),                    //日   
		    "H+" : this.getHours(),                   //小时   
		    "m+" : this.getMinutes(),                 //分   
		    "s+" : this.getSeconds(),                 //秒   
		    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
		    "S"  : this.getMilliseconds()             //毫秒   
		  };   
		  if(/(y+)/.test(fmt))   
		    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
		  for(var k in o)   
		    if(new RegExp("("+ k +")").test(fmt))   
		  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
		  return fmt;   
		}
		function formatMoneyToShow(money){
			return parseFloat(money*1.0/100).toFixed(2);
		}
		$(function(){
			window.aid = getQueryVariable("aid");
			window.size = 10;
			loadData();
		});
	</script>
</body>
</html>