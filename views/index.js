$("#codechef-button").on("click",()=>{
var username = $("#codechef-username").val().trim();
$("#codechef-info").html("");
$("#codechef-submission-info").html("");
if(username.length==0){
    alert("Field cannot be empty");
    return;
}
$("#codechef-button").hide();
$("#codechef-wait").show();
$.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent('https://codechef.com/users/') + username, function(data){
    
    var output = data.contents;
    var fake = output.search(/Could not find page you requested for/i);
    $("#codechef-wait").hide();
    $("#codechef-button").show();
    if(fake > 0){
      alert("No such username exists");
      $("#codechef-username").val('');
      return;
    }
    var flag = output.search(/<section class="rating-data-section problems-solved">/i);
    var temp1 = output.substring(flag,flag+200);
    var temp2 = temp1.search(/\(/i);
    var temp3 = temp1.search(/\)/i);
    var problemSolved = temp1.substring(temp2+1,temp3);
    $("#codechef-info").append("<div>Problems Solved : "+problemSolved+"</div>");
    flag = output.search(/<a href="\/ratings\/all"><strong>/i);
    temp1 = output.substring(flag,flag+200);
    temp2 = temp1.search(/g>/i);
    temp3 = temp1.search(/<\/s/i);
    var globalRank = temp1.substring(temp2+2,temp3);
    $("#codechef-info").append("<div>Global Rank : "+globalRank+"</div>");
    flag = output.search(/data: \[/i);
    temp1 = output.substring(flag,flag+800);
    temp2 = temp1.search(/true}/i);
    temp3 = temp1.search(/{name/i);
    var jsonString = temp1.substring(temp3,temp2+5);
    var newJson = jsonString.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
    newJson = newJson.replace(/'/g, '"');
    var regex = /"y"/gi, result, indices = [];
    while ( (result = regex.exec(newJson)) ) {
        indices.push(result.index);
    }
    var regex2 = /,"color"/gi, result2, indices2 = [];
    while ( (result2 = regex2.exec(newJson)) ) {
        indices2.push(result2.index);
    }
    var totalProblems = 0;
    for(var i = 0;i<indices.length;i++){
      totalProblems += parseInt(newJson.substring(indices[i]+4,indices2[i]));
    }
    flag = newJson.search(/"name":"solutions_accepted","y":/i);
    var acceptedSolutions = 0;
    if(flag>0){
      temp1 = newJson.substring(flag,flag+50);
      temp2 = temp1.search(/,"color/i);
      acceptedSolutions = parseInt(temp1.substring(32,temp2));
    }
    var accuracy = ((acceptedSolutions/totalProblems)*100).toFixed(2);
    if(totalProblems == 0){
      accuracy = (0).toFixed(2);
    }
    $("#codechef-info").append("<div>Accuracy : "+accuracy+"</div>");
    getCodechefSubmissions(username,0);
});
});

$("#spoj-button").on("click",()=>{
  var username = $("#spoj-username").val().trim();
  $("#spoj-info").html("");
  if(username.length==0){
      alert("Field cannot be empty");
      return;
  }
  $("#spoj-button").hide();
  $("#spoj-wait").show();
  $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent('https://spoj.com/users/') + username, function(data){
    var output = data.contents;
    var fake = output.search(/Become a true programming master/i);
    $("#spoj-wait").hide();
    $("#spoj-button").show();
    if(fake > 0){
      alert("No such username exists");
      $("#spoj-username").val('');
      return;
    }
    var flag = output.search(/Problems solved/i);
    var temp1 = output.substring(flag,flag+200);
    var temp2 = temp1.search(/<dd>/i);
    var temp3 = temp1.search(/<\/dd>/i);
    var problemSolved = temp1.substring(temp2+4,temp3);
    $("#spoj-info").append("<div>Problems Solved : "+problemSolved+"</div>");
    flag = output.search(/World Rank: /i);
    temp1 = output.substring(flag,flag+30);
    temp2 = temp1.search(/#/i);
    temp3 = temp1.search(/\(/i);
    var worldRank = temp1.substring(temp2+1,temp3-1);
    $("#spoj-info").append("<div>World Rank : "+worldRank+"</div>");
    flag = output.search(/'Submissions'/i);
    temp1 = output.substring(flag,flag+30);
    temp2 = temp1.search(/', /i);
    var temp4 = temp1.substring(temp2+2,temp2+10);
    temp3 = temp4.search(/,/i);
    var acceptedSolutions = 0;
    acceptedSolutions = parseInt(temp4.substring(0,temp3));
    flag = output.search(/Solutions submitted/i);
    temp1 = output.substring(flag,flag+200);
    temp2 = temp1.search(/<dd>/i);
    temp3 = temp1.search(/<\/dd>/i);
    totalProblems = parseInt(temp1.substring(temp2+4,temp3));
    var accuracy = ((acceptedSolutions/totalProblems)*100).toFixed(2);
    if(totalProblems == 0){
      accuracy = (0).toFixed(2);
    }
    $("#spoj-info").append("<div>Accuracy : "+accuracy+"</div>");
  });
});

$("#codeforces-button").on("click",()=>{
  var username = $("#codeforces-username").val().trim();
  $("#codeforces-info").html("");
  if(username.length==0){
      alert("Field cannot be empty");
      return;
  }
  $("#codeforces-button").hide();
  $("#codeforces-wait").show();
  $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent('https://codeforces.com/api/user.status?handle=') + username, function(data){
    var output = JSON.parse(data.contents);
    if(output.status=="FAILED"){
      alert("There was some error.");
      $("#codeforces-wait").hide();
      $("#codeforces-button").show();
      $("#codeforces-username").val('');
      return;
    }
    var totalProblems = output.result.length;
    var acceptedSolutions = 0;
    output.result.forEach(element => {
      if(element.verdict=="OK"){
        acceptedSolutions+=1;
      }
    });
    
    $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent('https://codeforces.com/api/user.rating?handle=') + username, function(data){
      $("#codeforces-wait").hide();
      $("#codeforces-button").show();
      output = JSON.parse(data.contents);
      var rating = output.result[output.result.length-1].newRating;
      $("#codeforces-info").append("<div>Problems Solved : "+acceptedSolutions+"</div>");
      $("#codeforces-info").append("<div>Current Rating : "+rating+"</div>");
      var accuracy = ((acceptedSolutions/totalProblems)*100).toFixed(2);
      if(totalProblems == 0){
        accuracy = (0).toFixed(2);
      }
      $("#codeforces-info").append("<div>Accuracy : "+accuracy+"</div>");
    });


});
});

function getCodechefSubmissions(username,page){
  var url = "https://www.codechef.com/recent/user";
  var params="?user_handle=" + username + "&page=" + page;
  $("#codechef-submission-info").html("");
  $("#codechef-submission-info").append('<h4>Recent Submissions</h4><br><div class="row" style="border-bottom:2px solid black"><div class="col-4">Date/Time</div><div class="col-4">Problem</div><div class="col-4">Result</div></div>');
  $.ajax({
    url:'https://api.allorigins.ml/get?url='+encodeURIComponent(url + params),
    type:"GET",
    data:params,
    cache:false,
    timeout:1e4,
    dataType:"json",
    success:function(s){
      output = JSON.parse(s.contents);
      var regex = /<tr >/gi, result, indices = [];
      while ( (result = regex.exec(output.content)) ) {
          indices.push(result.index);
      }
      for(i=0;i<indices.length;i++){
        var temp1 = output.content.substring(indices[i],indices[i]+210);
        var temp2 = temp1.search(/<td >/i);
        var temp3 = temp1.search(/<\/td>/i);
        var time = temp1.substring(temp2+5,temp3);
        temp2 = temp1.search(/'_blank'>/i);
        temp3 = temp1.search(/<\/a>/i);
        var code = temp1.substring(temp2+9,temp3);
        var result = "";
        temp2 = temp1.search(/pts]/i);
        if(temp2!=-1){
          result = "AC";
          temp2 = temp1.search(/<br\/>/i);
          temp3 = temp1.search(/<br \/>/i);
          result = result + " [" + temp1.substring(temp2+5,temp3) + "pts]";
        }
        temp2 = temp1.search(/title='w/i);
        if(temp2!=-1){
          result = "WA";
        }
        temp2 = temp1.search(/title='time/i);
        if(temp2!=-1){
          result = "TLE";
        }
        temp2 = temp1.search(/title='c/i);
        if(temp2!=-1){
          result = "CE";
        }
        temp2 = temp1.search(/title='r/i);
        if(temp2!=-1){
          result = "RE";
        }
        temp2 = temp1.search(/title='acc/i);
        if(temp2!=-1){
          result = "AC";
        }
        console.log(time);
        console.log(code);
        console.log(result);
        $("#codechef-submission-info").append('<div class="row" style="border-bottom:1px dashed black;padding:10px"><div class="col-4">' + time + '</div><div class="col-4"><a target="_blank" href="https://www.codechef.com/problems/' + code + '">' + code + '</a></div><div class="col-4">' + result + '</div></div>');
    }
      if(page==0){
        $("#codechef-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;"></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;cursor:pointer" onclick=getCodechefSubmissions("' + username + '",' + (page+1) + ')></i></center></div></div>');
      }else if(page==(parseInt(output.max_page)-1)){
        $("#codechef-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;cursor:pointer" onclick=getCodechefSubmissions("' + username + '",' + (page-1) + ')></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;"></i></center></div></div>');
      }else{
      $("#codechef-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;cursor:pointer" onclick=getCodechefSubmissions("' + username + '",' + (page-1) + ')></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;cursor:pointer" onclick=getCodechefSubmissions("' + username + '",' + (page+1) + ')></i></center></div></div>');
      }
    }
  });
}