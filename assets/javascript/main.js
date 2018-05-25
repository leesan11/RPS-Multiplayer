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
  //set array for rock paper scissors
 
  var sarr=["rock","paper","scissors"];

  //send name with choice to firebase in an array like so: [name,choice];
  //ask for name
  var name=prompt("what is your name?");
  //get choice
  //create object with name
  database.ref(name).set({
      "choice":false,
      ready:false,
      chat:""
    });

  $("#userChoice").on("click",".button-choice",function(){
      $("#resultMessage").text("Waiting for other player to choose");
      database.ref(name).update({ready:false});
      database.ref(name).update({choice:this.innerHTML});
  })
//check if there is choice key in both objects for both players

database.ref().on("value",function(snapshot){
    names =Object.keys(snapshot.val());
    
    if(name==names[0]){
        player=0;
        otherPlayer=1; 
    }
    else{
        player=1;
        otherPlayer=0;
    }
    //set names
    $("#players").text(names[player] +" Vs "+names[otherPlayer]);

    if(snapshot.val()[names[0]].choice&&snapshot.val()[names[1]].choice){
        var choices=[snapshot.val()[names[0]].choice,snapshot.val()[names[1]].choice];
        console.log(choices);
        //player 0 or 1
        
        console.log(player);
        //logic for player 0
        if(player==0){
            if((choices[0]=="rock"&&choices[1]=="paper")||(choices[0]=="paper"&&choices[1]=="scissors")||(choices[0]=="scissors"&&choices[1]=="rock")){
                $("#resultMessage").text("you lose");
            }
            else if(choices[0]==choices[1]){
                $("#resultMessage").text("tie");
            }
            else{
                $("#resultMessage").text("you win")
            }
        }
        //logic for player 1
        else if(player==1){
            if((choices[0]=="rock"&&choices[1]=="paper")||(choices[0]=="paper"&&choices[1]=="scissors")||(choices[0]=="scissors"&&choices[1]=="rock")){
                $("#resultMessage").text("you win");
            }
            else if(choices[0]==choices[1]){
                $("#resultMessage").text("tie");
            }
            else{
                $("#resultMessage").text("you lose")
            }

        }
    }
    else{
        $("#resultMessage").text("Waiting for other player...");
    }
    //check for round restart
    if(snapshot.val()[names[otherPlayer]].ready&&snapshot.val()[names[player]].ready){
        $("#resultMessage").text("New Round Go!");
    };

});
//mesaanging update
database.ref(name+"/chat").on("value",function(snapshot){
    //check for chat 
    $("#messages").append(names[player]+": "+snapshot.val()[names[player]].chat+ "<br>");

});



//new round on button click

$("#newRound").on("click",function(){
    //check if other player is ready
    $("#resultMessage").text("Waiting for other player response...");
    database.ref(name).update({ready:true});
    database.ref(name).update({choice:false});
});

//send chat messages
$("#submitChat").on("click",function(){
    database.ref(name).update({chat:$("#chatBox").val()});
})

