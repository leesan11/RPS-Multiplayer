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


//===================================================clear object on connect

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
connectedRef.on("value", function(snap) {
  if (snap.val()) {
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});

connectionsRef.on("value", function(snap) {
  if(snap.numChildren()==1){
      database.ref("players").set({});
      database.ref("/players/"+name).set({
        choice:false,
        ready:false,
        playAgain:false,
        chat:false,
        score:0
    });
  }
});


//===============================================================================================================
$("#newRound").attr("disabled","disabled");
$(".button-choice").attr("disabled","disabled");

var name=prompt("What is your name?");
while(name==""||name==="null"){
    name=prompt("What is your name?");
}
var player."name"=name;
var thisPlayerReady=false;
var thisPlayerChoice=false;
var thisPlayerPlayAgain=false;
var otherPlayer;
var thisPlayerScore=0;
database.ref("/players/"+name).set({
    choice:false,
    ready:false,
    playAgain:false,
    chat:false,
    score:0
});

var done=0;
//count number of players online //.val() is the object that contains all
database.ref("players").on("value",function(snapshot){
    if(Object.keys(snapshot.val()).length==2&&done==0){
        for (var names in snapshot.val()){
            if(names!=thisPlayer){
                otherPlayer=names;
                $(".button-choice").removeAttr("disabled");
                $("#waitingForName").text(thisPlayer+ " vs "+otherPlayer);
                database.ref(otherPlayer+"/chat").once("value",function(snape){
                    if(snape.val()){
                    $("#messages").append(otherPlayer+": "+snape.val()+"<br>");
                    };
                });
                
            }
        }
        
        done=1;
        console.log("done: "+done)
        run();
    }
    
});

function run(){
    //record choice RPS & record state of player
$("#userChoice").on("click",".button-choice",function(){
    database.ref("players/"+thisPlayer).update({
        choice:$(this).attr("id"),
        ready:true,
        playAgain:false
    });
});

//if both players are ready run RPS logic
database.ref("players").on("value",function(snapshot){
    s=snapshot.val();
    
    //if both players are ready run logic
    if(s[thisPlayer].choice && s[otherPlayer].choice){
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
        database.ref("players/"+thisPlayer).update({
            choice:false,
            ready:false,
            score:thisPlayerScore
        });
        //update score
        
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

//update score
database.ref("players").on("value",function(scoresnap){
    
    $("#score").text(thisPlayerScore +" : "+ scoresnap.val()[otherPlayer].score);
})

//replay button
$("#newRound").on("click",function(){
    database.ref("players/"+thisPlayer).set({
        choice:false,
        ready:false,
        playAgain:true,
        chat:false,
        score:thisPlayerScore
    });
});
//send chat message to firebase
$("#submitChat").on("click",function(){
    database.ref("players/"+thisPlayer).update({
        chat:$("#chatInput").val()
    });
    $("#messages").append(thisPlayer+": "+$("#chatInput").val()+"<br>");
    $("#chatInput").val("");
});
//update chat messages
database.ref("players/"+otherPlayer+"/chat").on("value",function(snapchat){
    if(snapchat.val()){
    $("#messages").append(otherPlayer+": "+snapchat.val()+"<br>");
    }
})
}











