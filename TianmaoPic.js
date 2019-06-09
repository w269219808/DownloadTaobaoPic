// ==UserScript==
// @name         获取天猫评论图片
// @namespace    https://greasyfork.org/zh-CN/scripts/22386
// @version      20170429
// @description  Get TMALL Comment Pic
// @author       jason
// @match        detail.tmall.com/item.htm?*
// @grant        none
// @require      https://code.jquery.com/jquery-1.9.1.min.js
// ==/UserScript==
/*
Target URL: https://item.taobao.com/item.htm?id=528857970664
*/
(function() {
    var page=1;
    var url,PageTotal;
    var itemid,sellerid;
    var targetElement='.rate-grid';
    itemid=g_config.itemId;
    sellerid=g_config.sellerId;
    var ImgLink=[];
    function getJSON(){
        url="https://rate.tmall.com/list_detail_rate.htm?itemId=" + itemid + "&sellerId=" + sellerid + "&order=3&currentPage=" + page + "&append=0&content=1&picture=1&_ksTS="+(new Date().getTime()) + "&callback=?";
        $.getJSON(url, function(d) {
        if(page==1) PageTotal=d.rateDetail.paginator.lastPage;//获取总页数
        ProcessJSON(d);
        page++;
        if(page<=Math.min(10,PageTotal)){//最多取10页数据
            getJSON();
        }else{ console.log(ImgLink.join(''));}
        });

    }
    function ProcessJSON(d)
    {
        var ImgList=[];
 //       var ImgLink=[];

        $.each(d.rateDetail.rateList,function(i,v){
            img='';
            link='';
            if(v.pics)
            {
                $.each(v.pics,function(pi,pv){
                    img+="<img src='" + pv + "' /><br><br>\r\n";
                    link+= "https:"+ pv + "\r\n";
                });
            }
            if(v.appendComment)
            {
                $.each(v.appendComment.pics,function(pi,pv){
                    img+="<img src='" + pv + "' /><br><br>\r\n";
                    link+= "https:"+ pv + "\r\n";
                });
            }
            ImgList.push(img);
            ImgLink.push(link);

        });
        append='<div>第' + page + '页</div>'+ImgList.join('');
     //   console.log(ImgLink.join(''));
        $(targetElement).append(append);

    }
     function getJSONText(){
        url="https://rate.tmall.com/list_detail_rate.htm?itemId=" + itemid + "&sellerId=" + sellerid + "&order=3&currentPage=" + page + "&append=0&content=1&_ksTS="+(new Date().getTime()) + "&callback=?";
        $.getJSON(url, function(d) {
        if(page==1) PageTotal=d.rateDetail.paginator.lastPage;//获取总页数
        ProcessJSONText(d);
        page++;
        if(page<=Math.min(10,PageTotal))getJSONText();//最多取10页数据
        });

    }
    function ProcessJSONText(d)
    {
        var Text=[];
        $.each(d.rateDetail.rateList,function(i,v){
            text='';
            if(v.rateContent){
               text += v.rateContent + "<br><br>\r\n";
            }
             if(v.appendComment)
            {
               if(v.appendComment.content){
                text += "【追评】:" + v.appendComment.content + "<br><br>\r\n";
                }
            }
            Text.push(text);

        });
        $(targetElement).append(Text.join(''));
    }
    if(jQuery)
    {
        $("#J_TabBar").append("<li id='sbdx_tools_getAllImage'><a>全部晒图</a></li><li id='sbdx_tools_getAllText'><a>全部评语</a></li>");
        $("#sbdx_tools_getAllImage").on("click",function(){page=1;$(targetElement).html('');getJSON();});
        $("#sbdx_tools_getAllText").on("click",function(){page=1;$(targetElement).html('');getJSONText();})
    }
    else
    {
        alert('Tampermonkey 加载jquery.js 失败！脚本终止运行！');
    }
})();
