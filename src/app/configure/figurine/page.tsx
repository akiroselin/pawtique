import Placeholder from '@/components/configurator/Placeholder';

export default function FigurinePage() {
  return (
    <Placeholder
      title="3D 打印 / 陶瓷雕塑配置器"
      emoji="🗿"
      tier="Tier 1 · P1b 阶段"
      description="上传多角度宠物照片 → AI 生成 3D 模型 → 选姿势/釉色/底座/配饰 → 实时 3D 预览 + AR 放在你家看效果"
      features={[
        '多角度照片上传（推荐 5-10 张）',
        'AI 自动生成 3D 模型（Meshy API）',
        '姿势选择器：坐/站/躺/睡/俏皮',
        '釉色 + 表面处理 + 配饰库',
        'Three.js 实时 3D 预览 + WebXR AR',
        '€100 起 · 树脂 3D / 陶瓷手绘 / 陶瓷原始款三种材质',
      ]}
    />
  );
}