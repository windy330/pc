<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@taglib prefix="wxj" uri="http://www.weixinjia.com/jstl/wxj" %>
        <!DOCTYPE html>
        <html>

        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width,minimum-scale=1,user-scalable=no,maximum-scale=1,initial-scale=1" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black" />
            <meta name="format-detection" content="telephone=no">
            <meta http-equiv="x-rim-auto-match" content="none">
            <wxj:cssresource src="/css/mobile/newgame/game_common.css" />
            <wxj:cssresource src="/css/mobile/newgame/game_style.css" />
            <title></title>
            <style>
                #join_line_cont {
                    top: 18.2rem;
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
            </style>
        </head>

        <body>
            <jsp:include page="../game_common.jsp"></jsp:include>
            <jsp:include page="../game_startpage.jsp"></jsp:include>
            <div class="game_page">
                <jsp:include page="../gamepage/snake.jsp"></jsp:include>
            </div>
        </body>
        <wxj:jsresource src="/js/mobile/newgame/game_main.js" />
        <script type="text/javascript">
            var gameTime = 300;
            var gameConfig = {
                image: {},
                topInfo: {},
                music: {}
            };
            var box = gameOrigin[0];
            var apple = gameOrigin[1];
            var cactus = gameOrigin[2];
            var gold = gameOrigin[3];
            gameConfig.image.background = gbp;
            gameConfig.image.apple = apple.path[0];
            gameConfig.image.cactus = cactus.path[0];
            gameConfig.image.gold = gold.path[0];

            // 上传音乐
            $(function() {
                // 背景音乐
                if (gamePageJson.bgMusicSwitch0) {
                    // bgMusicSwitch0 = 0; // 开启音乐按钮
                    // bgMusicSwitch0 = 1; // 关闭音乐按钮
                    // gamePageJson.bgMusic0 // 自定义音乐路径
                    window.bgMusicSwitch0 = gamePageJson.bgMusicSwitch0;
                    if (gamePageJson.bgMusicSwitch0 == 0 && gamePageJson.bgMusic0) {
                        gameConfig.music['backgroundMusic'] = gamePageJson.bgMusic0.replace(/\*_resRoot\*/g, _resRoot).replace(/\*_qiniuResRoot\*/g, _qiniuResRoot);
                    }
                } else {
                    // 兼容以前的老数据（默认开启音乐）
                    window.bgMusicSwitch0 = 0;
                }
            });
        </script>

        </html>