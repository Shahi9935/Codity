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
  $("#spoj-submission-info").html("");
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
    getSpojSubmissions(username,0);
  });
});

$("#codeforces-button").on("click",()=>{
  var username = $("#codeforces-username").val().trim();
  $("#codeforces-info").html("");
  $("#codeforces-submission-info").html("");
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
      getCodeforcesSubmissions(username);
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
          result = "RTE";
        }
        temp2 = temp1.search(/title='acc/i);
        if(temp2!=-1){
          result = "AC";
        }
        $("#codechef-submission-info").append('<div class="row" style="border-bottom:1px dashed black;padding:10px"><div class="col-4">' + time + '</div><div class="col-4"><a target="_blank" href="https://www.codechef.com/problems/' + code + '">' + code + '</a></div><div class="col-4">' + result + '</div></div>');
    }
      if(page==0){
        $("#codechef-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;"></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;cursor:pointer" onclick=getCodechefSubmissions("' + username + '",' + (page+1) + ')></i></center></div></div>');
      }else if(page==(parseInt(output.max_page)-1)){
        $("#codechef-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;cursor:pointer" onclick=getCodechefSubmissions("' + username + '",' + (page-1) + ')></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;"></i></center></div></div>');
      }else{
      $("#codechef-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;cursor:pointer" onclick=getCodechefSubmissions("' + username + '",' + (page-1) + ')></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;cursor:pointer" onclick=getCodechefSubmissions("' + username + '",' + (page+1) + ')></i></center></div></div>');
      }
      if((parseInt(output.max_page)==1)){
        $("#codechef-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;"></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;"></i></center></div></div>');
      }
    }
  });
}

function getSpojSubmissions(username,page){
  var url = "https://www.spoj.com/status/" + username + "/all/start=" + (page*20).toString(); 
  $("#spoj-submission-info").html("");
  $("#spoj-submission-info").append('<h4>Recent Submissions</h4><br><div class="row" style="border-bottom:2px solid black"><div class="col-4">Date/Time</div><div class="col-4">Problem</div><div class="col-4">Result</div></div>');
  $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent(url), function(data){
    var output = data.contents;
    var regex = /<tr class="kol/gi, result, indices = [];
      while ( (result = regex.exec(output)) ) {
          indices.push(result.index);
      }
      var flag=0;
      if(indices.length<20||page==5){
        flag=1;
      }
      for(i=0;i<indices.length;i++){
        var temp1 = output.substring(indices[i],indices[i]+500);
        var temp2 = temp1.search(/<span title="/i) ;
        var temp3 = temp1.search(/<\/span>/i) ;
        var time = temp1.substring(temp2+34,temp3);
        temp2 = temp1.search(/href="\/problems\//i) ;
        temp3 = temp1.search(/\/"/i) ;
        var code = temp1.substring(temp2+16,temp3);
        var result="";
        temp2 = temp1.search(/status="/i) ;
        temp3 = temp1.search(/" final/i) ;
        var status = parseInt(temp1.substring(temp2+8,temp3));
        if(status==11){
          result = "CE";
        }
        if(status==14){
          result = "WA";
        }
        if(status==13){
          result = "TLE";
        }
        if(status==15){
          result = "AC";
        }
        if(status==12){
          result = "RTE";
        }
        $("#spoj-submission-info").append('<div class="row" style="border-bottom:1px dashed black;padding:10px"><div class="col-4">' + time + '</div><div class="col-4"><a target="_blank" href="https://www.spoj.com/problems/' + code + '">' + code + '</a></div><div class="col-4">' + result + '</div></div>');
      }
      if(page==0 && flag==0){
        $("#spoj-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;"></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;cursor:pointer" onclick=getSpojSubmissions("' + username + '",' + (page+1) + ')></i></center></div></div>');
      }else if(flag==1 && page>0){
        $("#spoj-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;cursor:pointer" onclick=getSpojSubmissions("' + username + '",' + (page-1) + ')></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;"></i></center></div></div>');
      }else{
        if(!(page==0 && flag==1)){
      $("#spoj-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;cursor:pointer" onclick=getSpojSubmissions("' + username + '",' + (page-1) + ')></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;cursor:pointer" onclick=getSpojSubmissions("' + username + '",' + (page+1) + ')></i></center></div></div>');
        }
      }
      if(page==0&&flag==1){
        $("#spoj-submission-info").append('<div class="row" style="width:100%;border-top:1px solid grey;padding:10px;"><div class="col-5"><center><i class="fa fa-angle-left" style="font-size:20px;float:left;"></i></center></div><div class="col-2"><center>' + (page+1) + '</center></div><div class="col-5"><center><i class="fa fa-angle-right col-1" style="font-size:20px;float:right;"></i></center></div></div>');
      }
});
}

function getCodeforcesSubmissions(username){
  var url = "https://codeforces.com/api/user.status?handle=" + username + "&from=1&count=100000";
  $("#codeforces-submission-info").html("");
  $("#codeforces-submission-info").append('<h4>Recent Submissions</h4><br><div class="row" style="border-bottom:2px solid black"><div class="col-4">Date/Time</div><div class="col-4">Problem</div><div class="col-4">Result</div></div>');
  $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent(url), function(data){
    var newJson = data.contents.replace(/\/"/g, '"');
    var x= JSON.parse(newJson);
    x.result.forEach(element=>{
      var link = "https://www.codeforces.com/problemset/problem/" + element.problem.contestId + "/" + element.problem.index;
      var name = element.problem.name;
      var ts= new Date(element.creationTimeSeconds*1000);
      var time = ts.toLocaleString();
      var result = "";
      if(element.verdict.startsWith("W")){
          result = "WA";
      }
      if(element.verdict.startsWith("T")){
        result = "TLE";
      }
      if(element.verdict.startsWith("R")){
        result = "RTE";
      }
      if(element.verdict.startsWith("C")){
        result = "CE";
      }
      if(element.verdict.startsWith("O")){
        result = "AC";
      }
      
      $("#codeforces-submission-info").append('<div class="row" style="border-bottom:1px dashed black;padding:10px"><div class="col-4">' + time + '</div><div class="col-4"><a target="_blank" href="' + link + '">' + name + '</a></div><div class="col-4">' + result + '</div></div>');
    });
    
});
}