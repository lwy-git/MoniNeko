# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

招财记账（MoniNeko）— 一款猫咪主题的个人记账移动 App，基于 uni-app（Vue 3）开发。用户记录每日消费、管理月度预算，同时养成一只会根据消费习惯做出反应的虚拟招财猫。

## 开发环境

- **IDE**：HBuilderX（主力开发工具），未配置 CLI 构建脚本
- **运行**：HBuilderX → 运行 → 浏览器（H5）进行开发预览
- **构建**：HBuilderX → 发行 → 选择目标平台（H5、App、微信小程序）
- **暂无测试框架和 ESLint 配置**

## 架构

**技术栈**：uni-app Vue 3 + Pinia + SQLite（本地优先）

**数据流**：页面(.vue) → Pinia Store(状态共享) → Hooks(业务逻辑) → DB 适配器 → SQLite 或 localStorage

**分层职责**：
- **SFC 视图层**（pages/*.vue）：只负责渲染和事件触发，不写复杂逻辑
- **Hooks 逻辑层**（hooks/use-*.js）：处理数据请求、业务逻辑，不操作 UI
- **Store 状态层**（store/*-store.js）：只做全局状态共享，调用 hooks 获取数据
- **DB 层**（utils/db/）：数据持久化，按平台条件编译选择适配器

**平台适配**：使用 uni-app 条件编译（`#ifdef APP-PLUS` / `#ifndef APP-PLUS`），原生端用 SQLite，H5/小程序用 localStorage 降级。

**导航**：自定义 TabBar 组件（easycom 自动注册为 `<my-custom-tabbar>`）。Tab 页跳转用 `uni.switchTab`，子页面用 `uni.navigateTo`。

**启动流程**：App 启动 → home（tabBar 首页）→ 首次启动 navigateTo splash → 点击按钮 redirectTo welcome → 点击"立即体验" → switchTab 回 home。

## 开发规范（详见 docs/开发规范.md）

- **统一 Vue3 script setup**，禁用选项式 API
- **文件命名**：严格 kebab-case（如 `user-store.js`、`use-budget.js`、`my-custom-tabbar.vue`）
- **组件超 300 行必须拆分**为 SFC + hooks
- **单位**：使用 `rpx`，不用 `px`
- **样式**：必须 scoped；颜色用 CSS 变量，不写固定色值
- **组件注册**：easycom 自动注册，template 中用 kebab-case 标签（如 `<my-custom-tabbar>`）
- **路径别名**：`@/` 指向项目根目录
- **禁止**：原生 DOM/BOM 操作、行内样式、v-for 与 v-if 同级

## 目录结构

```
├── config/         环境配置、常量
├── hooks/          全局通用组合逻辑（use-*.js）
├── store/          Pinia 状态管理（*-store.js）
├── pages/          路由页面
├── components/     全局公共组件（kebab-case 文件夹）
├── utils/          工具函数
│   └── db/         数据库层（schema + 适配器）
├── styles/         全局样式（theme/mixins/animation）
├── static/         静态资源
├── api/            接口请求（V1.1 启用）
└── docs/           项目文档
```

## 设计规范

| 设计令牌 | 值 |
|---------|---|
| 主色金 | `#F6C445` / `var(--color-primary)` |
| 猫爪粉 | `#F472B6` / `var(--color-paw-pink)` |
| 背景色 | `#FFF8F0` / `var(--color-bg)` |
| 主文字色 | `#4A3728` / `var(--color-text-primary)` |
| 卡片圆角 | `48rpx` / `var(--radius-lg)` |
| TabBar 高度 | `120rpx` / `var(--tabbar-height)` |

## 数据库（utils/db/schema.js）

6 张表：`user`、`monthly_budget`、`expense_record`、`cat_status`、`cat_accessory`、`achievement`。数据库名：`monineko`。localStorage 适配器 key 前缀为 `monineko_`。

## 版本范围

- **V1.0**（当前）：仅游客模式，本地数据，无登录/云同步/语音记账
- **V1.1**（规划中）：登录注册、云端同步、统计图表升级
- UI 必须像素级还原 `PRD_记账App需求文档.md` 中嵌入的 HTML 原型
