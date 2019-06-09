下载淘宝评论图片
by jason
1
// ==UserScript==
2
// @name         下载淘宝评论图片
3
// @namespace    https://greasyfork.org/zh-CN/scripts/22386
4
// @version      20170820
5
// @description  Get TAOBAO Comment Pic
6
// @author       jason
7
// @match        https://item.taobao.com/item.htm?*
8
// @grant        none
9
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.js
10
// ==/UserScript==
11
/*
12
Target URL: https://item.taobao.com/item.htm?id=528857970664
13
*/
14
(function() {
15
    var page = 1;
16
    var url, PageTotal;
17
    var itemid, sellerid;
18
    var targetElement = 'div.tb-revbd';
19
    itemid = g_config.itemId;
20
    sellerid = g_config.sellerId;
21
    var Link = [];
22
    function getJSON() {
23
     //   $('#J_IdsSegments').css('z-index', 100); //降低右侧div的层级
24
​
25
        url = "https://rate.taobao.com/feedRateList.htm?auctionNumId=" + itemid + "&userNumId=" + sellerid + "&currentPageNum=" + page + "&rateType=3&orderType=sort_weight&attribute=&sku=&hasSku=false&folded=0&_ksTS=" + (new Date().getTime()) + "&callback=?";
26
        $.getJSON(url, function(d) {
27
            if (page == 1) PageTotal = d.maxPage;
28
            ProcessJSON(d);
29
            page++;
30
            if (page <= Math.min(20, PageTotal)) {
31
                getJSON();
32
            } else{console.log(Link.join(''));}
33
        });
34
​
35
    }
36
​
37
    function ProcessJSON(d) {
38
        var ImgList = [];
39
 //       var Link = [];
40
        $.each(d.comments, function(i, v) {
41
            img = '';
42
            urls = '';
43
            if (v.photos) {
44
                $.each(v.photos, function(pi, pv) {
45
                    img += "<img src='" + pv.url.replace('_400x400.jpg', '') + "' /><br><br>\r\n";
46
                    urls += "https:" + pv.url.replace('_400x400.jpg', '')+"\r\n";
47
                });
48
            }
49
            if (v.appendList) {
50
                $.each(v.appendList, function(spi, spv) {
51
                    $.each(spv.photos, function(fpi,fpv) {
52
                        img += "<img src='" + fpv.url.replace('_400x400.jpg', '') + "' /><br><br>\r\n";
53
                        urls += "https:" + fpv.url.replace('_400x400.jpg', '')+"\r\n";
54
                    });
55
                })
56
            }
57
            ImgList.push(img);
58
            Link.push(urls);
59
​
60
        });
61
      $(targetElement).append('<div>第' + page + '页</div>' + ImgList.join(''));
62
  //      console.log(Link.join(''));
63
​
64
    }
65
     function getJSONText() {
66
        $('#J_IdsSegments').css('z-index', 100); //降低右侧div的层级
67
        url = "https://rate.taobao.com/feedRateList.htm?auctionNumId=" + itemid + "&userNumId=" + sellerid + "&currentPageNum=" + page + "&rateType=&orderType=sort_weight&attribute=&sku=&hasSku=false&folded=0&_ksTS=" + (new Date().getTime()) + "&callback=?";
68
        $.getJSON(url, function(d) {
69
            if (page == 1) PageTotal = d.maxPage;
70
            ProcessJSONText(d);
71
            page++;
72
            if (page <= Math.min(10, PageTotal)) getJSONText(); //最多取10页数据
73
        });
74
    }
75
     function ProcessJSONText(d) {
76
        var Text = [];
77
        $.each(d.comments, function(i, v) {
78
            text = '';
