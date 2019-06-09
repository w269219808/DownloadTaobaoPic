// ==UserScript==
// @name         下载淘宝评论图片
// @namespace    https://greasyfork.org/zh-CN/scripts/22386
// @version      20170820
// @description  Get TAOBAO Comment Pic
// @author       jason
// @match        https://item.taobao.com/item.htm?*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// ==/UserScript==
/*
Target URL: https://item.taobao.com/item.htm?id=528857970664
*/
(function() {
    var page = 1;
    var url, PageTotal;
    var itemid, sellerid;
    var targetElement = 'div.tb-revbd';
    itemid = g_config.itemId;
    sellerid = g_config.sellerId;
    var Link = [];
    function getJSON() {
     //   $('#J_IdsSegments').css('z-index', 100); //降低右侧div的层级

        url = "https://rate.taobao.com/feedRateList.htm?auctionNumId=" + itemid + "&userNumId=" + sellerid + "&currentPageNum=" + page + "&rateType=3&orderType=sort_weight&attribute=&sku=&hasSku=false&folded=0&_ksTS=" + (new Date().getTime()) + "&callback=?";
        $.getJSON(url, function(d) {
            if (page == 1) PageTotal = d.maxPage;
            ProcessJSON(d);
            page++;
            if (page <= Math.min(20, PageTotal)) {
                getJSON();
            } else{console.log(Link.join(''));}
        });

    }

    function ProcessJSON(d) {
        var ImgList = [];
 //       var Link = [];
        $.each(d.comments, function(i, v) {
            img = '';
            urls = '';
            if (v.photos) {
                $.each(v.photos, function(pi, pv) {
                    img += "<img src='" + pv.url.replace('_400x400.jpg', '') + "' /><br><br>\r\n";
                    urls += "https:" + pv.url.replace('_400x400.jpg', '')+"\r\n";
                });
            }
            if (v.appendList) {
                $.each(v.appendList, function(spi, spv) {
                    $.each(spv.photos, function(fpi,fpv) {
                        img += "<img src='" + fpv.url.replace('_400x400.jpg', '') + "' /><br><br>\r\n";
                        urls += "https:" + fpv.url.replace('_400x400.jpg', '')+"\r\n";
                    });
                })
            }
            ImgList.push(img);
            Link.push(urls);

        });
      $(targetElement).append('<div>第' + page + '页</div>' + ImgList.join(''));
  //      console.log(Link.join(''));

    }
     function getJSONText() {
        $('#J_IdsSegments').css('z-index', 100); //降低右侧div的层级
        url = "https://rate.taobao.com/feedRateList.htm?auctionNumId=" + itemid + "&userNumId=" + sellerid + "&currentPageNum=" + page + "&rateType=&orderType=sort_weight&attribute=&sku=&hasSku=false&folded=0&_ksTS=" + (new Date().getTime()) + "&callback=?";
        $.getJSON(url, function(d) {
            if (page == 1) PageTotal = d.maxPage;
            ProcessJSONText(d);
            page++;
            if (page <= Math.min(10, PageTotal)) getJSONText(); //最多取10页数据
        });
    }
     function ProcessJSONText(d) {
        var Text = [];
        $.each(d.comments, function(i, v) {
            text = '';

            if(v.content)
            {
                text+=v.content+"<br><br>\r\n";
            }

            $.each(v.appendList, function(pi, pv) {
                 text+= "【追评】"+pv.content+"<br><br>\r\n";
            })

            Text.push(text);

        });
      $(targetElement).append(Text.join(''));

    }
    if ($) {
        $("#J_TabBar").append("<li id='sbdx_tools_getAllImage'><a style='line-height:44px;color:#3C3C3C;text-decoration: none;'>全部晒图</a></li><li id='sbdx_tools_getAllText'><a style='text-decoration: none;line-height:44px;color:#3C3C3C;'>全部评语</a></li>");
        $("#sbdx_tools_getAllImage").on("click", function() {page = 1;$(targetElement).html('');getJSON();});
        $("#sbdx_tools_getAllText").on("click",function(){page=1;$(targetElement).html('');getJSONText();})
        $("#J_ServiceTab").hide();
        $(".tb-tabbar>li").css({"min-width":"92px","cursor":"pointer"});
    //    $(window).scroll(function() { $("div[id^=sbdx]").each(function(i) { $(this).offset({ top: $(document).scrollTop() + 100 + i * 30 }); }); });
    }
})();
