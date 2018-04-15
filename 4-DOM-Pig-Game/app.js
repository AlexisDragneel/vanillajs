/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, gamePlaying;

init();

//dice = Math.floor(Math.random()*6) + 1;
//console.log(dice);

//document.querySelector(`div#current-${activePlayer}`).textContent = dice
//document.querySelector(`div#current-${activePlayer}`).innerHTML = '<em>'+dice+'</em>';


//var x = document.querySelector('#score-0').textContent;

/////////////////////////game functionality
document.querySelector('.btn-roll').addEventListener('click',function() {
    if(gamePlaying){
        // radom number
        var dice = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;
        var sixInRow = 0;

        // display the result
        var diceDOM = document.querySelector('.dice'); 
        diceDOM.style.display = 'block';
        diceDOM.src = `dice-${dice}.png`
        var dice2DOM = document.querySelector('.dice2'); 
        dice2DOM.style.display = 'block';
        dice2DOM.src = `dice-${dice2}.png`
        // update the round score If the rolled number was not 1
        function addScore(){
            roundScore += dice;
            roundScore += dice2;
            document.querySelector(`div#current-${activePlayer}`).textContent = roundScore;
        }

        if(dice !== 1 && dice2 !== 1){
            if(dice === 6 || dice2 === 6){
                sixInRow++;
                if(sixInRow<3){
                    addScore();
                }else{
                    document.getElementById(`score-${activePlayer}`).textContent = '0';
                    document.getElementById(`current-${activePlayer}`).textContent = '0';
                    nextPlayer();
                }
            }else{
                sixInRow=0;
                addScore();
            }
        }else{
            //Next player
            //document.querySelector(`.player-${activePlayer}-panel`).classList.remove('active');
            nextPlayer();
            }
        }
    });

document.querySelector('.btn-hold').addEventListener('click', function(){
    if(gamePlaying){
        // Add Current score to global score
        scores[activePlayer] += roundScore;

        // Update the UI 
        document.querySelector(`#score-${activePlayer}`).textContent = scores[activePlayer];
        
        // Check if player won the game
        var winning_score = document.getElementById('winning-score').value === '' ? 100 : document.getElementById('winning-score').value;  
        if(scores[activePlayer]>=winning_score){
            document.querySelector(`#name-${activePlayer}`).textContent='Winner!!!!';
            document.querySelector('.dice').style.display = 'none'; 
            document.querySelector('.dice2').style.display = 'none'; 
            document.querySelector(`.player-${activePlayer}-panel`).classList.add('winner');
            document.querySelector(`.player-${activePlayer}-panel`).classList.remove('active');
            gamePlaying=false;
        }else{
            //next player
            nextPlayer();
        } 
    }    
});

function nextPlayer(){

    activePlayer = activePlayer === 0 ? 1 : 0;
    roundScore = 0;
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.player-0-panel').classList.toggle('active');
    //document.querySelector('.player-0-panel').classList.remove('active');
    //document.querySelector('.player-1-panel').classList.add('active');


    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';

}



//////////////new game
document.querySelector('.btn-new').addEventListener('click',init);


function init(){
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;

    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('winner');

    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
}


/*
YOUR 3 CHALLENGES
change the game to follow these rules


1. A player looses his ENTIRE score whe he rolls 6 in row. After that. it's the next player's 
turn. (Hint: Always save the previous dice roll in a separate variable);
2. Add an input field where players can set the winning score, so that they can change the 
predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a 
good oportunity to use google to figure this out)
3. Add anotherdice to the game, so that there two dices now. The player looses his current score
when one of them is a 1 (Hint: yo will need CSS position to second dice, so take a look at the CSS
code for the first one.)
 */































