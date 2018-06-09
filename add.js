$(function()
{
  
  $.getJSON("fukui-event.json", function(data)
  {
    
    $contents = $("#contents");

    var len = data.length; 
    for(var i=0; i<len; i++)
    {
      createDtl($contents, data[i]);
    }
    
  });
  
});

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

  if(!data.schedule_description)
  {
    $detailObj.children('.schedule_description').remove();
  }
}