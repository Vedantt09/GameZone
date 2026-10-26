
const games = [
  ["Neon Drift","Racing","🏎️","#ff7b39","#7928ca","4.9"],
  ["Monster Dash","Arcade","👾","#3824bb","#ff5fa2","4.8"],
  ["Brain Blitz","Puzzle","🧠","#ffdf50","#ff477e","4.8"],
  ["Turbo Rally","Racing","🏁","#05c8d6","#1f5cff","4.7"],
  ["Goal Legends","Sports","⚽","#9ee85d","#00a77d","4.7"],
  ["Fruit Ninja","Arcade","🍉","#ff745e","#e82770","4.8"],
  ["Pixel Jumper","Arcade","👾","#23254d","#6b50ff","4.6"],
  ["Bubble Pop","Casual","🫧","#70e6ff","#4b66ff","4.6"],
  ["Tic Tac Toe","Puzzle","❎","#fe5ec9","#6754ff","4.5"],
  ["Pool Masters","Sports","🎱","#0c9d86","#174a67","4.6"],
  ["Sky Surfer","Arcade","🛹","#42e2df","#3e67d7","4.5"],
  ["Candy Kingdom","Puzzle","🍬","#ff83bd","#ffb45b","4.7"],
  ["Street Racer","Racing","🏎️","#121c39","#f72585","4.8"],
  ["Penalty Shootout","Sports","🥅","#55d86a","#168f60","4.6"],
  ["Ninja Strike","Action","🥷","#252044","#f43f5e","4.7"],
  ["Farm Frenzy","Casual","🐣","#ffe57b","#71d76c","4.4"],
  ["Space Blaster","Action","🚀","#242d74","#00d6d6","4.8"],
  ["Chess Clash","Puzzle","♟️","#e9d7b6","#9c7853","4.7"],
  ["Skate City","Sports","🛼","#ffa7b9","#6658ff","4.5"],
  ["Jelly Jump","Arcade","🟣","#56e0c4","#695bff","4.6"],
  ["Mystery Manor","Puzzle","🕵️","#292d5e","#b25cff","4.7"],
  ["Ocean Rescue","Casual","🐬","#70edff","#1875d1","4.5"],
  ["Drift Kings","Racing","🚘","#f8a51b","#e83b53","4.8"],
  ["Tower Builder","Casual","🏗️","#74f0d1","#4378d9","4.4"],
  ["Robot Rumble","Action","🤖","#ffcb56","#ff6c8c","4.7"],
  ["Word Wizard","Puzzle","🔤","#7ed8ff","#6a57ff","4.5"],
  ["Basket Blitz","Sports","🏀","#ffb34b","#ff5c49","4.6"],
  ["Ghost Escape","Action","👻","#3b2c71","#2dd4bf","4.6"],
  ["Merge Mania","Puzzle","🧩","#f9a8d4","#818cf8","4.5"],
  ["Happy Hopper","Casual","🐸","#b7f56c","#14b8a6","4.4"],
  ["Volleyball Stars","Sports","🏐","#ffd76b","#fa7b55","4.5"],
  ["Cyber Runner","Arcade","🏃","#0d243c","#00c9ff","4.8"],
  ["Dragon Quest","Action","🐉","#fb7185","#7c3aed","4.7"],
  ["Parking Pro","Racing","🅿️","#8bd3ff","#4f46e5","4.5"],
  ["Memory Match","Puzzle","🃏","#ff9dbe","#ffcf6e","4.6"],
  ["Lucky Blocks","Casual","🟩","#70e1a0","#2786d8","4.4"]
].map(([name,cat,emoji,c1,c2,rating],i)=>({
  name,cat,emoji,rating,cover:`linear-gradient(140deg,${c1},${c2})`,index:i
}));

const $ = id => document.getElementById(id);
const grid = $("gameGrid");
const modal = $("gameModal");

let category = "All";
let favoritesOnly = false;
let visibleCount = 18;
let saved = new Set(JSON.parse(localStorage.getItem("gz-favorites") || "[]"));
let currentGame = null;
let score = 0;
let seconds = 30;
let best = Number(localStorage.getItem("gz-best") || 0);
let timer = null;
let running = false;
let lane = 1;
let shots = 5;
let opened = [];
let matched = [];
let round = 0;

function filteredGames(){
  const q = $("searchInput").value.trim().toLowerCase();
  let list = games.filter(g =>
    (category==="All" || g.cat===category) &&
    (!favoritesOnly || saved.has(g.name)) &&
    (!q || (g.name+" "+g.cat).toLowerCase().includes(q))
  );
  if($("sortSelect").value==="az") list.sort((a,b)=>a.name.localeCompare(b.name));
  if($("sortSelect").value==="new") list.reverse();
  return list;
}

function render(){
  const list=filteredGames();
  grid.innerHTML=list.slice(0,visibleCount).map((g,i)=>`
    <article class="game-card" tabindex="0" role="button" data-game="${g.name}" style="animation-delay:${i*15}ms">
      <div class="game-cover" style="--cover:${g.cover}">
        ${g.index<3?'<span class="new-label">POPULAR</span>':""}
        <button class="favorite-btn ${saved.has(g.name)?"saved":""}" data-fav="${g.name}" aria-label="Toggle favorite">${saved.has(g.name)?"♥":"♡"}</button>
        <span class="game-emoji">${g.emoji}</span>
      </div>
      <div class="game-info"><div class="game-name">${g.name}</div>
        <div class="game-meta"><span class="game-category">${g.cat}</span><span class="game-rating">★ ${g.rating}</span></div>
      </div>
    </article>`).join("");
  $("resultsText").textContent=`Showing ${Math.min(list.length,visibleCount)} of ${list.length} games`;
  $("emptyState").hidden=list.length>0;
  $("loadMore").hidden=list.length<=visibleCount;
  $("clearFilters").classList.toggle("show",category!=="All"||favoritesOnly||!!$("searchInput").value);
}

$("categoryBar").addEventListener("click",e=>{
  const b=e.target.closest("[data-category]");
  if(!b)return;
  category=b.dataset.category;
  document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===b));
  visibleCount=18;render();
});
$("searchInput").addEventListener("input",()=>{visibleCount=18;render()});
$("sortSelect").addEventListener("change",render);
$("loadMore").addEventListener("click",()=>{visibleCount+=12;render()});

$("clearFilters").addEventListener("click",()=>{
  category="All";favoritesOnly=false;$("searchInput").value="";
  $("favoritesToggle").textContent="♡ Favorites";
  document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));
  render();
});

$("favoritesToggle").addEventListener("click",()=>{
  favoritesOnly=!favoritesOnly;
  $("favoritesToggle").textContent=favoritesOnly?"♥ Favorites":"♡ Favorites";
  visibleCount=18;render();
});

grid.addEventListener("click",e=>{
  const fav=e.target.closest("[data-fav]");
  if(fav){
    const name=fav.dataset.fav;
    saved.has(name)?saved.delete(name):saved.add(name);
    localStorage.setItem("gz-favorites",JSON.stringify([...saved]));
    render();return;
  }
  const card=e.target.closest("[data-game]");
  if(card)launchGame(card.dataset.game);
});
grid.addEventListener("keydown",e=>{
  if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-game]")){
    e.preventDefault();launchGame(e.target.dataset.game);
  }
});

function randomGame(){
  launchGame(games[Math.floor(Math.random()*games.length)].name);
}
$("randomBtn").addEventListener("click",randomGame);
$("surpriseBtn").addEventListener("click",randomGame);
document.querySelectorAll("[data-launch]").forEach(b=>b.addEventListener("click",()=>launchGame(b.dataset.launch)));

function launchGame(name){
  currentGame=games.find(g=>g.name===name)||games[0];
  clearInterval(timer);running=false;
  $("modalTitle").textContent=currentGame.name;
  $("modalDescription").textContent=`${currentGame.cat} challenge — play and beat your best score!`;
  $("scoreValue").textContent="0";
  $("timeValue").textContent="30";
  $("bestValue").textContent=best;
  $("playField").innerHTML=`<div class="play-intro"><span>${currentGame.emoji}</span><p>${instructions()}</p><button id="startGame" class="primary-btn">▶ Start playing</button></div>`;
  modal.hidden=false;document.body.style.overflow="hidden";
  $("startGame").addEventListener("click",startGame);
}

function instructions(){
  return {
    Racing:"Dodge obstacles using left and right controls.",
    Puzzle:"Flip the cards and find matching pairs.",
    Sports:"Take five penalty shots and score goals.",
    Arcade:"Hit as many targets as possible.",
    Action:"React quickly and hit targets.",
    Casual:"Tap targets to collect points."
  }[currentGame.cat];
}

function startGame(){
  clearInterval(timer);
  score=0;seconds=30;shots=5;lane=1;opened=[];matched=[];round=0;running=true;
  $("scoreValue").textContent="0";$("timeValue").textContent="30";
  if(currentGame.cat==="Racing")raceGame();
  else if(currentGame.cat==="Puzzle")puzzleGame();
  else if(currentGame.cat==="Sports")sportsGame();
  else targetGame();

  if(currentGame.cat!=="Puzzle"&&currentGame.cat!=="Sports"){
    timer=setInterval(()=>{
      seconds--; $("timeValue").textContent=seconds;
      if(seconds<=0)endGame("⏱️ Time's up!");
    },1000);
  }
}

function addPoints(n){
  score+=n;$("scoreValue").textContent=score;
  if(score>best){
    best=score;localStorage.setItem("gz-best",best);
    $("bestValue").textContent=best;
  }
}

function endGame(message){
  clearInterval(timer);running=false;
  $("playField").innerHTML=`<div class="play-intro"><span>🏆</span><p>${message}</p><p>Your score: <b>${score}</b></p><button id="againGame" class="primary-btn">↻ Play again</button></div>`;
  $("againGame").addEventListener("click",startGame);
}

function targetGame(){
  const field=$("playField");
  field.innerHTML='<button id="target" class="target-btn" aria-label="Hit target">🎯</button>';
  moveTarget();
  $("target").addEventListener("click",()=>{
    if(!running)return;addPoints(1);moveTarget();
  });
}
function moveTarget(){
  const t=$("target"),f=$("playField");
  if(!t||!running)return;
  t.style.left=Math.random()*Math.max(0,f.clientWidth-55)+"px";
  t.style.top=Math.random()*Math.max(0,f.clientHeight-55)+"px";
}

/* Racing: dodge obstacles by changing lanes. */
function raceGame(){
  const f=$("playField");
  f.innerHTML=`
    <div style="position:absolute;inset:0;background:#26354b"></div>
    <div style="position:absolute;left:33.33%;height:100%;border-left:3px dashed #ffffff70"></div>
    <div style="position:absolute;left:66.66%;height:100%;border-left:3px dashed #ffffff70"></div>
    <div id="obstacle" style="position:absolute;top:45px;left:50%;transform:translateX(-50%);font-size:32px">🚧</div>
    <div id="car" style="position:absolute;bottom:58px;left:50%;transform:translateX(-50%);font-size:38px">🏎️</div>
    <div style="position:absolute;bottom:8px;display:flex;justify-content:center;gap:12px;width:100%">
      <button id="left" class="primary-btn">⬅ LEFT</button><button id="right" class="primary-btn">RIGHT ➡</button>
    </div>`;
  function update(){ $("car").style.left=(lane*33.333+16.666)+"%"; }
  function change(d){
    if(!running)return;
    lane=Math.max(0,Math.min(2,lane+d));update();addPoints(1);
  }
  $("left").onclick=()=>change(-1);$("right").onclick=()=>change(1);
  const keyHandler=e=>{
    if(!running||currentGame.cat!=="Racing")return;
    if(e.key==="ArrowLeft")change(-1);
    if(e.key==="ArrowRight")change(1);
  };
  document.addEventListener("keydown",keyHandler);
  timer=setInterval(()=>{
    if(!running){document.removeEventListener("keydown",keyHandler);return;}
    seconds--; $("timeValue").textContent=seconds;
    if(seconds<=0){document.removeEventListener("keydown",keyHandler);endGame("🏁 Race complete!");return;}
    const obstacleLane=Math.floor(Math.random()*3);
    $("obstacle").style.left=(obstacleLane*33.333+16.666)+"%";
    round++;
    if(lane===obstacleLane){document.removeEventListener("keydown",keyHandler);endGame("💥 Crash!");}
    else addPoints(5);
  },1100);
}

/* Puzzle: match 6 pairs. */
function puzzleGame(){
  const symbols=["🍎","🚀","🐸","⚽","🌟","🎲"];
  const deck=[...symbols,...symbols].sort(()=>Math.random()-.5);
  matched=[];opened=[];
  $("playField").innerHTML=`<div id="memoryGrid" style="width:100%;height:100%;padding:12px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);gap:8px">${deck.map((s,i)=>`<button data-card="${i}" style="border:2px solid #ffffff60;border-radius:12px;background:#6552ef;color:white;font-size:25px;cursor:pointer">?</button>`).join("")}</div>`;
  $("memoryGrid").addEventListener("click",e=>{
    const b=e.target.closest("[data-card]");
    if(!b||!running||b.disabled||opened.some(x=>x.b===b))return;
    const i=Number(b.dataset.card);b.textContent=deck[i];opened.push({b,i,s:deck[i]});
    if(opened.length===2){
      const [a,c]=opened;
      if(a.s===c.s){
        a.b.disabled=true;c.b.disabled=true;matched.push(a.i,c.i);opened=[];addPoints(10);
        if(matched.length===deck.length)endGame("🎉 Perfect! All pairs matched!");
      }else{
        const pair=[a,c];setTimeout(()=>{
          if(!running)return;
          pair.forEach(x=>x.b.textContent="?");opened=[];
        },650);
      }
    }
  });
}

/* Sports: five penalty shots. */
function sportsGame(){
  $("playField").innerHTML=`
    <div style="width:100%;height:100%;background:linear-gradient(#76d7ff 0 35%,#39b85e 35%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">
      <div style="font-size:60px">🥅</div><div style="font-size:35px">⚽</div>
      <b id="shotsMessage">Shots left: ${shots}</b>
      <div style="display:flex;gap:7px">
        <button class="primary-btn" data-shot="left">LEFT</button>
        <button class="primary-btn" data-shot="center">CENTER</button>
        <button class="primary-btn" data-shot="right">RIGHT</button>
      </div><b id="shotResult">Choose your shot!</b>
    </div>`;
  $("timeValue").textContent=shots;
  $("playField").addEventListener("click",e=>{
    const b=e.target.closest("[data-shot]");
    if(!b||!running||shots<=0)return;
    const keeper=["left","center","right"][Math.floor(Math.random()*3)];
    shots--;
    if(b.dataset.shot!==keeper){addPoints(10);$("shotResult").textContent="⚽ GOAL! +10";}
    else $("shotResult").textContent="🧤 Saved!";
    $("shotsMessage").textContent="Shots left: "+shots;
    $("timeValue").textContent=shots;
    if(shots===0){running=false;setTimeout(()=>{if(!modal.hidden)endGame("Shootout finished!");},700);}
  });
}

function closeGame(){
  clearInterval(timer);running=false;modal.hidden=true;
  document.body.style.overflow="";
}
$("modalClose").addEventListener("click",closeGame);
modal.addEventListener("click",e=>{if(e.target===modal)closeGame()});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")closeGame();
  if(e.key==="/"&&document.activeElement!==$("searchInput")){
    e.preventDefault();$("searchInput").focus();
  }
});

render();
