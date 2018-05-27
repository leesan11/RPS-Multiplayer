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
//==============================try to implement object
var player={
    name: "",
    otherName:"",
    score: 0,
    clearPreviousNames: true,
    clearFirebaseOnConnect: function () {
        var connectionsRef = database.ref("/connections");
        var connectedRef = database.ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val()) {
                var con = connectionsRef.push(true);
                con.onDisconnect().remove();
            }
        });

        connectionsRef.on("value", function (snap) {
            if (snap.numChildren() == 1) {
                database.ref("players").set({});
                database.ref("/players/" + player.name).set({
                    choice: false,
                    ready: false,
                    playAgain: false,
                    chat: false,
                    score: 0
                });
            }
        });
    },
    getName: function () {
        $("#newRound").attr("disabled", "disabled");
        $(".button-choice").attr("disabled", "disabled");

        while (player.name == "" || player.name === "null") {
            player.name = prompt("What is your name?");
        }

        database.ref("/players/" + player.name).set({
            choice: false,
            ready: false,
            playAgain: false,
            chat: false,
            score: 0
        });
    },
    getNamesAll: function (){
        database.ref("players").on("value",function(snapshot){
            if(Object.keys(snapshot.val()).length==2&&player.clearPreviousNames){
                for (var names in snapshot.val()){
                    if(names!=player.name){
                        player.otherName=names;
                        $(".button-choice").removeAttr("disabled");
                        $("#waitingForName").text(player.name+ " vs "+player.otherName);
                        database.ref(player.otherName+"/chat").once("value",function(snape){
                            if(snape.val()){
                            $("#messages").append(player.otherName+": "+snape.val()+"<br>");
                            };
                        });
                        
                    }
                }
                
                player.clearPreviousNames=false;
                player.runRest()
            }
            
        });
    },
    runRest: function (){
        //record choice RPS & record state of player
        $("#userChoice").on("click", ".button-choice", function () {
            database.ref("players/" + player.name).update({
                choice: $(this).attr("id"),
                ready: true,
                playAgain: false
            });
        });

        //if both players are ready run RPS logic
        database.ref("players").on("value", function (snapshot) {
            s = snapshot.val();

            //if both players are ready run logic
            if (s[player.name].choice && s[player.otherName].choice) {
                if ((s[player.name].choice == "rock" && s[player.otherName].choice == "paper") || (s[player.name].choice == "scissor" && s[player.otherName].choice == "rock") || (s[player.name].choice == "paper" && s[player.otherName].choice == "scissor")) {
                    $("#resultMessage").text("you lose");
                }
                else if (s[player.name].choice == s[player.otherName].choice) {
                    $("#resultMessage").text("tie");
                }
                else {
                    $("#resultMessage").text("you win");
                    player.score += 1;
                }
                //change both players to ready false
                database.ref("players/" + player.name).update({
                    choice: false,
                    ready: false,
                    score: player.score
                });
                //update score

                //disable buttons
                $(".button-choice").attr("disabled", "disabled");
                $("#newRound").removeAttr("disabled");
            }
            else if ((!s[player.name].playAgain && s[player.otherName].playAgain && !s[player.otherName].choice && !s[player.name].choice)) {
                $("#resultMessage").text("Other Player wants to play again");

            }
            else if (s[player.name].playAgain && s[player.otherName].playAgain) {
                $("#resultMessage").text("Next Round has started");
                $(".button-choice").removeAttr("disabled");
                //disable buttons
                $("#newRound").attr("disabled", "disabled");
            }

        });

        //update score
        database.ref("players").on("value", function (scoresnap) {

            $("#score").text(player.score + " : " + scoresnap.val()[player.otherName].score);
        })

        //replay button
        $("#newRound").on("click", function () {
            database.ref("players/" + player.name).set({
                choice: false,
                ready: false,
                playAgain: true,
                chat: false,
                score: player.score
            });
        });
        //send chat message to firebase
        $("#submitChat").on("click", function () {
            database.ref("players/" + player.name).update({
                chat: $("#chatInput").val()
            });
            $("#messages").append(player.name + ": " + $("#chatInput").val() + "<br>");
            $("#chatInput").val("");
        });
        //update chat messages
        database.ref("players/" + player.otherName + "/chat").on("value", function (snapchat) {
            if (snapchat.val()) {
                $("#messages").append(player.otherName + ": " + snapchat.val() + "<br>");
            }
        })
    }


}

player.clearFirebaseOnConnect();
player.getName();
player.getNamesAll();













