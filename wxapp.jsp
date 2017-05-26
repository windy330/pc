<%@page import="com.weixinjia.recreation.common.util.PlatformUtils"%>
<%@page import="com.weixinjia.recreation.common.constant.PlatformURL"%>
<%@taglib prefix="wxj" uri="http://www.weixinjia.com/jstl/wxj" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <%
    PlatformURL platform = PlatformUtils.getPlatformUrl();
    %>
	<meta charset="UTF-8">
	<link rel="icon" href="<%=platform.getJsCssDomain() %>image/page/index/favicon.ico" type="image/x-icon" />
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<title>花儿绽放</title>
	<wxj:cssresource  src="/css/page/index/index.css"/>
	<style>
		body{
			position: relative;
		}
		
		*{
			margin:0;
			padding: 0;
			font-family: "微软雅黑";
		}
		a{
			text-decoration: none;
		}
		img{
			display: block;
			width: 100%;
		}
		/* 清理浮动 */
		.fn-clear:after {
			visibility:hidden;
			display:block;
			font-size:0;
			content:" ";
			clear:both;
			height:0;
		}
		.fn-clear {
			zoom:1; /* for IE6 IE7 */
		}
		/*.brandhead{
		    height: 1.792rem;
		    background-color: #373737;
		    position: fixed;
		    padding-top: 0.29867rem;
			top:0;
			width: 100%;
			-webkit-box-sizing: border-box;
		    -moz-box-sizing: border-box;
		    box-sizing: border-box;
		    z-index: 100;
		}
		.brandhead .img1{
		    float: left;
		    margin-left: 0.512rem;
		    height: 1.28rem;
		    width: 1.792rem;
		}
		.brandhead a{
		    float: right;
		    margin-right: 0.42667rem;
		    height: 1.152rem;
		    width: 2.85867rem;
		}*/
		.brandpic .a1{
			position: absolute;
		    top: 2.6213rem;
            left: 5.80267rem;
		    width: 4.352rem;
		    height: 1.8773rem;
		}
		.brandpic .a2{
			position: absolute;
		    top: -0.21333rem;
		    left: 5.46133rem;
		    width: 4.9493rem;
		    height: 1.7493rem;
		}
		.brandpic .a3{
		    position: absolute;
		    top: 0.1rem;
		    left: 5.2907rem;
		    width: 10.0267rem;
		    height: 1.1093rem;
		}
		.brandpic .a4{
		    position: absolute;
		    top: 3.15rem;
		    left: 5.2907rem;
		    width: 10.0693rem;
		    height: 1.1093rem;
		}
		#formBox{
			color:white;
			font-size: 0.8rem;
			text-align: center;
			position: absolute;
		   	top: 53rem;
			left: 2.2rem;
		}

		#formBox p{
			margin-bottom: 0.5rem;
		}
		#formBox p .label{
		    color: black;
		    float: left;
		    line-height: 1.5rem;
		    padding-left: 0.3rem;
		    font-size: 0.7rem;
		}
		#formBox input{
			font-size: 0.7rem;
		    outline: none;
		    border: none;
		    height: 1.5rem;
		    width: 9rem;
		    padding: 0 0.2rem 0 0;
		    float: left;
			border: 0.025rem solid #1e9eff;
			border-radius: 0.075rem;
		}
		#formBox2{
			color:white;
			font-size: 0.8rem;
			text-align: center;
			position: absolute;
		   	top: 139rem;
			left: 2.2rem;
		}

		#formBox2 p{
			margin-bottom: 0.5rem;
			
		}
		#formBox2 p .label{
		    color: black;
		    float: left;
		    line-height: 1.5rem;
		    padding-left: 0.3rem;
		    font-size: 0.7rem;
		}
		.pBz {
			width: 4.325rem !important;
    		margin-left: 0.36rem;
		}
		#pBzid {
			width: 4.325rem !important;
    		margin-left: 0.36rem;
		}
		#formBox2 input{
			font-size: 0.7rem;
		    outline: none;
		    border: none;
		    height: 1.5rem;
		    width: 9rem;
		    padding: 0 0.2rem 0 0;
		    float: left;
			border: 0.025rem solid #1e9eff;
			border-radius: 0.075rem;
		}

		.btn2{
			width: 12.275rem;
			height: 1.8rem;
    		margin: 1rem auto 0;
		}
		#btn2id{
			width: 12.275rem;
			height: 1.8rem;
    		margin: 1rem auto 0;
		}
		.banner {
			width: 100%;
			height: 10.5rem;
			overflow: hidden;
		}
		#imageBox {
			width: 500%;
			height: 100%;
			/*margin-left: -100%;*/
		}
		.banner ul>li {
			width: 20%;
			height: 100%;
			list-style: none;
			float:left;
		}
		#points {
			width: 1.4rem;
			position: absolute;
			bottom: 15px;
			left: 50%;
			margin-left: -0.7rem;
			text-align: center;
		}
		#points li {
			float: left;
			width: 0.15rem;
			height: 0.15rem;
			background: #BAA89A;
			border-radius: 50%;
			margin: 0 0.125rem;
		}
		.point_now {
			background: white !important;;
		}
		.link-us {
			width: 3.525rem;
			height: 3.525rem;
			border-radius:1.7625rem;
			position: fixed;
			bottom: 1.2rem;
			right:0.6rem;
		}
		.link-us a {
			width: 100%;
			height: 100%;
		}
		.link-us img {
			width: 100%;
			height: 100%;
		}
		.red {
			float:left;
			color:red;
		}
		#verify {
			width: 2.2rem;
			height: 1.5rem;
			margin: 0 0.4rem;
			display: inline-block;
			float: left;
		}
		#verifyid {
			width: 2.2rem;
			height: 1.5rem;
			margin: 0 0.4rem;
			display: inline-block;
			float: left;
		}
		.text2 {
			font-size: 0.5rem;
			height: 0.6rem;
			color: #2EC0FC;
			float: left;
			margin-top: 0.6rem;
			border-bottom: solid 0.025rem #2EC0FC;
		}
		#text2id{
			font-size: 0.5rem;
			height: 0.6rem;
			color: #2EC0FC;
			float: left;
			margin-top: 0.6rem;
			border-bottom: solid 0.025rem #2EC0FC;
		}
		.website {
			width: 12.45rem;
			height: 1.35rem;
			position: absolute;
			bottom: 11.3rem;
			left: 50%;
			margin-left: -6.225rem;
		}
		.phone {
			width: 12.025rem;
			height: 1.5rem;
			position: absolute;
			bottom: 6.7rem;
			left: 50%;
			margin-left: -6.0125rem;
		}
		</style>
</head>
<body>
<%--<div class="brandhead">
    <img class="img1" src="<%=platform.getJsCssDomain() %>/image/market/brandimg/youyuicon.png" alt=""/>
    <a href="tel:4007888925"> <img src="<%=platform.getJsCssDomain() %>/image/market/brandimg/zxkf.png" alt=""/></a>
    <a href="http://youyu.weijuju.com/regMobile.jsp"> <img src="<%=platform.getJsCssDomain() %>/image/market/brandimg/tc.png" alt=""/></a>
</div>--%>
<div class="banner">
	<ul id="imageBox">
		<li><a href="javascript:void(0);"><img src="<%=platform.getJsCssDomain() %>image/market/wxapp/banner3.jpg" alt=""></a></li>
		<li><a href="tel:4007888925"><img src="<%=platform.getJsCssDomain() %>image/market/wxapp/banner1.jpg" alt=""></a></li>
		<li><a href="javascript:void(0);"><img src="<%=platform.getJsCssDomain() %>image/market/wxapp/banner2.jpg" alt=""></a></li>
		<li><a href="javascript:void(0);"><img src="<%=platform.getJsCssDomain() %>image/market/wxapp/banner3.jpg" alt=""></a></li>
		<li><a href="tel:4007888925"><img src="<%=platform.getJsCssDomain() %>image/market/wxapp/banner1.jpg" alt=""></a></li>
	</ul>
	<ul id= "points">
		<li class="point_now"></li>
		<li></li>
		<li></li>
	</ul>
</div>
<div class="brandpic">	
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/01.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/02.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/03.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/04.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/05.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/06.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/07.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/08.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/09.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/10.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/11.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/12.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/13.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/14.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/15.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/16.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/17.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/18.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/19.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/20.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/21.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/22.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/23.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/24.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/25.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/26.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/27.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/28.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/29.jpg?v=1"/>
	<img src="<%=platform.getJsCssDomain() %>image/market/wxapp/30.jpg?v=1"/>
	<div id="formBox">
		<p class="fn-clear"><span class="red">*</span><span class="label">姓名：</span><input class="pName" type="text"></p>
		<p class="fn-clear"><span class="red">*</span><span class="label">电话：</span><input class="pTel" type="tel"></p>
		<p class="fn-clear"><span class="label">验证码</span><input class="pBz" type="text">
		<img id="verify" src="http://youyu.weijuju.com/randimage?size=2x&1111" alt=""><a class="text2">看不清</a></p>
		<img class="btn2" src="<%=platform.getJsCssDomain() %>/image/market/wxapp/btn.png"/>
	</div>
	<div id="formBox2">
		<p class="fn-clear"><span class="red">*</span><span class="label">姓名：</span><input id="pNameid"  type="text"></p>
		<p class="fn-clear"><span class="red">*</span><span class="label">电话：</span><input id="pTelid"  type="tel"></p>
		<p class="fn-clear"><span class="label">验证码</span><input id="pBzid"  type="text">
		<img id="verifyid" src="http://youyu.weijuju.com/randimage?size=2x&1111" alt=""><a id="text2id" >看不清</a></p>
		<img id="btn2id" src="<%=platform.getJsCssDomain() %>/image/market/wxapp/btn.png"/>
	</div>
	<div class="link-us"><a href="tel:4007888925"> <img src="<%=platform.getJsCssDomain() %>/image/market/wxapp/btn1.png" alt=""/></a></div>
	<a class="website" href="http://youyu.weijuju.com"><img src="<%=platform.getJsCssDomain() %>/image/market/wxapp/wangzhi.png" alt="网址"></a>
	<a class="phone" href="tel:4007888925"><img src="<%=platform.getJsCssDomain() %>/image/market/wxapp/phone400.png" alt="电话"></a>
	<div style="position: relative;">
		<img src="<%=platform.getJsCssDomain() %>image/market/toutiao/brand_16.jpg?v=1"/>
		<a class="a3" href="http://youyu.weijuju.com"><img src="<%=platform.getJsCssDomain() %>/image/market/brandimg/wz.png" alt=""/></a>
		<a class="a4" href="tel:4007888925"><img src="<%=platform.getJsCssDomain() %>/image/market/brandimg/400phone.png" alt=""/></a>
	</div>
</div>
<script type="text/javascript" src="http://static.resource.youyu.weijuju.com/js/plugin/jquery-1.7.2.min.js?v=20161020180054"></script>
	<script>
		//rem单位转换
		(function(doc, win) {
			var docEl = doc.documentElement, resizeEvt = 'orientationchange' in window ? 'orientationchange'
					: 'resize', recalc = function() {
				var clientWidth = docEl.clientWidth;
				if (!clientWidth)
					return;
				docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
			};
			if (!doc.addEventListener)
				return;
			win.addEventListener(resizeEvt, recalc, false);
			doc.addEventListener('DOMContentLoaded', recalc, false);
		})(document, window);
	</script>
	
	<script type="text/javascript">
	// 表单提交
	var canClick = true;
	$(".btn2").on("click",function(){
		if($(this).hasClass("disabled")) return false;
		var pName = $(".pName").val();
		var pTel = $(".pTel").val();
		var pBz = $(".pBz").val();

		if(pName==""){
			alert("请输入姓名！");
			$(".pName").focus();
			return false;
		} else if (pTel==""){
			alert("请输入电话！");
			$(".pTel").focus();
			return false;
		}  else if (pBz==""){
			alert("请输入验证码！");
			$(".pBz").focus();
			return false;
		} else {
			$(this).addClass("disabled");
			$.ajax({
				url:"/collect_info/user_info",
				dataType:"json",
				type:"post",
				data:{
					userName:pName,
					telphone:pTel,
					userRemark:"",
					resource:7,
					_: new Date().getTime()
				},
				success:function(){
					alert("提交成功！");
					// canClick = true;
				}
			})
		}
	});

	$("#btn2id").on("click",function(){
		if($(this).hasClass("disabled")) return false;
		var pName = $("#pNameid").val();
		var pTel = $("#pTelid").val();
		var pBz = $("#pBzid").val();

		if(pName==""){
			alert("请输入姓名！");
			$("#pNameid").focus();
			return false;
		} else if (pTel==""){
			alert("请输入电话！");
			$("#pTelid").focus();
			return false;
		}  else if (pBz==""){
			alert("请输入验证码！");
			$("#pBzid").focus();
			return false;
		} else {
			$(this).addClass("disabled");
			$.ajax({
				url:"/collect_info/user_info",
				dataType:"json",
				type:"post",
				data:{
					userName:pName,
					telphone:pTel,
					userRemark:"",
					resource:7,
					_: new Date().getTime()
				},
				success:function(){
					alert("提交成功！");
					// canClick = true;
				}
			})
		}
	});
	</script>
	
	<!-- ptengine统计代码 -->
	<script type="text/javascript">
		window._pt_sp_2 = [];
		_pt_sp_2.push('setAccount,11969d4b');
		var _protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
		
		(function() {
			var atag = document.createElement('script'); atag.type = 'text/javascript'; atag.async = true;
			atag.src = _protocol + 'js.ptengine.cn/js/pta.js';
			var stag = document.createElement('script'); stag.type = 'text/javascript'; stag.async = true;
			stag.src = _protocol + 'js.ptengine.cn/js/pts.js';
			var s = document.getElementsByTagName('script')[0]; 
			s.parentNode.insertBefore(atag, s);s.parentNode.insertBefore(stag, s);
		})();
	</script>
	<!-- 百度统计代码 -->
	<script>
	var _hmt = _hmt || [];
	(function() {
	  var hm = document.createElement("script");
	  hm.src = "//hm.baidu.com/hm.js?8b4a3f32b2eaef7faf9360df7dec7c34";
	  var s = document.getElementsByTagName("script")[0]; 
	  s.parentNode.insertBefore(hm, s);
	})();
	</script>

	<!-- 轮播代码 -->
	<script type="text/javascript">
		var index = 1;
		var timerOnOff;

		var banner = document.querySelector('.banner');
		var banner_width = $('.banner').outerWidth();
		// 图片盒子
		var imageBox = banner.querySelector('#imageBox');
		// 所有的图片
		var images = imageBox.querySelectorAll('li');
		// 点盒子
		var pointBox = banner.querySelector('#points');
		// 所有的点
		var points = pointBox.querySelectorAll('li');

		// 默认显示第二张图片
		imageBox.style.transform = "translateX(" + banner_width * index * -1 + "px)";

		// 公用方法
		var addTransition = function() {
			imageBox.style.webkitTransition = "all .2s";
			imageBox.style.transition = "all .2s";
		}
		var removeTransition = function() {
			imageBox.style.webkitTransition = "none";
			imageBox.style.transition = "none";
		}
		var setTranslateX = function(x) {
			imageBox.style.webkitTransform = "translateX("+x+"px)";
			imageBox.style.transform = "translateX("+x+"px)";
		}

		// 自动轮播
		timerOnOff = setInterval(function(){
			console.log("index"+index);
			console.log("banner_width"+banner_width);
			console.log("-index*banner_width"+(-index*banner_width));
			index++;
			// 加上过渡
			addTransition();
			setTranslateX(-index*banner_width);
		},3000);

		//控制小圆点
		function setPoint() {
			for(var i=0;i<points.length; i++){
				points[i].className = "";
			}
			points[index-1].className = "point_now";
		}

		// 结束
		transitionEnd(imageBox,function(){
			if(index >= images.length-1){
				index=1;
				removeTransition();
				setTranslateX(-index*banner_width);
			}else if (index <= 0){
				index  = images.length-2;
				removeTransition();
				setTranslateX(-index*banner_width);
				
			}
			setPoint();
		});

		// 兼容transitionEnd
		function transitionEnd(dom,callback) {
			if(dom && typeof  dom == 'object'){
				dom.addEventListener('webkitTransitionEnd',function(){
					callback && callback();
				});
				dom.addEventListener('transitionEnd',function(){
					callback && callback();
				});
			}
		}

		// 滑动
		var startX = 0;
		var moveX = 0;
		var distanceX = 0;
		var isMove = false;
		
		imageBox.addEventListener('touchstart',function(e){
			clearInterval(timerOnOff);
			startX = e.touches[0].clientX;
		});
		imageBox.addEventListener('touchmove',function(e){
			isMove = true;
			moveX = e.touches[0].clientX;
			distanceX = moveX - startX;
			/*在滑动的时候不断的给图片盒子做定位  来达到滑动的效果*/
			/*定位的位置  当前的图片的定位  加上 移动的距离*/
			/*清除过度*/
			removeTransition();
			/*设置当前的定位*/
			setTranslateX(-index*banner_width+distanceX);
		});
		//在谷歌的模拟器会出现  一个问题就是  touchend的时候可能会丢失事件
		imageBox.addEventListener('touchend',function(e){
			if(Math.abs(distanceX) > (banner_width/8) && isMove){
				if(distanceX>0){
					index --;//向右
				}else{
					index ++;
				}
				addTransition();
				setTranslateX(-index*banner_width);
			}else{
				/*动画的定位回去 其实就是吸附回去*/
				addTransition();
				setTranslateX(-index*banner_width);
			}
			
			/*重置参数  防止第二次的时候影响计算*/
			startX = 0;
			moveX = 0;
			distanceX = 0;
			isMove = false;

			/*加上定时器*/
			clearInterval(timerOnOff);
			timerOnOff = setInterval(function(){
				if(pauseSwipe){
					return false;
				}
				
				index ++ ;
				/*让图片动画的滚动  translateX  transition 来实现动画*/
				/*给imageBox加上过度*/
				addTransition();
				/*给imageBox设置当前的位置 */
				setTranslateX(-index*banner_width);
			},3000);
		});
		
		$(".text2").on("touchend",function(){
			$("#verify").attr('src', '/randimage?size=2x&' + Math.random());
		});
		$("#text2id").on("touchend",function(){
			$("#verifyid").attr('src', '/randimage?size=2x&' + Math.random());
		});
	</script>
</body>
</html>