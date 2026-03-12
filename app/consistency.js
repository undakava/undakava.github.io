/* ======================================
   Story Consistency Checker
   剧情一致性检查器
====================================== */

async function checkStoryConsistency(summary, scene, beats){

    const characters = await loadCharacterMemory();
    const world = await loadWorldMemory();
    const history = await loadStoryMemory();

    const prompt = `
你是一个小说剧情逻辑检查专家。

你的任务是检查即将生成的小说剧情是否与既有设定冲突。

【世界观规则】
${world}

【角色设定】
${characters}

【历史剧情摘要】
${history}

【即将生成的章节概述】
${summary}

【场景拆分】
${scene}

【剧情节拍】
${beats}

请检查以下问题：

1 是否违反世界观规则
2 是否出现人物性格崩塌
3 是否出现人物能力突然变化
4 是否出现剧情跳跃
5 是否与历史剧情冲突

输出格式：

一致性评分：0-100

问题列表：
（如果没有问题写“无明显冲突”）

建议修正：
（如果没有写“无需修正”）
`;

    return prompt;

}