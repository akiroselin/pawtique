import PageWithGallery from '@/components/configurator/PageWithGallery';
import productsData from '../../../../products-data.json';

export default function JewelryPage() {
  return (
    <PageWithGallery
      slug="jewelry"
      products={productsData.product_lines.jewelry || []}
      configurator={{
        title: '高级树脂首饰配置器',
        emoji: '💎',
        imageLine: 'jewelry',
        tier: 'Tier 2 · P2b 阶段',
        description: '上传照片/提供毛发/骨灰 → 选吊坠形状/嵌入物/树脂染色/链长 → 实时 3D 预览',
        features: [
          '6 种吊坠形状：心 / 圆 / 水滴 / 宠物轮廓 / 爪印 / 椭圆',
          '嵌入物选项：宠物毛发 / 骨灰 / 干花 / 金箔 / 照片',
          '8 种树脂染色：透明 / 蜜糖 / 玫瑰 / 紫罗兰 / 海蓝 / 薄荷 / 樱桃 / 烟灰',
          '925 银链 · 3 种长度（40/45/50cm）',
          'Three.js 实时 3D 预览',
          '£80 起 · 密封工艺保证 + 终身保修',
        ],
      }}
    />
  );
}
