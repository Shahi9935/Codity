function initializeCodechef(username){
    username = username.trim();
    $("#codechef-info").html("");
    if(username.length==0){
        $("#codechef-info").append("<div>Problems Solved : -</div>");
        $("#codechef-info").append("<div>Global Rank : -</div>");
        $("#codechef-info").append("<div>Accuracy : -</div>");
        return;
    }
    $("#codechef-wait").show();
    $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent('https://codechef.com/users/') + username, function(data){
        
        var output = data.contents;
        var fake = output.search(/Could not find page you requested for/i);
        $("#codechef-wait").hide();
        if(fake > 0){
            $("#codechef-info").append("<div>Problems Solved : -</div>");
            $("#codechef-info").append("<div>Global Rank : -</div>");
            $("#codechef-info").append("<div>Accuracy : -</div>");  
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
    });
    }
    
    function initializeSpoj(username){
      username = username.trim();
      $("#spoj-info").html("");
      if(username.length==0){
        $("#spoj-info").append("<div>Problems Solved : -</div>");
        $("#spoj-info").append("<div>World Rank : -</div>");
        $("#spoj-info").append("<div>Accuracy : -</div>");
          return;
      }
      $("#spoj-wait").show();
      $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent('https://spoj.com/users/') + username, function(data){
        var output = data.contents;
        var fake = output.search(/Become a true programming master/i);
        $("#spoj-wait").hide();
        if(fake > 0){
            $("#spoj-info").append("<div>Problems Solved : -</div>");
            $("#spoj-info").append("<div>World Rank : -</div>");
            $("#spoj-info").append("<div>Accuracy : -</div>");
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
    }
    
    function initializeCodeforces(username){
      username = username.trim();
      $("#codeforces-info").html("");
      if(username.length==0){
        $("#spoj-info").append("<div>Problems Solved : -</div>");
        $("#spoj-info").append("<div>Current Rating : -</div>");
        $("#spoj-info").append("<div>Accuracy : -</div>");
          return;
      }
      $("#codeforces-wait").show();
      $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent('https://codeforces.com/api/user.status?handle=') + username, function(data){
        var output = JSON.parse(data.contents);
        if(output.status=="FAILED"){
            $("#spoj-info").append("<div>Problems Solved : -</div>");
            $("#spoj-info").append("<div>World Rank : -</div>");
            $("#spoj-info").append("<div>Accuracy : -</div>");
          $("#codeforces-wait").hide();
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
    }
    