import PageWithGallery from '@/components/configurator/PageWithGallery';
import productsData from '../../../../products-data.json';

export default function UrnPage() {
  return (
    <PageWithGallery
      slug="urn"
      products={productsData.product_lines.urn || []}
      configurator={{
        title: '设计师陶瓷 Urn 配置器',
        emoji: '🏺',
        imageLine: 'urn',
        tier: 'Tier 3 · P3b 阶段',
        description: '选尺寸 × 10+ 釉色 × 表面处理 × 刻印文字/符号/爪印 → 实时 3D 预览 → 欧洲高端设计师款',
        features: [
          '10+ 釉色：奶白 / 蜜糖 / 玫瑰金 / 暮色紫 / 海洋蓝 / 苔绿 / 焦糖 / 烟灰 / 雪白 / 石墨',
          '5 种表面处理：哑光 / 亮光 / 拉丝 / 手绘纹理 / 素烧',
          '刻印选项：名字 / 日期 / 爪印 / 符号 / 自定义文字',
          '3 种尺寸：S（< 5kg 宠物）/ M（5-15kg）/ L（> 15kg）',
          'Three.js urn 3D 模型 + 实时纹理预览',
          '£120 起 · 精密螺纹盖 · 欧洲本地陶瓷工坊',
        ],
      }}
    />
  );
}
