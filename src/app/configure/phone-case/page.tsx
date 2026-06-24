import PageWithGallery from '@/components/configurator/PageWithGallery';
import productsData from '../../../../products-data.json';

export default function PhoneCasePage() {
  return (
    <PageWithGallery
      slug="phone-case"
      products={productsData.product_lines['phone-case'] || []}
      configurator={{
        title: '宠物定制手机壳',
        emoji: '📱',
        tier: 'Tier 2 · 时尚穿戴',
        description: '上传宠物照片 → AI 抠图 → 选壳型/材质/排版/边框 → 9H 钢化玻璃喷印 → 5-7 天欧洲到货',
        features: [
          '全机型覆盖：iPhone 12-16 / Samsung S22-S25 / Pixel 6-9',
          '3 种壳型：钢化玻璃 / 硅胶软壳 / 透明硬壳',
          '6 种排版：单图 / 九宫格 / 全屏 / 心形 / 卡通边框 / 黑白滤镜',
          '9H 钢化玻璃喷印 · 防刮防摔',
          'AI 自动抠图 · 5 秒预览效果',
          '€25 起 · 起订 1 件 · 5-7 天到货',
        ],
      }}
    />
  );
}
