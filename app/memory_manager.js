/* ======================================
   Auto Story Memory
   自动剧情摘要系统
====================================== */


/* 生成章节摘要Prompt */

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


/* 写入剧情记忆 */

async function saveChapterSummaryDB(summary){

 try{

  const res = await fetch("memory/chapter_summary_cache.json");
  const json = await res.json();

  json.chapters.push({
  chapter: Date.now(),
  summary: summary
});

/* 只保留最近20章剧情摘要 */
if(json.chapters.length > 20){
  json.chapters.shift();
}

console.log("剧情摘要已加入缓存:", summary);

 }catch(e){

  console.error("剧情缓存写入失败:", e);

 }

}