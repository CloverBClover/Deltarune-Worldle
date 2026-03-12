let answer = null;
let attempts = 0;
let maxAttempts = 6;
let gameType = '';
let characterMode = '';
let selectionMode = '';
let characterSet = [];

function initGame(game, mode, selection) {
    gameType = game;
    characterMode = mode;
    selectionMode = selection;
    attempts = 0;

    // pick character set
    if(gameType === 'ut') characterSet = characterMode === 'main' ? ut_main_characters : ut_all_characters;
    else characterSet = characterMode === 'main' ? dr_main_characters : dr_all_characters;

    if(selectionMode === 'daily') {
        answer = getDailyCharacter(characterSet);
        if(localStorage.getItem(`${game}-${mode}-daily-guess`)) attempts=parseInt(localStorage.getItem(`${game}-${mode}-daily-guess`));
    } else answer = getRandomCharacter(characterSet);

    updateUI();
}

function getDailyCharacter(arr) {
    const today=new Date();
    const seed=today.getFullYear()*10000+(today.getMonth()+1)*100+today.getDate();
    return arr[seed%arr.length];
}

function getRandomCharacter(arr){return arr[Math.floor(Math.random()*arr.length)];}

document?.getElementById('submit-guess')?.addEventListener('click',()=>{
    const input=document.getElementById('guess-input');
    const guessName=input.value.trim();
    if(!guessName) return;
    const guess=characterSet.find(c=>c.Name.toLowerCase()===guessName.toLowerCase());
    if(!guess){alert('Character not found.'); return;}
    attempts++;
    if(selectionMode==='daily') localStorage.setItem(`${gameType}-${characterMode}-daily-guess`,attempts);
    const result=checkGuess(guess,answer,gameType);
    displayGuess(guess,result);
    if(guess.Name.toLowerCase()===answer.Name.toLowerCase()) endGame(true);
    else if(attempts>=maxAttempts) endGame(false);
    input.value='';
});

function checkGuess(guess,answer,gameType){
    const result={};
    const attrs=gameType==='ut'?['Name','Species','FirstSeen','Role','Gender','InDeltarune']:['Name','LightDark','Chapter','Role','Gender','InUndertale'];
    attrs.forEach(attr=>{
        const g=guess[attr]||'', a=answer[attr]||'';
        if(g.toLowerCase()===a.toLowerCase()) result[attr]='green';
        else if(Object.values(answer).some(v=>v.toLowerCase()===g.toLowerCase())) result[attr]='yellow';
        else if(attr==='FirstSeen'||attr==='Chapter') result[attr]=g<a?'up':'down';
        else result[attr]='gray';
    });
    return result;
}

function displayGuess(guess,result){
    const container=document.getElementById('attempts-container');
    const div=document.createElement('div'); div.className='attempt-row';
    for(let key in result){
        const span=document.createElement('span'); span.textContent=guess[key]||''; span.className=result[key]; div.appendChild(span);
    }
    container.appendChild(div);
}

function endGame(won){
    const res=document.getElementById('result-container');
    res.textContent=won?`You got it! ${answer.Name}`:`Out of turns! The answer was ${answer.Name}`;
    if(selectionMode==='random'){
        document.getElementById('new-random').style.display='inline-block';
        document.getElementById('new-random').onclick=()=>{
            answer=getRandomCharacter(characterSet); attempts=0;
            document.getElementById('attempts-container').innerHTML='';
            res.textContent='';
            document.getElementById('new-random').style.display='none';
        }
    }
}

function updateUI(){
    document.getElementById('attempts-container').innerHTML='';
    document.getElementById('result-container').innerHTML='';
    document.getElementById('new-random')?.style.display='none';
}
