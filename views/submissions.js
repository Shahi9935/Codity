var codechefsubmissions = [];
var spojsubmissions = [];
var codeforcessubmissions = [];
var checkCodechef = true;
var checkSpoj = true;
var checkCodeforces = true;

function loadEverything(ccusername, spojusername, cfusername){
    checkCodechefUsername(ccusername,function(){
        if(!checkCodechef){
            ccusername = "";
        }
        checkSpojUsername(spojusername,function(){
            if(!checkSpoj){
                spojusername = "";
            }
            checkCodeforcesUsername(cfusername,function(){
                if(!checkCodeforces){
                    cfusername = "";
                }
                getCodechefSubmissions(ccusername,0,function(){
                    getSpojSubmissions(spojusername,0,function(){
                        getCodeforcesSubmissions(cfusername,function(){
                            displayEverything();
                        });
                    });
                });
            });
        });
    });
}

function checkCodechefUsername(username,callback){
    console.log("Codechef check " + username);
    $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent('https://codechef.com/users/') + username, function(data){

        var output = data.contents;
        var fake = output.search(/Could not find page you requested for/i);
        if(fake > 0){
          checkCodechef = false;
          callback();
          return;
        }else{
            callback();
        }
    }).fail(function(){
        checkCodechef = false;
        callback();
        return;
    });
}

function checkSpojUsername(username,callback){
    console.log("Spoj check " + username);
    $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent('https://spoj.com/users/') + username, function(data){
    var output = data.contents;
    var fake = output.search(/Become a true programming master/i);
    if(fake > 0){
        checkSpoj = false;
        callback();
      return;
    }else{
        callback();
    }
}).fail(function(){
    checkSpoj = false;
    callback();
    return;
});
}

function checkCodeforcesUsername(username,callback){
    console.log("Codeforces check " + username);
    $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent('https://codeforces.com/api/user.status?handle=') + username, function(data){
    var output = JSON.parse(data.contents);
    if(output.status=="FAILED"){
       checkCodeforces = false;
       callback();
      return;
    }else{
        callback();
    }
    }).fail(function(){
        checkCodeforces = false;
        callback();
        return;
    });
}

function getCodechefSubmissions(username,page,callback){
    console.log("Codechef Submissions " + username + " " + page);
    
    if(username.length==0){
    callback();
    return ;
    }
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
          var obj ={};
          var temp1 = output.content.substring(indices[i],indices[i]+210);
          var temp2 = temp1.search(/<td >/i);
          var temp3 = temp1.search(/<\/td>/i);
          var time = temp1.substring(temp2+5,temp3);
          var time2 = time.substring(9,11);
          var time3 = time.substring(12,14);
          time = time.replaceAt(9,time3);
          time = new Date(parseInt(new Date(time.replaceAt(12,time2)).getTime())).toLocaleString();
          obj.time = time;
          temp2 = temp1.search(/'_blank'>/i);
          temp3 = temp1.search(/<\/a>/i);
          var code = temp1.substring(temp2+9,temp3);
          obj.code = code;
          obj.link = "https://www.codechef.com/problems/"+code;
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
          temp2 = temp1.search(/title='memo/i);
          if(temp2!=-1){
            result = "MLE";
          }
          obj.result = result;
          obj.host = "CODECHEF";
          codechefsubmissions.push(obj);
      }
        if(page==(parseInt(output.max_page)-1)){
            console.log(codechefsubmissions);
            
            callback();
        }else{
            getCodechefSubmissions(username,page+1,callback);
        }
      }
    }).fail(function(){
        callback();
    });
  }

  function getSpojSubmissions(username,page,callback){
    console.log("Spoj Submissions " + username + " " + page);
    if(username.length==0){
        callback();
        return ;
        }
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
        var obj ={};
          var temp1 = output.substring(indices[i],indices[i]+500);
          var temp2 = temp1.search(/<span title="/i) ;
          var temp3 = temp1.search(/<\/span>/i) ;
          var time = new Date(parseInt(new Date(temp1.substring(temp2+34,temp3)).getTime())).toLocaleString();
          obj.time = time;
          temp2 = temp1.search(/href="\/problems\//i) ;
          temp3 = temp1.search(/\/"/i) ;
          var code = temp1.substring(temp2+16,temp3);
          obj.code = code;
          obj.link = "https://www.spoj.com/problems/"+code;
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
          if(result==""){
              result="MLE";
          }
          obj.result = result;
          obj.host = "SPOJ";
          spojsubmissions.push(obj);
        }
       if(flag==1){
        console.log(spojsubmissions);
            
            callback();   
       }else{
           getSpojSubmissions(username,page+1,callback);
       }
  }).fail(function(){
    callback();
});
}

function getCodeforcesSubmissions(username,callback){
    console.log("Codeforces Submissions " + username);
    if(username.length==0){
        callback();
        return ;
        }
    var url = "https://codeforces.com/api/user.status?handle=" + username + "&from=1&count=100000";
    $("#codeforces-submission-info").html("");
    $("#codeforces-submission-info").append('<h4>Recent Submissions</h4><br><div class="row" style="border-bottom:2px solid black"><div class="col-4">Date/Time</div><div class="col-4">Problem</div><div class="col-4">Result</div></div>');
    $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent(url), function(data){
      var newJson = data.contents.replace(/\/"/g, '"');
      var x= JSON.parse(newJson);
      x.result.forEach(element=>{
        var obj={};
        var link = "https://www.codeforces.com/problemset/problem/" + element.problem.contestId + "/" + element.problem.index;
        obj.link = link;
        var name = element.problem.name;
        obj.code = name;
        var ts= new Date(element.creationTimeSeconds*1000);
        var time = ts.toLocaleString();
        obj.time = time;
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
        if(element.verdict.startsWith("M")){
            result = "MLE";
        }
        if(element.verdict.startsWith("O")){
          result = "AC";
        }
        obj.result = result;
        obj.host = "CODEFORCES";
        codeforcessubmissions.push(obj);
      });
      console.log(codeforcessubmissions);
      callback();
  }).fail(function(){
    callback();
});
  }

function displayEverything(){
    var submissions = [];
    submissions = submissions.concat(codechefsubmissions).concat(spojsubmissions).concat(codeforcessubmissions);
    submissions.sort(function(a,b){
        return new Date(b.time) - new Date(a.time);
      });
    console.log(submissions);
    $("#loadingAnimation").hide();
    var ac=0,wa=0,tle=0,rte=0,mle=0,ce=0,others=0,total=0,pa=0;
    submissions.forEach(element=>{
        switch(element.result){
            case "AC":
            ac=ac+1;
            break;
            case "WA":
            wa=wa+1;
            break;
            case "TLE":
            tle=tle+1;
            break;
            case "RTE":
            rte=rte+1;
            break;
            case "CE":
            ce=ce+1;
            break;
            case "MLE":
            mle=mle+1;
            break;
            default:
            if(element.result.startsWith("AC")){
                pa=pa+1;
            }else{
            others=others+1;
            }
            break;
        }
        total = total+1;
        var icon = '<div class="col-1">' + '<a target="_blank" href="https://www.' + element.host.toLowerCase() + '.com">' + '<img class="img img-fluid" style="height:50px" src="../images/' + element.host + '.png' + '"></a>' + '</div>';
        var time = '<div class="col-3" style="padding-top:12px">' + element.time + '</div>';
        var name = '<div class="col-7" style="padding-top:12px">' + '<a target="_blank" href="' + element.link + '">' + element.code + '</a></div>';
        var result = '<div class="col-1" style="padding-top:12px">' + element.result + '</div>';
        $("#submissions").append('<div class="row" style="border-bottom:1px solid grey">' + icon + name + time + result + '</div>')
        });
        $("#chartContainer").show();

        CanvasJS.addColorSet("customColorSet",
                [
                    "#3CB371",
                    "#90EE90",
                    "#F25C5C",
                    "#E6F72A",
                    "#B83BDD",
                    "#6331ED",
                    "#847B7B",
                    "#E5A742"
                ]);
        var chart = new CanvasJS.Chart("chartContainer", {
            colorSet: "customColorSet",
            animationEnabled: true,
            title: {
                text: "Acceptance Pie Chart"
            },
            data: [{
                type: "pie",
                startAngle: 270,
                yValueFormatString: "##0.00\"%\"",
                indexLabel: "{label} {y}",
                toolTipContent: "{label} {count} ({y})",
                dataPoints: [
                    {y: (ac/total)*100, label: "Accepted", count: ac},
                    {y: (pa/total)*100, label: "Partially Accepted", count: pa},
                    {y: (wa/total)*100, label: "Wrong Answer", count: wa},
                    {y: (tle/total)*100, label: "Time Limit Exceeded", count: tle},
                    {y: (rte/total)*100, label: "Run-Time Error", count: rte},
                    {y: (mle/total)*100, label: "Memory Limit Exceeded", count: mle},
                    {y: (ce/total)*100, label: "Compilation Error", count: ce},
                    {y: (others/total)*100, label: "Others", count: others}
                ]
            }]
        });
        chart.render();
}

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
  }