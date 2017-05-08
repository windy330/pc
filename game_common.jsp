<%@page import="com.weixinjia.recreation.account.entity.AccountPackage"%>
<%@page import="com.weixinjia.recreation.account.service.AccountPackageService"%>
<%@page import="java.util.Calendar"%>
<%@page import="com.weixinjia.recreation.newcore.entity.ImgTextShare"%>
<%@page import="com.weixinjia.recreation.common.constant.Platform"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.weixinjia.recreation.newbaseweb.util.WebUtil"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="com.weixinjia.recreation.newcore.entity.GamePage"%>
<%@page import="com.weixinjia.recreation.newcore.entity.Activity"%>
<%@page import="com.weixinjia.recreation.common.context.SpringContextManager"%>
<%@page import="com.weixinjia.recreation.gameservice.service.ManageActivityService"%>
<%@page import="java.util.Date"%>
<%@page import="com.weixinjia.recreation.common.util.CommonUtils"%>
<%@page import="com.weixinjia.recreation.wxapi.entity.OpenUser"%>
<%@page import="com.weixinjia.recreation.wxapi.sysoauth2.service.UnionUserSystem"%>
<%@page import="com.weijuju.data.base.constant.BusinessModuleType"%>
<%@page import="com.weijuju.data.base.constant.BusinessPlatformType"%>
<%@page import="com.weixinjia.recreation.newcore.constant.PlatformId"%>
<%@page import="com.weixinjia.recreation.common.util.PlatformUtils"%>
<%@page import="com.weixinjia.recreation.common.constant.PlatformURL"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="wxj" uri="http://www.weixinjia.com/jstl/wxj" %>
<%
OpenUser openUser = UnionUserSystem.getSystemOpenUser(request,response); 
String groupId = request.getParameter("groupId");
String fromOpenid = request.getParameter("fromOpenid");
%>
<script type="text/javascript">
// 是否控制loading页面的隐藏，如果true，则loading页面不会自动关闭
var takeControlLoadingPage = <%=StringUtils.isNotBlank(groupId)||(StringUtils.isNotBlank(fromOpenid)&&!fromOpenid.equals(openUser.getOpenid())) %>;
var openId = "<%=openUser.getOpenid() %>";
function $getStack(e, d) {
    if (e && e.stack) {  
        var s = e.stack.replace(/(?:http:)[^:]*:(.*)/g, "$1").replace(/@/g, "at").split("at"), l = d ? d + 1  
                : s.length - 1;  
        return s.slice(1, l).join(":");  
    } else if (arguments.callee.caller.caller) {  
        var curr = arguments.callee.caller.caller, c, o = [];  
        while (curr) {
            c = curr;  
            o.push(c.toString().substring(0, 100));  
            curr = curr.caller;  
        }  
        return o.join(":");  
    } else {
        return "";
    }
};  
function $initBadjs() {
    window.onerror = function(msg, url, l, c) {
        if(document.getElementById("youyu_loading_main")){
        	document.getElementById("youyu_loading_main").style.display="none";
        }
        if (/WeixinJSBridge/.test(msg) || /_WXJS/.test(msg)) {
			return;
		}
        var stack = $getStack();  
        $sendBadjs(msg, url, l + ":" + stack, l, c);  
        return false;  
    };
};
function $sendBadjs(msg, src, d, l, c) {
     var ua = navigator.userAgent.toLowerCase(), s,
         bom =  (s = ua.match(/msie ([\d.]+)/)) ? "ie:" + s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? "firefox:" + s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? "chrome:" + s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? "opera:" + s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? "safari:" + s[1] : 0;
         
     var ts = d+"|"+openId;  
     var errImg = new Image();
     var errImgSrc = "/mobile/newgame/jserror?errorMessage="+msg;
     errImgSrc += "&scriptURI="+encodeURIComponent(src || window.location.href);
     errImgSrc += "&lineNumber="+(l || 0);
     errImgSrc += "&columnNumber="+(c || 0);
     errImgSrc += "&errorObj="+ts;
     errImgSrc += "&bowserType="+ua;
     errImgSrc += "&type=1";
     errImgSrc += "&_="+new Date().getTime();
     errImg.src = errImgSrc;
     errImg.imageSrcKey = errImgSrc;
};  
$initBadjs();
window._sendBadjs = $sendBadjs;
</script>
<%
PlatformURL platformUrl = PlatformUtils.getPlatformUrl();
Platform platform = SpringContextManager.getBean(Platform.class);
String resourceDomain=platformUrl.getJsCssDomain();
String aid = request.getParameter("aid");
String activityid = request.getParameter("activityid");
ManageActivityService actSvc = SpringContextManager.getBean(ManageActivityService.class);
AccountPackageService packageSvc = SpringContextManager.getBean(AccountPackageService.class);
Activity act = actSvc.queryActivity(Integer.parseInt(activityid));
AccountPackage accountPackage = packageSvc.getPackageInMobile(act.getUnionId());
boolean isFreeUser = packageSvc.isFree(act.getUnionId());
GamePage gamePage = actSvc.queryGamePage(act.getPageId());
ImgTextShare imgTextShare = actSvc.queryImgTextShareByActId(Integer.parseInt(activityid), act.getPlatformId());
if(imgTextShare == null){
	imgTextShare = new ImgTextShare();
	imgTextShare.setTitle(act.getTitle());
}
String skinId = "1";
if(null != act.getSkinId()){
	skinId = act.getSkinId().toString();
}
String gameImgPath = WebUtil.getSkinGameImgPath(act.getPageTemplateId(), skinId);
//特殊游戏图片需要保存在七牛服务器
String qiniuGameImgPath = WebUtil.getQiniuGameImgPath(skinId);
request.setAttribute("skinId", skinId);
request.setAttribute("isFreeUser", isFreeUser);
request.setAttribute("templateId", act.getPageTemplateId());
request.setAttribute("activityId", act.getId());
request.setAttribute("gameImgPath", gameImgPath);
%>
<%if(skinId.equals("1")){ %>
<%}else{%>
<wxj:cssresource src="/css/mobile/newgame/game_style_${skinId}.css"/>
<%} %>
<wxj:jsresource src="/js/plugin/jquery-1.8.2.min.js"/>
<wxj:jsresource src="/js/plugin/jquery.json-2.4.min.js" />
<wxj:jsresource src="/js/plugin/jquery.deparam.js"/>
<wxj:jsresource src="/js/mobile/newgame/iscroll.js"/>
<wxj:jsresource src="/js/mobile/newgame/game_common.js"/>
<!-- 七夕活动share.js特殊处理，这里不用默认的分享代码 -->
<%if(act.getPageTemplateId() != 13){ %>
<wxj:jsresource src="/js/mobile/jweixin-1.0.0.js"/>
<wxj:jsresource src="/js/mobile/share.js"/>
<!--手机端游戏开屏页面关闭后才显示开始页面的标题图片和按钮，这样才能看到css动画执行 -->
<style>
.start_page .title_img{
	display: none;
}
.start_page #startBtnImg{
	display: none;
}
</style>
<%} %>
<!-- S custom css -->
<style type="text/css" id="_yy_custom_css"></style>
<!-- E custom css -->
<!-- 活动自定义样式 -->
<script type="text/javascript">
var extendOperation = <%=StringUtils.isBlank(act.getExtendOperation())?"{}":act.getExtendOperation() %>;
var _customStyle=document.getElementById("_yy_custom_css");
var innerStyle = "";
if(extendOperation.loadingPic){
	innerStyle += "#loading_banner_bg {background-image:"+extendOperation.loadingPic+";}";
}
if(extendOperation.loadingLogo){
	innerStyle += "#yy_logo_bg {background-image:"+extendOperation.loadingLogo+";}";
}
if(extendOperation.lotteryPic){
	innerStyle += "#lotto_banner_bg {background-image:"+extendOperation.lotteryPic+";}";
}
if(extendOperation.lotteryLogo){
	innerStyle += "#lotto_logo_bg {background-image:"+extendOperation.lotteryLogo+";}";
}
_customStyle.innerHTML=innerStyle;
</script>

<div class="topbar_unpublish">活动尚未发布，当前仅供预览，将不会派发奖品</div>
<div class="mp_loading_clip" id="loading_clip" style="z-index: 2002;display: none;"><div class="mp_loading_bar"></div></div>
<div class="mp_loading_cover" style="z-index:2000;"></div>
<!-- 通用组件分数、红包、奖品界面开始 -->
<jsp:include page="game_maskpage.jsp"></jsp:include>
<!-- 通用组件分数、红包、奖品界面结束 -->
<script type="text/javascript">
//预加载loadingPic图片
$(function(){
	if(extendOperation.loadingPic && extendOperation.loadingPic.indexOf("url") == 0){
		var loadingPicUrl = extendOperation.loadingPic.substring(4,extendOperation.loadingPic.length-1);
		if(extendOperation.loadingPic.indexOf("http") == 5){
			loadingPicUrl = extendOperation.loadingPic.substring(5,extendOperation.loadingPic.length-2);
		}
		var loadingPicImg = new Image();
		loadingPicImg.onload = function(){
			window.hasLoadLoadingBanner = true;
			if($('.fire_loading').size() > 0){
				// 游戏加载页面跳过事件
				var skipCount = 3;
				window.skipLoadingTimer = setInterval(function(){
					skipCount--;
					if(skipCount <= 0){
						window.game._hideFireLoading();
						window.clearInterval(window.skipLoadingTimer);
					}
					$('.fire_loading').find(".skip_count").text(skipCount);
				},1000);
			}
		};
		loadingPicImg.onerror = function(){
			window.hasLoadLoadingBanner = true;
			window.game._hideFireLoading();
		};
		loadingPicImg.src = loadingPicUrl;
		loadingPicImg.imageSrcKey = loadingPicUrl;
	} else {
		window.hasLoadLoadingBanner = true;
	}
});
</script>
<!-- 数据统计开始 -->
<jsp:include page="/mobile/youyu_common.jsp"></jsp:include>
<!-- 数据统计结束 -->
<script type="text/javascript">
var params = $.deparam(window.location.search.substring(1));
var dataDomain = "<%=platform.isDebug()?"http://gametest.weijuju.com":"http://business.bigdata.weijuju.com" %>";
var gamePageJson = <%=gamePage == null ? "{}":gamePage.getJsonContent() %>;
var activityJson = <%=JSONObject.fromObject(act) %>;
var _resRoot = '<%=gameImgPath %>';
var _gameTemplateId = <%=act.getPageTemplateId() %>;
var _isFreeUser = <%=isFreeUser %>;
var _maxParticipateNumber = <%=accountPackage.getMaxParticipateNumber() %>;
var _qiniuResRoot = '<%=qiniuGameImgPath%>';
var imgTextShare = <%=JSONObject.fromObject(imgTextShare) %>;
var _manage = false;
var gameTime = 30;

// 客户端服务端时间差
var serverTimeDelta = <%=new Date().getTime() %>-new Date().getTime();
// 加载页面是否跳转
var open_loading_link = (activityJson.extraData&(Math.pow(2,3))) != 0;
if(open_loading_link){
	/** $("#loading_banner_bg").live("click",function(){
		window.location.href=extendOperation.loadingLink;
	}); **/
	$("#loading_banner_bg").attr("href",extendOperation.loadingLink);
}
// 扫二维码加入游戏的不需要关注
if(params.groupId || params.fromOpenid){
	params.isFromApiFilter = 1;
}
$(function(){
	//从数据中心获取活动参与数据
	$.ajax({
		type: 'post',
		url: dataDomain+"/trace/activitystatis/v1/statis.do",
		data: {"busiPlatform": "2", "busiType": "100000", "busiId": params.activityid},
		complete: function(xhr){
		},
		success: function(data){
			if(data.ret == 0){
				$("#join_line_cont .join_num").text(data.model.statisInfo.userJoinPerson+activityJson.participantVirtualAddCount);
				// 活动总中奖次数
				window.game.config.userGetPrize = data.model.statisInfo.userGetPrize;
				// 免费版用户手机端限制最大参与人数6000人
				if(_isFreeUser && data.model.statisInfo.userJoinPerson>_maxParticipateNumber){
					var gameOverPageLink = "/mobile/newgame/game_over.jsp?aid="+window.game.config.aid+"&activityid="+window.game.config.activityid+"&wuid="+window.game.config.wuid;
					if(params.isFromApiFilter == 1){
						gameOverPageLink += "&isFromApiFilter=1";
					}
					gameOverPageLink += "&keyversion="+window.game.config.keyversion;
					window.location.replace(gameOverPageLink);
				}
			} else {
				$("#join_line_cont").hide();
			}
		},
		error: function(){
			$("#join_line_cont").hide();
		}
	});
	
	window.game.init({
		"aid":params.aid,
		"activityid":params.activityid,
		"keyversion":params.keyversion||"0",
		"wuid":params.wuid,
		"groupId":params.groupId,
		"fromOpenid":params.fromOpenid,
		"platformId":"<%=PlatformId.COMMON_YOUYU.val() %>",
		"nickname":"<%=openUser.getNickname() %>",
		"openid":"<%=openUser.getOpenid() %>",
		"headimg":"<%=openUser.getHeadimgurl() %>",
		"userImgDomain":"<%=platformUrl.getUserImageDomain() %>",
		"imgTextShare":imgTextShare,
		"wjjPageDomain":"<%=platformUrl.getWeijujuPageDomain() %>",
		"pageDomain":"<%=platformUrl.getNewMobilePageDomain().replace("{wuid}", request.getParameter("wuid")) %>",
		"shareType":(activityJson.extraData&(Math.pow(2,7))),
		"isHelpAward":(activityJson.extraData&(Math.pow(2,5))) != 0
	});
	if(activityJson.awardSendType == 1){
		$(".start_page .rank_btn").show();
	}
	window.game.loadingClip && window.game.loadingClip.show();
	window.game.loadingCover && window.game.loadingCover.show();
	$.ajax({
		url: '/mobile/participation/init',
		type: 'get',
		data: {
			"aid":params.aid,
			"activityid":params.activityid,
			"keyversion":window.game.config.keyversion
		},
		success: function(data){
		   if(data.retCode == 0){
			   //$btn.removeClass("disabled");
			   console.log(data);
			   var activityData = data.model.activity;
			   var userPlayinfo = data.model.userPlayinfo;
			   var sendRuleMap = data.model.sendRuleMap;
			   var actRuntime = data.model.actRuntime;
			   var prizeList = data.model.prizeList;
			   var trophyList = data.model.trophyList;
			   var helpMap = data.model.helpMap ? data.model.helpMap: {}; // 获取助力相关信息
			   var getHelpScore = 0;
			   var awardTips = $.parseJSON(activityData.awardTips);
			   if(userPlayinfo && userPlayinfo.getHelpScore){
				   getHelpScore = userPlayinfo.getHelpScore;
			   }
			   window.game.helpMap = helpMap;
			   window.game.getHelpScore = getHelpScore;
			   window.game.activity = activityData;
			   window.game.userPlayinfo = userPlayinfo || {};
			   window.game.sendRuleMap = sendRuleMap;
			   window.game.prizeList = prizeList;
			   // 活动奖项数据
			   window.game.trophyList = trophyList;
			   var getHelpNum = 0;
			   if(userPlayinfo && userPlayinfo.getHelpNum){
				   getHelpNum = userPlayinfo.getHelpNum;
			   }
			   window.game.getHelpNum = getHelpNum;
			   window.game.actRuntime = actRuntime;
			   window.game.extendOperation = $.parseJSON(activityData.extendOperation);
			   document.title = activityData.title;
			   // 先判断是否有需要助力的奖品
			   if(prizeList != null && window["isSkipTree"] != true){
				   for(var i=0;i<prizeList.length;i++){
					   var prize = prizeList[i];
					   if(prize.status == -1 || prize.status == 4 || prize.status == 0){
						   window.awardRecord = prize;
						   var prizeCheck = function(){
							   // 记录是否三级防刷，下面跳过首页时要做这个判断，否则会把防刷页面覆盖掉
							   window.isPrizeChecked = true;
							   // 过滤自燃红包活动，使用自己的倒计时页面，并在助力成功之后才进入三级防刷
							   if (_gameTemplateId === 25 && !prize.checked && prize.status === 0) { 
								   window.game.loadUnLockAward(prize, true);
								   return false;
							   } else {
								   window.game.loadUnLockAward(prize);
							   }
						   }
						   // 中奖之后，跳过助力阶段
						   if (window["isSkipHelpTree"]) {
							   if (prize.status != -1) {
								   prizeCheck();
							   }
						   } else {
							   prizeCheck();
						   }
						   break;
					   }
				   }
			   }
			   // 如果要跳过开始页面就在verifyplay接口里提示一次就好了，详细见game_main.js
			   if (!window["isSkipStartPage"]) {
				   if(activityData.isStart == 0){
					   //console.log("活动未发布");
					   $(".topbar_unpublish").show();
				   } else if(activityData.isStart == 1){
					   //$(".loading_text").text("活动未开始╮(╯_╰)╭");
					   	window.game.alert("活动未开始");
					   //return;
				   } else if(activityData.isStart == 4){
					   //$(".loading_text").text("活动已结束╮(╯_╰)╭");
					   window.game.alert("活动已结束");
					   //window.game.afterInit(data.retCode);
					   //return;
				   } else if(activityData.isStart == 6){
					   //$(".loading_text").text("活动已停止╮(╯_╰)╭");
					   window.game.alert("活动已停止");
					   //window.game.afterInit(data.retCode);
					   //return;
				   }
			   } else {
				   if(activityData.isStart == 0){
				   		$(".topbar_unpublish").show();
				   }
			   }
			   
			   window.game.ruleMask.find(".content .fire_res_rule_tips_text").html($.htmlEncode(activityData.ruleTips));
			   var startDate = new Date(activityData.start).Format("yyyy年MM月dd日");
			   var endDate = new Date(activityData.end).Format("yyyy年MM月dd日");
			   window.game.ruleMask.find("#rule_time").html(startDate+"~"+endDate);
			   if(awardTips){
				   var awardHtml = "";
				   var awardSize = awardTips.length;
				   for (var i=0;i<awardSize;i++) {
					   var award = awardTips[i];
					   awardHtml += "<p>";
					   awardHtml += award.awardName;
					   awardHtml += "：";
					   awardHtml += award.trophyName;
					   awardHtml += "</p>";
				   }
				   window.game.ruleMask.find("#rule_award").html(awardHtml);
			   }
			   if(sendRuleMap){
				   window.game.fireFailMask.find(".prize_score").text(sendRuleMap.passCondition);
			   }
			   window.game.ruleMask.find(".organizer").text(activityJson.organizer);
			   window.game.awardInfoMask.find(".organizerName").text(activityJson.organizer);
				if(activityJson.showCopyright){
					$("#start_bottom").show();
				} else {
					$("#start_bottom").hide();
				}
				if(!activityJson.useDefaultCopyright){
					$("#startLogoImg").attr("src",window.game.config.userImgDomain+activityJson.customCopyrightPic);
				}
				if(actRuntime){
					// 统一从数据中心获取活动数据
					//$("#join_line_cont .join_num").text(actRuntime.playerNum+activityJson.participantVirtualAddCount);
				} else {
					$("#join_line_cont").hide();
				}
				if(activityJson.hideParticipant){
					$("#join_line_cont").hide();
				}
			   
			   $(".subscribe_link").on("touchend",function(){
				   window.location.href=activityData.wxlink;
			   });
			   if(activityJson.organizerLink && activityJson.organizerLink!=""){
				   $(".organizer_link").on("touchend",function(){
					  window.location.href=activityJson.organizerLink; 
				   });
			   }
			   //没有开启分享，隐藏分享的相关提示文字和按钮
			   if(!activityData.withHelp){
				   $('.fire_res .share').hide();
				   $('.fire_res .share_text').hide();
			   }
			   if(window.game.config.isHelpAward){
				   $('.fire_res .share_text').hide();
			   }
			   try{
				   //添加数据统计
				   var bigDataParam = {
					   "uid":activityData.uid,
					   "busiPlatform":"<%=BusinessPlatformType.YOUYU %>",
					   "busiType":"<%=BusinessModuleType.ENGINE %>",
					   "busiId":"<%=activityid%>",
					   "openid":"<%=openUser.getOpenid() %>",
					   "nickName":"<%=openUser.getNickname()%>",
					   "headimg":"<%=openUser.getHeadimgurl() %>",
					   "time":"<%=CommonUtils.getSimpleDate(new Date())%>"
				   };
				   if(params.openid){
					   bigDataParam.fromOpenid=params.openid;
				   }
				   if(params.fromOpenid){
					   bigDataParam.fromOpenid=params.fromOpenid;
				   }
				   BigData.sender.saveVisit(bigDataParam);
			   }catch(e){	
			   }
			   if(activityData.participateLimit && userPlayinfo && userPlayinfo.telphone==null){
				   window.game._showParticipateUserInfo();
				   return false;
			   }
		   } else if(data.retCode == -60){
			   $(".fire_participate_overlimit").show();
			   return;
		   } else {
			   window.game.alert(data.message);
		   }
		   
		   // 初始化游戏
		   if(window.gamepage && activityData){
			   var gameTimeType = activityData.gameTimeType;
			   if(gameTimeType == 1){
			       gameTime = activityData.gameTime;
			   }
			   gameConfig.headerimg = window.game.config.headimg;
			   gameConfig.gameTime = gameTime;
			   window.gamepage.initGame(gameConfig);
		   }
		  	// 初始化页面分享信息
		    window.shareConfig = {
		        link: null,
		        title: activityJson.title,
		        desc: activityJson.title,
		        img_url: "<%=platformUrl.getJsCssDomain() %>/image/mobile/newgame/sharecover/<%=WebUtil.getGameTemplateNameById(act.getPageTemplateId()) %>.jpg?v=3",
		        img_width: 80,
		        img_heigth: 80,
		        successCallback: function(){
			    	 // 页面分享成功回调后台统计数据
					$.ajax({
						url: '/mobile/participation/share_rollback',
						type: 'get',
						data: {
							"aid":params.aid,
							"activityid":params.activityid,
							"keyversion":window.game.config.keyversion
						},
						success: function(data){
							console.log(data);
						}
					});
			    }
		    }
			if(imgTextShare){
			   window.game.imgTextShare = imgTextShare;
			   shareConfig.link = imgTextShare.linkUrl;
			   if(activityJson.withHelp){
				   shareConfig.link = window.game.config.pageDomain + "/mobile/newgame/game_help.jsp?aid="+
						   window.game.config.aid + "&activityid=" + window.game.config.activityid + "&wuid=" +
						   window.game.config.wuid + "&openid=" + window.game.config.openid + "&keyversion="+window.game.config.keyversion;
			   } else {
				   shareConfig.link = window.game.config.pageDomain + "/mobile/newgame/index.jsp?aid="+
						   window.game.config.aid + "&activityid=" + window.game.config.activityid + "&wuid=" +
						   window.game.config.wuid + "&keyversion="+window.game.config.keyversion;
			   }
			   shareConfig.title = activityJson.title;
			   window.game.imgTextShare.awardText = window.game.imgTextShare.awardText.replace(/\\${nickName}/g,window.game.config.nickname);
			   var descText = imgTextShare.noAwardText;
			   descText = descText.replace(/\\${nickName}/g,window.game.config.nickname);
			   var lastScore = 0;
			   if(window.game.userPlayinfo && window.game.userPlayinfo.lastScore){
				   lastScore = window.game.userPlayinfo.lastScore;
			   }
			   descText = descText.replace(/\\${score}/g,lastScore);
			   shareConfig.desc = descText;
			   if(imgTextShare.sttr1 == "1" && imgTextShare.imgPath){
				   //使用自定义短图文分享图片
				   shareConfig.img_url = window.game.config.userImgDomain + imgTextShare.imgPath;
			   }
		    }
		  	
		    // 初始化完成后的回调方法
		    window.game.afterInit(data.retCode);
		    
		  	// 七夕活动分享特殊处理
		  	if(_gameTemplateId == 13){
		  	   shareConfig.title="hey 在吗？有些话憋了很久，一直想跟你说…";
		  	   shareConfig.desc="憋了很久的话，我录了下来，想要你听一下，就当作是我给你写的信";
		  	   shareConfig.img_url=window.game.config.headimg;
			   shareConfig.link = window.game.config.pageDomain + "/mobile/newgame/index.jsp?aid="+
			   window.game.config.aid + "&activityid=" + window.game.config.activityid + "&wuid=" +
			   window.game.config.wuid + "&fromOpenid=" + (window.game.config.fromOpenid || window.game.config.openid) + "&keyversion="+window.game.config.keyversion;
		  	   window['initShareInfo'](shareConfig.title,shareConfig.desc,shareConfig.img_url,shareConfig.link,shareConfig.successCallback,256764);
		  	// 后面开发的新游戏分享链接默认使用fromOpenid参数
		  	} else if(_gameTemplateId >= 14 && _gameTemplateId != 24 && _gameTemplateId != 36 && _gameTemplateId != 37 && !window["isCommonHelp"]){
			   shareConfig.link = window.game.config.pageDomain + "/mobile/newgame/index.jsp?aid="+
			   window.game.config.aid + "&activityid=" + window.game.config.activityid + "&wuid=" +
			   window.game.config.wuid + "&fromOpenid=" + (window.game.config.fromOpenid || window.game.config.openid) + "&keyversion="+window.game.config.keyversion;
			   if(_gameTemplateId == 19){
				   shareConfig.title="哎哟喂！客官～快戳进来！伸个手帮我拿下奖，我的大奖快到手了！你也来一份吧～";
			   }
			   if(_gameTemplateId == 21){
				   shareConfig.title = window.game.config.nickname+"想要你的吻，你不吻一下吗？";
			   }
			   if(_gameTemplateId == 23){
				   shareConfig.title = window.game.config.nickname+"要搞事情，你收不收礼？";
			   }
			   // 万圣节游戏默认使用参与者的头像作为分享的小图
			   if(_gameTemplateId == 22){
				   shareConfig.img_url=window.game.config.headimg;
			   }
			   // 真心话大冒险默认分享图片为用户头像
			   if(_gameTemplateId == 44){
				   shareConfig.img_url=window.game.config.headimg;
				   shareConfig.desc="有个小秘密，我只告诉你，来看看！";
			   }
			   window['initShareInfo'](shareConfig.title,shareConfig.desc,shareConfig.img_url,shareConfig.link,shareConfig.successCallback,<%=platform.getUniqueJsShareWuid() %>);
		  	} else{
			   window['initShareInfo'](shareConfig.title,shareConfig.desc,shareConfig.img_url,shareConfig.link,shareConfig.successCallback,<%=platform.getUniqueJsShareWuid() %>);
		  	}
		    // 如果有groupId参数，表示对战游戏，可以直接开始游戏
		    if(window.game.config.groupId && window.game.awardHelpPage.is(":hidden")){
		    	$(".start_btn").click();
		    }
		    // 新版砍价活动特殊处理
		    if(_gameTemplateId == 19 && !window.awardRecord){
			   if(window.game.config.fromOpenid && window.game.config.fromOpenid != window.game.config.openid){
				   window.gamepage.startHelpGame(function(score){
				   });
			   } else {
				   window.gamepage.startGame(function(score){
				   });
			   }
			   //window.game._showGamePage();
		    }
		    
		    // 大转盘（29）
		    // 跳过开始页面直接显示自己的页面，同时也要判断是否要过滤三级防刷
		    if(_gameTemplateId == 29 || window["isSkipStartPage"] && !window.awardRecord){
		    	// 如果是助力人就提示跳转关注链接
		    	if (params.fromOpenid && window["isSkipFllow"] != true) {
		    		$(".fire_common").find(".p_text_1").html("关注一下嘛~<br>人家才让你玩！");
		    		$(".fire_common").find(".subscribe_link").show().children("a").attr("src", window.game.activity.wxlink);
		    		$(".fire_common").show();
		    		return false;
		    	}
		    	if (!window.isPrizeChecked) {
		    		// 模拟点击开始按钮，获取游戏资格，显示游戏页面，详细见game_main.js
			    	$(".start_btn").click();
		    	}
		    }
		    
		    // 如果有fromOpenid参数且fromOpenid不是自己，可以直接开始游戏并且记录助力信息
		    if(window.game.config.fromOpenid && 
		    		window.game.config.openid != window.game.config.fromOpenid  && 
		    		window.game.awardHelpPage.is(":hidden") && _gameTemplateId != 19){
	    		/**
		    	$.ajax({
	    			url: '/mobile/participation/help_user',
	    			data: {
		    			"aid":params.aid,
		    			"activityid":params.activityid,
		    			"wuid":params.wuid,
		    			"keyversion":params.keyversion||"0",
		    			"openid":params.fromOpenid
		    		},
	    			type:"GET",
	    			success: function(data){
	    			   if(data.retCode == 0){
	    				 // TODO
	    			   } else if(data.retCode == -3501){
	    			   } else {
	    				 // TODO
	    			   }
	    			}
	    		});
	    		**/
		    	$(".start_btn").click();
		    }
		}
	});
});
// 根据分享方式判断是否隐藏分享菜单
if ((activityJson.extraData & (Math.pow(2, 7))) != 0) {
	// 图文分享方式
	// 定制处理
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		WeixinJSBridge.call('showOptionMenu');
	});

} else {
	// 图片分享方式
	// 目前只针对新版砍价游戏进行隐藏分享菜单，其他游戏考虑传播效果默认开放分享菜单
	if (_gameTemplateId == 19 || _gameTemplateId == 40 || window["isHideShare"]) {
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
			WeixinJSBridge.call('hideOptionMenu');
		});
	} else {
		if(activityJson.id == 37995){
			document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
				WeixinJSBridge.call('hideOptionMenu');
			});
		} else {
			// 图文分享方式
			// 定制处理
			document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
				WeixinJSBridge.call('showOptionMenu');
			});
		}
	}
}
</script>
<!-- 开屏广告统计代码  -->
<script type="text/javascript">
    window._pt_lt = new Date().getTime();
    window._pt_sp_2 = [];
    _pt_sp_2.push('setAccount,659b6c18');
    var _protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
    (function() {
        var atag = document.createElement('script'); atag.type = 'text/javascript'; atag.async = true;
        atag.src = _protocol + 'js.ptengine.cn/659b6c18.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(atag, s);
    })();
</script>