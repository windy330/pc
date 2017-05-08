/* b 编辑类型
 * j 编辑元素id
 * M 编辑配置，详细参考common.jsp
 */
function showEditByGame(b, j, M) {
    var fromEl = $(this);
    // 以后编辑的自定义的方法全部放到M中，不要在这里加方法了
    if (M && M[0] && M[0].callback && typeof M[0].callback == "function") {
        M[0].callback();
        return;
    }
    if (b == -1) {
        $("#upload_img_modal").modal("show");
        var $modalContent = $("#upload_img_modal .modal-body");
        $modalContent.html("");
        for (var K = 0; K < M.length; K++) {
            var x = M[K];
            if (!x.extend) {
                x.extend = {};
            }
            x.index = K;
            if (!x.imgtype) {
                x.imgtype = "common";
            }
            var J = getJqSrc($$(x.from), true);
            var k = x.size || "--px*--px";
            x.img_src = J;
            x.recover = getImgName(J) != getImgName(x.defSrc);
            var infoText = '图片像素建议为 <span class="uploadSize uploadSize-' + K + '">' + k + "</span><br>大小在" + x.limit + '以内，格式为jpg\\bmp\\png\\gif<div class="sanjiao"></div>';
            x.infoText = infoText;
            var upload_item_tpl = document.getElementById("upload_img_field_tpl").text;
            var upload_content_html = $.template(upload_item_tpl).render(x);
            $("#upload_img_modal .modal-body").append(upload_content_html);
            (function(N) {
                GameImgReady(x.defSrc, function() {
                    $(".uploadSize-" + N).html(this.width + "px*" + this.height + "px")
                })
            })(K);
        }

        // 上传图片调用
        initFileUpload($("#upload_img_modal input[name='fileupload']"), function(jsonData, $cont) {
            //setJqSrc($$($cont.find(".cover-bd").data("from")),jsonData.fileUrl);
            $cont.find(".cover-recovery").show();
        });
    } else if (b == 5) {
        // 编辑文字样式
        editCheckText(fromEl, j);
    } else if (b == 6) {
        // 音乐编辑
        for (var K = 0; K < M.length; K++) {
            var x = M[K];
            if (!x.extend) {
                x.extend = {};
            }
            x.index = K;
            if (!x.imgtype) {
                x.imgtype = "common";
            }

            var J = getJqSrc($$(x.from), true);

            /*			x.recover = getImgName(J) != getImgName(x.defSrc);*/

            $("#upload_music_modal").find(".control-group").eq(K).find(".music_area").attr("data-defsrc", x.defSrc);
            var music_name = $("#upload_music_modal").find(".control-group").eq(K).find(".upload_music_1_1").val();

            if (music_name && x.defSrc != music_name) {

                $("#upload_music_modal").find(".control-group").eq(K).find(".music_cover-recovery").show();
            } else {
                $("#upload_music_modal").find(".control-group").eq(K).find(".music_cover-recovery").hide();
            }

            $("#upload_music_modal").find(".control-group").eq(K).find(".music_name").text(music_name ? music_name : x.defSrc);
        }

        // 判断是否有cookie
        var _cookies = document.cookie.split("; ");
        for (var i = 0; i < _cookies.length; i++) {
            if (_cookies[i].indexOf("disclaimer_music") == 0) {
                // 上传音乐
                $("#upload_music_modal").modal("show");
                break;
            } else if (i == _cookies.length - 1) {
                // 显示免责声明
                $("#disclaimer_modal").modal("show");
            }
        }

    } else if (b == 11) {
        // 集五福游戏文字自定义
        var $jiwufuModal = $("#jiwufu_gametext_modal");
        $jiwufuModal.modal("show");
    } else if (b == 12) {
        var $newshakeredpackModal = $("#newshakeredpack_redpacktext_modal");
        $newshakeredpackModal.modal("show");
    } else if (b == 13) {
        // 估价猎人图片上传
        $("#valuationHunter_goodsImg_modal").show();
    } else if (b == 15) {
        // 真心话大冒险
        $("#upload_truth_modal").modal("show");
    } else {
        addFieldCheckBorder(j);
    }
}

//（如点击编辑，是修改文字样式的操作）j为初始化传递的第三个参数（字符串）
function editCheckText(that, j) {
    // 先进行解绑事件
    $("#range_edit_text").off("keyup");
    $("#range_edit_color").off("keyup")

    $("#edit_text_modal").modal("show");

    var text = {};
    text.value = $$(that).text() || "";
    text.color = rgb2hex($$(that).css("color")) || "#000000";
    text.size = $$(that).css("fontSize").replace("px", "") || "12";

    //赋值
    $("#range_edit_text").val(text.value);
    if ($$(that).attr("id") == "qrcode_edit_represent_text" || $$(that).attr("id") == "qrcode_edit_title_text") {
        $("#range_edit_text").attr("readonly", true);
    } else {
        $("#range_edit_text").attr("readonly", false);
    }
    $("#range_edit_color").val(text.color).trigger("keyup");
    progressBar(that, text.size);

    // 重新文本变换绑定事件
    $("#range_edit_text").on("keyup", function() {
        $$(that).html($("#range_edit_text").val());
    });

    // 重新颜色变换绑定事件
    $("#range_edit_color").on("keyup", function() {
        $$(that).css("color", $("#range_edit_color").val());
    });

    // 恢复默认颜色
    $("#edit_text_modal").off("click", "j-reback-color").on("click", ".j-reback-color", function() {
        var _value = $$(that).data("color");
        var _color = rgb2hex(_value) || "#000000";
        $("#range_edit_color").val(_color).trigger("keyup");
        return false;
    });
    // 恢复默认文字
    $("#edit_text_modal").off("click", "j-reback-text").on("click", ".j-reback-text", function() {
        var _value = $$(that).data("text") || "新增文本";
        $("#range_edit_text").val(_value).trigger("keyup");
        return false;
    });
}

//字体进度条控制
function progressBar(that, value) {
    var $progress = $("#progress_control");
    var isDrag = false;
    var fullWidth = $progress.find(".progress").width();
    var left = changeToWidth(value) || 0;

    // 初始化
    setBar(left);
    // 启动拖动
    $progress.off("mousedown", ".j-bar-control").on("mousedown", ".j-bar-control", function() {
        isDrag = true;
        return false;
    });

    $progress.off("mousemove", ".progress").on("mousemove", ".progress", function(e) {
        if (isDrag) {
            setBar(e.offsetX);
        }
        return false;
    });

    // 停止拖动
    $progress.off("mouseup").on("mouseup", function() {
        isDrag = false;
        return false;
    });

    // 恢复默认
    $progress.off("click", "j-reback-size").on("click", ".j-reback-size", function() {
        var _value = $$(that).data("size") || "12px";
        var _left = changeToWidth(_value) || 0;
        setBar(_left);
        return false;
    });

    // 设置进度条显示
    function setBar(left) {
        var _left = 0;
        if ((left <= fullWidth) || (left >= 0)) {
            _left = left;
        } else if (left > fullWidth) {
            _left = fullWidth;
        } else {
            _left = 0;
        }

        var font_size = changeToFont(_left);
        $$(that).css("fontSize", font_size);
        $progress.find(".j-bar-value").html(font_size);
        $progress.find(".j-bar-line").width(_left + "px");
        $progress.find(".j-bar-control").css("left", _left + "px");
    }
    // 转换文字字体大小
    function changeToFont(value) {
        var _width = parseInt(value);
        return Math.round(_width / (fullWidth / 30) + 10) + "px";
    }

    // 转换宽度
    function changeToWidth(value) {
        var _width = parseInt(value);
        return Math.round((_width - 10) * fullWidth / 30);
    }
}


//颜色值转换
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

// 生成指定位数的数字随机数
function genRandomNum(len) {
    var ranNum = [];
    for (var i = 0; i < len; i++) {
        ranNum.push(Math.floor(Math.random() * 10));
    }
    return ranNum.join("");
}

GameImgReady = (function() {
    var d = [],
        c = null,
        b = function() {
            var e = 0;
            for (; e < d.length; e++) {
                d[e].end ? d.splice(e--, 1) : d[e]()
            }!d.length && a()
        },
        a = function() {
            clearInterval(c);
            c = null
        };
    return function(f, k, m, j) {
        var l, g, n, i, e, h = new Image();
        h.src = f;
        if (h.complete) {
            k.call(h);
            m && m.call(h);
            return
        }
        g = h.width;
        n = h.height;
        h.onerror = function() {
            j && j.call(h);
            l.end = true;
            h = h.onload = h.onerror = null
        };
        l = function() {
            i = h.width;
            e = h.height;
            if (i !== g || e !== n || i * e > 1024) {
                k.call(h);
                l.end = true
            }
        };
        l();
        h.onload = function() {
            !l.end && l();
            m && m.call(h);
            h = h.onload = h.onerror = null
        };
        if (!l.end) {
            d.push(l);
            if (c === null) {
                c = setInterval(b, 40)
            }
        }
    }
})();
// 设置盒子
function addFieldCheckBorder(j) {
    var $box = $("#set_" + j + "_box");
    var configTabIndex = $box.closest(".config_view").index();
    $("#configTab>li").eq(configTabIndex).click();
    if ($box.closest("#adv_subtab_content").size() > 0) {
        var advSubTabIndex = $box.closest(".tab-pane").index();
        $("#adv_subtab>li").eq(advSubTabIndex).find(">a").click();
    }
    $box.addClass("checkBorder");
}

function getJqSrc(el, origin) {
    var uploadSrc = '';
    if (el.attr('src')) {
        uploadSrc = el.attr('src');
    } else if (el.val()) {
        uploadSrc = el.val();
    } else if (el.css('background-image')) {
        var backgroundImage = el.css('background-image');
        var match = backgroundImage.match(/url\("(.+)"\)/) || backgroundImage.match(/url\('(.+)'\)/) || backgroundImage.match(/url\((.+)\)/);
        if (match) {
            uploadSrc = match[1];
        }
    }
    if (origin) {
        return uploadSrc;
    } else {
        // 动态路径，支持换肤
        return uploadSrc.replace(_resRoot, "*_resRoot*").replace(_qiniuResRoot, "*_qiniuResRoot*");
    }
}

function setJqSrc(el, src) {
    el.each(function() {
        var nodeName = $(this)[0].nodeName;
        if (/img/i.test(nodeName)) {
            $(this).attr('src', src);
        } else if (/input/i.test(nodeName)) {
            $(this).val(src);
        } else {
            $(this).css('background-image', 'url("' + src + '")');
        }
    });
}

function getImgName(b) {
    var a = b.match(/\/([^\.\/]+?\.\w+)($|\?)/i);
    if (a === null) {
        return false
    }
    return a[1]
}

//点击删除操作
function removeItemByGame(d, f, g, h) {
    // d选中元素选中器
    $(this).remove(); // 删除操作
}

function showCssByGame(d, f) {
    if (d == "gameTopBar") {
        HdPortal.popupWindow({
            title: "样式设置",
            frameSrcUrl: "manage/gameTopBar.jsp?ram=" + Math.random(),
            width: 425,
            height: 125,
            frameWidth: "445px",
            frameHeight: "350px",
            frameOverFlow: true
        });
        return
    }
    if (d == "joinNum") {
        HdPortal.popupWindow({
            title: "样式设置",
            frameSrcUrl: "manage/joinNum.jsp?ram=" + Math.random() + "&isSelf=" + isSelAwardLine + "&id=" + g_id,
            width: 465,
            height: 240,
            frameWidth: "485px",
            frameHeight: "485px",
            frameOverFlow: true
        });
        return
    }
    var a = $("#uploadBg");
    var c = $("#uploadImgBox");
    var b = $("#uploadInfoBox");
    c.removeClass("uploadUp").addClass("uploadDown");
    a.fadeIn(200);
    $("#uploadImgBox .updTopBar .title span").text("样式设置");
    c.css("left", $(".editDetail").offset().left + 12);
    b.css("padding-top", "15px");
    b.css("margin-left", "2px");
    b.html("");
    var e = getPreviewWin().musicList;
    b.append('<div class="poupContent cssEditContent"></div>');
    $.each(f, function(n, h) {
        var p = $$(h.from);
        p.data("_cssEditArg", h);
        if (h.css) {
            var g = $('<div>\n<span class="title">' + h.title + "：</span>\n" + (typeof h.opt === "undefined" ? "" : ('<input id="cssDefault-' + n + '" class="cssDefault" type="radio" name="cssOpt-' + n + '" checked><label for="cssDefault-' + n + '">默认</label>\n<input id="cssSelf-' + n + '" class="cssSelf" type="radio" name="cssOpt-' + n + '" ><label for="cssSelf-' + n + '">自定义</label>')) + '<div class="setBox"></div></div>');
            var m = g.find(".setBox");
            for (var l = 0; l < h.css.length; l++) {
                m.append(getSetLine(h.css[l], p, n, l))
            }
            var k = g.find(".cssDefault");
            var o = g.find(".cssSelf");
            k.on("click", function() {
                m.find(".setLine").each(function(i, j) {
                    var r = $("el").find(".defSet");
                    if (r.length > 0) {
                        r.click()
                    } else {
                        var q = h.css[i];
                        setColor(p, q, true);
                        q.opt = 0
                    }
                });
                m.hide();
                h.opt = 0
            });
            o.on("click", function() {
                m.find(".setLine").each(function(j, q) {
                    var i = $("el").find(".selfSet");
                    if (i.length > 0) {
                        i.click()
                    } else {
                        var r = h.css[j];
                        setColor(p, r);
                        r.opt = 1
                    }
                });
                m.show();
                h.opt = 1
            });
            b.find(".cssEditContent").append(g);
            if (h.opt) {
                o.click().attr("checked", "checked")
            } else {
                k.click().attr("checked", "checked")
            }
            g = null
        } else {
            b.find(".cssEditContent").append(getSetLine(h, p, 0, n))
        }
    })
}

function parsePxToRem(px) {
    if (typeof px == 'number') {
        return (parseInt(px) / 20 <= 0 ? 2 : parseInt(px) / 20) + "rem";
    }
    return parseInt(px) / 20 + "rem";
}

function parseRemToPx(rem) {
    if (rem.indexOf('rem') === -1) {
        return parseFloat(rem);
    }
    return parseFloat(rem) * 40;
}

function recoveryImg(c, d) {
    setJqSrc($$(c), d);
}

//解析二维码自定义编辑页面的可编辑节点，返回{位置 大小 地址}对象
//{
//   pos:{ left: , top: }, 
//   size:{ width:  , height: },
//   path:src || {src1:src1 , src2:src2 , src3:src3 ...}
//}
//el          :可编辑节点id 
//pathTarget  :存储图片地址的节点id数组
//pathProperty：path对象的key数组,默认使用传入的储存节点id作为key
function parsedQrcodePageArg(el, pathTarget, pathProperty, origin) {
    var pos, size, path, parent, string;
    if (el) {
        if (typeof el === 'string') {
            string = el;
            el = $$('#' + el);
            el.length === 0 && (el = $$('.' + string));
            if (el.length === 0) {
                if (!((string === 'qrcode_edit_headimg' || string === 'qrcode_edit_codeimg') && false)) {
                    window.errorTarget = string;
                    alert("二维码自定义编辑页面编辑数据错误，请重新检查");
                }
                return false;
            }
        }
        parent = el.parents('.ui-wrapper');
        if (parent.length === 0) {
            parent = el;
        }
        pos = { left: parseFloat(parent.css('left')), top: parseFloat(parent.css('top')) };
        size = { width: parseFloat(parent.width()), height: parseFloat(parent.height()) };
        path = getJqSrc(el);
        if (path == "") {
            window.errorTarget = el.selector;
            return false;
        }
    }
    if (pathTarget) {
        path = {};
        var editTargetFlag = false;
        if (pathTarget[0].indexOf('editTarget') !== -1) {
            path = [];
            editTargetFlag = true;
        }
        if (!pathProperty) {
            pathProperty = pathTarget;
        }
        for (var i = 0, n = pathTarget.length; i < n; i++) {
            var imgCan = null;
            if (pathTarget[i] instanceof jQuery) {
                imgCan = pathTarget[i];
            } else {
                imgCan = $$('#' + pathTarget[i]);
                if (imgCan.length === 0) {
                    imgCan = $$('.' + pathTarget[i]);
                }
            }
            var imgSrc = imgCan.attr('src');
            if (getJqSrc(imgCan) == "") {
                return false;
            }
            if (editTargetFlag) {
                path[i] = getJqSrc(imgCan);
            } else {
                path[pathProperty[i]] = getJqSrc(imgCan);
            }
        }
    }
    if (!pos && !size && !path) {
        return false;
    }
    if (isNaN(pos.left)) {
        pos.left = 38;
    }
    if (isNaN(pos.top)) {
        pos.top = 190;
    }
    if (isNaN(size.width)) {
        size.width = 100;
    }
    if (isNaN(size.height)) {
        size.height = 100;
    }
    return { position: pos, size: size, path: path };
}


// 解析可编辑节点，返回{位置 大小 地址}对象
// {
//      pos:{ left: , top: }, 
//      size:{ width:  , height: },
//      path:src || {src1:src1 , src2:src2 , src3:src3 ...}
//  }
//  el          :可编辑节点id 
//  pathTarget  :存储图片地址的节点id数组
//  pathProperty：path对象的key数组,默认使用传入的储存节点id作为key
function parsedGameArg(el, pathTarget, pathProperty, origin) {
    var pos, size, path, parent, string;
    if (el) {
        if (typeof el === 'string') {
            string = el;
            el = $$('#' + el);
            el.length === 0 && (el = $$('.' + string));
            if (el.length === 0) {
                if (!((string === 'rule_tag_img' || string === 'startBtnImg' || string === 'titleImg' || string === 'organizer_logo' || string === 'openClick_pic') && false)) {
                    window.errorTarget = string;
                    alert("自定义编辑数据错误，请重新检查");
                }
                return false;
            }
        }
        parent = el.parents('.ui-wrapper');
        if (parent.length === 0) {
            parent = el;
        }
        pos = { left: parsePxToRem(parent.css('left')), top: parsePxToRem(parent.css('top')) };
        size = { width: parsePxToRem(parent.width()), height: parsePxToRem(parent.height()) };
        /**
        if(origin){
            if(origin.pos && HdPortal.getType(origin.pos) === 'array'){
                pos = [];
                parent.each(function(index,val) {
                    var self = $(this);
                    pos.splice(0,0,{ left : parsePxToRem(self.css('left')) , top : parsePxToRem(self.css('top')) });
                });
            }
            if(origin.size && HdPortal.getType(origin.size) === 'array'){
                size = [];
                parent.each(function(index,val) {
                    var self = $(this);
                    size.push({ width : parsePxToRem(self.width()) , height : parsePxToRem(self.height()) });
                });
            }
        }
        **/
        pos = $.toJSON(pos);
        size = $.toJSON(size);
        path = getJqSrc(el);
        if (path == "") {
            window.errorTarget = el.selector;
            return false;
        }
    }
    if (pathTarget) {
        path = {};
        var editTargetFlag = false;
        if (pathTarget[0].indexOf('editTarget') !== -1) {
            path = [];
            editTargetFlag = true;
        }
        if (!pathProperty) {
            pathProperty = pathTarget;
        }
        for (var i = 0, n = pathTarget.length; i < n; i++) {
            var imgCan = null;
            if (pathTarget[i] instanceof jQuery) {
                imgCan = pathTarget[i];
            } else {
                imgCan = $$('#' + pathTarget[i]);
                if (imgCan.length === 0) {
                    imgCan = $$('.' + pathTarget[i]);
                }
            }
            var imgSrc = imgCan.attr('src');
            if (getJqSrc(imgCan) == "") {
                return false;
            }
            if (editTargetFlag) {
                path[i] = getJqSrc(imgCan);
            } else {
                path[pathProperty[i]] = getJqSrc(imgCan);
            }
        }
        path = $.toJSON(path);
    }
    if (!pos && !size && !path) {
        return false;
    }
    return { pos: pos, size: size, path: path };
}

//返回文本节点的信息--广告文案）
function parsedTextArg() {
    var $parent = $$("#qrcode_edit_page");
    var _list = [];
    $parent.find(".j-text-poster").each(function() {
        var item = {};
        item.position = {}
        item.position.left = $(this).css("left").replace("px", "");
        item.position.top = $(this).css("top").replace("px", "");
        item.font = {}
        item.font.size = $(this).css("fontSize").replace("px", "");
        item.font.color = rgb2hex($(this).css("color")).replace("#", "");
        item.size = {}
        item.size.width = $(this).width();
        item.size.height = $(this).height();
        item.content = $(this).text() + "";
        _list.push(item);
    });
    // 返回
    return _list;
}

// 返回文本节点信息
function parsedTextNode(select) {
    var $that = $$("#" + select);
    var item = {};
    item.position = {}
    item.position.left = $that.css("left").replace("px", "");
    item.position.top = $that.css("top").replace("px", "");
    item.font = {}
    item.font.size = $that.css("fontSize").replace("px", "");
    item.font.color = rgb2hex($that.css("color")).replace("#", "");
    item.size = {}
    item.size.width = $that.width();
    item.size.height = $that.height();
    item.content = $that.text() + "";
    if ($that.css("display") != "none") {
        item.showState = "1";
    } else {
        item.showState = "0";
    }
    // 返回
    return item;
}
// 返回背景图片位置
function parsedBgImg(select, type) {
    var $that = $$("#" + select);
    var item = {};
    item.position = {};
    item.position.left = 0;
    item.position.top = 0;
    if (type && type == "1") {
        item.position.bottom = 0;
    }
    item.size = {};
    item.size.width = $that.width();
    item.size.height = $that.height();
    item.size.rawwidth = $that.attr("data-rawwidth");
    item.size.rawheight = $that.attr("data-rawheight");

    item.path = $that.attr("src");
    item.showState = true;
    if ($that.css("display") != "none") {
        item.showState = "1";
    } else {
        item.showState = "0";
    }
    // 返回
    return item;
}


//构建二维码分享页面 json
function genQrcodeEditPageJson() {
    var resultData = {};
    var pagePreviewWin = getPreviewWin();
    //开始按钮
    var _logoImg = parsedQrcodePageArg('qrcode_edit_headimg');
    var _codeImg = parsedQrcodePageArg('qrcode_edit_codeimg');
    var _bgImg = parsedBgImg("qrcode_edit_bgimg");
    var _representText = parsedTextNode("qrcode_edit_represent_text");
    var _titleText = parsedTextNode("qrcode_edit_title_text");
    var _posterList = parsedTextArg(); // 返回海报文案 

    if (_logoImg) {
        resultData.headerImg = _logoImg;
        resultData.headerImg.showState = "1";
        if ($$("#qrcode_edit_headimg").css("display") != "none") {
            resultData.headerImg.showState = "1";
        } else {
            resultData.headerImg.showState = "0";
        }
    } else {
        return false;
    }
    if (_codeImg) {
        resultData.codeImg = _codeImg;
    } else {
        return false;
    }
    if (_bgImg) {
        resultData.bgImg = _bgImg;
    } else {
        return false;
    }
    resultData.posterText = _posterList;
    resultData.representText = _representText;
    resultData.titleText = _titleText;
    return $.toJSON(resultData);
}


//构建gamePage json
function genGamePageJson() {
    var gamePage = {};
    //标题图片
    var titleImg = parsedGameArg('titleImg');
    if (titleImg) {
        gamePage.titleImg = titleImg;
    } else {
        return false;
    }
    //开始按钮
    var startBtn = parsedGameArg('startBtnImg');
    if (startBtn) {
        gamePage.startBtn = startBtn;
    } else {
        return false;
    }
    //活动说明按钮
    var ruleBtn = parsedGameArg('rule_tag_img');
    if (ruleBtn) {
        gamePage.ruleBtn = ruleBtn;
    } else {
        return false;
    }
    //企业LOGO
    if ($("input[name='hideOrganizerLogo']:checked").val() != 1) {
        var organizer_logo = parsedGameArg('organizer_logo');
        if (organizer_logo) {
            gamePage.organizerLogo = organizer_logo;
        } else {
            return false;
        }
    }
    // 加载页面开启可点击提示
    if ($("input[name='isOpenClick']:checked").val() != 0) {
        var openClick_pic = parsedGameArg('openClick_pic');
        if (openClick_pic) {
            gamePage.openClickPic = openClick_pic;
        } else {
            return false;
        }
    }

    //首页背景图片
    var homeBgPath = getJqSrc($$("#homeBg"));
    gamePage.hbp = homeBgPath;
    //游戏背景图片
    var gameBgPath = getJqSrc($$("#gameBg"));
    gamePage.gbp = gameBgPath;

    var editPageCount = getPreviewWin().editPageCount || 1;
    for (var EditPageCount_i = 0; EditPageCount_i < editPageCount; EditPageCount_i++) {

        var _idx = EditPageCount_i == 0 ? "" : EditPageCount_i;

        if (getPreviewWin()['Edit' + _idx] && getPreviewWin()['Edit' + _idx]['originDef']) {
            var origin = getPreviewWin()['Edit' + _idx]['originDef'];
            var editInfoList = [];
            for (var i = 0; i < origin.length; i++) {
                var tem = origin[i];
                var editName = 'editTarget-' + tem.name;
                var path = tem.path;
                var argList = false;
                var editInfo = {};
                editInfo.name = tem.name;
                if (tem.pos || tem.size || path) {
                    if (path && typeof path[0] !== 'string') {
                        argList = [];
                        for (var q = 0; q < path.length; q++) {
                            if (q === 0) {
                                argList.push(editName);
                            } else {
                                argList.push(editName + "-" + q);
                            }
                        }
                    }
                    var editInfoDef = parsedGameArg(editName, argList, false, tem);
                    if (!editInfoDef) {
                        return false;
                    }
                    tem.pos && (editInfo.pos = $.parseJSON(editInfoDef.pos));
                    tem.size && (editInfo.size = $.parseJSON(editInfoDef.size));
                    if (path) {
                        if (/^\[.+]$/.test(editInfoDef.path)) {
                            var pathList = $.parseJSON(editInfoDef.path);
                            for (var j = 0; j < pathList.length; j++) {
                                pathList[j] = [pathList[j]];
                            }
                            editInfo.path = pathList;
                        } else {
                            editInfo.path = [editInfoDef.path];
                        }
                    }
                }
                if (tem.css) {
                    function getCssArg(item, isDef) {
                        var obj = {};
                        obj.opt = item.opt;
                        if (isDef) {
                            obj.opt = 0;
                        }
                        if (!obj.opt) {
                            obj.val = item.defVal;
                        } else {
                            obj.val = item.val;
                        }
                        obj.defVal = item.defVal
                        if (typeof item.tra !== 'undefined') {
                            if (!obj.opt) {
                                obj.tra = item.defTra;
                            } else {
                                obj.tra = item.tra;
                            }
                            obj.defTra = item.defTra;
                        }
                        return obj;
                    }
                    editInfo.css = [];
                    $.each(tem.crrCssArg, function(i, item) {
                        if (item.css) {
                            var obj = {};
                            obj.css = [];
                            if (typeof item.opt !== 'undefined') {
                                obj.opt = item.opt;
                            }
                            $.each(item.css, function(i, cssItem) {
                                obj.css.push(getCssArg(cssItem, obj.opt === 0));
                            })
                            editInfo.css.push(obj);
                        } else {
                            editInfo.css.push(getCssArg(item));
                        }
                    });
                }
                editInfoList.push(editInfo);
            }
            gamePage['propList' + _idx] = $.toJSON(editInfoList);
        }

        // 游戏弹出层分享按钮
        gamePage.shareBtn = getJqSrc($$(".fire_btn.share"));
        // 游戏弹出层去抽奖按钮
        gamePage.awardBtn = getJqSrc($$(".link_lottery"));
        // 游戏弹出层挑战成功图片
        gamePage.fireResSuccess = getJqSrc($$(".fire_res_success"));
        // 游戏弹出层挑战失败图片
        gamePage.fireResFail = getJqSrc($$(".fire_res_fail"));
        // 游戏弹出层再玩一次按钮
        gamePage.replayBtn = getJqSrc($$(".playagain_link"));
        // 游戏弹出层关注我们按钮
        gamePage.subscribeBtn = getJqSrc($$(".subscribe_link"));
        // 游戏弹出层查看详情按钮
        gamePage.detailsBtn = getJqSrc($$(".fire_success_detail"));

        // 万圣节特殊处理
        if (templateId == 22) {
            // 查看奖品
            gamePage.check = getJqSrc($$("#checkPrizeBtn"));
            // 游戏背景
            gamePage.bg2 = getJqSrc($$("#gameBox"));
            // 发起者外框
            gamePage.chang = getJqSrc($$("#faqiBox"));
            // 整蛊好友按钮
            gamePage.button = getJqSrc($$("#fqb_zgBtn"));
            // 排行榜标题
            gamePage.friend = getJqSrc($$(".rb_head"));
            // 助力者外框
            gamePage.duan = getJqSrc($$("#zhuliBox"));
            // 我也要鬼混拿奖
            gamePage.button2 = getJqSrc($$("#zlb_wyyBtn"));
            // 领奖外框
            gamePage.chakan = getJqSrc($$("#prizeBox"));
            // 我的奖品
            gamePage.my = getJqSrc($$("#pb_myBtn"));
            // 整蛊外框
            gamePage.kuang = getJqSrc($$("#beizhengBox"));
            // 鬼混1
            gamePage.gui = getJqSrc($$("#bzb_gui1"));
            // 鬼混2
            gamePage.gui2 = getJqSrc($$("#bzb_gui2"));
            // 直接领奖按钮
            gamePage.lingj = getJqSrc($$("#xzb_fanhuiBtn"));
            // 继续整蛊按钮
            gamePage.zheng = getJqSrc($$("#xzb_jixuBtn"));
            // 稻草人
            gamePage.dcr = getJqSrc($$(".sb_dcr"));
            // 箭头
            gamePage.jiantou = getJqSrc($$(".sb_jiantou"));
            // 选择一下
            gamePage.xuanze = getJqSrc($$(".xzb_head"));
            // 温馨提示
            gamePage.wenxin = getJqSrc($$(".wxb_head"));
            // 返回按钮
            gamePage.back = getJqSrc($$("#wxb_fanhuiBtn"));
            // 继续按钮
            gamePage.jixu = getJqSrc($$("#wxb_jixuBtn"));
        }
        // 合伙抢货特殊处理
        if (templateId == 23) {
            // 游戏背景
            gamePage.bg = getJqSrc($$("#gameBox"));
            // 发起者外框
            gamePage.chang = getJqSrc($$(".chang"));
            // 整蛊好友按钮
            gamePage.button = getJqSrc($$("#fqb_zgBtn"));
            // 我也要鬼混拿奖
            gamePage.button2 = getJqSrc($$("#zlb_wyyBtn"));
            /* // 排行榜标题
            gamePage.friend = getJqSrc($$(".rb_head"));      
            // 直接领奖按钮
            gamePage.lingj = getJqSrc($$("#xzb_fanhuiBtn"));
            // 继续整蛊按钮
            gamePage.zheng = getJqSrc($$("#xzb_jixuBtn"));  
            // 返回按钮
            gamePage.back = getJqSrc($$("#wxb_fanhuiBtn"));
            // 继续按钮
            gamePage.jixu = getJqSrc($$("#wxb_jixuBtn"));
            // 分享背景
            gamePage.share = getJqSrc($$("#shareBox"));*/
            // 商品图片
            gamePage.pic = getJqSrc($$(".sp_img"));
        }
        // 新版的自燃红包
        if (templateId == 25) {
            gamePage.title = parsedGameArg("title");
        }
        if (templateId == 27) {
            gamePage.gameTitleImg = parsedGameArg('game-title-img');
        }
        // 咻一咻红包
        if (templateId == 28) {
            gamePage.gameTitleImg = parsedGameArg('game-title-img');
            gamePage.gameStartImg = parsedGameArg('game-start-img');
            gamePage.gameRuleImg = parsedGameArg('game-rule-img');
            gamePage.gameMyprizeImg = parsedGameArg('game-myprize-img');
        }
        // 狂欢大抽奖
        if (templateId == 30) {
            gamePage.gameTitleImg = parsedGameArg('game-title-img');
            gamePage.gameAdImg = parsedGameArg('game-ad-img');
        }
        // 口令红包
        if (templateId == 31) {
            gamePage.banner = getJqSrc($$("#banner_img"));
            gamePage.seller_logo = getJqSrc($$("#seller_logo"));
            gamePage.receiveBtn = parsedGameArg("receiveBtn");
            gamePage.commandLink = parsedGameArg("commandLink");
        }
        // 砸金蛋
        if (templateId == 37) {
            gamePage.bg2 = getJqSrc($$(".game_div"));
            gamePage.btn_2 = getJqSrc($$("#rule_btn"));
            gamePage.egg = getJqSrc($$(".egg"));
            gamePage.egg2 = getJqSrc($$(".egg2"));
            gamePage.image_5 = getJqSrc($$("#hammer"));
            gamePage.bg3 = getJqSrc($$(".win_div"));
            gamePage.bg4 = getJqSrc($$(".fail_div"));
            gamePage.icon_3 = getJqSrc($$(".again_btn"));
            gamePage.icon_1 = getJqSrc($$(".yqhy_btn"));
        }
        // 孵蛋
        if (templateId == 39) {
            gamePage.bg1 = getJqSrc($$("#backfill_panel"));
            gamePage.bg2 = getJqSrc($$("#panel_help"));
            gamePage.btn1 = getJqSrc($$("#invite"));
            gamePage.btn2 = getJqSrc($$("#i_want"));
        }
        // 新版摇一摇红包
        if (templateId == 40) {
            gamePage.manImg = getJqSrc($$(".manImg"));
            gamePage.panel = getJqSrc($$(".redEnvelope"));
        }

        // 获取子页面的可编辑移动的元素数据
        if (!!window.addGamePageDataFn && typeof window.addGamePageDataFn == "function") {
            window.addGamePageDataFn(gamePage);
        }

        // 上传音乐数据
        $(function() {

            for (var i = 0; i < $("#upload_music_modal").find(".control-group").length; i++) {
                // 路径
                gamePage["bgMusic" + i] = $("#upload_music_modal").find(".control-group").eq(i).find(".music_name").text().replace(_resRoot, "*_resRoot*").replace(_qiniuResRoot, "*_qiniuResRoot*");
                // 开关
                gamePage["bgMusicSwitch" + i] = $("#upload_music_modal").find(".control-group").find("input[name='bgMusicSwitch" + i + "']:checked").val();
            }


        });

    }

    // TODO
    var style = 1;
    if (style == 13) {
        //游戏图片
        var gameImg = parsedGameArg(false, ['belleImg', 'shemaleImg', 'gameLeftBtn', 'gameRightBtn']);
        if (!gameImg) {
            return;
        }
        gamePage.ph_gimgs = gameImg.path;
    }

    return $.toJSON(gamePage);

}

function addEditBtn(c, e) {
    var b = $$(".start_page,.game_page");
    var a = false;
    if (arguments.length === 3) {
        if (typeof arguments[1] === "function") {
            e = arguments[1];
            a = arguments[2]
        } else {
            b = arguments[1];
            e = arguments[2]
        }
    }
    if (arguments.length === 4) {
        b = arguments[1];
        e = arguments[2];
        a = arguments[3]
    }
    if (typeof b === "string") {
        b = $$(b)
    }
    if (b.length <= 0) {
        return
    }
    var d = $("<div class='moduleLayer'><div class='item'><a class='item tool' hidefocus='true' href='javascript:;'>" + c + "</a></div></div>");
    if (a) {
        $("#moduleLayerBox").prepend(d)
    } else {
        $("#moduleLayerBox").append(d)
    }
    d.hide().find(".tool").on("click", e);
    b.on("mouseover", function() {
        d.show()
    });
    c = b = e = null
}

// 将微信分享内容中的标签转换为后端规定的标示符
function getFinallyShareTxt(shareContent, shareTxtType) {
    var shareInputVal = $("input[name='useShareTxt']:checked").val();
    /**
    if (shareInputVal == 1) {	// 默认
    	if (shareTxtType == "noAwardText") {
    		return '${nickName}在活动中即将问鼎大奖，你敢挑战Ta吗？丰厚奖品等着你哦！';
    	} else {
    		return '${nickName}已经在活动中赢得了奖品，你也快来玩游戏赢大奖吧！';
    	}
    } else if (shareInputVal == 2) {	// 自定义
    }
    **/
    if (shareTxtType == "noAwardText") {
        return shareContent.replace(/玩家名称/g, "${nickName}").replace(/游戏成绩/g, "${score}").replace(/游戏排名/g, "${rank}");
    } else {
        return shareContent.replace(/玩家名称/g, "${nickName}").replace(/游戏成绩/g, "${score}").replace(/游戏排名/g, "${rank}").replace(/奖项等级/g, "${awardName}").replace(/奖品名称/g, "${trophyName}"); //trophyName:奖品名称
    }
}

$(function() {

    // 图片恢复
    $("#upload_img_modal .cover-recovery").live("click", function() {

        var $imgArea = $(this).closest(".img-area");
        var from = $imgArea.data("from");
        var defsrc = $imgArea.data("defsrc");

        // 恢复图片
        $imgArea.find(".thumb_img").attr("src", defsrc);
        recoveryImg(from, defsrc);

        $(this).hide();
    });

    // 上传音乐
    $(function() {

        $("#disclaimer_btn").on("click", function() {
            // 上传音乐
            $("#upload_music_modal").modal("hide");
            // 显示免责声明
            $("#disclaimer_modal").modal("show");
        })

        // 勾选免责声明
        $("#read_over").on("change", function() {

            if ($(this).is(":checked")) {
                $("#music_agree_btn").removeAttr("disabled");
            } else {
                $("#music_agree_btn").attr("disabled", "disabled");
            }
        });

        // 确认免责声明
        $("#music_agree_btn").on("click", function() {
            if ($(this).attr("disabled")) {
                return;
            }

            // 设置cookie
            document.cookie = "disclaimer_music=true;expires=" + new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000));
            // 隐藏免责声明
            $("#disclaimer_modal").modal("hide");
            // 上传音乐
            $("#upload_music_modal").modal("show");
        });

        // 音乐自定义单选按钮
        $("#upload_music_modal").find(".music_switch").on("change", function() {
            if ($(this).val() == 0) {
                $(this).parents(".control-group").find(".music_area").show();
            } else if ($(this).val() == 1) {
                $(this).parents(".control-group").find(".music_area").hide();
            }
        })

        // 音乐恢复
        $("#upload_music_modal .music_cover-recovery").live("click", function() {

            var $imgArea = $(this).parents(".music_area");
            var from = $imgArea.data("from");
            var defsrc = $imgArea.data("defsrc");
            $imgArea.find(".upload_music_1_1").val("");
            // 恢复音乐
            $imgArea.find(".music_name").text(defsrc);

            $(this).hide();
        });

    });


    /* 游戏背景编辑框特殊处理*/
    var homeBgmoduleLayer = $('#moduleLayerBox');
    var homeBgmoduleTimer = null;

    homeBgmoduleLayer.mouseenter(function() {
        clearTimeout(homeBgmoduleTimer);
    }).mouseleave(function() {
        homeBgmoduleTimer = setTimeout(function() {
            $('#moduleLayerBox .moduleLayer').hide();
            //homeBgmoduleLayer.hide();
            getPreviewWin().removeBgFrame();
        }, 10);
    });

    $('#gameContent').mouseenter(function(event) {
        clearTimeout(homeBgmoduleTimer);
    }).mouseleave(function(event) {
        if (getPreviewWin().ResizeDoc) {
            getPreviewWin().ResizeDoc.find(".ui-wrapper").trigger("mouseup").trigger("mouseleave");
        }
        homeBgmoduleTimer = setTimeout(function() {
            $('#moduleLayerBox .moduleLayer').hide();
            getPreviewWin().removeBgFrame && getPreviewWin().removeBgFrame();
        }, 10);
    });

    // 基础设置配置面板
    var form_activity_config_validator = $("#form_activity_config").validate({
        onfocusout: false,
        rules: {
            title: { required: true, maxlength: 16 },
            collect: { required: true, minlength: 3, maxlength: 8, collectWord: true },
            slogan: { required: true, maxlength: 50 },
            ruleTips: { required: true, maxlength: 500 }, //活动规则
            startDate: { required: true },
            endDate: { required: true, afterDate: true },
            participantVirtualAddCount: { required: true, digits: true, min: 0 },
            bless: { required: true, maxlength: 30 },
            seller_name: { required: true, maxlength: 10 },
            commandWord: { required: true, minlength: 5, maxlength: 30 },
            startTime: { required: true }, // TODO
            endTime: { required: true, afterTime: true }
        },
        messages: {
            title: { required: "不能为空", maxlength: "不能超过16个字符" },
            collect: { required: "不能为空", minlength: "不能小于3个字符", maxlength: "不能超过8个字符", collectWord: "不能输入特殊符号" },
            slogan: { required: "不能为空", maxlength: "不能超过50个字符" },
            ruleTips: { required: "不能为空", maxlength: "不能超过500个字符" },
            startDate: { required: "不能为空" },
            endDate: { required: "不能为空", afterDate: "结束时间必须大于开始时间" },
            participantVirtualAddCount: { required: "不能为空", digits: "必需为数值", min: "最小值为0" },
            bless: { required: "不能为空", maxlength: "不能超过30个字符" },
            commandWord: { required: "不能为空", minlength: "不能小于5个字符", maxlength: "不能超过30个字符" },
            seller_name: { required: "不能为空", maxlength: "不能超过10个字符" },
            startTime: { required: "不能为空" }, // TODO
            endTime: { required: "不能为空", afterTime: "结束时间必须大于开始时间" }
        },
        showErrors: function(errorMap, errorList) {
            if (errorList && errorList.length > 0) {
                $.each(errorList,
                    function(index, obj) {
                        var item = $(obj.element);
                        if (item.is(".cover")) {
                            alert(obj.message);
                        }
                        // 给输入框添加出错样式
                        item.closest(".control-group").addClass('error');
                        item.attr("title", obj.message);
                    });
            } else {
                var item = $(this.currentElements);
                item.closest(".control-group").removeClass('error');
                item.removeAttr("title");
            }
        },
        submitHandler: function() {
            //校验关注链接的公众号
            /*
			$.post('/account/postuser',{postUserUrl:$('#attentUrl').val()},function(data){
				if (data.ret == 0) {
					if(data.model.same){	
		    			changeView(2);				
					}else{
		            	alert('您填写的关注图文跟您在安全设置的微信公众号不一致，为了您的权益和数据安全，请填写与安全设置一致的公众号图文链接。');						
					}
	            } else {
	            	alert('您填写的关注图文跟您在安全设置的微信公众号不一致，为了您的权益和数据安全，请填写与安全设置一致的公众号图文链接。');	
	            }
			},'json');
			*/
            //changeView(2);
            return false;
        }
    });


    var getTimeMin = 10;
    var getTimeMax = 1000;
    var totalLotteryCountMax = 100;
    if (_isNewYyhb) {
        getTimeMin = 3;
        getTimeMax = 60;
        totalLotteryCountMax = 10;
    }
    if (_isYyttl) {
        getTimeMin = 3;
    }

    // TODO: 继续补强校验，地区的判断，参与次数的前后判断-派奖设置
    var form_play_help_validator = $("#form_play_help").validate({
        onfocusout: false,
        rules: {
            initCount: { required: true, digits: true, min: 1, max: 100 },
            dayIncrCount: { required: true, digits: true, min: 0, max: 100 },
            dayCount: { required: true, digits: true, min: 1, max: 100 },
            playCount: { required: true, digits: true, min: 1, max: 100 },
            lotteryAddCount: { required: true, digits: true, min: 1, max: 10 },
            unlockPrizeCount: { required: true, digits: true, min: 1, max: 10 },
            awardCycleTime: { required: true, digits: true, min: 5, max: 1200 },
            helpCount: { required: true, digits: true, min: 3, max: 30 },
            gamePointAddPercent: { required: true, number: true, min: 1, max: 100 },
            totalLotteryCount: { required: true, digits: true, min: 1, max: totalLotteryCountMax },
            dayLotteryCount: { required: true, digits: true, min: 1, max: 100, dayLotteryCount: true },
            passCondition: { required: true, number: true, min: 1, max: 1000000 },
            singleUserAwards: { required: true, digits: true, min: 1, max: 1000000 },
            globalAwardVirtualNum: { required: true, digits: true, min: 0, max: 1000000 },
            globalProbability: { required: true, number: true, min: 0, max: 100 },
            initialProbability: { required: true, number: true, min: 0, max: 100 }, // 初始中奖率
            helpProbability: { required: true, number: true, min: 0, max: 100 }, //助力中奖率
            helpNum: { required: true, number: true, min: 0, max: 100 }, //助力人数
            elongationMin: { required: true, digits: true, min: 1, max: 300, bargainTotalLength: true },
            elongationMax: { required: true, digits: true, elongationMax: true, min: 1, max: 300, bargainTotalLength: true },
            shortenMin: { required: true, digits: true, min: 0, max: 300, bargainTotalLength: true },
            shortenMax: { required: true, digits: true, shortenMax: true, min: 0, max: 300, bargainTotalLength: true },
            // 全景红包特殊处理
            awardCycleTime2: { required: true, digits: true, min: 5, max: 1200 },
            unlockPrizeCount2: { required: true, digits: true, min: 1, max: 10 }
        },
        messages: {
            initCount: { required: "不能为空", digits: "必须是数字", min: "最小为1", max: "最大值为100" },
            dayIncrCount: { required: "不能为空", digits: "必须是数字", min: "最小为0", max: "最大值为100" },
            dayCount: { required: "不能为空", digits: "必须是数字", min: "最小为1", max: "最大值为100" },
            helpCount: { required: "不能为空", digits: "必须是数字", min: "最小为3", max: "最大值为30" },
            playCount: { required: "不能为空", digits: "必须是数字", min: "最小为1", max: "最大值为100" },
            lotteryAddCount: { required: "不能为空", digits: "必须是数字", min: "最小为1", max: "最大值为10" },
            unlockPrizeCount: { required: "不能为空", digits: "必须是数字", min: "最小为1", max: "最大值为10" },
            awardCycleTime: { required: "不能为空", digits: "必须是数字", min: "最小为5", max: "最大值为1200" },
            gamePointAddPercent: { required: "不能为空", number: "必须是数字", min: "最小为1", max: "最大值为100" },
            totalLotteryCount: { required: "不能为空", digits: "必须是数字", min: "最小为1", max: "最大值为100" },
            dayLotteryCount: { required: "不能为空", digits: "必须是数字", min: "最小为1", max: "最大值为100" },
            passCondition: { required: "不能为空", number: "必须是数字", min: "最小为1", max: "最大值为1000000" },
            singleUserAwards: { required: "不能为空", digits: "必须是数字", min: "最小为1", max: "最大值为1000000" },
            globalAwardVirtualNum: { required: "不能为空", digits: "必须是数字", min: "最小为0", max: "最大值为1000000" },
            globalProbability: { required: "不能为空", number: "必需为数值", min: "数值至少为0", max: "数值最大为100" },
            initialProbability: { required: "不能为空", number: "必需为数值", min: "数值至少为0", max: "数值最大为100" },
            helpProbability: { required: "不能为空", number: "必需为数值", min: "数值至少为0", max: "数值最大为100" },
            helpNum: { required: "不能为空", number: "必需为数值", min: "数值至少为0", max: "数值最大为100" },
            elongationMin: { required: "不能为空", digits: "必需为数值", min: "数值至少为1", max: "数值最大为300" },
            elongationMax: { required: "不能为空", digits: "必需为数值", min: "数值至少为1", max: "数值最大为300" },
            shortenMin: { required: "不能为空", digits: "必需为数值", min: "数值至少为0", max: "数值最大为300" },
            shortenMax: { required: "不能为空", digits: "必需为数值", min: "数值至少为0", max: "数值最大为300" },
            // 全景红包特殊处理
            awardCycleTime2: { required: "不能为空", digits: "必须是数字", min: "最小为5", max: "最大值为1200" },
            unlockPrizeCount2: { required: "不能为空", digits: "必须是数字", min: "最小为1", max: "最大值为10" }
        },
        showErrors: function(errorMap, errorList) {
            if (errorList && errorList.length > 0) {
                $.each(errorList,
                    function(index, obj) {
                        var item = $(obj.element);
                        if (item.is(".cover")) {
                            alert(obj.message);
                        }
                        // 给输入框添加出错样式
                        item.closest(".control-group").addClass('error');
                        item.attr("title", obj.message);
                    });
            } else {
                var item = $(this.currentElements);
                item.closest(".control-group").removeClass('error');
                item.removeAttr("title");
            }
        },
        submitHandler: function() {
            return false;
        }
    });


    // 高级设置判断
    var high_setting_validator = $("#form_high_setting").validate({
        onfocusout: false,
        rules: {
            wxname: { required: true, maxlength: 30 },
            wxlink: { required: true, maxlength: 500 },
            organizerLink: { maxlength: 500 },
            openingLink: { maxlength: 500 },
            organizer: { maxlength: 16 },
            organizerLogo: { required: true },
            openClickPic: { required: true },
            gameTime: { required: true, digits: true, min: getTimeMin, max: getTimeMax },
            shareQrcodeBg: { required: true },
            shareIco: { required: true },
            checkShareTxt: { shareTxt: true },
            customCopyrightPic: { required: true },
            newPzhb1: { required: true, minlength: 4, maxlength: 8, hanziLimit: true },
            newPzhb2: { pzLengthLimit: true, hanziLimit: true },
            newPzhb3: { pzLengthLimit: true, hanziLimit: true }

        },
        messages: {
            wxname: { required: "不能为空", maxlength: "长度不能大于30" },
            wxlink: { required: "不能为空", maxlength: "长度不能大于500" },
            organizerLink: { maxlength: "长度不能大于500" },
            openingLink: { maxlength: "长度不能大于500" },
            organizer: { maxlength: "长度不能大于16" },
            organizerLogo: { required: "企业logo不能为空" },
            openClickPic: { required: "加载页面开启可点击提示图片不能为空" },
            gameTime: { required: "不能为空", digits: "必须是数字", min: "最小为" + getTimeMin, max: "最大值为" + getTimeMax },
            shareQrcodeBg: { required: "不能为空" },
            shareIco: { required: "不能为空" },
            checkShareTxt: { shareTxt: "自定义微信分享内容错误" },
            customCopyrightPic: { required: "不能为空" },
            newPzhb1: { required: "不能为空", minlength: "最少四个字", maxlength: "不能超过八个字", hanziLimit: "请输入汉字" },
            newPzhb2: { pzLengthLimit: "每句由4-8个汉字组成", hanziLimit: "请输入汉字" },
            newPzhb3: { pzLengthLimit: "每句由4-8个汉字组成", hanziLimit: "请输入汉字" }
        },
        showErrors: function(errorMap, errorList) {
            if (errorList && errorList.length > 0) {
                $.each(errorList,
                    function(index, obj) {
                        var item = $(obj.element);
                        if (item.is(".cover")) {
                            alert(obj.message);
                        }
                        // 给输入框添加出错样式
                        item.closest(".control-group").addClass('error');
                        item.attr("title", obj.message);
                    });
            } else {
                var item = $(this.currentElements);
                item.closest(".control-group").removeClass('error');
                item.removeAttr("title");
            }
        },
        submitHandler: function() {
            return false;
        }
    });

    var showQrcode = function(activityId) {
        $.ajax({
            url: '/admin/new_activity/getActivityLink',
            timeout: 15000,
            dataType: "json",
            data: {
                activityId: activityId
            },
            success: function(data) {
                if (data.ret == 0) {
                    var model = data.model;
                    $("input[name='act_link']").val(model.act_link);
                    $("#qrcode").attr("src", model.qrcode_url);
                    $("#qrcode_url").attr("href", model.qrcode_url);
                }
            }
        });
    };

    $(".checkBorder").live("mouseover", function() {
        var $box = $(this);
        setTimeout(function() {
            $box.removeClass("checkBorder");
        }, 10);
    });

    // 校验中秋集字不能包含特殊字符
    $.validator.addMethod("collectWord", function(value) {
        // 特殊符号
        var regEx = /^(([^\^\.<>%&',;=?$"':#@!~\]\[{}\\/`\|])*)$/;
        // 半角符号
        var regExBanjiao = /[\uff00-\uffff]/g;
        var result = regEx.test(value) && !regExBanjiao.test(value);
        return result;
    }, "不能包含特殊字符");

    // 这个有用
    $.validator.addMethod("afterDate", function(value) {
        var $startDate = $("input[name='startDate']");
        var $endDate = $("input[name='endDate']");
        $startDate.datetimepicker('setDate', $startDate.val());
        $endDate.datetimepicker('setDate', $endDate.val());
        return $endDate.datetimepicker('getDate') > $startDate.datetimepicker('getDate');
    }, '结束时间必须大于开始时间');

    $.validator.addMethod("dayLotteryCount", function(value) {
        var $totalLotteryCount = $("input[name='totalLotteryCount']");
        if ($totalLotteryCount.attr("disabled")) {
            return true;
        } else {
            var dayLotteryCount = Number(value);
            var totalLotteryCount = Number($totalLotteryCount.val());
            return totalLotteryCount >= dayLotteryCount;
        }
    }, '总抽奖机会必须大于或者等于每日抽奖机会');

    /** 新版砍价特殊配置 start **/
    $.validator.addMethod("elongationMax", function(value, element, params) {
        var singleMax = Number(value);
        var singleMin = Number($(element).parent().find("input[name='elongationMin']").val());
        return singleMax > singleMin;
    }, '单次拿奖伸长距离范围最大值取值必需大于最小值');
    $.validator.addMethod("shortenMax", function(value, element, params) {
        var singleMax = Number(value);
        var singleMin = Number($(element).parent().find("input[name='shortenMin']").val());
        return singleMax >= singleMin;
    }, '单次拿奖缩短距离范围最大值取值必需大于等于最小值');
    $.validator.addMethod("bargainTotalLength", function(value, element, params) {
        var length = Number(value);
        var totalLength = $("input[name='totalLength']").val();
        return totalLength > length;
    }, '单次拿奖伸长/缩短的距离不能大于总距离');

    /** 新版砍价特殊配置 end **/

    /** 新版拼字特殊配置 start **/
    $.validator.addMethod("hanziLimit",
        function(g) {
            if (g.length == 0) {
                return true
            }
            var e = /^[0-9\u4e00-\u9faf]+$/;
            var f = e.test(g);
            if (f) {
                return true
            } else {
                return false
            }
        },
        "请输入汉字");
    $.validator.addMethod("pzLengthLimit", function(value) {
        var length = value.length;
        if (length == 0 || (length >= 4 && length <= 8)) {
            return true;
        }
        return false;
    }, '每句由4-8个汉字组成');

    /** 新版拼字特殊配置 end **/

    /** 众筹起床特殊配置 start **/ // TODO
    $.validator.addMethod("afterTime", function(value) {
        var $startDate = $("input[name='startTime']");
        var $endDate = $("input[name='endTime']");
        return diffTime($startDate.val(), $endDate.val());
    }, '结束时间必须大于开始时间,打卡时间段仅支持15分钟内');

    function diffTime(start, end) {
        var s = start.split(":"),
            e = end.split(":"),
            date = new Date(),
            y = date.getFullYear(),
            m = date.getMonth(),
            d = date.getDate();
        var start = new Date(y, m, d, s[0], s[1]).getTime();
        var end = new Date(y, m, d, e[0], e[1]).getTime();
        var cha = Math.ceil((end - start) / 1000 / 60); // 差值
        if (cha < 5 || cha > 15) {
            return false;
        } else {
            return true;
        }
    }
    /** 众筹起床特殊配置 end **/

    // 校验分享内容
    $.validator.addMethod("shareTxt", function(value, element, params) {
        return $(element).val() == 1;
    }, "微信分享内容错误");

    $.validator.addMethod("addressLimit", function(value) {
        if ($("#needLimitAddress").is(":checked")) {
            if ($("#addr_prov").val() == '') {
                return false;
            }
        }
        return true;
    }, '请选择省份');

    // 是否开启地区限制
    $("#needLimitAddress").on("click", function() {
        if ($("#needLimitAddress").is(":checked")) {
            $("#addressGroup").show();
        } else {
            $("#addressGroup").hide();
        }
    });

    // 切换中奖概率模式
    $("input[name='showDanmu']").on("change", function() {
        if ($("input[name='showDanmu']:checked").val() == 1) {
            getPreviewWin().game.clearDanmu();
        } else {
            getPreviewWin().game.showDanmu(true);
        }
    });

    // 是否开始助力
    $("#withHelp").on("click", function() {
        if ($("#withHelp").is(":checked")) {
            $("#gamePointAddPercent").removeAttr("disabled");
            $(".helpType_1_cont, .helpType_2_cont").find("input").removeAttr("disabled");
        } else {
            $("#gamePointAddPercent").attr("disabled", "disabled");
            $(".helpType_1_cont, .helpType_2_cont").find("input").attr("disabled", "disabled");
        }

    });
    // 助力类型判断
    /*$("input[name='helpType']").on("click", function(){
    	var id_attr = $(this).attr("id");
    	if (id_attr == "helpTypeCount") {
    		$(".helpCount_content").show();
    		$(".helpScoreCount_content").hide();
    	} else if (id_attr == "helpTypeScore") {
    		$(".helpCount_content").hide();
    		$(".helpScoreCount_content").show();
    	}
    });*/
    // 中奖概率
    $(".award_tab_content").on("click", ".probabilityType", function() {
        var $this_tab = $(this).closest(".award_tab");
        if ($(this).data("value") == 1) {
            // 判断是否是value=1
            //$this_tab.find("input[name='probabilityValue']").attr("disabled", true);
        } else {
            // 判断是否是value=2
            //$this_tab.find("input[name='probabilityValue']").attr("disabled", false);
        }
    });

    // 切换中奖概率模式
    $("input[name='probabilityMode']").on("change", function() {
        if ($("input[name='probabilityMode']:checked").val() == 1) {
            $("input[name='globalProbability']").removeAttr("disabled");
            $(".probabilityMode-help-inline").show();
            $("#set_probabilityType_box").show();
            $(".award_tab input[name='probabilityValue']").attr("disabled", "disabled").closest(".control-group").hide();
        } else {
            $("input[name='globalProbability']").attr("disabled", "disabled");
            $(".probabilityMode-help-inline").hide();
            $("#set_probabilityType_box").hide();
            $(".award_tab input[name='probabilityValue']").removeAttr("disabled").closest(".control-group").show();
        }
    });

    // 内定中奖人数量
    $(".award_tab_content").on("input", "input[name='defaultWinnerAmount']", function() {
        var $input = $(this);
        var $controls = $input.closest(".controls");
        if (isNaN($input.val())) {
            return;
        }
        var awardRealNum = Number($input.closest(".award_detail_form").find("input[name='awardRealNum']").val());
        var defaultWinnerAmount = Number($input.val());
        if ((awardRealNum - defaultWinnerAmount) < 0) {
            $controls.find(".defaultWinnerAmount-tips-error").show();
            $controls.find(".defaultWinnerAmount-tips").hide();
        } else {
            $controls.find(".defaultWinnerAmount-tips-error").hide();
            $controls.find(".defaultWinnerAmount-tips").show();
        }
        $controls.find(".c1").text(defaultWinnerAmount);
        $controls.find(".c2").text(awardRealNum - defaultWinnerAmount);
    });

    // 追加实物奖品数量
    $("#add_sncode_award_modal").on("input", "input[name='award_unsend_num']", function() {
        var $input = $(this);
        var $controls = $input.closest(".controls");
        if (isNaN($input.val())) {
            return;
        }
        var awardRealNum = Number($input.closest(".award_detail_form").find("input[name='awardRealNum']").val());
        var defaultWinnerAmount = Number($input.val());
    });

    // 切换内定中奖人
    $(".config-tab-content").on("change", "input[name='defaultWinner']", function() {
        var $cont = $(this).closest(".award_detail_form").find(".set_defaultWinnerAmount_box");
        var awardId = $cont.closest(".award_detail_form").data("awardid");
        var $qrcodeImg = $cont.find("img.qrcode_img");
        if ($(this).val() == 1) {
            $cont.hide().find("input").attr("disabled", "disabled");
        } else {
            $cont.show();
            if (!_hasPublish) {
                $cont.find("input").removeAttr("disabled");
            }
            if ($cont.find(".verifycode").text() == "") {
                $cont.find(".verifycode").text(genRandomNum(6))
            }
            $cont.find("input[name='defaultWinnerAmount']").trigger("input");
            if (!$qrcodeImg.attr("src")) {
                var verifyUrl = window.www_domain + "/mobile/newgame/default_winner.jsp";
                if (isEdit) {
                    verifyUrl += "?activityid=" + window.activityJson.id;
                    verifyUrl += "&aid=" + window.activityJson.aidEncrypt;
                    verifyUrl += "&wuid=" + window.activityJson.wuid;
                    verifyUrl += "&awardId=" + awardId;
                }
                $.ajax({
                    url: '/admin/new_activity/generate_qrcode',
                    timeout: 15000,
                    dataType: "json",
                    data: {
                        "theUrl": encodeURI(verifyUrl)
                    },
                    success: function(data) {
                        if (data.ret == 0) {
                            $qrcodeImg.attr("src", data.model.qrcodeUrl);
                            $cont.find(".qrcode_down_link").attr("href", data.model.qrcodeUrl);
                        }
                    }
                });
            }
        }
    });


    // 内定中奖人修改数量按钮事件
    $(".add_defaultwinner_award").live("click", function() {
        var awardId = $(this).attr("data-awardid");
        var trophyId = $(this).attr("data-trophyid");
        var $cont = $(this).parent();
        var $form = $(this).closest(".award_detail_form");
        var $addSncodeModal = $("#add_defaultwinner_award_modal");
        $addSncodeModal.modal("show");
        $addSncodeModal.attr("data-awardid", awardId).attr("data-trophyid", trophyId);
        $("input[name='defaultwinner_send_num']", $addSncodeModal).val($cont.find("input[name='defaultWinnerLoseNum']").val());
        $("input[name='defaultwinner_available_num']", $addSncodeModal).val($form.find("input[name='awardRealNum']").val());
        $("input[name='defaultwinner_left_num']", $addSncodeModal).val($cont.find("input[name='defaultWinnerAmount']").val());
        $("input[name='defaultwinner_left_num']", $addSncodeModal).parent().find(".c1").text($form.find("input[name='awardRealNum']").val());

    });

    // 修改内定实物奖品设置判断
    var add_defaultwinner_award_validator = $("#form_add_defaultwinner_award_setting").validate({
        onfocusout: false,
        rules: {
            defaultwinner_left_num: { required: true, number: true, min: 0, defaultWinnerLeftNum: true },
        },
        messages: {
            defaultwinner_left_num: { required: "不能为空", number: "必需为数值", min: "数值至少为0", defaultWinnerLeftNum: "待领取数量不能大于可内定数量" },
        },
        showErrors: function(errorMap, errorList) {
            if (errorList && errorList.length > 0) {
                $.each(errorList,
                    function(index, obj) {
                        var item = $(obj.element);
                        if (item.is(".cover")) {
                            alert(obj.message);
                        }
                        // 给输入框添加出错样式
                        item.closest(".control-group").addClass('error');
                        item.attr("title", obj.message);
                    });
            } else {
                var item = $(this.currentElements);
                item.closest(".control-group").removeClass('error');
                item.removeAttr("title");
            }
        },
        submitHandler: function() {
            var $addSncodeModal = $("#add_defaultwinner_award_modal");
            var awardId = $addSncodeModal.attr("data-awardid");
            var trophyId = $addSncodeModal.attr("data-trophyid");
            var $btn = $("#add_defaultwinner_award_confirm");
            var $form = $("#form_add_defaultwinner_award_setting");
            if ($btn.hasClass("disabled")) return;
            var updateNum = parseInt($('input[name="defaultwinner_left_num"]', $form).val()) + parseInt($('input[name="defaultwinner_send_num"]', $form).val());
            var submitData = {
                "activityId": global_aid,
                "awardId": awardId,
                "trophyId": trophyId,
                "updateNum": updateNum
            }
            $btn.addClass("disabled");
            $.ajax({
                url: '/admin/new_activity/update_switch',
                timeout: 15000,
                type: "post",
                dataType: "json",
                data: submitData,
                success: function(data) {
                    if (data.ret == 0) {
                        var model = data.model;
                        unbindBeforeUnload();
                        alert("内定奖品数量修改成功");
                        window.location.reload();
                    } else {
                        alert(data.msg);
                    }
                    $btn.removeClass("disabled");
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("服务器正在紧张的运行中，请稍后再试");
                    $btn.removeClass("disabled");
                }
            });
        }
    });

    $(".get_default_winner_pwd").live("click", function() {
        if ($(this).attr("data-disabled")) return;
        var awardId = $(this).data("awardid");
        var trophyId = $(this).data("trophyid");
        var $modal = $("#defaultwinner_pwd_modal").attr("data-awardid", awardId).attr("data-trophyid", trophyId);
        $modal.modal("show").find("select[name='defaultwinner_pwd_statu']").trigger("change");
        $modal.find("#export_defaultwinner_pwd").attr("href", "/admin/new_activity/export_switchcode?activityId=" + global_aid + "&trophyId=" + trophyId + "&type=2");
    });

    // 加载更多恢复默认特殊处理
    $(document).on("click", ".huifuBtn", function() {
        var defaulurl = $(this).parents(".cover-area").find("input[name='fileupload']").attr("data-defaulturl");
        $(this).parents(".cover-area").find(".thumb_img").attr("src", defaulurl);
        $(this).parents(".cover-area").find(".fileupload_input").val(defaulurl);
        $(this).hide();
        var targetEle = $(this).parents(".cover-area").find(".fileupload_input").attr("data-target");
        console.log($(defaulurl))
        $$(targetEle).css("backgroundImage", "url(" + defaulurl + ")");
    })

    $("#defaultwinner_pwd_modal select[name='defaultwinner_pwd_statu']").on("change", function() {
        var $modal = $("#defaultwinner_pwd_modal");
        var awardId = $modal.attr("data-awardid");
        var trophyId = $modal.attr("data-trophyid");
        var awardStatu = $(this).val();
        var submitData = {
            "activityId": global_aid,
            "trophyId": trophyId,
            "type": awardStatu,
        };
        $(".mp_loading_cover").show();
        $(".mp_loading_clip").show();
        $.post('/admin/new_activity/query_switch_awardcode', submitData, function(data) {
            $(".mp_loading_cover").hide();
            $(".mp_loading_clip").hide();
            if (data.ret == 0) {
                var $cont = $("#defaultwinner_pwd_modal .defaultwinner_pwd_cont").html("");
                if (data.model.records) {
                    for (var i = 0; i < data.model.records.length; i++) {
                        $cont.append('<div class="control-group"><label class="control-label">内定密码' + i + '：</label><div class="controls">' + data.model.records[i] + '</div></div>');
                    }
                }
            } else {
                alert(data.msg);
            }
        });
    });

    // 中奖概率模式
    $("#set_probabilityMode_box label").on("click", function() {
        var $tipsInfo = $(this).find(".field_tips_info");
        if ($tipsInfo.is(":hidden")) {
            $tipsInfo.show();
            setTimeout(function() {
                $tipsInfo.hide();
            }, 3000);
        }
    });
    // 跳转到奖品设置页签
    $(".prize_config_tab_link").on("click", function() {
        $(".prize_config_tab").click();
    });

    // 选择关闭领奖验证码的提示
    $("input[name='trophyValidator']").on("click", function(e) {
        if ($(this).val() == 2) {
            $("#trophyValidator-alert-modal").modal("show");
            e.stopPropagation();
            return false;
        }
    });
    $("#trophyValidator-alert-modal .trophyValidator-alert-confirm").click(function() {
        if ($(this).hasClass("disabled")) return;
        $("#trophyValidator-alert-modal").modal("hide");
        $("input[name='trophyValidator'][value='2']").attr("checked", "checked").trigger("change", true);
    });
    $("#trophyValidator_alert_check").change(function() {
        if ($(this).is(":checked")) {
            $("#trophyValidator-alert-modal .trophyValidator-alert-confirm").removeClass("disabled");
        } else {
            $("#trophyValidator-alert-modal .trophyValidator-alert-confirm").addClass("disabled");
        }
    });


    // 选择关闭黑名单的提示
    $("input[name='blacklist']").on("click", function(e) {
        if ($(this).val() == 0) {
            $("#blacklist-alert-modal").modal("show");
            e.stopPropagation();
            return false;
        }
    });
    $("#blacklist-alert-modal .blacklist-alert-confirm").click(function() {
        if ($(this).hasClass("disabled")) return;
        $("#blacklist-alert-modal").modal("hide");
        $("input[name='blacklist'][value='0']").attr("checked", "checked").trigger("change", true);
    });
    $("#blacklist_alert_check").change(function() {
        if ($(this).is(":checked")) {
            $("#blacklist-alert-modal .blacklist-alert-confirm").removeClass("disabled");
        } else {
            $("#blacklist-alert-modal .blacklist-alert-confirm").addClass("disabled");
        }
    });


    // 跳转到中奖模式并高亮
    $(".config-tab-content").on("click", ".probabilityMode_highlight_link", function() {
        addFieldCheckBorder("probabilityMode");
    });

    // 提交按钮 start!
    $("#save_btn").on("click", function() {
        var $btn = $(this);
        if ($btn.hasClass("disabled")) return;
        var validFlag = true;
        $btn.addClass("disabled"); //防止重复点击

        // 口令红包的处理逻辑
        if (_isKlhb) {
            // 判断用户是否绑定公众号
            if (!_hasBindWx) {
                alert("温馨提示：创建口令红包的商家公众号必须是通过微信认证的公众号，否则活动将不能正常进行！");
                return false;
            }
            // 判断用户绑定的公众号是否是微信认证
            if (!_verifyAvailable) {
                alert("温馨提示：创建口令红包，认证公众号必须进行服务授权，否则将会导致活动无法正常进行！授权服务后即可创建活动。");
                return false;
            }
        }
        // config_view:是配置项的tab栏
        $(".config_view:visible form").each(function(index, item) {
            var $form = $(item);
            // 特殊处理，被隐藏的奖项表单不校验
            if ($form.is(".award_detail_form")) {
                var index = $(item).parent().index();
                if ($(".award_tab_item .prize_tab_item").eq(index).is(":hidden")) {
                    return true;
                }
            }
            if (!$form.validate().form()) {
                validFlag = false;
                return true;
            }
        });

        // 特殊处理，当增加奖品后直接保存需要校验一下派奖设置
        if ($("#award_convert_limit_form").length > 0) {
            var limit = $("#award_convert_limit").find(".convert_limit input").not(":disabled");
            var flag = true;
            var limitList = [];
            limit.each(function() {
                if (!$(this).val()) {
                    flag = false;
                } else {
                    limitList.push($(this).val());
                }
            });
            if (!flag) {
                alert('请先填写“得奖所需助力人数”！');
                $btn.removeClass("disabled");
                return false;
            }
            // 判断数组的排序
            if (limitList.length > 1) {
                for (var j = 0; j < limitList.length; j++) {

                    if (parseInt(limitList[j]) < parseInt(limitList[j + 1])) {
                        alert("奖项所需助力人数要按奖项一至奖项八从大到小排序！");
                        $btn.removeClass("disabled");
                        return false;
                    }
                }
            }

            if (limitList.length > 1) {
                limitList.sort();
                for (var i = 0; i < limitList.length; i++) {
                    if (limitList[i] === limitList[i + 1]) {
                        alert('各奖项的“得奖所需助力人数”不能相等！');
                        $btn.removeClass("disabled");
                        return false;
                    }
                }
            }

        }

        if (!validFlag) {
            alert("校验不通过：" + $(".error .control-label").text().replace("：", ""));
            $btn.removeClass("disabled");
            return false;
        }

        var $form_activity_config = $("#form_activity_config");
        var $form_play_help = $("#form_play_help");
        var $form_high_setting = $("#form_high_setting");
        var awardSendType = $form_play_help.find("input[name='awardSendType']:checked").val();

        var dayLotteryCount = $form_play_help.find("#dayLotteryCount").val();

        // 封装数据的数组
        var submitData = {
            // 活动配置
            "activity.activityType": 31502,
            "activity.skinId": window.skinId,
            "activity.end": $form_activity_config.find("#endDate").val(), //活动结束时间
            "activity.start": $form_activity_config.find("#startDate").val(), //活动开始时间
            "activity.ruleTips": $form_activity_config.find("#ruleTips").val(),
            "activity.title": $form_activity_config.find("#title").val(), //活动名称
            "activity.organizer": $form_high_setting.find("#organizer").val(), //主办单位
            "activity.awardSendType": awardSendType,
            "activity.organizerLink": $form_high_setting.find("#organizerLink").val(),
            "activity.showSupport": $form_high_setting.find("input[name='showCopyright']:checked").val() == 1,
            "activity.showCopyright": $form_high_setting.find("input[name='showCopyright']:checked").val() == 1,
            "activity.useDefaultCopyright": $form_high_setting.find("input[name='useDefaultCopyright']:checked").val() == 1,
            "activity.customCopyrightPic": $form_high_setting.find("#customCopyrightPic").val(),
            // 企业logo
            "activity.hideOrganizerLogo": $form_high_setting.find("input[name='hideOrganizerLogo']:checked").val() == 1,
            "activity.organizerLogo": $form_high_setting.find("#organizerLogo").val(),


            // 总开关-整型，转化为2进制去做判断，将所有开关的value相加
            "activity.extraData": Number($form_high_setting.find("input[name='shareType']:checked").val()) +
                Number($form_high_setting.find("input[name='blacklist']:checked").val()) +
                Number($form_high_setting.find("input[name='open_opening_link']:checked").val()) +
                Number($form_play_help.find("input[name='helpEffect']:checked").val()) +
                ($form_high_setting.find("input[name='exchangeLimitDetail'][value='4']").is(":checked") ? 4 : 0) +
                ($form_high_setting.find("input[name='exchangeLimitDetail'][value='2']").is(":checked") ? 2 : 0) +
                ($form_high_setting.find("input[name='exchangeLimitDetail'][value='6']").is(":checked") ? Math.pow(2, 14) : 0) +
                Number($("input[name=helpEffectMs]:checked").val()),

            // 分享二维码背景图
            "activity.shareQrcodeBg": $form_high_setting.find("#shareQrcodeBg").val(),
            "activity.useDefaultQrcodeBg": $form_high_setting.find("input[name='useDefaultQrcodeBg']:checked").val() == 1,

            // 游戏背景图
            "activity.bgPic": getJqSrc($$("#gameBg"), true),

            // 微信分享图标
            "imgTextShare.sttr1": $form_high_setting.find("input[name='useShareIco']:checked").val() == 1 ? 0 : 1,
            "imgTextShare.imgPath": $form_high_setting.find("#shareIco").val(),
            // 微信分享内容
            "imgTextShare.id": $form_high_setting.find("#adv_subtab_2").attr("shareId") || "",
            "imgTextShare.sttr2": $form_high_setting.find("input[name='useShareTxt']:checked").val() == 1 ? 0 : 1,
            "imgTextShare.noAwardText": getFinallyShareTxt($form_high_setting.find(".j-share-txt-content").eq(0).text(), "noAwardText"),
            "imgTextShare.awardText": getFinallyShareTxt($form_high_setting.find(".j-share-txt-content").eq(1).text(), "awardText"),

            "activity.globalProbability": $form_play_help.find("#globalProbability").val(),
            "activity.probabilityType": $form_play_help.find("#probabilityType").is(":checked") ? 1 : 2,
            "activity.hideParticipant": $form_activity_config.find("input[name='hideParticipant']:checked").val() == 1,
            "activity.participantVirtualAddCount": $form_activity_config.find("#participantVirtualAddCount").val(), //参加人数
            //"activity.bgPic": "/image/admin/newgame/demo_driver.jpg",
            "activity.wxname": $form_high_setting.find("#wxname").val(),
            "activity.wxlink": $form_high_setting.find("#wxlink").val(),
            "activity.trophyValidator": $form_high_setting.find("input[name='trophyValidator']:checked").val() == 1,
            "activity.unionId": global_uid,
            "activity.pageTemplateId": pageTemplateId,
            "activity.path": window.actGamePagePath,
            "activity.withHelp": $form_play_help.find("#withHelp").is(":checked") ? true : false, // 是否开启助力
            "activity.privilegeType": isTest ? 2 : 1, // 是否是试用的，2表示试用，1表示正常使用
            "activity.securityLevel": $form_high_setting.find("input[name='securityLevel']:checked").val(),

            // 参与-助力规则
            "playRule.dayCount": $form_play_help.find("#dayCount").val(),
            "playRule.dayIncrCount": $form_play_help.find("#dayIncrCount").val(),
            "playRule.initCount": $form_play_help.find("#initCount").val(),
            "playRule.playCount": $form_play_help.find("#playCount").val(),
            "playRule.totalLotteryCount": $form_play_help.find("#totalLotteryCount").val(), // 单人抽奖总数
            "playRule.limitLottery": $form_play_help.find("input[name='totalLotteryCountRadio']:checked").val() == 2,
            "playRule.dayLotteryCount": dayLotteryCount, //每人每日抽奖次数
            "playRule.gameTimeType": $form_high_setting.find("input[name='gameTimeRadio']:checked").val(),
            "playRule.gameTime": $form_high_setting.find("#gameTime").val(),

            "playRule.participateLimit": $form_high_setting.find("input[name='participateLimit']:checked").val() == 1,
            "playRule.needFollow": $form_high_setting.find("input[name='forceAttent']:checked").val() == 1,
            "playRule.exchangeLimit": $form_high_setting.find("input[name='exchangeLimit']:checked").val() == 1,
            "playRule.needArea": false, // 后续计算
            //"playRule.needMoreInfo": $("#needMoreInfo").is(":checked") ? true : false,
            //"playRule.virtualCount": $("#virtualCount").val(),

            // 1-增加抽奖次数;4-助力领奖;2-按排名
            "helpRule.helpType": $("#helpType").val(),
            "helpRule.maxCount": $("#maxCount").val(),
            "helpRule.minCount": $("#minCount").val(),
            "helpRule.percentage": $("#percentage").val(),
            "helpRule.helpCount": $("#helpCount").val(),
            "helpRule.exchangeCount": $("#exchangeCount").val(),
            "helpRule.lotteryAddCount": $("#lotteryAddCount").val(),
            "helpRule.gamepointAddPercent": $("#gamePointAddPercent").val(),
            _: new Date().getTime()
        };
        if (_isNewBargain) {
            submitData["activity.bgPic"] = getJqSrc($$("#bargainBannerBg"), true);
        }
        // 从红包专场创建的活动
        if (_isFromHb) {
            submitData["activity.extraData"] = submitData["activity.extraData"] + 512;
        }
        // 中奖概率模式
        if ($form_play_help.find("input[name='probabilityMode']:checked").val() == 2) {
            submitData["activity.extraData"] = submitData["activity.extraData"] + Math.pow(2, 10);
        }
        // 是否启用中奖链接轮播
        if ($form_activity_config.find("input[name='showDanmu']:checked").val() == 2) {
            submitData["activity.extraData"] = submitData["activity.extraData"] + Math.pow(2, 11);
        }
        // 安全验证方式（选择短信验证时开启）
        if ($form_high_setting.find("input[name='securityType']:checked").val() == 1) {
            submitData["activity.extraData"] = submitData["activity.extraData"] + Math.pow(2, 13);
        }

        // 活动拓展信息
        var extendOperation = {};
        extendOperation.awardCycleTime = $("#awardCycleTime").val(); //几分钟内获得>
        extendOperation.unlockPrizeCount = $("#unlockPrizeCount").val(); //>几次助力才能参加抽奖活动
        extendOperation.loadingPic = $$("#loading_banner_bg").css("backgroundImage");
        extendOperation.loadingLogo = $$("#yy_logo_bg").css("backgroundImage");
        extendOperation.lotteryPic = $$("#lotto_banner_bg").css("backgroundImage");
        extendOperation.lotteryLogo = $$("#lotto_logo_bg").css("backgroundImage");
        extendOperation.loadingLink = $("#openingLink").val();
        extendOperation.isOpenClick = $("input[name='isOpenClick']:checked").val() == 0 ? false : true;
        extendOperation.openClickPic = $("#openClickPic").val();
        // 底部版权跳转链接
        extendOperation.copyrightLink = $("#copyrightLink").val();
        // 活动总的虚拟奖品数量
        extendOperation.globalAwardVirtualNum = $("#set_globalAwardVirtualNum_box #globalAwardVirtualNum").val();

        // 主办单位跳转链接
        extendOperation.jumpLinkBtn = $form_high_setting.find("input[name='jumpLinkBtn']:checked").val();

        if ($("#collect").size() > 0) {
            extendOperation.collect = $("#collect").val();
        }
        if ($("#slogan").size() > 0) {
            extendOperation.slogan = $("#slogan").val();
        }
        // 集五福特殊处理
        if (_isJiWuFu) {
            var $jiwufuTextForm = $("#form_jiwufu_gametext_setting");
            if ($("input[name='jiwufu_slogan_radio']:checked", $jiwufuTextForm).val() == 1) {
                extendOperation.slogan = "";
            } else {
                extendOperation.slogan = "";
                $("#cus_jiwufu_text_cont input").each(function(index, item) {
                    var $input = $(item);
                    if ($input.val() == "") {
                        extendOperation.slogan = "";
                        return false;
                    }
                    if (index != 0) {
                        extendOperation.slogan += "::";
                    }
                    extendOperation.slogan += $input.val();
                });
            }
        }
        // 奥运火炬特殊处理
        if (templateId == 14) {
            var $jiwufuTextForm = $("#form_jiwufu_gametext_setting");
            if ($("input[name='jiwufu_slogan_radio']:checked", $jiwufuTextForm).val() == 1) {
                extendOperation.slogan = "";
            } else {
                extendOperation.slogan = "";
                $("#cus_jiwufu_text_cont input").each(function(index, item) {

                    var $input = $(item);

                    if ($input.val() == "") {
                        extendOperation.slogan = "";
                        return false;
                    }
                    if (index != 0) {
                        extendOperation.slogan += "::";
                    }
                    extendOperation.slogan += $input.val();

                });
            }
        }
        // 新版摇一摇红包雨
        if (_isNewShakeRedpack) {
            var $newshakeredpackTextForm = $("#form_newshakeredpack_redpacktext_setting");
            extendOperation.redpackText = "";
            $("#cus_newshakeredpack_redpacktext_cont input").each(function(index, item) {
                var $input = $(item);
                if ($input.val() == "") {
                    extendOperation.redpackText = "";
                    return false;
                }
                if (index != 0) {
                    extendOperation.redpackText += "::";
                }
                extendOperation.redpackText += $input.val();
            });
        }
        // 新版拼字特殊处理
        if (_isNewPzhb) {
            extendOperation.newPzhb1 = $("#newPzhb1").val();
            extendOperation.newPzhb2 = $("#newPzhb2").val();
            extendOperation.newPzhb3 = $("#newPzhb3").val();
            //TODO 中文校验 长度校验 4-8
        }
        // 新版砍价特殊处理
        if (_isNewBargain) {
            extendOperation.totalLength = $("input[name='totalLength']", $form_play_help).val();
            extendOperation.elongationMin = $("input[name='elongationMin']", $form_play_help).val();
            extendOperation.elongationMax = $("input[name='elongationMax']", $form_play_help).val();
            extendOperation.shortenMin = $("input[name='shortenMin']", $form_play_help).val();
            extendOperation.shortenMax = $("input[name='shortenMax']", $form_play_help).val();
        }
        // 口令红包特殊处理
        if (_isKlhb) {
            extendOperation.bless = $("input[name='bless']").val();
            extendOperation.seller_name = $("input[name='seller_name']").val();
        }
        //新版语音红包
        if (_isNewYyhb) {
            extendOperation.commandWord = $("#commandWord").val();
        }
        // 百分百大转盘
        if (_isAbsolutelyBigWheel) {
            extendOperation.initialProbability = $("#initialProbability").val();
            extendOperation.helpNum = $("#helpNum").val();
        }
        // 摇摇天天乐
        if (_isYyttl) {
            var award_detail_form_0 = $("#award_detail_form_0");
            var minval = $("#award_detail_form_0").find("input[name='withdrawThresholdRadio']:checked").val();
            var maxval = award_detail_form_0.find(".withdrawThreshold_Max").val();
            if (minval == 1 || minval == 3) {
                extendOperation.withdrawThresholdMin = parseFloat(minval) * 1000 * 100 / 1000;
            } else {
                minval = award_detail_form_0.find(".withdrawThreshold_Min").val();
                extendOperation.withdrawThresholdMin = parseFloat(minval) * 1000 * 100 / 1000;
            }
            extendOperation.withdrawThresholdMax = parseFloat(maxval) * 1000 * 100 / 1000;
        }
        // 众筹起床
        if (_isZcqc) {
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();
            var startDate = $("#startDate").val();
            var endDate = $("#endDate").val();
            extendOperation.startTime = startTime;
            extendOperation.endTime = endTime;
            extendOperation.startDate = startDate;
            extendOperation.endDate = endDate;
        }
        // 全景红包
        if (_isPanoredpack) {
            // 覆盖上面的字段
            if (+$("input[name=helpEffectMs]:checked").val() != 0) {
                extendOperation.awardCycleTime = $("#awardCycleTime2").val();
                extendOperation.unlockPrizeCount = $("#unlockPrizeCount2").val();
            }
        }
        // 估价猎人
        if (_isValuationHunter) {
            /*
             *  数据格式
             *  
             *  1_path : "http://192.168.168.31//image/admin/newgame/def_img_1.png"
             *  1_size  : "0-0"
             *  size : 1
             * 
             * */

            var hunter_json = {};

            var li_list = $("#valuationHunter_goodsImg_modal").find("li");
            var v_length = li_list.length - 1;
            var v_length2 = $(".hunter_li_hide").length;

            // 构建每条图片数据
            for (var i = 0; i < (v_length - v_length2); i++) {
                hunter_json[(i + 1) + "_size"] = li_list.eq(i).find(".hunter_minNum").val() + "-" + li_list.eq(i).find(".hunter_maxNum").val();
                hunter_json[(i + 1) + "_path"] = li_list.eq(i).find(".hunter_img").attr("src");
            }
            // 总图片数
            hunter_json.size = v_length - v_length2;
            // 存入拓展字段
            extendOperation.hunter = hunter_json;
        }
        // 真心话大冒险
        if (_isTruthOrDare) {
            // 在子页面构造
            if (!window.TruthQuestion) {
                alert("请填写完成题目！");
                return false;
            }
            extendOperation.TruthQuestion = JSON.stringify(window.TruthQuestion);
        }
        /*// 愚人语音
        if (_isFoolvoice) {
        	// 在子页面构造
        	if (!window.TruthQuestion) {
        		alert("请填写完成新闻！");
        		return false;
        	}
        	extendOperation.TruthQuestion = JSON.stringify(window.TruthQuestion);
        }*/

        // 万圣节鬼混
        if (_isWanSheng) {
            // 在子页面构造
            if (!window.TruthQuestion) {
                alert("请填写完成分享内容！");
                return false;
            }
            extendOperation.TruthQuestion = JSON.stringify(window.TruthQuestion);
        }

        if (awardSendType == 1) {
            // 排名类活动派发规则
            submitData["rankingSendRule.rankingType"] = 2;
            submitData["rankingSendRule.withType"] = 0;
            submitData["rankingSendRule.orderBy"] = 0;
            submitData["rankingSendRule.rankingLine"] = 0;
        } else if (awardSendType == 2) {
            // 抽奖类活动派发规则，passCondition抽奖门槛，成绩达到多少可以参与抽奖
            submitData["challengeSendRule.passCondition"] = $("#passCondition").val();
            //"challengeSendRule.singleDayAwards": $("#singleDayAwards").val(),
            // singleUserAwards每人最多中奖几次
            submitData["challengeSendRule.singleUserAwards"] = $("#singleUserAwards").val();
        }
        var awardCount = $(".award_tab_item>li.prize_tab_item").length;

        // 设置的奖品数之和
        var totalPrizeCount = 0;
        var awardTipsArray = [];
        // 奖项赋值
        for (var i = 0; i < awardCount; i++) {
            var $tab = $(".award_tab_item>li.prize_tab_item").eq(i);
            // 奖项，submitData添加奖品信息
            submitData["awardBindPrizes[" + i + "].award.awardLevel"] = i + 1;
            submitData["awardBindPrizes[" + i + "].award.awardType"] = $(".award_tab_" + i + " select[name='awardType']").val(); //奖品类型
            submitData["awardBindPrizes[" + i + "].award.awardName"] = $(".award_tab_" + i + " input[name='awardName']").val(); //奖项等级
            // 存入奖品上传的图片
            submitData["awardBindPrizes[" + i + "].award.awardPic"] = $(".award_tab_" + i + " input[name='prize_image']").val();
            submitData["awardBindPrizes[" + i + "].trophy.awardPic"] = $(".award_tab_" + i + " input[name='prize_image']").val();
            submitData["awardBindPrizes[" + i + "].award.probabilityType"] = $(".award_tab_" + i + " input[name='probabilityType" + i + "']:checked").data("value");
            submitData["awardBindPrizes[" + i + "].award.probabilityValue"] = $(".award_tab_" + i + " input[name='probabilityValue']").val();
            submitData["awardBindPrizes[" + i + "].award.awardIndex"] = i + 1; // 奖项真实序号
            submitData["awardBindPrizes[" + i + "].award.operationTip"] = $(".award_tab_" + i + " input[name='operationTip']").val();
            submitData["awardBindPrizes[" + i + "].award.storeAddress"] = $(".award_tab_" + i + " input[name='storeAddress']").val();
            submitData["awardBindPrizes[" + i + "].award.subhead"] = $(".award_tab_" + i + " input[name='subhead']").val();
            submitData["awardBindPrizes[" + i + "].award.serviceTel"] = $(".award_tab_" + i + " input[name='serviceTel']").val();
            submitData["awardBindPrizes[" + i + "].award.description"] = $(".award_tab_" + i + " textarea[name='description']").val();
            if ($("#award_convert_limit_form").length > 0) {
                submitData["awardBindPrizes[" + i + "].award.integralConvert"] = $("#award_convert_limit_form").find("input[name='integralConvert" + i + "']").val();
            }
            if ($tab.hasClass("hide")) {
                submitData["awardBindPrizes[" + i + "].award.deleted"] = true;
                submitData["awardBindPrizes[" + i + "].trophy.deleted"] = true;
            } else {
                submitData["awardBindPrizes[" + i + "].award.deleted"] = false;
                submitData["awardBindPrizes[" + i + "].trophy.deleted"] = false;
                awardTipsArray.push({
                    "awardName": $(".award_tab_" + i + " input[name='awardName']").val(),
                    "trophyName": $(".award_tab_" + i + " input[name='trophyName']").val() //奖品名字
                });
                totalPrizeCount += parseInt($(".award_tab_" + i + " input[name='awardRealNum']").val()); //奖品数量
            }

            // 奖品
            submitData["awardBindPrizes[" + i + "].trophy.awardRealNum"] = parseInt($(".award_tab_" + i + " input[name='awardRealNum']").val()) + parseInt($(".award_tab_" + i + " input[name='awardLoseNum']").val()); //奖品数量
            submitData["awardBindPrizes[" + i + "].trophy.trophyName"] = $(".award_tab_" + i + " input[name='trophyName']").val(); //奖品名字
            submitData["awardBindPrizes[" + i + "].trophy.awardVirtualNum"] = $(".award_tab_" + i + " input[name='awardVirtualNum']").val();
            if (!_isYyttl) {
                submitData["awardBindPrizes[" + i + "].trophy.singleMin"] = parseFloat($(".award_tab_" + i + " input[name='singleMin']").val()) * 1000 * 100 / 1000;
                submitData["awardBindPrizes[" + i + "].trophy.singleMax"] = parseFloat($(".award_tab_" + i + " input[name='singleMax']").val()) * 1000 * 100 / 1000;
            } else {
                submitData["awardBindPrizes[" + i + "].trophy.singleMin"] = 100;
                submitData["awardBindPrizes[" + i + "].trophy.singleMax"] = 100;
            }
            submitData["awardBindPrizes[" + i + "].trophy.totalCount"] = parseFloat($(".award_tab_" + i + " input[name='totalCount']").val()) * 1000 * 100 / 1000;
            submitData["awardBindPrizes[" + i + "].trophy.awardType"] = $(".award_tab_" + i + " select[name='awardType']").val();
            submitData["awardBindPrizes[" + i + "].trophy.validityStart"] = $(".award_tab_" + i + " input[name='validityStart']").val(); //有效期的开始时间
            submitData["awardBindPrizes[" + i + "].trophy.validityStop"] = $(".award_tab_" + i + " input[name='validityStop']").val(); //有效期的结束时间

            // sn码自定义(券号，1为系统生成，3为手工导入)
            submitData["awardBindPrizes[" + i + "].trophy.snGenerateType"] = $(".award_tab_" + i + " input[name='sncodeType']:checked").val();
            submitData["awardBindPrizes[" + i + "].trophy.defaultSnCode"] = $(".award_tab_" + i + " textarea[name='sncodes']").val().split(/\n/g).toString();

            // 是否同步到微信卡券
            submitData["awardBindPrizes[" + i + "].trophy.isWxCard"] = $(".award_tab_" + i + " input[name='isWxCard']:checked").val() == 1;
            var awardLogicSwitch = 0;
            var awardCustom = {};
            // 是否内定中奖人
            if ($(".award_tab_" + i + " input[name='defaultWinner']:checked").val() == 1) {
                awardCustom.setSwitchNum = 0;
            } else {
                awardCustom.setSwitchNum = $(".award_tab_" + i + " input[name='defaultWinnerAmount']").val();
                awardLogicSwitch += 1;

            }
            submitData["awardBindPrizes[" + i + "].award.logicSwitch"] = awardLogicSwitch;

            // 跳转按钮
            if ($(".award_tab_" + i + " input[name='guanwanJumpBtn']:checked").val() == 1) {
                // 是否开启跳转按钮
                awardCustom.guanwanJumpBtn = "false";
            } else if ($(".award_tab_" + i + " input[name='guanwanJumpBtn']:checked").val() == 2) {
                // 是否开启跳转按钮
                awardCustom.guanwanJumpBtn = "true";
                // 跳转按钮名字 

                awardCustom.jumpBtnName = $(".award_tab_" + i + " input[name='jumpBtnName']").val();
                // 跳转按钮链接 
                awardCustom.jumpLink = $(".award_tab_" + i + " input[name='jumpLink']").val();
            }


            // 新版砍价特殊处理
            if (_isNewBargain && i == 0) {
                awardCustom.detailLink = $(".award_tab_" + i + " input[name='detailLink']").val();
                extendOperation.virtualNum = $(".award_tab_" + i + " input[name='virtualNum']").val();
            }
            submitData["awardBindPrizes[" + i + "].award.custom"] = $.toJSON(awardCustom);

            if (isEdit) {
                submitData["awardBindPrizes[" + i + "].award.activityId"] = global_aid;
                submitData["awardBindPrizes[" + i + "].trophy.activityId"] = global_aid;
                submitData["awardBindPrizes[" + i + "].award.id"] = $(".award_tab_" + i + " input[name='awardId']").val();
                submitData["awardBindPrizes[" + i + "].trophy.id"] = $(".award_tab_" + i + " input[name='trophyId']").val();
                // 此处应该不用再设置一次，否则会出错
                submitData["awardBindPrizes[" + i + "].trophy.awardsTypeId"] = $(".award_tab_" + i + " input[name='awardId']").val();
            }
        }
        submitData["activity.extendOperation"] = $.toJSON(extendOperation);
        // 七夕活动特殊处理
        if (templateId == 13) {
            submitData["activity.activityType"] = 31503;
        }
        submitData["activity.awardTips"] = $.toJSON(awardTipsArray);
        // 排名类活动派发规则
        if (awardSendType == 1) {
            submitData["rankingSendRule.rankingLine"] = totalPrizeCount;
        }

        //限制城市
        if ($("#addr_prov").val() != '') {
            //submitData["playRule.needArea"] = true;
            // 直接传递中文(以前的)
            /*submitData["playRule.province"]=$("#addr_prov").find("option:selected").text();
            submitData["playRule.city"]=$("#addr_city").val()==''?'':$("#addr_city").find("option:selected").text();*/

            // 多选省市
            submitData["playRule.needArea"] = window.save_needArea;
            submitData["playRule.areaCode"] = window.save_addressList;
            submitData["playRule.province"] = window.save_province;
            submitData["playRule.city"] = window.save_city;


            // submitData.province=$("#addr_prov").val();
            // submitData.city=$("#addr_city").val();
        } else {
            submitData["playRule.needArea"] = false;
        }

        // 是否需要补全信息
        // 补全信息有问题
        /**
        if ($("#needMoreInfo").is(":checked")) {
        	var moreInfo = {
        			"times": 1,
        			"info": []
        	};
        	if ($("#moreInfo_tel").is(":checked")) {
        		moreInfo["info"].push({"title":"电话", "needed": true, "value": ""});
        	}
        	if ($("#moreInfo_addr").is(":checked")) {
        		moreInfo["info"].push({"title":"地址", "needed": true, "value": ""});
        	}
        	if ($("#moreInfo_name").is(":checked")) {
        		moreInfo["info"].push({"title":"姓名", "needed": true, "value": ""});
        	}
        	
        	submitData["playRule.needMoreInfo"] = true;
        	submitData["playRule.moreInfo"] = JSON.stringify(moreInfo);
        }
        **/

        /*
        if(window.isEdit){
        	submitData.actId = window.actId;
        }
        //总金额
        var totalMoney = $("input[name='totalMoney']").val();
        if(!window.isEdit) {
        	if (totalMoney > window.balance) {
        		alert("余额不足");
        		return;
        	}
        }
        */
        // 构造gamePage json
        submitData["gamePage.jsonContent"] = genGamePageJson();
        // 构造自定义二维码分享页面 json
        submitData["activity.qrcodeUrl"] = genQrcodeEditPageJson();
        // 构造JSON出错，无法获取节点的图片路径
        if (submitData["gamePage.jsonContent"] == false) {
            alert('自定义编辑数据错误，请刷新页面');
            $btn.removeClass("disabled");
            var errImg = new Image();
            var msg = "自定义编辑数据错误：" + window.errorTarget;
            var errImgSrc = "/mobile/newgame/jserror?errorMessage=" + msg;
            errImgSrc += "&scriptURI=" + encodeURIComponent(window.location.href);
            errImgSrc += "&lineNumber=0";
            errImgSrc += "&columnNumber=0";
            errImgSrc += "&errorObj=" + msg;
            errImgSrc += "&bowserType=" + navigator.userAgent.toLowerCase();
            errImgSrc += "&type=0";
            errImgSrc += "&_=" + new Date().getTime();
            errImg.src = errImgSrc;
            errImg.imageSrcKey = errImgSrc;
            return;
        }
        // 构造自定义二维码分享页面JSON出错，无法获取节点的图片路径
        if (submitData["activity.qrcode_url"] == false) {
            alert('二维码分享页面自定义编辑数据错误，请刷新页面');
            $btn.removeClass("disabled");
            return;
        }

        // 子页面往submitData里加入内容
        if (!!window.addSubmitDataFn && typeof window.addSubmitDataFn == "function") {
            window.addSubmitDataFn(submitData);
        }

        if (isEdit) {
            submitData["activity.id"] = global_aid;
            submitData["helpRule.activityId"] = global_aid;
            submitData["playRule.activityId"] = global_aid;
            submitData["challengeSendRule.activityId"] = global_aid;
            submitData["challengeSendRule.id"] = window.challengeSendRuleId;
            submitData["rankingSendRule.activityId"] = global_aid;
            submitData["rankingSendRule.id"] = window.rankingSendRuleId;
            submitData["gamePage.id"] = window.actPageId;

            $.post('/admin/new_activity/updateActivityWithAllInfo', submitData, function(data) {
                if (!window.childUpdateFn) {
                    $btn.removeClass("disabled");
                }
                if (data.ret == 0) {
                    // 更新二维码
                    showQrcode(global_aid);
                    unbindBeforeUnload();
                    if (window.childUpdateFn && typeof window.childUpdateFn == "function") {
                        //childObj = [global_aid,$btn];
                        var childObj = {
                            "global_aid": global_aid,
                            "$btn": $btn,
                            "data": data
                        };
                        window.childUpdateFn(childObj);
                        return false;
                    }
                    alert("活动修改成功");
                } else {
                    alert(data.msg);
                }
            });
        } else {
            // 将配置 数据传到后台
            $.post('/admin/new_activity/addActivityWithAllInfo', submitData, function(data) {
                if (!window.childSaveFn) {
                    $btn.removeClass("disabled");
                }
                if (data.ret == 0) {
                    var model = data.model;
                    // 更新二维码
                    //showQrcode(model.activityId);
                    unbindBeforeUnload();
                    // 子页面调用函数
                    if (window.childSaveFn && typeof window.childSaveFn == "function") {
                        var childObj = {
                            "model": model,
                            "$btn": $btn
                        }
                        window.childSaveFn(childObj);
                        return false;
                    }
                    alert("活动创建成功");
                    if (_isFromHb) {
                        window.location.href = "/admin/activity/unpublish.jsp?isHb=true&showActivityId=" + model.activityId;
                    } else {
                        window.location.href = "/admin/activity/unpublish.jsp?showActivityId=" + model.activityId;
                    }
                } else {
                    alert(data.msg);
                }
                $btn.removeClass("disabled");
            }, "json");
        }
    });
    // 提交按钮 end!

    /** 助力环节二维码分享图片页面自定义 start */
    // 颜色选择插件	        
    /*$("#range_edit_color").minicolors({
    	defaultValue : '',
    	change : function(hex, opacity) {
    		$("#range_edit_color").trigger("keyup");
    	},
    	theme : 'bootstrap'
    });*/
    // 新增分享文案
    $("#label_poster").off("click").on("click", function() {
        reviewPageWin.addPosterText();
    });

    // 大背景图
    $("#label_bgimg").off("click").on("click", function() {
        reviewPageWin.triggerQrcodePageBgUpload();
    });

    $("#label_logo_tips").tooltip();
    $("#label_logo_tips").on("click", function() {
        $$("#qrcode_edit_headimg").toggle();
        if ($$("#qrcode_edit_headimg").css("display") == "none") {
            $(this).attr("data-original-title", "显示");
        } else {
            $(this).attr("data-original-title", "隐藏");
        }
    });

    $("#label_nickname_tips").tooltip();
    $("#label_nickname_tips").on("click", function() {
        if ($$("#qrcode_edit_represent_text").css("display") == "none") {
            $$("#qrcode_edit_represent_text").css("display", "inline-block");
            $(this).attr("data-original-title", "隐藏");
        } else {
            $$("#qrcode_edit_represent_text").css("display", "none");
            $(this).attr("data-original-title", "显示");
        }
    });

    $("#label_actname_tips").tooltip();
    $("#label_actname_tips").on("click", function() {
        if ($$("#qrcode_edit_title_text").css("display") == "none") {
            $$("#qrcode_edit_title_text").css("display", "inline-block");
            $(this).attr("data-original-title", "隐藏");
        } else {
            $$("#qrcode_edit_title_text").css("display", "none");
            $(this).attr("data-original-title", "显示");
        }
    });
    /** 助力环节二维码分享图片页面自定义 end */
});

//由于需要等待游戏iframe初始化完成之后才能进行分享二维码自定义页面初始的部分
function initQrcodeBindPage() {
    // 初始化
    if ($$("#qrcode_edit_represent_text").css("display") == "none") {
        $("#label_nickname_tips").attr("data-original-title", "显示");
    } else {
        $("#label_nickname_tips").attr("data-original-title", "隐藏");
    }

    // 由于初始化编辑拖动，会影响，必须等待初始化完成才进行显示隐藏的操作
    var logoType = $$("#qrcode_edit_headimg").data("type");
    if (logoType == "1") {
        $$("#qrcode_edit_headimg").show();
    } else {
        $$("#qrcode_edit_headimg").hide();
    }

    if ($$("#qrcode_edit_headimg").css("display") == "none") {
        $("#label_logo_tips").attr("data-original-title", "显示");
    } else {
        $("#label_logo_tips").attr("data-original-title", "隐藏");
    }

    // 校验奖品内定数量
    $.validator.addMethod("defaultWinnerLeftNum", function(value, element, params) {
        var awardRealNum = Number($("#form_add_defaultwinner_award_setting").find("input[name='defaultwinner_available_num']").val()); //awardRealNum:奖品数量
        var defaultWinnerAmount = Number(value);
        return defaultWinnerAmount > 0 && defaultWinnerAmount <= awardRealNum;
    }, "待领取数量不能大于可内定数量");
}