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
	/* AccountPackageService accountPackageService = SpringContextManager.getBean(AccountPackageService.class);
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
	<title>投票收礼列表</title>
	<link rel="icon" href="<%=platformURL.getJsCssDomain() %>image/page/index/favicon.ico" type="image/x-icon" />
	<wxj:cssresource src="/bootstrap/css/bootstrap.css"/>
	<wxj:cssresource src="/bootstrap/css/style.css"/>
	<wxj:cssresource src="/css/admin/admin.css"/>
	<wxj:cssresource src="/jquery-ui/css/smoothness/jquery-ui-tooltip.min.css"/>
	<wxj:cssresource src="/jquery-ui/css/smoothness/jquery-ui-1.10.0.custom.min.css"/>
	<wxj:jsresource src="/js/plugin/jquery-1.7.2.min.js"/>
	<wxj:jsresource src="/bootstrap/js/bootstrap.min.js" />
	<wxj:jsresource src="/js/plugin/jquery.deparam.js"/>
	<wxj:jsresource src="/jquery-ui/js/jquery-ui-tooltip.min.js" />
	<wxj:jsresource src="/jquery-ui/js/jquery-ui-1.10.0.custom.min.js"/>
	<wxj:jsresource src="/js/plugin/timepicker/jquery-ui-timepicker-addon.js"/>
	<wxj:jsresource src="/js/plugin/timepicker/jquery-ui-timepicker-zh-CN.js"/>
	<wxj:jsresource src="/js/plugin/jquery.template.js"/>
	<wxj:jsresource src="/js/plugin/pager.bootstrap.js"/>
		

	<style type="text/css">
		.hide { display: none;}
		.empty-data{ width: 100%; text-align: center;}
		.header{ margin-bottom: 20px; border-bottom: 1px solid #f0f0f0;}
		.header>p{ margin: 20px 0; font-size: 16px;}
		.table .headimg{ display: block; width: 50px; height: 50px; border-radius: 50%;}
		input[type="radio"], input[type="checkbox"] {
		    margin: 0px 5px 0 0;
		}
		.voteDefine {
			margin-top: 20px;
		}
		.remind {
			width: 100%;
			height: 64px;
			background: #F2DEDF;
			margin-bottom: 20px;
			border-radius: 5px;
			line-height: 64px;
			font-weight: 500;
			font-family: "宋体";
		}
		.voteForm {
			font-weight: 500;
		}
		.title {
			font-size: 30px;
			font-weight: 600;
			margin-bottom: 14px;
			margin-top: 18px;
			letter-spacing:2px;
		}
	</style>
</head>
<body>
	<!--<div class="mp_loading_clip" id="loading_clip" style="z-index: 2002;display: block;"><div class="mp_loading_bar"></div></div>
	<div class="mp_loading_cover" style="z-index:2000;display: block;"></div>
	<div class="header">
		<%if("publish".equals(from)){ %>
		<h3><a href="publish.jsp">&lt;&lt;返回活动列表</a></h3>
		<%}else{ %>
		<h3><a href="unpublish.jsp">&lt;&lt;返回活动列表</a></h3>
		<%} %>
	</div>-->
	<p class="title">收礼记录</p>
	<div class="remind">
		&nbsp; 温馨提示: 收礼记录暂时不支持导出操作，收礼记录每5分钟更新一次，会有一定延迟的情况
	</div>
	<from  class="form-horizontal voteForm">
		支付时间:
		<input type="text" name="startTimes" id="startTimes" value="" placeholder="开始时间">&nbsp至
		<input type="text" name="endTimes" id="endTimes" value="" placeholder="结束时间">
		<button id="search_record" class="btn btn-primary no-border" type="submit">查询</button>
		<button id="reset_record" class="btn btn-primary no-border" type="submit">重置</button>
	</form>
	<div class="content voteDefine">
		<div >
		<table class="table">
			<thead>
				<tr>
					<th>送礼人</th>
					<th>open ID</th>
					<th>IP 地址</th>
					<th>手机型号</th>
					<th>支付时间</th>
					<th>抵送票数</th>
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
					<td><img class="headimg" src="{{record.headImg}}" alt="玩家头像"></td>
					<td>{{record.openId}}</td>
					<td>{{record.ip}}</td>
					{{#if record.userAgent}}
							<td>{{record.userAgent.substr(0,30)}}</td>
					{{#else}}
							<td>{{record.userAgent}}</td>
					{{/if}}
					<td>{{new Date(record.payTime).Format('yyyy-MM-dd HH:mm')}}</td>
					<td>{{record.tickets}}</td>
				</tr>
			{{/each}}
	</script>
	<!--<wxj:jsresource src="/js/plugin/jquery-1.7.2.min.js"/>
	<wxj:jsresource src="/js/plugin/jquery.template.js"/>
	<wxj:jsresource src="/bootstrap/js/bootstrap.min.js" />
	<wxj:jsresource src="/js/plugin/pager.bootstrap.js"/>
	
	<wxj:jsresource src="/js/plugin/jquery.deparam.js"/>-->
	<script type="text/javascript">
	<%-- var activityId = <%=activityid %>; --%>
	var params = $.deparam(window.location.search.substring(1));
	</script>
	<script>
		$(function(){
			$('#startTimes').datepicker();
			$('#endTimes').datepicker();
		});
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
		// 127.0.0.1:8080/admin/game_account/voteGiftRecord?key=0F4464337CF52CCE&start=0&size=10
		var key = params['key'] || 0;
		
		function loadData(){
			window["renderPageData"] = function(page) {
				$("#list_container").html("");
		        $.ajax({
		        	url: "/admin/game_account/voteGiftRecord",
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

		$("#reset_record").on("click",function(){
			$('#startTimes').val("");
 			$('#endTimes').val("");

		});
		// 查询数据
		// 127.0.0.1:8080/admin/game_account/voteGiftRecord?key=0F4464337CF52CCE&start=0&size=10&startTime=2017-05-04 11:11:11&endTime=2017-05-08 11:11:11
		$("#search_record").on("click",function(){
			var start_times = $('#startTimes').val();
 			var end_times = $('#endTimes').val();
			
			window["renderPageData"] = function(page) {
				$("#list_container").html("");
		        $.ajax({
		        	url: "/admin/game_account/voteGiftRecord",
		    		type: "GET",
		    		dataType: "json",
		    		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		            data: {
		            	key: key,
		            	start: (page - 1) * size,
		            	size: size-1,
						startTime: start_times+" 00:00:00",
						endTime: end_times+" 11:59:59"
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
		});
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