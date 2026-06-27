import PageWithGallery from '@/components/configurator/PageWithGallery';
import productsData from '../../../../products-data.json';

export default function AIArtPage() {
  // AI 增强艺术画借用 painting 类别的产品作为案例展示（都是图像类作品）
  const products = productsData.product_lines.painting || [];
  return (
    <PageWithGallery
      slug="painting"
      productType="sandstone"
      products={products}
      configurator={{
        title: 'AI 增强艺术画配置器',
        emoji: '🎨',
        imageLine: 'painting',
        tier: 'Tier 1 · P1c 阶段',
        description: '上传照片 → 5 种艺术风格 + 调色板 + 构图 + 输出材质 → 实时风格迁移 → 72 小时到货',
        features: [
          '6 种艺术风格：文艺复兴 / 浮世绘 / 印象派 / 波普 / 水彩 / 油画',
          '5 种调色板：暖色 / 冷色 / 粉彩 / 单色 / 鲜艳',
          '4 种构图：头部 / 半身 / 全身 / 多宠合影',
          '4 种输出：画布 / 框画 / 金属打印 / 木板打印',
          'Replicate Stable Diffusion 实时风格迁移',
          '£80 起 · 72 小时到货（解决"等太久"的核心痛点）',
        ],
      }}
    />
  );
}
