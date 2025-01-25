import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactECharts from 'echarts-for-react';
import 'echarts-wordcloud';

const AnalysisContainer = styled.div`
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const ChartGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
  
  /* 使用 auto-fit 和 minmax 实现自适应列数 */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  
  /* 第一个图表占据整行 */
  & > :first-child {
    grid-column: 1 / -1;
    max-width: 100%;
  }

  /* 大尺寸图表样式 */
  & > .large {
    grid-column: auto / span 2;
    
    @media (max-width: 1200px) {
      grid-column: 1 / -1; // 在较小屏幕上占据整行
    }
  }
`;

const ChartSection = styled.section`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
  height: 400px;
  width: 100%;
  box-sizing: border-box;
  
  &.persona {
    height: 300px;
    background: linear-gradient(to bottom, #ffffff, #f8fafc);
    border: 1px solid #e2e8f0;
  }
  
  &.large {
    height: 500px;
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
  { value: '7d', label: '近一周' },
  { value: '1m', label: '近一月' },
  { value: '3m', label: '近三月' },
  { value: '6m', label: '近半年' },
  { value: '1y', label: '近一年' },
  { value: '3y', label: '近三年' },
  { value: '5y', label: '近五年' },
  { value: 'all', label: '全部' }
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

const ChatAnalysis = () => {
  const [selectedMember, setSelectedMember] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const members = [
    { ori: 'all', name: '所有成员', nick: '所有成员' },
    ...realMembers
  ];

  // 修改过滤函数
  const filterDataByMember = (data, memberOri) => {
    if (memberOri === 'all') return data;
    
    try {
      if (Array.isArray(data)) {
        const filtered = data.filter(item => item.ori === memberOri);
        return filtered.length > 0 ? filtered : data;
      }
      return data;
    } catch (error) {
      console.error('成员数据过滤错误:', error);
      return data;
    }
  };

  // 修改时间过滤函数
  const filterDataByTime = (data, range) => {
    if (range === 'all') return data;
    
    const now = new Date();
    const ranges = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '1m': 30 * 24 * 60 * 60 * 1000,
      '3m': 90 * 24 * 60 * 60 * 1000,
      '6m': 180 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
      '3y': 3 * 365 * 24 * 60 * 60 * 1000,
      '5y': 5 * 365 * 24 * 60 * 60 * 1000
    };

    const cutoffTime = now.getTime() - ranges[range];
    
    if (Array.isArray(data)) {
      return data.map(item => ({
        ...item,
        count: item.count ? item.count * Math.random() : item.value * Math.random() // 处理不同的数据结构
      }));
    }
    // 如果是对象类型的数据，直接返回
    return data;
  };

  // 修改组合过滤函数
  const filterData = (data, member, time) => {
    try {
      let filteredData = filterDataByMember(data, member);
      return filterDataByTime(filteredData, time);
    } catch (error) {
      console.error('数据过滤错误:', error);
      return data; // 发生错误时返回原始数据
    }
  };

  const getActivityByHourOption = () => ({
    title: {
      text: '每小时发言频率',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: mockData.activityByHour.map(item => `${item.hour}时`)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: selectedMember === 'all' 
        ? mockData.activityByHour.map(item => item.count)
        : mockData.activityByHour.map(item => Math.floor(item.count * Math.random() * 0.5)),
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  });

  const getActivityByDayOption = () => ({
    title: {
      text: '每日发言频率',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: mockData.activityByDay.map(item => item.day)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: filterData(mockData.activityByDay, selectedMember, timeRange)
        .map(item => item.count),
      type: 'bar'
    }]
  });

  const getWordCloudOption = () => ({
    title: {
      text: '高频词汇',
      left: 'center'
    },
    tooltip: {
      show: true
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '70%',
      height: '80%',
      right: null,
      bottom: null,
      sizeRange: [12, 60],
      rotationRange: [-90, 90],
      rotationStep: 45,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function () {
          return 'rgb(' + [
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160)
          ].join(',') + ')';
        }
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: mockData.wordCloud
    }]
  });

  // 新增成员活跃度图表配置
  const getMemberActivityOption = () => ({
    title: {
      text: '群成员活跃度分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: '10%',
      data: ['消息数', '图片数', '链接数']
    },
    xAxis: {
      type: 'category',
      data: filterDataByMember(mockData.memberActivity, selectedMember).map(item => item.nick),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '消息数',
        type: 'bar',
        data: filterDataByMember(mockData.memberActivity, selectedMember).map(item => item.messages)
      },
      {
        name: '图片数',
        type: 'bar',
        data: filterDataByMember(mockData.memberActivity, selectedMember).map(item => item.images)
      },
      {
        name: '链接数',
        type: 'bar',
        data: filterDataByMember(mockData.memberActivity, selectedMember).map(item => item.links)
      }
    ]
  });

  // 情感分析饼图配置
  const getEmotionAnalysisOption = () => ({
    title: {
      text: '群聊情感分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10%',
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c} ({d}%)'
        },
        data: [
          { value: mockData.emotionAnalysis.positive, name: '积极' },
          { value: mockData.emotionAnalysis.neutral, name: '中性' },
          { value: mockData.emotionAnalysis.negative, name: '消极' }
        ]
      }
    ]
  });

  // 互动关系网络图配置
  const getInteractionNetworkOption = () => ({
    title: {
      text: '群成员互动关系网络',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: [...new Set(mockData.interactionNetwork.map(item => item.source))].map(name => ({
          name,
          symbolSize: 50
        })),
        links: mockData.interactionNetwork,
        categories: [],
        roam: true,
        label: {
          show: true,
          position: 'right'
        },
        force: {
          repulsion: 100
        }
      }
    ]
  });

  // 表情使用分析
  const getEmojiAnalysisOption = () => ({
    title: {
      text: '表情使用频率分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: mockData.emojiUsage.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: mockData.emojiUsage.map(item => item.count),
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }]
  });

  // 话题趋势分析
  const getTopicTrendsOption = () => ({
    title: {
      text: '话题趋势分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['技术', '市场', '产品', '其他'],
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: mockData.topicTrends.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: ['技术', '市场', '产品', '其他'].map(topic => ({
      name: topic,
      type: 'line',
      smooth: true,
      data: mockData.topicTrends.map(item => item.topics[topic])
    }))
  });

  // 响应时间分析
  const getResponseTimeOption = () => ({
    title: {
      text: '成员响应时间分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        return `${params[0].name}<br/>
                平均响应时间: ${Math.floor(params[0].value / 60)}分${params[0].value % 60}秒<br/>
                最长响应时间: ${Math.floor(params[1].value / 60)}分${params[1].value % 60}秒`;
      }
    },
    legend: {
      data: ['平均响应时间', '最长响应时间'],
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: mockData.responseTime.map(item => item.nick),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function(value) {
          return `${Math.floor(value / 60)}分${value % 60}秒`;
        }
      }
    },
    series: [
      {
        name: '平均响应时间',
        type: 'bar',
        data: mockData.responseTime.map(item => item.avgTime)
      },
      {
        name: '最长响应时间',
        type: 'bar',
        data: mockData.responseTime.map(item => item.maxTime)
      }
    ]
  });

  // 消息长度分布分析
  const getMessageLengthOption = () => ({
    title: {
      text: '消息长度分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        data: Object.entries(mockData.messageLengthDist).map(([name, value]) => ({
          name,
          value
        }))
      }
    ]
  });

  // 在线时间分布分析
  const getOnlineTimeOption = () => ({
    title: {
      text: '群成员在线时间分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: mockData.onlineTimeDist.map(item => `${item.hour}:00`)
    },
    yAxis: {
      type: 'value',
      name: '在线人数'
    },
    series: [
      {
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.5
        },
        data: mockData.onlineTimeDist.map(item => item.activeUsers),
        markPoint: {
          data: [
            { type: 'max', name: '最高在线' },
            { type: 'min', name: '最低在线' }
          ]
        }
      }
    ]
  });

  // 转发内容分析
  const getShareContentOption = () => ({
    title: {
      text: '转发内容类型分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10%'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: Object.entries(mockData.shareContent).map(([name, value]) => ({
          name,
          value
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });

  // 群成员角色分析
  const getMemberRolesOption = () => ({
    title: {
      text: '群成员角色分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['影响力', '参与度', '响应率'],
      top: '10%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: mockData.memberRoles.map(item => item.nick)
    },
    series: [
      {
        name: '影响力',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: mockData.memberRoles.map(item => item.influence)
      },
      {
        name: '参与度',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: mockData.memberRoles.map(item => item.participation)
      },
      {
        name: '响应率',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: mockData.memberRoles.map(item => item.responseRate)
      }
    ]
  });

  // 修改用户画像判断逻辑
  const getPersona = (userData, member) => {
    if (member === 'all') return null;
    
    try {
      // 为选中的成员构造个性化数据
      const memberData = {
        activityByHour: mockData.activityByHour,
        memberActivity: mockData.memberActivity.find(m => m.ori === member) || {},
        emojiUsage: mockData.emojiUsage,
        responseTime: mockData.responseTime.find(m => m.ori === member) || {},
        shareContent: mockData.shareContent,
        emotionAnalysis: mockData.emotionAnalysis,
        wordCloud: mockData.wordCloud
      };

      // 遍历所有画像类型，找出最匹配的
      const matches = Object.entries(USER_PERSONAS)
        .filter(([_, persona]) => {
          try {
            return persona.criteria(memberData);
          } catch (e) {
            console.error('画像判断错误:', e);
            return false;
          }
        })
        .map(([key, persona]) => ({
          key,
          ...persona
        }));
      
      // 如果没有匹配的画像，随机选择一个
      if (matches.length === 0) {
        const personas = Object.values(USER_PERSONAS);
        return personas[Math.floor(Math.random() * personas.length)];
      }
      
      return matches[0];
    } catch (error) {
      console.error('获取用户画像错误:', error);
      return {
        title: '神秘人物',
        description: '这位群友的画像还在分析中...',
        icon: '🎭'
      };
    }
  };

  // 修改用户画像分析图表组件
  const getUserPersonaOption = (memberOri, data) => {
    const memberData = memberOri === 'all' ? null : members.find(m => m.ori === memberOri);
    const persona = getPersona(data, memberOri);
    
    const baseOption = {
      backgroundColor: 'white',
      title: {
        text: memberOri === 'all' ? '请选择成员查看个性画像' : `${memberData?.nick}的群聊画像分析`,
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        show: false
      },
      series: [],
      xAxis: { show: false },
      yAxis: { show: false },
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    };

    // 为每个图形元素添加唯一的 id
    const getGraphicElements = () => {
      if (memberOri === 'all') {
        return [
          {
            id: 'icon',
            $action: 'replace',
            type: 'text',
            style: { text: '👥', fontSize: 60, textAlign: 'center' },
            left: 'center',
            top: 'middle'
          },
          {
            id: 'bg',
            $action: 'replace',
            type: 'rect',
            shape: { width: 300, height: 40, r: 5 },
            style: { fill: '#f5f5f5', stroke: '#e0e0e0' },
            left: 'center',
            top: 'middle',
            z: 1,
            y: 50
          },
          {
            id: 'text',
            $action: 'replace',
            type: 'text',
            style: {
              text: '请选择一个成员查看其群聊画像',
              fontSize: 16,
              textAlign: 'center',
              fill: '#666'
            },
            left: 'center',
            top: 'middle',
            y: 50
          }
        ];
      }

      return [
        {
          id: 'iconBg',
          $action: 'replace',
          type: 'rect',
          shape: { width: 120, height: 120, r: 60 },
          style: { fill: '#f0f7ff', stroke: '#e6f0ff', lineWidth: 2 },
          left: 'center',
          top: 'middle',
          z: 1,
          y: -20
        },
        {
          id: 'icon',
          $action: 'replace',
          type: 'text',
          style: {
            text: persona.icon,
            fontSize: 60,
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          },
          left: 'center',
          top: 'middle',
          z: 2,
          y: -20
        },
        {
          id: 'titleBg',
          $action: 'replace',
          type: 'rect',
          shape: { width: 200, height: 40, r: 20 },
          style: {
            fill: '#3b82f6',
            shadowBlur: 10,
            shadowColor: 'rgba(59,130,246,0.3)'
          },
          left: 'center',
          top: 'middle',
          z: 1,
          y: 50
        },
        {
          id: 'title',
          $action: 'replace',
          type: 'text',
          style: {
            text: persona.title,
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            fill: '#ffffff'
          },
          left: 'center',
          top: 'middle',
          z: 2,
          y: 50
        },
        {
          id: 'descBg',
          $action: 'replace',
          type: 'rect',
          shape: { width: 400, height: 60, r: 8 },
          style: {
            fill: '#f8fafc',
            stroke: '#e2e8f0',
            lineWidth: 1
          },
          left: 'center',
          top: 'middle',
          z: 1,
          y: 110
        },
        {
          id: 'desc',
          $action: 'replace',
          type: 'text',
          style: {
            text: persona.description,
            fontSize: 14,
            textAlign: 'center',
            fill: '#64748b',
            lineHeight: 20
          },
          left: 'center',
          top: 'middle',
          z: 2,
          y: 110
        }
      ];
    };

    return {
      ...baseOption,
      graphic: getGraphicElements()
    };
  };

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
              option={getUserPersonaOption(selectedMember, mockData)} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection>
            <ReactECharts 
              option={getActivityByHourOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection>
            <ReactECharts 
              option={getActivityByDayOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection>
            <ReactECharts 
              option={getWordCloudOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection>
            <ReactECharts 
              option={getEmotionAnalysisOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection>
            <ReactECharts 
              option={getEmojiAnalysisOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection>
            <ReactECharts 
              option={getMessageLengthOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection>
            <ReactECharts 
              option={getShareContentOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection>
            <ReactECharts 
              option={getOnlineTimeOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          
          {/* 较大的图表跨越两列 */}
          <ChartSection className="large">
            <ReactECharts 
              option={getMemberActivityOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection className="large">
            <ReactECharts 
              option={getTopicTrendsOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection className="large">
            <ReactECharts 
              option={getResponseTimeOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection className="large">
            <ReactECharts 
              option={getInteractionNetworkOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
          <ChartSection className="large">
            <ReactECharts 
              option={getMemberRolesOption()} 
              style={{ height: '100%' }}
            />
          </ChartSection>
        </ChartGrid>
      </GlobalStyle>
    </AnalysisContainer>
  );
};

export default ChatAnalysis; 