﻿//メイン
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
  
  //件数表示を調整
  addModeAttr();

  //JSONを取得・処理
  $.getJSON("fukui-event.json", function(data)
  {
    //検索カテゴリの選択肢を生成
    addOption($("#category") , 'category', data)

    //
    $contents = $("#contents");

    //検索ワードにヒットした情報を抽出
    var hitData = searchCnt(getVars['keyword'], getVars['category'], data);
    
    //検索結果の詳細を表示
    var resultText = '';
    if(getVars['keyword'] != null)
    {
      resultText = escapeHtml(getVars['keyword']);
    }
    if(getVars['category'] != null && getVars['category'] != 'all')
    {
      if(getVars['category'] == 'faves')
        resultText = resultText+'　お気に入り';
      else
        resultText = resultText+'　'+getVars['category'];
    }
    if(resultText != '')
    {
      resultText = resultText+'　'+hitData.length+'件の検索結果';
      $('#searchResult').text(resultText);
    }

    //表示する情報の範囲（長さ）を計算
    var maxIdx = hitData.length;
    var srtIdx = 0;
    var endIdx = maxIdx;

    if(getVars['mode'] != null && getVars['mode'] > 0)
    {
      srtIdx = getVars['mode'] * (getVars['page'] - 1);
      if((srtIdx+getVars['mode']) <= maxIdx)
      {
        endIdx = srtIdx + getVars['mode'];
      }
    }

    //ページ番号を生成
    if(getVars['mode'] != null && getVars['mode'] != -1)
    {
      var pageMax = hitData.length/abs(getVars['mode'])+1;
      if(getVars['page'] == null)
      {
        createSelectP(1, pageMax);
      }
      else
      {
        createSelectP(getVars['page'], pageMax);
      }
    }
    
    //イベント情報の生成
    for(var i=srtIdx; i<endIdx; i++)
    {
      createDtl($contents, hitData[i]);
    }
  });
  
});


//絶対値を算出する
function abs(val) {
  return (val < 0 ? -val : val);
};


//SelectのOptionを追加
function addOption($obj, kind, data)
{
  var foundKind = [];
  var kindLen = 0;
  var kindData;

  
  for(var i=0; i<data.length; i++)
  {
    kindData = data[i][kind];
    var flg = 0;
    for(var j=0; j<kindLen; j++)
    {
      if(kindData == 'その他' || kindData == foundKind[j])
      {
        flg = 1;
        break;
      }
    }

    if(!flg)
    {
      foundKind.push(kindData);
      kindLen++;
      $obj.children('.others').before($("<option>").attr('value',kindData).text(escapeHtml(kindData)));
    }
  }
}


//件数表示のリンクを調整
function addModeAttr()
{
  $('#objMaxMax').attr('href',createGetPara({'mode':-1}));
  $('#objMax10').attr('href',createGetPara({'mode':10}));
  $('#objMax30').attr('href',createGetPara({'mode':30}));
}

//各イベントの詳細項目を追加
function createDtl($obj, data)
{
  var key = ['category','start_date','end_date','description','schedule_description','contact','contact_phone_number','event_place','latitude','longitude','city'];
  var title = ['カテゴリ','開始日時','終了日時','詳細説明','スケジュール','連絡先','電話番号','開催場所','緯度','経度','開催都市'];

  //タイトルを追加
  var $eveObj = $("<li class='event'>").appendTo($obj);
  $eveObj.append($("<p class='event_name'>").text(data.event_name));

  //お気に入りボタンを追加
  var $star;
  if(!$.cookie(data.event_name))
  {
    $star = $("<img>").attr('name',data['event_name']).attr('src','img/star_not.png');
  }
  else
  {
    $star = $("<img>").attr('name',data['event_name']).attr('src','img/star_fave.png');
  }
  $star.on('click',function(){
    var title = $(this).attr('name');
    if(!$.cookie(title))
    {
      $(this).attr('src','img/star_fave.png');
      $.cookie(title, '1');
    }
    else
    {
      $(this).attr('src','img/star_not.png');
      $.removeCookie(title);
    }
  });

  $eveObj.append($("<span>").attr('class','faveWrap').append($star));
  
  //詳細情報を追加
  var $detailObj = $("<ul class='detail'>").appendTo($eveObj);

  for(var i=0; i<key.length; i++)
  {
    if(!data[key[i]])
    {
      continue;
    }
    $detailObj.append($("<li class='category'>")
                  .append($('<span>').attr('class','dtlTitle').text(title[i]))
                  .append($('<span>').attr('class','wrapDtl').text(data[key[i]]))
               );
  }
}


//GETパラメータを生成
function createGetPara(newVars)
{
  var getVars = getUrlVars();
  var getPara = "?";
  var key = ['mode','page','keyword','category'];

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


//エスケープ処理
function escapeHtml(str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/'/g, '&#39;');
    return str;
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


//文字列を検知
function search(word, category, data)
{
  if(category == 'faves')
  {
    if($.cookie(data['event_name']))
    {
      return 1;
    }
    return 0;
  }

  var str = data['event_name']+data['category']+data['start_date']+data['end_date']
            +data['description']+data['schedule_description']+data['contact']
            +data['contact_phone_number']+data['event_place']+data['latitude']
            +data['longitude']+data['city'];
  
  var regexpW = new RegExp(word);
  if(str.match(regexpW))
  {
    var regexpC = new RegExp(category)
    if(category == 'all' || data['category'].match(regexpC))
    {
      return 1;
    }
  }

  return 0;
}


//
function searchCnt(word, category, data)
{
  var hitData = [];
  for(var i=0; i<data.length; i++)
  {
    if(search(word, category, data[i]))
    {
      hitData.push(data[i]);
    }
  }

  return hitData;
}