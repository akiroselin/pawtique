import PageWithGallery from '@/components/configurator/PageWithGallery';
import productsData from '../../../../products-data.json';

export default function ApparelPage() {
  return (
    <PageWithGallery
      slug="apparel"
      productType="tshirt"
      fabricColor="#F4F1EA"
      products={productsData.product_lines.apparel || []}
      configurator={{
        title: '宠物刺绣 T 恤 / 卫衣',
        emoji: '👕',
        tier: 'Tier 2 · 穿戴',
        description: '上传宠物头像 → 选款式/刺绣颜色/位置/尺码 → 100% 纯棉 + 高密刺绣 → 5-7 天欧洲到货',
        features: [
          '4 种款式：T 恤 / 卫衣 / 棒球帽 / 帆布袋',
          '8 种底色：白 / 黑 / 米白 / 浅灰 / 海军蓝 / 粉 / 黄 / 军绿',
          '高密度机绣（非印刷）· 1000+ 针/平方厘米',
          '12 种绣线色：黑/白/灰/棕/金/银/红/蓝/绿/粉/黄/橙',
          '3 个位置：胸口 / 后背 / 帽子正前',
          '5 个尺码：XS / S / M / L / XL',
          '€39 起 · 起订 1 件 · 5-7 天到货',
        ],
      }}
    />
  );
}
