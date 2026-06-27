import PageWithGallery from '@/components/configurator/PageWithGallery';
import productsData from '../../../../products-data.json';

export default function WoolFeltPage() {
  return (
    <PageWithGallery
      slug="wool-felt"
      productType="pillow"
      fabricColor="#F4F1EA"
      products={productsData.product_lines['wool-felt'] || []}
      configurator={{
        title: '羊毛毡定制抱枕',
        emoji: '🛏️',
        imageLine: 'wool-felt',
        tier: 'Tier 1 · P1a 阶段',
        description: '上传宠物照片 → 选羊毛色调 → 3D 实物预览（6 面贴图）→ 欧洲签约羊毛毡工坊手工制作',
        features: [
          '6 面满版贴图（cover-fit，照片环绕抱枕）',
          '4 种尺寸：30×30 / 40×40 / 50×50 / 60×60 cm',
          '3 种填充：PP 棉 / 记忆棉 / 荞麦壳',
          '可机洗外罩（YKK 隐形拉链）',
          'Three.js 实时 3D 预览（拖拽旋转 + 缩放）',
          '€45 起 · 7-14 天交付 · 终身修补',
        ],
      }}
    />
  );
}
