import Placeholder from '@/components/configurator/Placeholder';

export default function VideoPage() {
  return (
    <Placeholder
      title="悼念视频 + USB 礼盒配置器"
      emoji="🎬"
      tier="Tier 3 · P3a 阶段"
      description="上传多张照片 → 5 模板 + 音乐库 + 文字/日期/故事 → 实时预览 → 实体 USB 木盒交付"
      features={[
        '5 种模板：电影感 / 纪录片 / 温馨日常 / 怀旧胶片 / 极简黑白',
        '10+ 首免版税音乐（calm/emotional/hopeful 三类）',
        '文字叠加：宠物名字 / 日期 / 主人留言',
        '4K 输出 + 实体 USB（木盒/磁带造型）',
        'FFmpeg 视频合成 + Web 实时预览',
        '£60 起 · 实体 USB 解决"数字交付仪式感缺失"痛点',
      ]}
    />
  );
}