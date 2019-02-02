var codeforces = ["NONE","NONE","binary search","bitmasks","NONE","brute force","combinatorics","NONE","data structures","dfs and similar","dsu","divide and conquer","dp","games","geometry","graphs","graph matchings","greedy","hashing","NONE","implementation","math","number theory","probabilities","shortest paths","sortings","strings","trees","two pointers"]
var spoj = ["array","backtracking","binary-search","bitmasks","bfs","brute-force","combinatorics","convex-hull","data-structure-1","dfs","disjoint-set-2","divide-and-conquer","dynamic-programming","game-theory-1","geometry","graph","graph-coloring","greedy","hash-table","heap","logic","list","math","number-theory","probability-theory","shortest-path","sorting","string-matching","tree","sliding-window-1"]
var codechef = ["array","backtracking","binary-search","bitmasking","bfs","bruteforce","combinatorics","convex-hull","data-structure","dfs","dsu","divide-and-conq","dynamic-programming","game-theory","geometry","graph","NONE","greedy","hashing","heap","implementation","NONE","math","number-theory","probability","shortest-path","sorting","string","tree","two-pointers"]
var codity = ["Array","Backtracking","Binary Search","Bitmask","Breadth First Search","Brute Force","Combinatorics","Convex hull","Data Structures","Depth First Search","Disjoint Set Union","Divide and Conquer","Dynamic Programming","Game Theory","Geometry","Graph","Graph Coloring","Greedy","Hashing","Heap","Implementation","Linked List","Math","Number Theory","Probability","Shortest Path","Sorting","String","Tree","Two Pointer"]
var selectele = document.getElementById("codity-categories");
var spojData = [], codechefData = [], codeforcesData = [], allData=[];
$(document).ready(function(){
    var num = 0;
    codity.forEach(element =>{
        $("#codity-categories").append('<option value="' + num.toString() + '">' + element + '</option>');
        num = num + 1;
    });
});

$("#findProblemButton").on("click",()=>{
    var index = selectele.value;
    spojData = [], codechefData = [], codeforcesData = [], allData=[];
    $("#findProblemButton").hide();
    $("#findProblemWait").show();
    $("#listOfProblems").html("");
    findSpojProblems(spoj[index],function(){
        findCodechefProblems(codechef[index],function(){
            findCodeforcesProblems(codeforces[index],function(){
                allData = allData.concat(spojData).concat(codechefData).concat(codeforcesData);
                shuffle(allData,function(){
                    $("#listOfProblems").append('<div class="row" style="width:100%;border-bottom:2px solid black"><div class="col-1">Site</div><div class="col-8">Name</div><div class="col-3">Users<i class="fa fa-arrow-up" style="margin-left:5px;cursor:pointer" onclick="sortAscending()"></i><i class="fa fa-arrow-down" style="margin-left:5px;cursor:pointer" onclick="sortDescending()"></i></div></div>');
                    allData.forEach(element=>{
                        var icon = '<div class="col-1">' + '<a target="_blank" href="https://www.' + element.host.toLowerCase() + '.com">' + '<img class="img img-fluid" style="height:50px" src="../images/' + element.host + '.png' + '"></a>' + '</div>';
                        var name = '<div class="col-8" style="padding-top:12px">' + '<a target="_blank" href="' + element.link + '">' + element.name + '</a></div>';
                        var users = '<div class="col-3" style="padding-top:12px">' + element.users + '</div>';
                        $("#listOfProblems").append('<div class="row" style="border-bottom:1px solid grey;width:100%">' + icon + name + users + '</div>');
                    });
                    $("#findProblemWait").hide();
                    $("#findProblemButton").show();
                });
            });
        });
    });
});

function findSpojProblems(tag,callback){
    if(tag=="NONE"){
            spojData=[];
            callback();
            return;
        }
    var obj = []
    var link = "https://www.spoj.com/problems/tag/"+tag;
    $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent(link), function(data){
    var output = data.contents;
    var regex = /align="left"/gi, result, indices = [],userSubmitted=[];
    while ( (result = regex.exec(output)) ) {
        indices.push(result.index);
    }
    regex = /See the best solutions/gi;
    while ( (result = regex.exec(output)) ) {
        userSubmitted.push(result.index);
    }
    var i = 0;
    for(i=0;i<indices.length;i++){
        obj.push({});
        var temp1 = output.substring(indices[i],indices[i]+100);
        var temp2 = temp1.search(/href/i);
        var temp3 = temp1.substring(temp2,temp2+70);
        var temp4 = temp3.search(/">/i);
        obj[i].link = "https://www.spoj.com" + temp1.substring(temp2+6,temp2+temp4);
        temp2 = temp3.search(/<\/a>/);
        obj[i].name = temp3.substring(temp4+2,temp2);
        temp1 = output.substring(userSubmitted[i],userSubmitted[i]+70);
        var temp2 = temp1.search(/<\/a>/i);
        obj[i].users = temp1.substring(25,temp2);
        obj[i].host = "SPOJ";
    }
    spojData=obj;
    callback();
}).fail(function(){
    callback();
});

}

function findCodechefProblems(tag,callback){
    if(tag=="NONE"){
        codechefData=[];
        callback();
        return;
    }
    var obj = [];
    var link = "https://www.codechef.com/get/tags/problems/"+tag;
    $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent(link), function(data){
    var newJson = data.contents.replace(/\/"/g, '"');
    var output = JSON.parse(newJson);
    var i;
    var j=0;
    for(i in output.all_problems){
        obj.push({});
        obj[j].link = "https://www.codechef.com/problems/" + output.all_problems[i].code;
        obj[j].name = output.all_problems[i].name;
        obj[j].users = output.all_problems[i].solved_by;
        obj[j].host = "CODECHEF";
        j+=1;
    }
    codechefData=obj;
    callback();
    }).fail(function(){
        callback();
    }); 
}

function findCodeforcesProblems(tag,callback){
    if(tag=="NONE"){
        codeforcesData=[];
        callback();
        return;
    }
    var obj = [];
    var link = "https://codeforces.com/api/problemset.problems?tags="+tag;
    $.getJSON('https://api.allorigins.ml/get?url=' + encodeURIComponent(link), function(data){
    var newJson = data.contents.replace(/\/"/g, '"');
    var output = JSON.parse(newJson);
    var i = 0;
    for(i=0;i<output.result.problems.length;i++){
        obj.push({});
        obj[i].link = "https://www.codeforces.com/problemset/problem/" + output.result.problems[i].contestId + "/" + output.result.problems[i].index;
        obj[i].name = output.result.problems[i].name;
        obj[i].users = output.result.problemStatistics[i].solvedCount;
        obj[i].host = "CODEFORCES";
    }
    codeforcesData=obj;
    callback();
    }).fail(function(){
        codeforcesData=[];
        callback();
    }); 
}

function shuffle(array,callback) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    allData = array;
    callback();
  }

  function sortAscending(){
    $("#listOfProblems").html("");
    $("#listOfProblems").append('<div class="row" style="width:100%;border-bottom:2px solid black"><div class="col-1">Site</div><div class="col-8">Name</div><div class="col-3">Users<i class="fa fa-arrow-up" style="margin-left:5px;cursor:pointer" onclick="sortAscending()"></i><i class="fa fa-arrow-down" style="margin-left:5px;cursor:pointer" onclick="sortDescending()"></i></div></div>');
    allData.sort(function(a, b){return a.users - b.users}); 
        allData.forEach(element=>{
            var icon = '<div class="col-1">' + '<a target="_blank" href="https://www.' + element.host.toLowerCase() + '.com">' + '<img class="img img-fluid" style="height:50px" src="images/' + element.host + '.png' + '"></a>' + '</div>';
            var name = '<div class="col-8" style="padding-top:12px">' + '<a target="_blank" href="' + element.link + '">' + element.name + '</a></div>';
            var users = '<div class="col-3" style="padding-top:12px">' + element.users + '</div>';
             $("#listOfProblems").append('<div class="row" style="border-bottom:1px solid grey;width:100%">' + icon + name + users + '</div>');
         });
  }

  function sortDescending(){
    $("#listOfProblems").html("");
    $("#listOfProblems").append('<div class="row" style="width:100%;border-bottom:2px solid black"><div class="col-1">Site</div><div class="col-8">Name</div><div class="col-3">Users<i class="fa fa-arrow-up" style="margin-left:5px;cursor:pointer" onclick="sortAscending()"></i><i class="fa fa-arrow-down" style="margin-left:5px;cursor:pointer" onclick="sortDescending()"></i></div></div>');
    allData.sort(function(a, b){return b.users - a.users});
        allData.forEach(element=>{
            var icon = '<div class="col-1">' + '<a target="_blank" href="https://www.' + element.host.toLowerCase() + '.com">' + '<img class="img img-fluid" style="height:50px" src="images/' + element.host + '.png' + '"></a>' + '</div>';
            var name = '<div class="col-8" style="padding-top:12px">' + '<a target="_blank" href="' + element.link + '">' + element.name + '</a></div>';
            var users = '<div class="col-3" style="padding-top:12px">' + element.users + '</div>';
             $("#listOfProblems").append('<div class="row" style="border-bottom:1px solid grey;width:100%">' + icon + name + users + '</div>');
         });
  }