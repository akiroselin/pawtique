import PageWithGallery from '@/components/configurator/PageWithGallery';
import productsData from '../../../../products-data.json';

export default function PaintingPage() {
  return (
    <PageWithGallery
      slug="painting"
      productType="painting"
      frameColor="#8B5E3C"
      products={productsData.product_lines.painting || []}
      configurator={{
        title: '手绘油画 / 水彩肖像配置器',
        emoji: '🖼️',
        imageLine: 'painting',
        tier: 'Tier 2 · P2a 阶段',
        description: '上传照片 → 选风格/构图/背景/尺寸/画框 → 欧洲签约艺术家制作 → 4 周交付',
        features: [
          '4 种绘画风格：油画 / 水彩 / 彩铅 / 数字手绘',
          '5 种构图：头部 / 半身 / 全身 / 双宠 / 三宠',
          '背景选项：纯色 / 渐变 / 场景 / 自定义',
          '6 种画框：橡木 / 胡桃 / 现代白 / 复古金 / 简约黑 / 无框画布',
          '签约 5-10 位欧洲艺术家（英国 / 波兰 / 乌克兰）',
          '£120 起 · 免费 proof + 1 次免费修改',
        ],
      }}
    />
  );
}
