# Farming Game Specification

## ADDED Requirements

### Requirement: 农田游戏主界面
系统 SHALL 在 `/dashboard` 页面显示卡通风格的种田游戏主界面。

#### Scenario: 访问 Dashboard 页面
- **WHEN** 用户访问 `/dashboard`
- **THEN** 系统显示种田游戏主界面
- **AND** 界面包含太阳光能量显示、农田地块、作��商店

#### Scenario: 页面布局
- **GIVEN** 用户在 Dashboard 页面
- **WHEN** 查看页面结构
- **THEN** 顶部显示太阳光能量
- **AND** 中间显示 6 个农田地块
- **AND** 底部显示作物商店

---

### Requirement: 太阳光能量系统
系统 SHALL 显示和管理用户的太阳光能量值。

#### Scenario: 显示太阳光能量
- **GIVEN** 用户在游戏界面
- **WHEN** 查看顶部
- **THEN** 显示当前阳光值（初始 50）
- **AND** 显示太阳图标
- **AND** 太阳图标有动画效果

#### Scenario: 阳光值变化
- **GIVEN** 用户有阳光值
- **WHEN** 种植作物消耗阳光
- **THEN** 阳光值减少相应数量
- **AND** 显示负值时无法种植

#### Scenario: 收获获得阳光
- **GIVEN** 用户有成熟作物
- **WHEN** 点击收获
- **THEN** 阳光值增加收获奖励
- **AND** 地块恢复为空闲状态

---

### Requirement: 作物种植系统
系统 SHALL 允许用户选择并种植作物。

#### Scenario: 作物商店显示
- **GIVEN** 用户在游戏界面
- **WHEN** 查看底部商店区域
- **THEN** 显示 5 种可种植作物
- **AND** 每种作物显示：名称、emoji、生长时间、收获奖励

#### Scenario: 选择作物
- **GIVEN** 作物商店已显示
- **WHEN** 点击某个作物
- **THEN** 该作物被选中
- **AND** 选中状态有高亮显示

#### Scenario: 种植作物
- **GIVEN** 已选择一个作物
- **AND** 有一个空闲地块
- **WHEN** 点击空闲地块
- **THEN** 作物被种植到该地块
- **AND** 消耗相应阳光值
- **AND** 地块状态变为 'growing'

#### Scenario: 阳光不足无法种植
- **GIVEN** 作物消耗阳光 > 当前阳光值
- **WHEN** 尝试种植
- **THEN** 显示提示"阳光不足"
- **AND** 种植失败

---

### Requirement: 作物生长系统
系统 SHALL 实现作物的自动生长机制。

#### Scenario: 作物自动生长
- **GIVEN** 地块中有正在生长的作物
- **WHEN** 时间推移
- **THEN** 作物生长进度增加
- **AND** 进度条显示当前进度

#### Scenario: 生长阶段显示
- **GIVEN** 作物正在生长
- **WHEN** 查看作物
- **THEN** 根据进度显示不同阶段：
  - 0-33%: 🌱 幼苗
  - 33-66%: 🌿 成长中
  - 66-99%: 🌳 即将成熟
  - 100%: 对应作物 emoji

#### Scenario: 作物成熟
- **GIVEN** 作物生长进度达到 100%
- **WHEN** 生长完成
- **THEN** 地块状态变为 'ready'
- **AND** 作物有动画效果提示可收获

---

### Requirement: 阳光加速系统
系统 SHALL 允许用户消耗阳光加速作物生长。

#### Scenario: 阳光加速
- **GIVEN** 地块中有正在生长的作物
- **AND** 用户有足够阳光
- **WHEN** 点击正在生长的作物
- **THEN** 消耗 1 阳光
- **AND** 生长进度增加 5%

#### Scenario: 阳光不足无法加速
- **GIVEN** 作物正在生长
- **AND** 用户阳光值为 0
- **WHEN** 点击作物
- **THEN** 显示提示"阳光不足"
- **AND** 加速失败

---

### Requirement: 作物收获系统
系统 SHALL 允许用户收获成熟的作物。

#### Scenario: 收获成熟作物
- **GIVEN** 地块中有成熟的作物
- **WHEN** 点击该地块
- **THEN** 收获作物
- **AND** 阳光值增加收获奖励
- **AND** 地块恢复为空闲状态
- **AND** 作物被清除

#### Scenario: 收获动画
- **GIVEN** 作物被收获
- **WHEN** 收获完成
- **THEN** 显示收获动画效果
- **AND** 阳光值增加有 +N 浮动提示

---

### Requirement: 卡通视觉风格
系统 SHALL 采用卡通可爱的视觉风格。

#### Scenario: 圆润造型
- **WHEN** 查看任何游戏元素
- **THEN** 使用圆角边框（rounded-xl, rounded-full）
- **AND** 使用柔和的颜色

#### Scenario: 动画效果
- **GIVEN** 太阳图标
- **WHEN** 显示时
- **THEN** 有脉动动画效果（animate-pulse）

#### Scenario: 成熟提示
- **GIVEN** 作物已成熟
- **WHEN** 显示时
- **THEN** 有脉冲动画效果（animate-pulse）

---

## MODIFIED Requirements

### Requirement: Dashboard 页面功能变更
系统 SHALL 修改 `/dashboard` 页面从占位符变为种田游戏。

#### Scenario: 页面变更
- **GIVEN** 项目更新后
- **WHEN** 访问 `/dashboard`
- **THEN** 不再显示 "Dashboard Page" 文本
- **AND** 显示完整的种田游戏界面

---

## Data Storage (未来)

### Requirement: 游戏状态持久化
系统 SHOULD 在未来支持游戏状态保存到数据库。

#### Scenario: 自动存档
- **GIVEN** 游戏状态发生变化
- **WHEN** 变化完成
- **THEN** 自动保存到 localStorage（临时）
- **AND** 未来保存到数据库

#### Scenario: 加载存档
- **GIVEN** 用户重新访问页面
- **WHEN** 页面加载
- **THEN** 从存储加载游戏状态
- **AND** 恢复之前的阳光值和作物状态
