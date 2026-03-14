/* ==================================================
   Core Layer - 稳定安全控制层
   适配当前 index.html 结构
   不依赖框架
   ================================================== */


/* ===============================
   全局生成锁（防止重复点击）
================================= */
var AI_GENERATING = false;


/* ===============================
   唯一数据修改入口
   用法：
   update(d => { d.xxx = ... })
================================= */
function update(fn){

  if(typeof fn !== "function") return;

  try{

    fn(data);

    // 统一保存
    if(typeof scheduleSave === "function"){
      scheduleSave();
    }

  }catch(e){
    console.error("Update Error:", e);
  }
}


/* ===============================
   AI 安全写入
   防止：
   - 用户切换章节
   - 异步返回错位
================================= */
function safeAIUpdate(volumeIndex, chapterIndex, fn){

  if(typeof fn !== "function") return;

  try{

    // 若用户已切换章节，阻止写入
    if(
      currentVolume !== volumeIndex ||
      currentChapter !== chapterIndex
    ){
      console.warn("AI写入被阻止：章节已切换");
      return;
    }

    fn(data);

    if(typeof scheduleSave === "function"){
      scheduleSave();
    }

  }catch(e){
    console.error("AI Update Error:", e);
  }
}


/* ===============================
   AI 生成流程封装（推荐使用）
   自动：
   - 锁定章节
   - 防并发
   - 捕获异常
================================= */
async function runAI(taskFn){

  if(AI_GENERATING){
    console.warn("已有AI生成进行中");
    return;
  }

  AI_GENERATING = true;

  try{
    await taskFn();
  }catch(e){
    console.error("AI生成异常:", e);
  }finally{
    AI_GENERATING = false;
  }
}


/* ===============================
   深拷贝（未来版本历史可用）
================================= */
function cloneData(){
  try{
    return JSON.parse(JSON.stringify(data));
  }catch(e){
    console.error("Clone Error:", e);
    return null;
  }
}


/* ===============================
   调试日志开关
================================= */
var DEBUG_MODE = false;

function log(){
  if(DEBUG_MODE){
    console.log.apply(console, arguments);
  }
}


/* ===============================
   生成时锁定当前章节索引
   用法：
   const lock = lockCurrentPosition();
================================= */
function lockCurrentPosition(){
  return {
    volume: currentVolume,
    chapter: currentChapter
  };
}


/* ===========================
   读取角色记忆（当前项目）
=========================== */

async function loadCharacterMemory(){

  if(!data || !data.characters) return "";

  return JSON.stringify(data.characters);

}


/* ===========================
   读取世界观（当前项目）
=========================== */

async function loadWorldMemory(){

  if(!data || !data.world) return "";

  return data.world;

}


/* ===========================
   读取剧情摘要（当前项目）
=========================== */

async function loadStoryMemory(){

  const history = await loadRecentSummaries(20);

  if(!history) return "";

  return history;

}

/* ==== 生成章节摘要Prompt ==== */

function buildChapterSummaryPrompt(chapterText){

return `
请将以下小说章节总结为100字以内的剧情摘要。

要求：

1 只保留关键剧情
2 不要细节描写
3 不要评价
4 不要使用文学语言

输出示例：

主角进入青云宗，参加入门测试，凭借时间回溯能力通过考核，被长老注意。

【章节正文】

${chapterText}
`;

}