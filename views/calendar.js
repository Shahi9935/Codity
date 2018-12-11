$(document).ready(function(){
  var d = new Date();
  var start = "&start__gt="+d.toISOString();
  var year = d.getFullYear();
  var month = d.getMonth();
  var date = d.getDate();
  var l = getLaterDate(year,month+1,date);
  var end = "&start__lt="+l.toISOString();
  var link = 'https://clist.by/api/v1/json/contest/?username=stwatbyshahi&api_key=34295086f175bc17d7ecdf2922a5d1d0b602783a&limit=1000&order_by=start&resource__in=1,2,63,73,26'+start+end
  console.log(link);
  $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent(link), function(data){
    var newJson = data.contents.replace(/\/"/g, '"');
    var x= JSON.parse(newJson);
    var upcomingContests = [];
    upcomingContests = createArrayforContests(x);
    upcomingContests.forEach(element =>{
      var icon = '<div class="col-sm-1">' + '<a target="_blank" href="https://www.' + element.host.toLowerCase() + '.com">' + '<img class="img img-fluid" style="height:50px" src="images/' + element.host + '.png' + '"></a>' + '</div>';
      var name = '<div class="col-sm-7" style="padding-top:12px">' + '<a target="_blank" href="' + element.link + '">' + element.name + '</a></div>';
      var start = '<div class="col-sm-2" style="padding-top:3px">' + element.start + '</div>';
      var duration = '<div class="col-sm-2" style="padding-top:12px">' + element.duration + '</div>';
      $("#upcoming-contests").append('<div class="row" id="contest" style="border-bottom:1px dashed grey;padding-top:15px;height:80px">' + icon + name + start + duration + '</div>');
    });
  });

  d = new Date();
  start = "&end__gt="+d.toISOString();
  end = "&start__lt="+d.toISOString();
  link = 'https://clist.by/api/v1/json/contest/?username=stwatbyshahi&api_key=34295086f175bc17d7ecdf2922a5d1d0b602783a&limit=1000&order_by=start&resource__in=1,2,63,73,26' + start + end;
  console.log(link);
  $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent(link), function(data){
    var newJson = data.contents.replace(/\/"/g, '"');
    var x= JSON.parse(newJson);
    var runningContests = [];
    runningContests = createArrayforContests(x);
    runningContests.forEach(element =>{
      var icon = '<div class="col-sm-1">' + '<a target="_blank" href="https://www.' + element.host.toLowerCase() + '.com">' + '<img class="img img-fluid" style="height:50px" src="images/' + element.host + '.png' + '"></a>' + '</div>';
      var name = '<div class="col-sm-7" style="padding-top:12px">' + '<a target="_blank" href="' + element.link + '">' + element.name + '</a></div>';
      var start = '<div class="col-sm-2" style="padding-top:3px">' + element.start + '</div>';
      var duration = '<div class="col-sm-2" style="padding-top:3px">' + element.end + '</div>';
      $("#running-contests").append('<div class="row" id="contest" style="border-bottom:1px dashed grey;padding-top:15px;height:80px">' + icon + name + start + duration + '</div>');
    });
  });

});

function getLaterDate(y,m,d){
  y=y+1;
  return new Date(y,m-1,d,23,59,59,00);
}

function durationInSecondsUncalculator (str) {
  var sec_num = parseInt(str, 10);
  var years = Math.floor(sec_num / 31536000);
  var months = Math.floor((sec_num - (years * 31536000)) / 2592000);
  sec_num = (sec_num - (years * 31536000)) - (months * 2592000);
  var days = Math.floor(sec_num / 86400);
  sec_num = (sec_num - (days* 86400));
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  var str = "";
  if(years != 0){
    str = str + years.toString() + "y";
  }
  if(months != 0){
    str = str + months.toString() + "mo";
  }
  if(days != 0){
    str = str + days.toString() + "d";
  }
  if(hours != 0){
    str = str + hours.toString() + "h";
  }
  if(minutes != 0){
    str = str + minutes.toString() + "m";
  }
  if(seconds != 0){
    str = str + seconds.toString() + "s";
  }
  return str;
}

function createArrayforContests(x){
  var contests = [];
  x.objects.forEach(element =>{
    var obj = {};
    obj.name = element.event;
    obj.link = element.href;
    var startISO = element.start;
    obj.start = getDateStringFromISOString(startISO);
    obj.end = getDateStringFromISOString(element.end);
    obj.duration = durationInSecondsUncalculator(element.duration.toString());
    obj.host = element.resource.name.substring(0,element.resource.name.indexOf('.')).toUpperCase();
    contests.push(obj);
  });
  return contests;
}

function getDateStringFromISOString(startISO){
  var mydate = new Date(startISO);
    var ms = (parseInt(mydate.getMonth()+1).toString());
    var md = mydate.getDate();
    var mh = mydate.getHours();
    var mm = mydate.getMinutes();
    var mse = mydate.getSeconds();
    if(parseInt(mydate.getMonth())<9){
      ms = "0" + (parseInt(mydate.getMonth()+1).toString());
    }
    if(parseInt(mydate.getDate())<10){
      md = "0" + mydate.getDate();;
    }
    if(mh == "0"){
      mh = "00";
    }
    if(mm == "0"){
      mm = "00";
    }
    if(mse == "0"){
      mse = "00";
    }
    var str =md + '/' + ms+ '/' + mydate.getFullYear() + ' ' + mh + ':' + mm + ':' + mse;
    return str;
}