//メイン
$(function()
{
  //Getの処理
  var getVars = getUrlVars();

  if(getVars['mode'] != null)
  {
    getVars['mode'] = parseInt(getVars['mode']);
  }

  if(getVars['page'] != null)
  {
    getVars['page'] = parseInt(getVars['page']);
  }
  else
  {
    getVars['page'] = 1;
  }
  
  //JSONを取得・処理
  $.getJSON("fukui-event.json", function(data)
  {
    //ページ番号を生成
    if(getVars['mode'] != -1)
    {
      var pageMax = data.length/abs(getVars['mode'])+1
      if(getVars['page'] == null)
      {
        createSelectP(1, pageMax);
      }
      else
      {
        createSelectP(getVars['page'], pageMax);
      }
    }

    //
    $contents = $("#contents");
    
    //表示する情報の範囲（長さ）を計算
    var srtIdx = 0;
    var endIdx = data.length;

    if(getVars['mode'] != null && getVars['mode'] > 0)
    {
      srtIdx = getVars['mode'] * (getVars['page'] - 1);
      if((srtIdx+getVars['mode']) <= endIdx)
      {
        endIdx = srtIdx + getVars['mode'];
      }
    }
    
    //イベント情報の生成
    for(var i=srtIdx; i<endIdx; i++)
    {
      createDtl($contents, data[i]);
    }
  });
  
});


function abs(val) {
  return (val < 0 ? -val : val);
};


//各イベントの詳細項目を追加
function createDtl($obj, data)
{
  var $eveObj = $("<li class='event'>").appendTo($obj);
  $eveObj.append($("<p class='event_name'>").text(data.event_name));

  var $detailObj = $("<ul class='detail'>").appendTo($eveObj);
  $detailObj.append($("<li class='category'>").text(data.category))
            .append($("<li class='date'>").text(data.start_date+"～"+data.end_date))
            .append($("<li class='description'>").text(data.description))
            .append($("<li class='schedule_description'>").text(data.schedule_description))
            .append($("<li class='contact'>").text(data.contact))
            .append($("<li class='contact_phone_number'>").text(data.contact_phone_number))
            .append($("<li class='event_place'>").text(data.event_place))
            .append($("<li class='latitude'>").text(data.latitude))
            .append($("<li class='longitude'>").text(data.longitude)
            .append($("<li class='city'>").text(data.city)));

  //文章が存在しない場合の例外処理
  if(!data.schedule_description)
  {
    $detailObj.children('.schedule_description').remove();
  }
}


//GETパラメータを生成
function createGetPara(newVars)
{
  var getVars = getUrlVars();
  var getPara = "?";
  var key = ['mode','page','word'];

  for(var i=0; i<key.length; i++)
  {
    if(newVars[key[i]] != null)
    {
      getPara = getPara+key[i]+"="+newVars[key[i]]+"&";
    }
    else if(getVars[key[i]] != null && key[i] != "page")
    {
      getPara = getPara+key[i]+"="+getVars[key[i]]+"&";
    }
  }
  getPara = getPara.replace(/&$/,'');

  return getPara;
}


//ページ選択ボタンを追加
function createSelectP(page, pageMax)
{
  $pageList = $(".pageList");
  for(var i=page-2; i<=page+2; i++){
    var $page = $("<li class='page'>").appendTo($pageList);

    if(i == page)
    {
      $page.append($("<p class='nowPage'>").text(i));
    }
    else if(i >= 1 && i <= pageMax)
    {
      var pageVers = {"page":i}
      $page.append($("<a class='jumpPage'>").attr('href',createGetPara(pageVers)).text(i));
    }
  }
}


//GETパラメータを取得
function getUrlVars()
{  
  var vars = {}; 
  var param = location.search.substring(1).split('&');

  for(var i = 0; i < param.length; i++) {
    var keySearch = param[i].search(/=/);
    var key = '';
    if(keySearch != -1) key = param[i].slice(0, keySearch);
    var val = param[i].slice(param[i].indexOf('=', 0) + 1);
    if(key != '') vars[key] = decodeURI(val);
  }
 
  return vars; 

}