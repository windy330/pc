<%@page import="com.weixinjia.recreation.common.context.SpringContextManager"%>
    <%@page import="com.weixinjia.recreation.gameservice.service.ManageActivityService"%>
        <%@page import="com.weixinjia.recreation.newcore.entity.GamePage"%>
            <%@page import="com.weixinjia.recreation.newcore.entity.Activity"%>
                <%@page import="org.apache.commons.lang.StringUtils"%>
                    <%@page import="com.weixinjia.recreation.wxapi.sysoauth2.service.UnionUserSystem"%>
                        <%@page import="com.weixinjia.recreation.wxapi.entity.OpenUser"%>
                            <%@page import="com.weixinjia.recreation.common.util.PlatformUtils"%>
                                <%@page import="com.weixinjia.recreation.common.constant.PlatformURL"%>
                                    <%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
                                        <%@taglib prefix="wxj" uri="http://www.weixinjia.com/jstl/wxj" %>
                                            <%
PlatformURL platform = PlatformUtils.getPlatformUrl();
String resourceDomain=platform.getJsCssDomain();
OpenUser openUser = UnionUserSystem.getSystemOpenUser(request, response);
String aid = request.getParameter("aid");
String activityid = request.getParameter("activityid");
String wuid = request.getParameter("wuid");
%>
                                                <!DOCTYPE html>
                                                <html>

                                                <head>
                                                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                                    <meta name="viewport" content="width=device-width,minimum-scale=1,user-scalable=no,maximum-scale=1,initial-scale=1" />
                                                    <meta name="apple-mobile-web-app-capable" content="yes" />
                                                    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                                                    <title>贪吃蛇</title>
                                                </head>
                                                <style>
                                                    #join_line_cont {
                                                        top: 18.2rem;
                                                    }
                                                    
                                                    .start_btn #startBtnImg {
                                                        top: 10.15rem;
                                                        width: 5.63rem;
                                                        left: 5.18rem;
                                                    }
                                                    
                                                    .title_img #titleImg {
                                                        width: 10.93rem;
                                                        left: 2.54rem;
                                                        top: 5.5rem;
                                                    }
                                                    
                                                    .start_page .rule_tag {
                                                        width: 3.63rem;
                                                        height: 2.55rem;
                                                        right: 5.65rem;
                                                        top: 1.15rem;
                                                    }
                                                    
                                                    .start_page .rank_btn {
                                                        width: 3.63rem;
                                                        height: 2.55rem;
                                                        top: 1.15rem;
                                                        right: 1.8rem;
                                                    }
                                                    
                                                    #snake_body {
                                                        margin-top: 14rem;
                                                        margin-left: 4rem;
                                                        position: relative;
                                                    }
                                                    
                                                    #snake_body>img {
                                                        position: absolute;
                                                        width: 0.88rem;
                                                        height: 0.88rem;
                                                    }
                                                </style>

                                                <body>
                                                    <jsp:include page="common.jsp"></jsp:include>
                                                    <%
String gameImgPath = request.getAttribute("gameImgPath").toString();
%>
                                                        <jsp:include page="/mobile/newgame/game_startpage.jsp"></jsp:include>
                                                        <div class="game_page gameBox gameBgBox">
                                                            <div id="gameBgBox">
                                                                <img id="gameBg" src="" style="width:100%;height:auto">
                                                            </div>
                                                            <div id="gameLayerBox" style="z-index: 11;">
                                                                <img class="editTarget-box">
                                                                <img class="editTarget-apple">
                                                                <img class="editTarget-cactus">
                                                                <img class="editTarget-gold">
                                                                <div id="snake_body">
                                                                    <img src="<%=gameImgPath%>/snake/game/body.png" style="top: 0rem;left: 0.88rem;" />
                                                                    <img src="<%=gameImgPath%>/snake/game/body.png" style="top: 0rem;left: 1.76rem;" />
                                                                    <img src="<%=gameImgPath%>/snake/game/body1.png" style="top: 0rem;left: 2.64rem;" />
                                                                    <img src="<%=gameImgPath%>/snake/game/body3.png" style="top: -0.88rem;left: 2.64rem;" />
                                                                    <img src="<%=gameImgPath%>/snake/game/head.png" style="top: -0.88rem;left: 3.52rem;" />
                                                                    <img src="<%=gameImgPath%>/snake/game/tail.png" style="top: 0rem;left: 0rem;" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                </body>
                                                <script type="text/javascript">
                                                    // 自定义配置的参数
                                                    Edit.originDef = [{
                                                        "name": "box",
                                                        "pos": {
                                                            "left": "0.8rem",
                                                            "top": "5rem",
                                                            "disable": "disable"
                                                        },
                                                        "size": {
                                                            "width": "14.38rem",
                                                            "height": "14.38rem"
                                                        },
                                                        "path": ["*_resRoot*/snake/game/box.png", "游戏框", "100k"]
                                                    }, {
                                                        "name": "apple",
                                                        "pos": {
                                                            "left": "7rem",
                                                            "top": "10rem",
                                                            "disable": "disable"
                                                        },
                                                        "size": {
                                                            "width": "0.88rem",
                                                            "height": "0.88rem"
                                                        },
                                                        "path": ["*_resRoot*/snake/game/apple.png", "苹果", "50k"],
                                                        "edit": "all"
                                                    }, {
                                                        "name": "cactus",
                                                        "pos": {
                                                            "left": "5rem",
                                                            "top": "8rem",
                                                            "disable": "disable"
                                                        },
                                                        "size": {
                                                            "width": "0.88rem",
                                                            "height": "0.88rem"
                                                        },
                                                        "path": ["*_resRoot*/snake/game/cactus.png", "仙人掌", "50k"],
                                                        "edit": "all"
                                                    }, {
                                                        "name": "gold",
                                                        "pos": {
                                                            "left": "3rem",
                                                            "top": "6rem",
                                                            "disable": "disable"
                                                        },
                                                        "size": {
                                                            "width": "0.88rem",
                                                            "height": "0.88rem"
                                                        },
                                                        "path": ["*_resRoot*/snake/game/gold.png", "金币", "50k"],
                                                        "edit": "all"
                                                    }];
                                                    var pubResizeDef = { //图片恢复默认参数
                                                        'titleImg': {
                                                            width: '10.93rem',
                                                            height: '3.7rem'
                                                        },
                                                        'startBtnImg': {
                                                            width: '5.63rem',
                                                            height: '2.28rem'
                                                        }
                                                    };

                                                    // 上传音乐
                                                    $(function() {
                                                        var parentWin = window.parent || window.top;
                                                        // 有背景音乐的都要加上这个全局变量，动态添加音乐编辑按钮
                                                        window.has_musicBtn = true;
                                                        // 必须写在setTimeout里面
                                                        setTimeout(function() {

                                                            // 如果要设置按钮的样式（示例）
                                                            /*
			
                                                            $("#music_editorBtn").attr("src",""); // 改变按钮图片
                                                            $("#music_editorBtn").attr("id","xx").css({ // 改变按钮id名，设置样式
                                                            	position:"absolute",
                                                            	top: "0.5rem",
                                                            	right: "0.5rem",
                                                            	"z-index": "100"
                                                            }); 
			
                                                            */


                                                            // 音乐按钮编辑触发
                                                            HdGame.initModuleLayer('#music_editorBtn', 6, "", [{
                                                                from: "#music_editorBtn",
                                                                title: '背景音乐',
                                                                limit: '100k',
                                                                defSrc: '<%=platform.getJsCssDomain()%>/image/mobile/newgame/gamepage/snake/bg_music.mp3' // 音乐路径
                                                            }]);

                                                        }, 0);


                                                    });
                                                </script>

                                                </html>