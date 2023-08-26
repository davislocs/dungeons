const dragContainers = document.querySelectorAll(".hero");
const dropZones = document.querySelectorAll(".main-game__drop-zone");

dragContainers.forEach(function(dragContainer) {
  dragContainer.addEventListener("dragstart", dragStart);
  dragContainer.addEventListener("dragend", dragEnd);
});

dropZones.forEach(function(dropZone) {
  dropZone.addEventListener("dragover", dragOver);
  dropZone.addEventListener("dragenter", dragEnter);
  dropZone.addEventListener("dragleave", dragLeave);
  dropZone.addEventListener("drop", drop);
});

function dragStart(event) {
  const container = event.currentTarget;
  const element = createDraggableElement(container);
  
  event.dataTransfer.setData("text/plain", element.outerHTML);
  event.dataTransfer.effectAllowed = "copy";
  // Add a class to the container to indicate dragging
  container.classList.add("dragging");
  
}

function dragEnd(event) {
  const container = event.currentTarget;

  // Remove the class indicating dragging
  container.classList.remove("dragging");
}

function dragOver(event) {
  event.preventDefault();
}

function dragEnter(event) {
  event.preventDefault();
  event.currentTarget.classList.add("main-game__drop-zone--hover");
}

function dragLeave(event) {
  event.currentTarget.classList.remove("main-game__drop-zone--hover");
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text/plain");
  
  const element = createElementFromHTML(data);
  if (element) {
    const dropZone = event.currentTarget;

    // Clear existing contents
    while (dropZone.firstChild) {
      dropZone.firstChild.remove();
    }
    dropZone.appendChild(element);
  }
  
  event.currentTarget.classList.remove("main-game__drop-zone--hover");
  
//////////////////////////////////////////////////////////////////////////////////////
////////REMOVE CLASS 'hidden' FROM CARD BTN SECTION WHEN DROPED IN DROP ZONE//////////

  const dropZoneSections = document.getElementsByClassName("main-game__drop-zone");
  // Iterate through the parent elements
  for (let i = 0; i < dropZoneSections.length; i++) {
    const attackBtnZone = dropZoneSections[i].getElementsByClassName("character-card__attack-btn-zone");
    for (let j = 0; j < attackBtnZone.length; j++) {
      attackBtnZone[j].classList.remove("hidden");
    }
  }

  
}
/////////////////////////////////////////////////////////////////////////
//??????????????????????????????????????????????????????????????????////
let idNumber = 1;
function createDraggableElement(container) {
  const element = document.createElement("div");
  element.innerHTML = container.innerHTML;
  element.classList.add("character-card");
  element.classList.add("hero");
  element.setAttribute("draggable", true);
  element.id = container.id + "-redy" + "-" + idNumber;
  idNumber++;
  return element;
}

function createElementFromHTML(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

////////////////////////////////////////////////////////////////////////////
///////////////////GO TO DUNGEON BTN////////////////////////////////////////

let startGameBtn = document.getElementById("start-btn");
let characterSelect = document.getElementById("character-select-zone");
let enemyZone = document.getElementById("enemy-zone");
let nextStageBtn = document.getElementById("next-stage-btn");
let enemyNodes = enemyZone.getElementsByClassName("enemy");//
let heroGroup;
let enemyGroup;
let stageCounter = 0;


startGameBtn.addEventListener("click", function start () {
  enemyGroup = enemyConstructor ();
  document.body.classList.add("dungeon-background");
  startGameBtn.classList.add("hidden");
  characterSelect.classList.add("hidden");
  enemyZone.classList.remove("hidden");
  // nextStageBtn.classList.remove("hidden");
  
  heroGroup = heroConstructor();
  let enemyNodes = enemyZone.getElementsByClassName("enemy");
  stageCounter++;
  battleFunction (enemyNodes);

  console.log("===============================================");

  heroGroup.forEach( item => console.log("HERO ARR ITEM: " + item.id));
  console.log("HERO ARR LENGHT: " + heroGroup.length);

  enemyGroup.forEach( item => console.log("ENEMY ARR ITEM: " + item.id));
  console.log("ENEMY ARR LENGHT: " + enemyGroup.length);
        
});

function selectBtn(btn) {
      btn.classList.add("btn-select");
}

function deSellectAllBtn() {
  let attackBtns = document.getElementsByClassName("fight-btn");
      for(let btn of attackBtns)  {
        btn.classList.remove("btn-select");
      }
}

//////////////////////////////////////////////////////////////////////////////
///////////////////BATLE FUNCTION////////////////////////////////////////////

function battleFunction (enemyNodes) {
  let selectedHero;
  let selectedEnemy;
  let mlFlag = false;
  let raFlag = false;
  let enemyFlag = false;
  let heroAtackFlag = false;

  for(let hero of heroGroup){
    let heroElement = document.getElementById(hero.id);

    heroElement.querySelector(".ma-attack-btn").addEventListener("click", function selectHero(){
      deSellectAllBtn();
      selectBtn(heroElement.querySelector(".ma-attack-btn"));
      selectedHero = hero;
      mlFlag = true;
      raFlag = false;
      
      console.log("HERO SELECTED: " + selectedHero.id);
      console.log("ATTACK TYPE: mele attack");
    });

    heroElement.querySelector(".ra-attack-btn").addEventListener("click", function selectHero(){
      deSellectAllBtn();
      selectBtn(heroElement.querySelector(".ra-attack-btn"));
      selectedHero = hero;
      raFlag = true;
      mlFlag = false;

      console.log("HERO SELECTED: " + selectedHero.id);
      console.log("ATTACK TYPE: range attack");
    });
  }


  for(let enemy of enemyGroup) {
    let enemyElement = document.getElementById(enemy.id);
    
    enemyElement.addEventListener("click", function selectEnemy () {
      console.log("ENEMY CLICKED: " + enemy.id);
      deSellectAllBtn();
      if(raFlag || mlFlag) {
        selectedEnemy = enemy;
        enemyFlag = true;

        if(mlFlag && enemyFlag) {
          console.log("ENEMY HP BEFORE ATTCK: " + selectedEnemy.hp.innerHTML);
          console.log("HERO ATTACK STREINGHT: " + selectedHero.ma.innerHTML);
          selectedHero.mlAttack(selectedEnemy);
          console.log("ENEMY HP AFTER ATTCK: " + selectedEnemy.hp.innerHTML);
          heroAtackFlag = true;
        }

        if(raFlag && enemyFlag) {
          console.log("ENEMY HP BEFORE ATTCK: " + selectedEnemy.hp.innerHTML);
          console.log("HERO ATTACK STREINGHT: " + selectedHero.ra.innerHTML);
          selectedHero.raAttack(selectedEnemy);
          console.log("ENEMY HP AFTER ATTCK: " + selectedEnemy.hp.innerHTML);
          heroAtackFlag = true;
        }

        if(selectedEnemy.hp.innerHTML <= 0) selectedEnemy.dying(enemyGroup);

        if(heroAtackFlag && enemyGroup.length > 0) {
          console.log("------------ENEMY TRUN----------")
          setTimeout(function() {
            enemyAttack(enemyGroup, heroGroup);
          }, 1000);

          selectedHero = undefined;
          heroFlageroFlag = false;
          raFlag = false;
          heroAtackFlag = false;
        }
        
      }

      if (enemyGroup.length == 0 && stageCounter == 10) {
        let resultBox = document.getElementById("resultBox");
        let result = document.getElementById("gameResult");
        resultBox.classList.remove("hidden");
        result.innerText = "You won!!!";
      }
      else if (enemyGroup.length == 0) nextStageBtn.classList.remove("hidden");
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////
//////////////////ENEMY ATTACK FUNCTION//////////////////////////////////////////

function enemyAttack (enemyGroup, heroGroup) {
  let enemyCount = enemyGroup.length;
  const enemyIndex = Math.floor(Math.random() * enemyCount);
  let heroCount = heroGroup.length;
  const heroIndex = Math.floor(Math.random() * heroCount);
  
  const attackTypeIndex = Math.floor(Math.random() * 2);
  const accurasy = Math.floor(Math.random() * 101);

  console.log("ENEMY: " + enemyGroup[enemyIndex].id);
  console.log("ATTACKING TO: " + heroGroup[heroIndex].id);
  //////////////melle attack///////////////////////////////////////////////////////////
  if (attackTypeIndex === 1 && enemyGroup[enemyIndex].ma.innerHTML != 0 || enemyGroup[enemyIndex].ra.innerHTML == 0 && enemyGroup[enemyIndex].ma.innerHTML != 0) {
    console.log("HERO HP BEFORE: " + heroGroup[heroIndex].hp.innerHTML);
    console.log("ATTACK TYPE MELE");
    console.log("ATTACK STREINGHT: " + enemyGroup[enemyIndex].ma.innerHTML);
    enemyGroup[enemyIndex].mlAttack (heroGroup[heroIndex], accurasy);
    console.log("HERO HP AFTER: " + heroGroup[heroIndex].hp.innerHTML);  
  }
//////////////////range attack///////////////////////////////////////////////////
  else {
    console.log("HERO HP BEFORE: " + heroGroup[heroIndex].hp.innerHTML);
    console.log("ATTACK TYPE RANGE");
    console.log("ATTACK STREINGHT: " + enemyGroup[enemyIndex].ra.innerHTML);
    enemyGroup[enemyIndex].raAttack (heroGroup[heroIndex], accurasy);
    console.log("HERO HP AFTER: " + heroGroup[heroIndex].hp.innerHTML);
  }
//////////////////////////ja hero hp ir 0 tad vins nomirst////////////////////
  if(heroGroup[heroIndex].hp.innerHTML <= 0) heroGroup[heroIndex].dying (heroGroup);

  if(heroGroup.length == 0) {
    let resultBox = document.getElementById("resultBox");
    let result = document.getElementById("gameResult");
    resultBox.classList.remove("hidden");
    result.innerText = "You LOSE!!!";
  }
}

/////////////////////////////////////////////////////////////////////////////
/////////////////BTN TO CHANGE ENEMY LIST FOR THE NEXT BATTLE///////////////

nextStageBtn.addEventListener("click", function nextStage () {
  
    while (enemyZone.firstChild) {
      enemyZone.removeChild(enemyZone.firstChild);
      }
      enemyGroup = enemyConstructor ();
      let enemyNodes = enemyZone.getElementsByClassName("enemy");
      battleFunction (enemyNodes);
  
      stageCounter++;
      console.log("STAGE COUNTER:" + stageCounter);
      nextStageBtn.classList.add("hidden");
})

////////////////////////////////////////////////////////////////////////////////
//////HERO CONSTRUCTOR/////////////////////////////////////////////////////////

function heroConstructor () {
  class Hero {
    constructor(hero) {
      this.id = hero.id;
      this.hp = hero.querySelector(".hp");
      this.ma = hero.querySelector(".ma");
      this.ra = hero.querySelector(".ra");
      this.class = hero.classList;
      
      if(hero.id.includes("character-card-worior-redy")) {
        this.hp.innerHTML = 100;
        this.ma.innerHTML = 15;
        this.ra.innerHTML = 0;
      }
      else if(hero.id.includes("character-card-wizard-redy")) {
        this.hp.innerHTML = 50;
        this.ma.innerHTML = 2;
        this.ra.innerHTML = 17;
      }
      else if(hero.id.includes("character-card-archer-redy")) {
        this.hp.innerHTML = 70;
        this.ma.innerHTML = 6;
        this.ra.innerHTML = 12;
      }
      else if(hero.id.includes("character-card-barbarian-redy")) {
        this.hp.innerHTML = 80;
        this.ma.innerHTML = 9;
        this.ra.innerHTML = 10;
      }
      else if(hero.id.includes("character-card-beast-redy")) {
        this.hp.innerHTML = 120;
        this.ma.innerHTML = 12;
        this.ra.innerHTML = 0;
      }
    }

    addAttckAnimation (animationClass) {
      let hero = document.getElementById(this.id);
      hero.style.animation = 'none';
      hero.offsetHeight;
      hero.style.animation = null;
      
      this.class.add(animationClass);
      hero.style.animationPlayState = 'running';
    }

    hitOrMiss (hOm, color, enemy) {
      let enemyHtml = document.getElementById(enemy.id);
      let hmBox = enemyHtml.querySelector(".hitt-or-miss");
      
      hmBox.style.animation = 'none';
      hmBox.offsetHeight;
      hmBox.style.animation = null;

      hmBox.textContent = hOm;
      hmBox.style.color = color;
      hmBox.classList.add("hitt-or-miss-animation");
      hmBox.style.animationPlayState = 'running';
    }

    mlAttack (enemy) {
      let enemyHp = enemy.hp;
      const accurasy = Math.floor(Math.random() * 101);
      this.addAttckAnimation("hero-attack-animation");
      if(accurasy <= 90) {
        enemyHp.innerHTML = enemyHp.innerHTML - this.ma.innerHTML;
        console.log("hero-melle-hit!!");
        this.hitOrMiss ("Hit!", "green", enemy);
      }
      else {
        console.log("hero-melle-miss!!");
        this.hitOrMiss ("Miss!", "red", enemy);
      }
    }

    raAttack (enemy) {
      let enemyHp = enemy.hp;
      const accurasy = Math.floor(Math.random() * 101);
      this.addAttckAnimation("hero-attack-animation");

      if(accurasy <= 50) {
        enemyHp.innerHTML = enemyHp.innerHTML - this.ra.innerHTML;
        console.log("hero-range-hit!!");
        this.hitOrMiss ("Hit!", "green", enemy);
      }
      else {
        console.log("hero-range--miss!!");
        this.hitOrMiss ("Miss!", "red", enemy);
      }
    }

    dying (heroGroup) {
      console.log(this.id + " DIDE!")
      console.log("HERO ARR BEFORE DEATH")
      heroGroup.forEach( item => console.log(item));
      console.log("ARR LENGHT: " + heroGroup.length);

      this.class.add("hidden");
      let heroIndex = heroGroup.indexOf(this);
      heroGroup.splice(heroIndex, 1);

      console.log("HERO ARR AFTER DEATH")
      heroGroup.forEach( item => console.log(item));
      console.log("ARR LENGHT: " + heroGroup.length);
    }
  }

  let heroArr = [];
  let heroGroup = document.getElementsByClassName("main-game__drop-zone");


  for(let zone of heroGroup){
    if(zone.firstChild) {
      let newHero = new Hero(zone.firstChild);
      heroArr.push(newHero);
    } 
    
  }

  return heroArr;
}

////////////////////////////////////////////////////////////////////
//////////////ENEMY CONSTRUCTOR////////////////////////////////////
function enemyConstructor () {
  class Enemy {
    constructor(enemy) {
      this.id = enemy.id;
      this.hp = enemy.querySelector(".hp");
      this.ma = enemy.querySelector(".ma");
      this.ra = enemy.querySelector(".ra");
      this.class = enemy.classList;
      
      if(enemy.id.includes("character-card-skeletor-worior-redy")) {
        this.hp.innerHTML = 50;
        this.ma.innerHTML = 5;
        this.ra.innerHTML = 0;
      }
      else if(enemy.id.includes("character-card-skeletor-archer")) {
        this.hp.innerHTML = 50;
        this.ma.innerHTML = 0;
        this.ra.innerHTML = 5;
      }
      else if(enemy.id.includes("character-card-necromancer-redy")) {
        this.hp.innerHTML = 20;
        this.ma.innerHTML = 0;
        this.ra.innerHTML = 7;
      }
      else if(enemy.id.includes("character-card-dark-worrior-redy")) {
        this.hp.innerHTML = 50;
        this.ma.innerHTML = 5;
        this.ra.innerHTML = 7;
      }
    }

    addAttckAnimation (animationClass) {
      let enemy = document.getElementById(this.id);
      enemy.style.animation = 'none';
      enemy.offsetHeight;
      enemy.style.animation = null;
      
      this.class.add(animationClass);
      enemy.style.animationPlayState = 'running';
    }

    hitOrMiss (hOm, color, hero) {
      let heroHtml = document.getElementById(hero.id);
      let hmBox = heroHtml.querySelector(".hitt-or-miss");
      
      hmBox.style.animation = 'none';
      hmBox.offsetHeight;
      hmBox.style.animation = null;

      hmBox.textContent = hOm;
      hmBox.style.color = color;
      hmBox.classList.add("hitt-or-miss-animation");
      hmBox.style.animationPlayState = 'running';
    }

    mlAttack (hero, accurasy) {
      let heroHp = hero.hp;
      this.hitOrMiss ("Mele attack!", "black", this);
      this.addAttckAnimation("enemy-attack-animation");

      if(accurasy <= 90) {
        heroHp.innerHTML = heroHp.innerHTML - this.ma.innerHTML;
        console.log("enemy-melle-hit!!");
        this.hitOrMiss ("Hit!", "green", hero);
      }
      else {
        console.log("enemy-melle-miss!!");
        this.hitOrMiss ("Miss!", "red", hero);
      }
    }

    raAttack (hero, accurasy) {
      let heroHp = hero.hp;
      this.addAttckAnimation("enemy-attack-animation");
      this.hitOrMiss ("Range attack!", "black", this);

      if(accurasy <= 50) {
        heroHp.innerHTML = heroHp.innerHTML - this.ra.innerHTML;
        this.hitOrMiss ("Hit!", "green", hero);
        console.log("enemy-range-hit!!");
      }
      else {
        console.log("enemy-range--miss!!");
        this.hitOrMiss ("Miss!", "red", hero);
      }
    }

    dying (enemyGroup) {
      console.log(this.id + " DIDE!")
      console.log("ENEMY ARR BEFORE DEATH")
      enemyGroup.forEach( item => console.log(item));
      console.log("ARR LENGHT: " + enemyGroup.length);

      this.class.add("hidden");
      let enemyIndex = enemyGroup.indexOf(this);
      enemyGroup.splice(enemyIndex, 1);

      console.log("ENEMY ARR AFTER DEATH")
      enemyGroup.forEach( item => console.log(item));
      console.log("ARR LENGHT: " + enemyGroup.length);
    }
  }

  let enemyArr = [];
  const enemyList = document.getElementById("enemy-list");
  const enemyCount = Math.floor(Math.random() * 3) + 1;

  for(let i = 0; i < enemyCount; i++){
    let randomIndex = Math.floor(Math.random() * 4);
    const enemy = enemyList.children[randomIndex];
    let clonedEnemy = enemy.cloneNode(true);
    enemyZone.appendChild(clonedEnemy);
    clonedEnemy.id = clonedEnemy.id + "-redy" + "-" + i;
    let newEnemy = new Enemy(clonedEnemy);
    enemyArr.push(newEnemy);
  }

  return enemyArr;
}
