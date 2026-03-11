# 在线工具集合

这是一个基于 Vite + Vue 的轻量在线工具集合（在线实用小工具、编码/加密/格式化等）。每个工具为一个单文件组件，按功能分类放在 `src/tools/` 下，页面通过路由展示。

## 快速开始

- 安装依赖：

	```bash
	npm install
	# 或者使用 pnpm/yarn
	```

- 启动开发服务器：

	```bash
	npm run dev
	```

- 构建：

	```bash
	npm run build
	npm run preview
	```

## 目录与示例工具

- `src/tools/developer/`：开发者工具，如 `ColorConvert`, `QrCodeGenerate`, `RegexTester`, `MarkdownPreview` 等。
- `src/tools/encoding/`：编码类工具，如 `Base64Encode`, `UrlEncode`, `Utf8Encode`。
- `src/tools/encryption/`：加密/解密相关，如 `AesEncrypt`, `RsaEncrypt`, `JwtGenerate`, `PgpSign`。
- `src/tools/css/`：CSS 转换/压缩/美化工具，如 `CssMinify`, `CssToLess`。
- `src/tools/js/`：JavaScript 辅助工具，如 `JsMinify`, `TsToJs`。
- `src/tools/json/`：JSON 处理工具，如 `JsonPretty`, `JsonToCsv`。
- `src/tools/yaml/`：YAML 相关工具。

页面入口与视图：`src/views/Home.vue`, `src/views/ToolPage.vue`。

工具卡片组件位于 `src/components/ToolCard.vue`，布局组件位于 `src/components/Layout.vue`。

## 添加新工具

1. 在对应分类目录下创建单文件组件，例如 `src/tools/encoding/MyTool.vue`。
2. 在 `src/tools/index.ts` 中导出并注册（按项目现有约定）。
3. 启动 `npm run dev`，在侧栏或主页验证新工具显示与功能。

## 开发与规范

- 每个工具使用 Vue 单文件组件（`.vue`），尽量保持组件小而专一。
- 使用现有样式与组件（`ToolCard`、布局等）保持界面一致性。
- 写明工具用途与示例输入/输出，提高可用性。