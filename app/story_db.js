/* ==================================
   Story Database
   浏览器长期剧情存储
================================== */

var STORY_DB = null;


/* 初始化数据库 */

function initStoryDB(){

 return new Promise((resolve,reject)=>{

  const req = indexedDB.open("AI_NOVEL_DB",1);

  req.onupgradeneeded = function(e){

   const db = e.target.result;

   if(!db.objectStoreNames.contains("chapter_memory")){
     db.createObjectStore("chapter_memory",{autoIncrement:true});
   }

  };

  req.onsuccess = function(e){
   STORY_DB = e.target.result;
   resolve();
  };

  req.onerror = reject;

 });

}


/* 保存章节摘要 */

function saveChapterSummaryDB(summary){

 return new Promise((resolve,reject)=>{

  const tx = STORY_DB.transaction("chapter_memory","readwrite");

  const store = tx.objectStore("chapter_memory");

  store.add({
    time:Date.now(),
    summary:summary
  });

  resolve();

 });

}


/* 读取最近N章 */

function loadRecentSummaries(limit=20){

 return new Promise((resolve,reject)=>{

  const tx = STORY_DB.transaction("chapter_memory","readonly");

  const store = tx.objectStore("chapter_memory");

  const req = store.getAll();

  req.onsuccess = function(){

   const list = req.result || [];

   const last = list.slice(-limit);

   const text = last.map(v=>v.summary).join("\n");

   resolve(text);

  };

 });

}