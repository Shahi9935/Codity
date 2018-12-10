$("#codechef-button").on("click",()=>{
var username = $("#codechef-username").val().trim();
$("#codechef-info").html("");
if(username.length==0){
    alert("Field cannot be empty");
    return;
}
$("#codechef-button").hide();
$("#codechef-wait").show();
$.getJSON('http://api.allorigins.ml/get?url=' + encodeURIComponent('http://codechef.com/users/') + username + '&callback=?', function(data){
    
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
    $("#codechef-info").append("<div>Problem Solved : "+problemSolved+"</div>");
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
});
});

$("#spoj-button").on("click",()=>{
  var username = $("#spoj-username").val().trim();
  if(username.length==0){
      alert("Field cannot be empty");
      return;
  }
  $.getJSON('http://api.allorigins.ml/get?url=' + encodeURIComponent('http://spoj.com/users/') + username + '&callback=?', function(data){
      $("#spoj-info").html(data.contents);
  });
  });