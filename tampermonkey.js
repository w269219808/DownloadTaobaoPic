// ==UserScript==
// @name         下载淘宝评论图片
// @namespace    https://greasyfork.org/zh-CN/scripts/22386
// @version      20190620
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
    var i=1
     function downloadIamge(imgsrc, name) {
    //下载图片地址和图片名
    var image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        var _dataURL = canvas.toDataURL('image/png'); //得到图片的base64编码数据
        var blob_ = dataURLtoBlob(_dataURL ); // 用到Blob是因为图片文件过大时，在一部风浏览器上会下载失败，而Blob就不会
        name= name + i;
        i++;
        var url= {
            name: name || "图片", // 图片名称不需要加.png后缀名
            src: blob_
        };
        if (window.navigator.msSaveOrOpenBlob) {   // if browser is IE
            navigator.msSaveBlob(url.src, url.name );//filename文件名包括扩展名，下载路径为浏览器默认路径
        } else {
            var link = document.createElement("a");
            link.setAttribute("href", window.URL.createObjectURL(url.src));
            link.setAttribute("download", url.name + '.jpg');
          //  link.href = window.URL.createObjectURL(url.src);
         //   link.download = url.name +'.jpg';
            document.body.appendChild(link);
            link.click();
   //         document.body.removeChild(link);
         //   window.URL.revokeObjectURL(link.href);
        }
    };
    image.src = imgsrc;
    function dataURLtoBlob(urlData) {
	var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
        type: 'image/jpg'
    });}
}
    var page = 1;
    var url, PageTotal;
    var itemid, sellerid;
    var targetElement = 'div.tb-revbd';
    itemid = g_config.itemId;
    sellerid = g_config.sellerId;
    var Link = [];
	var Linkc =[];
    function getJSON() {
        $('#J_IdsSegments').css('z-index', 100); //降低右侧div的层级
        url = "https://rate.taobao.com/feedRateList.htm?auctionNumId=" + itemid + "&userNumId=" + sellerid + "&currentPageNum=" + page + "&rateType=3&orderType=sort_weight&attribute=&sku=&hasSku=false&folded=0&_ksTS=" + (new Date().getTime()) + "&callback=?";
        $.getJSON(url, function(d) {
            if (page == 1) PageTotal = d.total/20+1;       //获取总页数
            ProcessJSON(d);
            page++;
            if (page < Math.min(10, PageTotal)) {     //最多找10页
                getJSON();
            }
            else{
                alert("一共有" + Link.length +"张晒图");
            }
        });
    }

    function ProcessJSON(d) {
        var ImgList = [];
        $.each(d.comments, function(i, v) {
            img = '';
            urls = '';
            if (v.photos) {
                $.each(v.photos, function(pi, pv) {
                    img += "<img src='" + pv.url.replace('_400x400.jpg', '') + "' /><br><br>\r\n";
                    urls += "https:" + pv.url.replace('_400x400.jpg', '')+"\r\n";
                    Link.push("https:" + pv.url.replace('_400x400.jpg', ''));
                });
            }
            if (v.appendList) {
                $.each(v.appendList, function(spi, spv) {
                    $.each(spv.photos, function(fpi,fpv) {
                        img += "<img src='" + fpv.url.replace('_400x400.jpg', '') + "' /><br><br>\r\n";
                        urls += "https:" + fpv.url.replace('_400x400.jpg', '')+"\r\n";
                        Link.push("https:" + fpv.url.replace('_400x400.jpg', ''));
                    });
                })
            }
            ImgList.push(img);
            Linkc.push(urls);
        });
      $(targetElement).append('<div>第' + page + '页</div>' + ImgList.join(''));
      console.log(Linkc.join(''));
    }
     function getJSONText() {
        $('#J_IdsSegments').css('z-index', 100); //降低右侧div的层级
        url = "https://rate.taobao.com/feedRateList.htm?auctionNumId=" + itemid + "&userNumId=" + sellerid + "&currentPageNum=" + page + "&rateType=&orderType=sort_weight&attribute=&sku=&hasSku=false&folded=0&_ksTS=" + (new Date().getTime()) + "&callback=?";
        $.getJSON(url, function(d) {
            if (page == 1) PageTotal = d.total/20+1;       //获取总页数
            ProcessJSONText(d);
            page++;
            if (page < Math.min(10, PageTotal)) getJSONText(); //最多取10页数据
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
        $("#J_TabBar").append("<li id='sbdx_tools_getAllImage'><a style='line-height:44px;color:#3C3C3C;text-decoration: none;'>全部晒图</a></li>");
        $("#J_TabBar").append("<li id='sbdx_tools_getAllText'><a style='text-decoration: none;line-height:44px;color:#3C3C3C;'>全部评语</a></li>");
        $("#J_TabBar").append("<li id='download_image'><a style='text-decoration: none;line-height:44px;color:#3C3C3C;'>下载</a></li>");
        $("#sbdx_tools_getAllImage").on("click", function() {page = 1;$(targetElement).html('');getJSON();});
        $("#sbdx_tools_getAllText").on("click",function(){page=1;$(targetElement).html('');getJSONText();});
        $("#download_image").on("click",function(){for (let index = 0; index < Link.length; index++){downloadIamge( Link[index],'买家秀');}});
        $("#J_ServiceTab").hide();
        $(".tb-tabbar>li").css({"min-width":"92px","cursor":"pointer"});
    }
})();
