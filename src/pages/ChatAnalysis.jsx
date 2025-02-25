import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactECharts from 'echarts-for-react';
import 'echarts-wordcloud';
import Papa from 'papaparse';

const AnalysisContainer = styled.div`
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const ChartGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px;
  width: 100%;
  
  .persona {
    width: 100%;
    height: 100px;
  }

  .charts-row {
    display: flex;
    gap: 16px;
    width: 100%;
    flex-wrap: nowrap;
  }

  .network-chart {
    width: 100%;
    height: 900px;
  }
`;

const ChartSection = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &.persona {
    height: 100px;
    display: flex;
    flex-direction: column;
    
    .echarts-for-react {
      flex: 1;
      min-height: 80px;
    }
  }

  &.chart {
    flex: 1;
    width: 0;
    height: 260px;
    min-width: 200px;
    
    .echarts-for-react {
      height: 100% !important;
    }
  }

  &.network-chart {
    .echarts-for-react {
      height: 100% !important;
    }
  }
`;

const FilterContainer = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
  max-width: 200px;
  cursor: pointer;
  
  /* 设置下拉列表样式 */
  & option {
    padding: 8px;
  }
  
  @media (max-width: 480px) {
    flex: 1;
  }
`;

/* 添加全局样式来控制下拉列表的行为 */
const GlobalStyle = styled.div`
  /* 控制下拉列表的样式 */
  select {
    option {
      padding: 8px;
    }
  }
  
  /* 修改下拉列表的默认样式 */
  select::-webkit-listbox {
    max-height: none !important;
  }
  
  /* Firefox 样式 */
  @-moz-document url-prefix() {
    select {
      overflow: -moz-scrollbars-vertical;
      scrollbar-width: thin;
    }
  }
  
  /* IE/Edge 样式 */
  select::-ms-expand {
    display: none;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

// 真实成员数据
const realMembers = [
  { ori: 'appollyon7', name: '侯佳琪', nick: '猴子' },
  { ori: 'baoweichen001', name: '鲍炜晨', nick: 'BWC' },
  { ori: 'ccc2929229', name: '曹毅欣', nick: '萌萌' },
  { ori: 'dcz583618689', name: '董晨钊', nick: 'DCZ' },
  { ori: 'dujiayinl993', name: '杜佳音', nick: 'DJY' },
  { ori: 'elisecheung111', name: '半夏夏', nick: '半夏' },
  { ori: 'Flora9256', name: '风小炫', nick: '弗洛' },
  // ... 其他成员数据
];

// 修改 mockData
const mockData = {
  activityByHour: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: Math.floor(Math.random() * 100)
  })),
  activityByDay: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => ({
    day,
    count: Math.floor(Math.random() * 1000)
  })),
  wordCloud: Array.from({ length: 50 }, (_, i) => ({
    name: `关键词${i + 1}`,
    value: Math.floor(Math.random() * 1000)
  })),
  memberActivity: realMembers.map(member => ({
    ori: member.ori,
    name: member.name,
    nick: member.nick,
    messages: Math.floor(Math.random() * 2000),
    images: Math.floor(Math.random() * 100),
    links: Math.floor(Math.random() * 50)
  })),
  emotionAnalysis: {
    positive: Math.floor(Math.random() * 1000),
    neutral: Math.floor(Math.random() * 1000),
    negative: Math.floor(Math.random() * 300)
  },
  interactionNetwork: Array.from({ length: 20 }, () => {
    const source = realMembers[Math.floor(Math.random() * realMembers.length)];
    const target = realMembers[Math.floor(Math.random() * realMembers.length)];
    return {
      source: source.nick,  // 使用昵称显示
      target: target.nick,  // 使用昵称显示
      value: Math.floor(Math.random() * 100)
    };
  }),
  emojiUsage: Array.from({ length: 10 }, (_, i) => ({
    name: `表情${i + 1}`,
    count: Math.floor(Math.random() * 500)
  })),
  topicTrends: Array.from({ length: 7 }, (_, i) => ({
    date: `2024-03-${i + 1}`,
    topics: {
      '技术': Math.floor(Math.random() * 100),
      '市场': Math.floor(Math.random() * 100),
      '产品': Math.floor(Math.random() * 100),
      '其他': Math.floor(Math.random() * 100)
    }
  })),
  responseTime: realMembers.map(member => ({
    ori: member.ori,
    name: member.name,
    nick: member.nick,
    avgTime: Math.floor(Math.random() * 300),
    maxTime: Math.floor(Math.random() * 1800)
  })),
  messageLengthDist: {
    '0-10字': Math.floor(Math.random() * 1000),
    '11-30字': Math.floor(Math.random() * 1000),
    '31-50字': Math.floor(Math.random() * 500),
    '51-100字': Math.floor(Math.random() * 300),
    '100字以上': Math.floor(Math.random() * 100)
  },
  onlineTimeDist: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    activeUsers: Math.floor(Math.random() * 50)
  })),
  shareContent: {
    '文章': Math.floor(Math.random() * 200),
    '视频': Math.floor(Math.random() * 150),
    '图片': Math.floor(Math.random() * 300),
    '链接': Math.floor(Math.random() * 250),
    '文件': Math.floor(Math.random() * 100)
  },
  memberRoles: realMembers.map(member => ({
    ori: member.ori,
    name: member.name,
    nick: member.nick,
    influence: Math.floor(Math.random() * 100),
    participation: Math.floor(Math.random() * 100),
    responseRate: Math.floor(Math.random() * 100)
  }))
};

// 添加时间范围选项
const TIME_RANGES = [
  { value: 'all', label: '全部时间' },
  { value: 'last7days', label: '最近7天' },
  { value: 'last30days', label: '最近30天' },
  { value: 'last90days', label: '最近90天' },
  { value: 'lastyear', label: '最近一年' }
];

// 添加用户画像定义
const USER_PERSONAS = {
  nightOwl: {
    title: '熬夜达人',
    description: '深夜群聊的常客，经常在凌晨时分活跃，是群里的"月光族"代表。',
    icon: '🌙',
    criteria: (data) => {
      // 判断夜间活跃度
      const nightHours = data.activityByHour.filter(h => h.hour >= 23 || h.hour <= 4);
      return nightHours.reduce((sum, h) => sum + h.count, 0) > 100;
    }
  },
  chatEngine: {
    title: '群聊发动机',
    description: '消息数量遥遥领先，是群里的活跃气氛担当，话题终结者。',
    icon: '🚀',
    criteria: (data) => data.memberActivity.messages > 1000
  },
  imagemaster: {
    title: '表情包大师',
    description: '表情包发送量惊人，总能用表情包精准表达情感。',
    icon: '😎',
    criteria: (data) => data.emojiUsage.length > 50
  },
  quickResponder: {
    title: '神速回复者',
    description: '群消息必秒回，是群里的"闪电侠"。',
    icon: '⚡',
    criteria: (data) => data.responseTime.avgTime < 60
  },
  infoProvider: {
    title: '资讯达人',
    description: '经常分享有价值的链接和文章，是群里的"知识库"。',
    icon: '📚',
    criteria: (data) => data.shareContent.links > 50
  },
  peacemaker: {
    title: '群里和事佬',
    description: '情感分析显示总是发送积极正面的消息，是群里的"暖男/暖女"。',
    icon: '🕊️',
    criteria: (data) => data.emotionAnalysis.positive > data.emotionAnalysis.negative * 3
  },
  debater: {
    title: '思辨达人',
    description: '总能提出独到见解，是群里的"思想家"。',
    icon: '🤔',
    criteria: (data) => data.wordCloud.filter(w => w.value > 100).length > 10
  },
  earlyBird: {
    title: '早起打卡王',
    description: '每天清晨准时出现，是群里的"生物钟达人"。',
    icon: '🌅',
    criteria: (data) => {
      const morningHours = data.activityByHour.filter(h => h.hour >= 5 && h.hour <= 8);
      return morningHours.reduce((sum, h) => sum + h.count, 0) > 50;
    }
  }
};

// 修改成员画像生成函数
const generateMemberPersona = (data, memberId) => {
  if (!Array.isArray(data)) {
    console.warn('无效的数据格式:', data);
    return {
      alias: '数据加载中',
      description: '正在分析数据...',
      traits: ['加载中']
    };
  }

  if (memberId === 'all') {
    return {
      alias: '群聊全景',
      description: '这里记录着所有成员的欢声笑语',
      traits: ['热闹非凡', '其乐融融']
    };
  }

  const memberData = data.filter(record => record.talker === memberId);
  if (!memberData.length) {
    return {
      alias: '暂无数据',
      description: '该成员暂无聊天记录',
      traits: ['待分析']
    };
  }

  // 扩展数据分析维度
  const analysis = {
    totalMessages: memberData.length,
    messagesByHour: Array(24).fill(0),
    wordCount: new Map(),
    emojiCount: 0,
    totalWords: 0,
    questionCount: 0,
    exclamationCount: 0,
    responseCount: 0,
    imageCount: 0,
    linkCount: 0,
    replyCount: 0,
    topWords: [],
    emotionStats: {
      positive: 0,
      negative: 0,
      neutral: 0
    }
  };

  // 更详细的内容分析
  memberData.forEach(record => {
    const hour = new Date(record.StrTime).getHours();
    analysis.messagesByHour[hour]++;

    if (record.message) {
      // 统计问题和感叹
      if (record.message.includes('?') || record.message.includes('？')) analysis.questionCount++;
      if (record.message.includes('!') || record.message.includes('！')) analysis.exclamationCount++;
      
      // 统计表情符号
      const emojiMatches = record.message.match(/[\u{1F300}-\u{1F9FF}]/gu);
      if (emojiMatches) analysis.emojiCount += emojiMatches.length;

      // 统计图片和链接
      if (record.message.includes('[图片]')) analysis.imageCount++;
      if (record.message.includes('http')) analysis.linkCount++;
      
      // 统计回复
      if (record.message.startsWith('@') || record.message.includes('回复')) analysis.replyCount++;

      // 分词统计
      const words = record.message.split(/[,，。！？\s]+/);
      words.forEach(word => {
        if (word.length > 1) {
          analysis.wordCount.set(word, (analysis.wordCount.get(word) || 0) + 1);
          analysis.totalWords++;
        }
      });

      // 简单情感分析
      if (record.message.match(/[哈😊😄😃😀😂🤣]/)) analysis.emotionStats.positive++;
      else if (record.message.match(/[etry😢😭😞😔😟]/)) analysis.emotionStats.negative++;
      else analysis.emotionStats.neutral++;
    }
  });

  // 计算各种比率
  const stats = {
    peakHour: analysis.messagesByHour.indexOf(Math.max(...analysis.messagesByHour)),
    avgWordsPerMessage: analysis.totalWords / analysis.totalMessages,
    questionRatio: analysis.questionCount / analysis.totalMessages,
    imageRatio: analysis.imageCount / analysis.totalMessages,
    linkRatio: analysis.linkCount / analysis.totalMessages,
    emojiRatio: analysis.emojiCount / analysis.totalMessages,
    replyRatio: analysis.replyCount / analysis.totalMessages,
    exclamationRatio: analysis.exclamationCount / analysis.totalMessages,
    emotionTendency: Object.entries(analysis.emotionStats)
      .sort((a, b) => b[1] - a[1])[0][0]
  };

  // 生成独特别名
  let alias = '';
  const timePrefix = stats.peakHour >= 23 || stats.peakHour <= 4 ? '夜' :
                    stats.peakHour >= 5 && stats.peakHour <= 8 ? '晨' :
                    stats.peakHour >= 9 && stats.peakHour <= 11 ? '朝' :
                    stats.peakHour >= 12 && stats.peakHour <= 13 ? '午' :
                    stats.peakHour >= 14 && stats.peakHour <= 17 ? '昳' : '夕';

  // 修改风格词生成逻辑
  const styleWord = 
    // 发言长度特征
    stats.avgWordsPerMessage > 30 ? '书' :
    stats.avgWordsPerMessage < 10 ? '简' :
    // 提问特征
    stats.questionRatio > 0.3 ? '问' :
    // 图片分享特征
    stats.imageRatio > 0.2 ? '影' :
    // 链接分享特征
    stats.linkRatio > 0.1 ? '链' :
    // 表情符号特征
    stats.emojiRatio > 0.3 ? '颜' :
    // 回复互动特征
    stats.replyRatio > 0.3 ? '答' :
    // 感叹句特征
    stats.exclamationRatio > 0.2 ? '叹' :
    // 如果没有明显特征，则根据消息总量选择
    analysis.totalMessages > 100 ? '谈' :
    analysis.totalMessages > 50 ? '论' :
    analysis.totalMessages > 20 ? '述' : '言';

  // 扩展情感词
  const emotionWord = 
    stats.emotionTendency === 'positive' && stats.emojiRatio > 0.2 ? '欢' :
    stats.emotionTendency === 'positive' ? '悦' :
    stats.emotionTendency === 'negative' && stats.exclamationRatio > 0.2 ? '慨' :
    stats.emotionTendency === 'negative' ? '忧' :
    stats.replyRatio > 0.3 ? '和' : '静';

  // 扩展后缀词
  const suffixWords = [
    '风', '月', '星', '云', '雨', '雪', '霜', '露', '华', '光',
    '溪', '泉', '河', '海', '山', '岚', '烟', '波', '尘', '影'
  ];

  // 生成唯一后缀
  const uniqueSuffix = Math.floor(
    (parseInt(memberId.replace(/\D/g, '')) || Date.now()) % suffixWords.length
  );

  // 组合别名
  alias = timePrefix + styleWord + emotionWord + suffixWords[uniqueSuffix];

  // 生成特征标签
  let traits = [];
  if (stats.questionRatio > 0.3) traits.push('求知者');
  if (stats.imageRatio > 0.2) traits.push('图说家');
  if (stats.linkRatio > 0.1) traits.push('资源达人');
  if (stats.emojiRatio > 0.3) traits.push('表情帝');
  if (stats.replyRatio > 0.3) traits.push('互动王');
  if (stats.avgWordsPerMessage > 30) traits.push('妙笔生花');
  
  // 生成个性化描述
  let description = `${timePrefix}时最活跃，`;
  
  if (stats.questionRatio > 0.3) description += '善于提问思考，';
  else if (stats.imageRatio > 0.2) description += '喜欢图片分享，';
  else if (stats.linkRatio > 0.1) description += '乐于传播知识，';
  else if (stats.emojiRatio > 0.3) description += '表情包达人，';
  else if (stats.replyRatio > 0.3) description += '互动积极热心，';
  else if (stats.avgWordsPerMessage > 30) description += '发言详实有深度，';
  
  description += stats.emotionTendency === 'positive' ? '总是充满活力。' :
                 stats.emotionTendency === 'negative' ? '心思较为细腻。' : '态度温和理性。';

  return {
    alias,
    description,
    traits: traits.slice(0, 3)
  };
};

// 修改用户画像图表配置
const getUserPersonaOption = (userId, rawData) => {
  if (!rawData || !Array.isArray(rawData)) {
    console.warn('无效的数据:', rawData);
    return {
    title: {
        text: '数据加载中',
      left: 'center',
        top: 20
      }
    };
  }

  const persona = generateMemberPersona(rawData, userId);

  return {
    title: {
      text: persona.alias,
      left: 'center',
      top: 5,
      textStyle: {
        fontSize: 16
      }
    },
    grid: {
      top: 30,
      bottom: 10,
      left: 20,
      right: 20,
      containLabel: true
    },
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: 30,
        children: [
          {
            type: 'text',
            style: {
              text: persona.description,
              fontSize: 12,
              fill: '#666',
              width: '90%',
              overflow: 'break',
              lineHeight: 16
            },
            left: 'center',
            top: 0
          },
          {
            type: 'text',
            style: {
              text: persona.traits.join(' · '),
              fontSize: 10,
              fill: '#999',
              width: '90%',
              overflow: 'break',
              lineHeight: 14
            },
            left: 'center',
            top: 25
          }
        ]
      }
    ]
  };
};

const ChatAnalysis = () => {
  const [selectedMember, setSelectedMember] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [chatData, setChatData] = useState(null);
  const [members, setMembers] = useState([{ ori: 'all', nick: '全部成员' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        console.log('开始加载数据...');
        const response = await fetch('/data/merged_chat_data.csv');
        if (!response.ok) {
          throw new Error(`数据加载失败: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('CSV解析结果:', {
              总行数: results.data.length,
              字段: results.meta.fields,
              示例数据: results.data[0]
            });

            if (results.data && results.data.length > 0) {
              const validData = results.data
                .filter(record => {
                  return record.Type === '1' && record.Sender && record.NickName;
                })
                .map(record => ({
                  msgSeq: record.localId,
                  type: record.Type,
                  talker: record.Sender, // 使用 Sender 替代 TalkerId
                  StrTime: record.StrTime || `${record.年}-${record.月}-${record.日} ${record.时}:${record.分}:${record.秒}`,
                  name: record.NickName,
                  message: record.StrContent,
                  status: record.Status,
                  isSend: record.IsSender
                }));

              console.log('有效数据条数:', validData.length);
              console.log('有效数据示例:', validData[0]);

              if (validData.length > 0) {
                setChatData(validData);
                const extractedMembers = extractMembers(validData);
                console.log('提取的成员:', extractedMembers);
                setMembers(extractedMembers);
              } else {
                setError('没有找到有效数据记录');
              }
            } else {
              setError('CSV 文件为空或格式不正确');
            }
            setLoading(false);
          },
          error: (error) => {
            console.error('Papa Parse 错误:', error);
            setError(`数据解析失败: ${error.message}`);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('数据加载错误:', error);
        setError(`${error.message}`);
        setLoading(false);
      }
    };

    loadChatData();
  }, []);

  // 修改成员提取函数
  const extractMembers = (data) => {
    const memberMap = new Map();
    memberMap.set('all', { ori: 'all', nick: '全部成员' });

    // 统计每个成员的消息数量
    const messageCount = {};
    const firstNickname = {}; // 记录每个 Sender 第一次出现时的昵称

    // 第一次遍历：记录第一次出现的昵称和统计消息数
    data.forEach(record => {
      if (record.talker) {
        // 统计消息数
        messageCount[record.talker] = (messageCount[record.talker] || 0) + 1;
        
        // 记录第一次出现的昵称
        if (!firstNickname[record.talker]) {
          firstNickname[record.talker] = record.name;
        }
      }
    });

    // 第二次遍历：创建成员列表
    Object.keys(firstNickname).forEach(sender => {
      memberMap.set(sender, {
        ori: sender,
        nick: firstNickname[sender],
        messageCount: messageCount[sender] || 0
      });
    });

    // 转换为数组并排序
    const members = [
      { ori: 'all', nick: '全部成员' },
      ...Array.from(memberMap.values())
        .filter(member => member.ori !== 'all')
        .sort((a, b) => b.messageCount - a.messageCount)
    ];

    console.log('提取的成员列表:', members);
    return members;
  };

  // 修改活跃度处理函数
  const processActivityByHour = (data) => {
    const hourCounts = Array(24).fill(0);
    
    data.forEach(record => {
      if (record.StrTime) {
        const date = new Date(record.StrTime);
        if (!isNaN(date.getTime())) {
          const hour = date.getHours();
          hourCounts[hour]++;
        }
      }
    });

    return hourCounts.map((count, hour) => ({
      hour: String(hour).padStart(2, '0'),
      count
    }));
  };

  const processActivityByDay = (data) => {
    const dayMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dayCounts = Array(7).fill(0);
    
    data.forEach(record => {
      if (record.StrTime) {
        const date = new Date(record.StrTime);
        if (!isNaN(date.getTime())) {
          const dayIndex = date.getDay();
          dayCounts[dayIndex]++;
        }
      }
    });

    return dayMap.map((day, index) => ({
      day,
      count: dayCounts[index]
    }));
  };

  const processWordCloud = (data) => {
    if (!data || data.length === 0) return [];

    const wordCount = new Map();
    const stopWords = new Set(['的', '了', '和', '是', '就', '都', '而', '及', '与', '这', '那', '有', '在', '我', '你', '他', '她', '它', '们']);

    data.forEach(record => {
      if (!record.message) return;
      
      // 移除@开头的内容
      const cleanMessage = record.message.replace(/@[^\s]+/g, '');
      
      // 分词并统计
      const words = cleanMessage
        .split(/[,，。！？\s]+/)
        .filter(word => 
          word.length > 1 && 
          !stopWords.has(word) && 
          !word.startsWith('@')  // 额外确保过滤@开头的词
        );

      words.forEach(word => {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      });
    });

    // 转换为词云数据格式
    return Array.from(wordCount.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 100);  // 取前100个高频词
  };

  const processMemberActivity = (data) => {
    const memberStats = new Map();

    data.forEach(record => {
      if (record.talker) {
        if (!memberStats.has(record.talker)) {
          memberStats.set(record.talker, {
            ori: record.talker,
            name: record.name || record.talker,
            messages: 0,
            images: 0,
            links: 0
          });
        }

        const stats = memberStats.get(record.talker);
        stats.messages++;
        
        // 统计图片和链接
        if (record.message) {
          if (record.message.includes('<?xml') || record.message.includes('<img')) {
            stats.images++;
          }
          if (record.message.includes('http://') || record.message.includes('https://')) {
            stats.links++;
          }
        }
      }
    });

    return Array.from(memberStats.values());
  };

  const processEmotionAnalysis = (data) => {
    // 简单的情感分析（可以根据需要使用更复杂的算法）
    const positiveWords = new Set(['好', '棒', '赞', '喜欢', '爱', '开心', '感谢', '谢谢']);
    const negativeWords = new Set(['差', '烂', '讨厌', '恨', '难过', '伤心', '失望']);
    
    let positive = 0;
    let negative = 0;
    let neutral = 0;

    data.forEach(record => {
      if (record.message) {
        let hasPositive = false;
        let hasNegative = false;

        positiveWords.forEach(word => {
          if (record.message.includes(word)) hasPositive = true;
        });

        negativeWords.forEach(word => {
          if (record.message.includes(word)) hasNegative = true;
        });

        if (hasPositive && !hasNegative) positive++;
        else if (!hasPositive && hasNegative) negative++;
        else neutral++;
      }
    });

    return { positive, neutral, negative };
  };

  const processInteractionNetwork = (data, members) => {
    if (!data || data.length === 0 || !members || members.length === 0) {
      console.warn('无效的输入数据');
      return null;
    }

    const uniqueMembers = new Map();
    const interactions = new Map();

    // 从成员列表初始化成员信息
    members.forEach(member => {
      if (member.ori !== 'all') {
        uniqueMembers.set(member.ori, {
          name: member.nick,
          value: member.messageCount || 0
        });
      }
    });

    // 统计互动关系
    data.forEach(record => {
      const sender = record.talker;
      if (!sender || !uniqueMembers.has(sender)) return;

      if (record.message && record.message.includes('@')) {
        const mentions = record.message.match(/@([^@\s]+)/g);
        if (mentions) {
          mentions.forEach(mention => {
            const mentionedName = mention.slice(1);
            const mentionedMember = Array.from(uniqueMembers.entries())
              .find(([_, info]) => info.name === mentionedName)?.[0];
            
            if (mentionedMember && mentionedMember !== sender) {
              const interactionKey = [sender, mentionedMember].sort().join('-');
              interactions.set(interactionKey, (interactions.get(interactionKey) || 0) + 1);
            }
          });
        }
      }
    });

    const nodes = Array.from(uniqueMembers.entries()).map(([id, info]) => ({
      id: id,
      name: info.name,
      value: info.value
    }));

    const links = Array.from(interactions.entries()).map(([key, value]) => {
      const [source, target] = key.split('-');
      return {
        source: source,
        target: target,
        value: value
      };
    });

    return { nodes, links };
  };

  const getNetworkOption = (data) => {
    if (!data) {
      console.warn('网络数据为空');
      return {
        title: { text: '暂无数据' }
      };
    }

    // 根据消息数量计算合适的节点大小范围
    const messageValues = data.nodes.map(node => node.value);
    const maxMessage = Math.max(...messageValues);
    const minMessage = Math.min(...messageValues);
    
    // 颜色方案
    const colors = {
      node: {
        fill: '#61649f',      // 更新节点填充色
        active: '#2c3e50',    // 保持激活状态颜色
        border: '#302f4b',    // 更新节点边缘颜色
        text: '#5c2223'       // 更新成员名称颜色
      },
      link: {
        line: '#a7a8bd',      // 更新连线颜色
        active: '#34495e'     // 保持激活状态连线颜色
      }
    };

    return {
    title: {
        text: '群成员互动网络',
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#2c3e50'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (params.dataType === 'node') {
            return `<div style="font-weight:bold;color:${colors.node.active}">${params.name}</div>消息数：${params.value}`;
          }
          return `<div style="font-weight:bold;color:${colors.link.active}">互动关系</div>${params.source} ↔ ${params.target}<br/>互动次数：${params.value}`;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#eee',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          fontSize: 12
        }
      },
      series: [{
        type: 'graph',
        layout: 'force',
        data: data.nodes.map(node => {
          const size = 40 + (Math.log(node.value - minMessage + 1) / Math.log(maxMessage - minMessage + 1)) * 40;
          return {
            ...node,
            symbolSize: size,
            label: {
              show: true,
              position: 'inside',
              fontSize: Math.min(size * 0.3, 14),
              color: colors.node.text,  // 使用新的文字颜色
              fontWeight: 'bold'
            },
            itemStyle: {
              color: colors.node.fill,    // 使用新的节点填充色
              borderColor: colors.node.border,  // 使用新的边缘颜色
              borderWidth: 2,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 5
            }
          };
        }),
        links: data.links.map(link => ({
          ...link,
          lineStyle: {
            color: colors.link.line,  // 使用新的连线颜色
            width: Math.log(link.value + 1) * 1.5,
            opacity: 0.7,
            curveness: 0.1,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 2
          }
        })),
        categories: [],
        roam: true,
        draggable: true,
        force: {
          repulsion: [100, 500],  // 使用范围值提高性能
          gravity: 0.1,
          edgeLength: [100, 300], // 使用范围值
          friction: 0.8,          // 增加摩擦力减少晃动
          layoutAnimation: false  // 关闭布局动画提高性能
        },
        emphasis: {
          focus: 'adjacency',
          scale: true,
        label: {
            fontSize: 16,
            fontWeight: 'bold'
          },
          itemStyle: {
            color: colors.node.active
          },
          lineStyle: {
            color: colors.link.active,
            opacity: 0.9,
            width: 3
          }
        },
        nodeScaleRatio: 0.4,
        zlevel: 2,
        progressive: 100,         // 渐进式渲染
        progressiveThreshold: 200,// 渐进式渲染阈值
        edgeSymbol: ['none', 'none'],
        edgeSymbolSize: 8,
        animation: false,         // 关闭初始动画提高性能
        large: true,             // 大规模优化
        largeThreshold: 100,     // 大规模阈值
        legendHoverLink: false   // 关闭图例联动提高性能
      }]
    };
  };

  // 添加时间过滤函数
  const filterDataByTimeRange = (data, range) => {
    if (range === 'all') return data;

    const now = new Date();
    let startDate;

    switch (range) {
      case 'last7days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'last30days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'last90days':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case 'lastyear':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return data;
    }

    return data.filter(record => {
      if (!record.StrTime) return false;
      const recordDate = new Date(record.StrTime);
      return recordDate >= startDate && recordDate <= new Date();
    });
  };

  // 修改数据处理函数
  const processData = (rawData) => {
    if (!rawData || rawData.length === 0) {
      console.warn('没有可用的聊天数据');
      return null;
    }

    const filteredData = filterDataByTimeRange(rawData, timeRange);
    const memberFilteredData = selectedMember === 'all' 
      ? filteredData 
      : filteredData.filter(record => record.talker === selectedMember);

    // 传入 members 数据
    const networkData = processInteractionNetwork(memberFilteredData, members);

    return {
      rawData: memberFilteredData,
      activityByHour: processActivityByHour(memberFilteredData),
      activityByDay: processActivityByDay(memberFilteredData),
      wordCloud: processWordCloud(memberFilteredData),
      memberActivity: processMemberActivity(memberFilteredData),
      emotionAnalysis: processEmotionAnalysis(memberFilteredData),
      interactionNetwork: networkData
    };
  };

  // 使用 useMemo 优化数据处理
  const processedData = React.useMemo(() => {
    return chatData ? processData(chatData) : null;
  }, [chatData, selectedMember, timeRange]);

  // 添加错误和加载状态的显示
  if (loading) {
    return <div>数据加载中...</div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

  if (!chatData || chatData.length === 0) {
    return <div>没有可用的数据</div>;
  }

  // 修改图表选项
  const getActivityByHourOption = (data) => ({
    title: {
      text: '每小时活跃度'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: data.map(item => `${item.hour}时`)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: data.map(item => item.count),
      type: 'line',
      smooth: true
    }]
  });

  const getActivityByDayOption = (data) => ({
    title: {
      text: '每日活跃度'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.day)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: data.map(item => item.count),
      type: 'bar'
    }]
  });

  // 图表配置
  const hourlyActivityOption = {
    title: {
      text: '每小时活跃度'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: processedData.activityByHour.map(item => `${item.hour}时`)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: processedData.activityByHour.map(item => item.count),
      type: 'line',
      smooth: true
    }]
  };

  const dailyActivityOption = {
    title: {
      text: '每日活跃度'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: processedData.activityByDay.map(item => item.day)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: processedData.activityByDay.map(item => item.count),
      type: 'bar'
    }]
  };

  const wordCloudOption = {
    title: {
      text: '聊天关键词'
    },
    tooltip: {},
    series: [{
      type: 'wordCloud',
      data: processedData.wordCloud,
      textStyle: {
        normal: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold'
        }
      }
    }]
  };

  const memberActivityOption = {
    title: {
      text: '成员活跃度'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['消息数', '图片数', '链接数']
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: processedData.memberActivity.map(item => item.name)
    },
    series: [
      {
        name: '消息数',
        type: 'bar',
        data: processedData.memberActivity.map(item => item.messages)
      },
      {
        name: '图片数',
        type: 'bar',
        data: processedData.memberActivity.map(item => item.images)
      },
      {
        name: '链接数',
        type: 'bar',
        data: processedData.memberActivity.map(item => item.links)
      }
    ]
  };

  const emotionOption = {
      title: {
      text: '情感分析'
      },
      tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: '50%',
      data: [
        { value: processedData.emotionAnalysis.positive, name: '积极' },
        { value: processedData.emotionAnalysis.neutral, name: '中性' },
        { value: processedData.emotionAnalysis.negative, name: '消极' }
      ]
    }]
  };

  const networkOption = getNetworkOption(processedData.interactionNetwork);

  return (
    <AnalysisContainer>
      <GlobalStyle>
        <h1>群聊数据分析</h1>
        <FilterContainer>
          <FilterGroup>
            <Label>成员：</Label>
            <Select 
              value={selectedMember} 
              onChange={(e) => setSelectedMember(e.target.value)}
              style={{ minWidth: '200px' }}
            >
              {members.map(member => (
                <option key={member.ori} value={member.ori}>
                  {member.nick}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>时间范围：</Label>
            <Select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {TIME_RANGES.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </Select>
          </FilterGroup>
        </FilterContainer>
        
        <ChartGrid>
          <ChartSection className="persona">
            <ReactECharts 
              option={getUserPersonaOption(selectedMember, processedData?.rawData)} 
              style={{ height: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </ChartSection>
          
          <div className="charts-row">
            <ChartSection className="chart">
            <ReactECharts 
                option={getActivityByHourOption(processedData?.activityByHour)} 
              style={{ height: '100%' }}
            />
          </ChartSection>
            
            <ChartSection className="chart">
            <ReactECharts 
                option={getActivityByDayOption(processedData?.activityByDay)} 
              style={{ height: '100%' }}
            />
          </ChartSection>
            
            <ChartSection className="chart">
            <ReactECharts 
                option={wordCloudOption} 
              style={{ height: '100%' }}
            />
          </ChartSection>
            
            <ChartSection className="chart">
            <ReactECharts 
                option={emotionOption} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          </div>

          <ChartSection className="network-chart">
            {processedData?.interactionNetwork ? (
            <ReactECharts 
                option={getNetworkOption(processedData.interactionNetwork)} 
              style={{ height: '100%' }}
                onEvents={{
                  // 添加图表事件监听
                  rendered: () => {
                    console.log('网络图表已渲染');
                  },
                  click: (params) => {
                    console.log('图表交互:', params);
                  }
                }}
              />
            ) : (
              <div>加载中...</div>
            )}
          </ChartSection>
        </ChartGrid>
      </GlobalStyle>
    </AnalysisContainer>
  );
};

export default ChatAnalysis; 