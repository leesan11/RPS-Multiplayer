var config = {
    apiKey: "AIzaSyB_3b1Nv9SQsXslCKWeCpe4ZL0H5Grh0zk",
    authDomain: "rps-multiplayer-96b6d.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-96b6d.firebaseio.com",
    projectId: "rps-multiplayer-96b6d",
    storageBucket: "rps-multiplayer-96b6d.appspot.com",
    messagingSenderId: "654415546341"
  };
  firebase.initializeApp(config);
  var database=firebase.database();

//===============================================================================================================

//disable new round button at the beginning
$("#newRound").attr("disabled","disabled");
$(".button-choice").attr("disabled","disabled");

var name=prompt("What is your name?");
var thisPlayer=name;
var otherPlayer=name;
var thisPlayerScore=0;
//store player name and other player name as objects/children; give each player a ready=true and choice =false
database.ref(thisPlayer).set({
    choice:false,
    ready:false,
    playAgain:false,
    chat:false,
    score:0
});


//record choice RPS & record state of player
$("#userChoice").on("click",".button-choice",function(){
    database.ref(thisPlayer).update({
        choice:this.innerHTML,
        ready:true,
        playAgain:false
    });
});

//if both players are ready run RPS logic
database.ref().on("value",function(snapshot){
    s=snapshot.val();
    //get other player name
    for (var names in s){
        if(names!=thisPlayer){
            otherPlayer=names;
            $(".button-choice").removeAttr("disabled");
            $("#waitingForName").text(thisPlayer+ " vs "+otherPlayer);
        }
    }
    //if both players are ready run logic
    if(s[thisPlayer].ready && s[otherPlayer].ready){
        if((s[thisPlayer].choice=="rock"&&s[otherPlayer].choice=="paper")||(s[thisPlayer].choice=="scissor"&&s[otherPlayer].choice=="rock")||(s[thisPlayer].choice=="paper"&&s[otherPlayer].choice=="scissor")){
            $("#resultMessage").text("you lose");
        }
        else if(s[thisPlayer].choice==s[otherPlayer].choice){
            $("#resultMessage").text("tie");
        }
        else{
            $("#resultMessage").text("you win");
            thisPlayerScore+=1;
        }
        //change both players to ready false
        database.ref(thisPlayer).update({
            choice:false,
            ready:false,
            score:thisPlayerScore
        });
        //update score
        var t=setTimeout(function(){$("#score").text(s[thisPlayer].score +" : "+ s[otherPlayer].score);},1000);
        //disable buttons
        $(".button-choice").attr("disabled","disabled");
        $("#newRound").removeAttr("disabled");
    }
    else if((!s[thisPlayer].playAgain && s[otherPlayer].playAgain && !s[otherPlayer].choice && !s[thisPlayer].choice)){
        $("#resultMessage").text("Other Player wants to play again");
        
    }
    else if(s[thisPlayer].playAgain && s[otherPlayer].playAgain){
        $("#resultMessage").text("Next Round has started");
        $(".button-choice").removeAttr("disabled");
        //disable buttons
        $("#newRound").attr("disabled","disabled");
    }
    
    

});
 
//replay button
$("#newRound").on("click",function(){
    database.ref(thisPlayer).set({
        choice:false,
        ready:false,
        playAgain:true,
        chat:false
    });
});
//send chat message to firebase
$("#submitChat").on("click",function(){
    database.ref(thisPlayer).update({
        chat:$("#chatInput").val()
    });
    $("#messages").append(thisPlayer+": "+$("#chatInput").val()+"<br>");
    $("#chatInput").val("");
});

//show chat
var n=setTimeout(function(){
    database.ref(otherPlayer+"/chat").on("value",function(snape){
        if(snape.val()){
        $("#messages").append(otherPlayer+": "+snape.val()+"<br>");
        };
    });
},1000);
