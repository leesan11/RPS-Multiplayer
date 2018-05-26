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
$("#newRound").attr("disabled","disabled");
$(".button-choice").attr("disabled","disabled");

var name=prompt("What is your name?");
while(name==""||name==="null"){
    name=prompt("What is your name?");
}
var thisPlayer=name;
var thisPlayerReady=false;
var thisPlayerChoice=false;
var thisPlayerPlayAgain=false;
var otherPlayer;
var thisPlayerScore=0;
//store player name and other player name as objects/children; give each player a ready=true and choice =false
database.ref(thisPlayer).set({
    choice:false,
    ready:false,
    playAgain:false,
    chat:false,
    score:0
});

//thisPlayer and other Player is now set
var numPlayers=0;
database.ref().on("child_added",function(snapshot){
    numPlayers++;
    if(numPlayers==2){
        for (var names in snapshot.val()){
            if(names!=thisPlayer){
                otherPlayer=names;
                //enable choice buttons
                $(".button-choice").removeAttr("disabled");
            }
        }
    }
});

//record choice RPS & record state of player
$("#userChoice").on("click",".button-choice",function(){
    thisPlayerChoice = $(this).attr("id");
    database.ref(thisPlayer).update({
        choice:$(this).attr("id"),
        ready:true,
        playAgain:false
    });
});
//if both are ready
database.ref(otherPlayer).child("ready").isEqualTo(true).on("value",function(snapshot){
    var s=snapshot.val();

    if(s.ready&&thisPlayerReady){
        //run logic
        if((thisPlayerChoice=="rock"&&s.choice=="paper")||(thisPlayerChoice=="scissor"&&s.choice=="rock")||(thisPlayerChoice=="paper"&&s.choice=="scissor")){
            $("#resultMessage").text("you lose");
        }
        else if(thisPlayerChoice==s.choice){
            $("#resultMessage").text("tie");
        }
        else{
            $("#resultMessage").text("you win");
            thisPlayerScore+=1;
        }
        //change both players to ready false and choice to false. Update score.
        database.ref(thisPlayer).update({
            choice:false,
            ready:false,
            score:thisPlayerScore
        });
        //disable buttons
        $(".button-choice").attr("disabled","disabled");
        $("#newRound").removeAttr("disabled");
    };
});

//replay button
$("#newRound").on("click",function(){
    database.ref(thisPlayer).update({
        choice:false,
        ready:false,
        playAgain:true,
    });
});

//check for playAgain

database.ref(otherPlayer).child("playAgain").isEqualTo(true).on("value",function(snapshot){
    s=snapshot.val();
    if(!thisPlayerPlayAgain){
        $("#resultMessage").text("Other Player wants to play again");
    }
    else if(thisPlayerPlayAgain){
        $("#resultMessage").text("Next Round has started");
        $(".button-choice").removeAttr("disabled");
        //disable buttons
        $("#newRound").attr("disabled","disabled");
    }
})

//send chat message
$("#submitChat").on("click",function(){
    database.ref(thisPlayer).update({
        chat:$("#chatInput").val()
    });
    $("#messages").append(thisPlayer+": "+$("#chatInput").val()+"<br>");
    $("#chatInput").val("");
});

//check for chat messages from other player
database.ref(otherPlayer).child("chat").on("value",function(snapshot){
    var s=snapshot.val();
    if(s.chat){
        $("#messages").append(s.chat+": "+$("#chatInput").val()+"<br>");
    }
})
