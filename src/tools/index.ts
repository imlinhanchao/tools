export interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  keywords?: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
}

export const categories: Category[] = [
  { id: 'encoding', name: '编码/解码', icon: 'CodeOutlined' },
  { id: 'encryption', name: '加密/解密', icon: 'LockOutlined' },
  { id: 'json', name: 'JSON工具', icon: 'FileTextOutlined' },
  { id: 'yaml', name: 'YAML工具', icon: 'FileTextOutlined' },
  { id: 'css', name: 'CSS工具', icon: 'BgColorsOutlined' },
  { id: 'js', name: 'JS工具', icon: 'FunctionOutlined' },
  { id: 'developer', name: '开发工具', icon: 'ToolOutlined' },
]

export const tools: Tool[] = [
  // ── Encoding ──────────────────────────────────────────────
  { id: 'url-encode', name: 'URL 编码', description: '对字符串进行 URL 编码', category: 'encoding', keywords: ['url', 'encode', 'percent', '百分号', '编码'] },
  { id: 'url-decode', name: 'URL 解码', description: '对 URL 编码字符串进行解码', category: 'encoding', keywords: ['url', 'decode', '解码'] },
  { id: 'url-parse', name: 'URL 解析', description: '解析 URL 的各个组成部分', category: 'encoding', keywords: ['url', 'parse', '解析', 'query', 'hash'] },
  { id: 'base64-encode', name: 'Base64 编码', description: '将文本或文件编码为 Base64', category: 'encoding', keywords: ['base64', 'encode', '编码'] },
  { id: 'base64-decode', name: 'Base64 解码', description: '将 Base64 字符串解码', category: 'encoding', keywords: ['base64', 'decode', '解码'] },
  { id: 'base64-to-hex', name: 'Base64 转 Hex', description: 'Base64 与十六进制互转', category: 'encoding', keywords: ['base64', 'hex', '十六进制', 'convert'] },
  { id: 'unicode-encode', name: 'Unicode 编码', description: '将文本编码为 Unicode 转义序列', category: 'encoding', keywords: ['unicode', 'encode', '编码', 'escape'] },
  { id: 'unicode-decode', name: 'Unicode 解码', description: '将 Unicode 转义序列解码', category: 'encoding', keywords: ['unicode', 'decode', '解码', 'unescape'] },
  { id: 'utf8-encode', name: 'UTF-8 编码', description: '将文本编码为 UTF-8 字节序列', category: 'encoding', keywords: ['utf8', 'encode', '编码', 'bytes'] },
  { id: 'utf8-decode', name: 'UTF-8 解码', description: '将 UTF-8 字节序列解码为文本', category: 'encoding', keywords: ['utf8', 'decode', '解码'] },
  { id: 'utf16-encode', name: 'UTF-16 编码', description: '将文本编码为 UTF-16 字节序列', category: 'encoding', keywords: ['utf16', 'encode', '编码'] },
  { id: 'utf16-decode', name: 'UTF-16 解码', description: '将 UTF-16 字节序列解码为文本', category: 'encoding', keywords: ['utf16', 'decode', '解码'] },
  { id: 'morse-encode', name: '摩斯编码', description: '将文本转换为摩斯电码', category: 'encoding', keywords: ['morse', 'code', '摩斯', '电码', '编码'] },
  { id: 'morse-decode', name: '摩斯解码', description: '将摩斯电码转换为文本', category: 'encoding', keywords: ['morse', 'decode', '摩斯', '解码'] },
  { id: 'html-encode', name: 'HTML 编码', description: '将特殊字符转义为 HTML 实体', category: 'encoding', keywords: ['html', 'entity', 'encode', '编码', 'escape'] },
  { id: 'html-decode', name: 'HTML 解码', description: '将 HTML 实体转换为普通字符', category: 'encoding', keywords: ['html', 'entity', 'decode', '解码', 'unescape'] },

  // ── Encryption ────────────────────────────────────────────
  { id: 'aes-encrypt', name: 'AES 加密', description: '使用 AES 算法加密文本', category: 'encryption', keywords: ['aes', 'encrypt', '加密', 'symmetric'] },
  { id: 'aes-decrypt', name: 'AES 解密', description: '使用 AES 算法解密文本', category: 'encryption', keywords: ['aes', 'decrypt', '解密', 'symmetric'] },
  { id: 'des-encrypt', name: 'DES 加密', description: '使用 DES 算法加密文本', category: 'encryption', keywords: ['des', 'encrypt', '加密'] },
  { id: 'des-decrypt', name: 'DES 解密', description: '使用 DES 算法解密文本', category: 'encryption', keywords: ['des', 'decrypt', '解密'] },
  { id: 'triple-des-encrypt', name: '3DES 加密', description: '使用 Triple DES 算法加密文本', category: 'encryption', keywords: ['3des', 'triple', 'des', 'encrypt', '加密'] },
  { id: 'triple-des-decrypt', name: '3DES 解密', description: '使用 Triple DES 算法解密文本', category: 'encryption', keywords: ['3des', 'triple', 'des', 'decrypt', '解密'] },
  { id: 'rc4-encrypt', name: 'RC4 加密', description: '使用 RC4 算法加密文本', category: 'encryption', keywords: ['rc4', 'encrypt', '加密', 'stream'] },
  { id: 'rc4-decrypt', name: 'RC4 解密', description: '使用 RC4 算法解密文本', category: 'encryption', keywords: ['rc4', 'decrypt', '解密'] },
  { id: 'rabbit-encrypt', name: 'Rabbit 加密', description: '使用 Rabbit 流密码加密文本', category: 'encryption', keywords: ['rabbit', 'encrypt', '加密', 'stream'] },
  { id: 'rabbit-decrypt', name: 'Rabbit 解密', description: '使用 Rabbit 流密码解密文本', category: 'encryption', keywords: ['rabbit', 'decrypt', '解密'] },
  { id: 'rsa-encrypt', name: 'RSA 加密', description: '使用 RSA 公钥加密文本', category: 'encryption', keywords: ['rsa', 'encrypt', '加密', 'asymmetric', '非对称'] },
  { id: 'rsa-decrypt', name: 'RSA 解密', description: '使用 RSA 私钥解密文本', category: 'encryption', keywords: ['rsa', 'decrypt', '解密'] },
  { id: 'rsa-key-gen', name: 'RSA 密钥生成', description: '生成 RSA 公私钥对', category: 'encryption', keywords: ['rsa', 'key', 'generate', '生成', 'keypair'] },
  { id: 'rsa-private-to-public', name: 'RSA 私钥提取公钥', description: '从 RSA 私钥中提取公钥', category: 'encryption', keywords: ['rsa', 'private', 'public', '公钥', '私钥'] },
  { id: 'jwt-generate', name: 'JWT 生成', description: '生成 JSON Web Token', category: 'encryption', keywords: ['jwt', 'token', 'generate', '生成', 'json web token'] },
  { id: 'jwt-parse', name: 'JWT 解析', description: '解析并验证 JWT Token', category: 'encryption', keywords: ['jwt', 'parse', '解析', 'verify', 'token'] },
  { id: 'pgp-encrypt', name: 'PGP 加密', description: '使用 PGP 公钥加密消息', category: 'encryption', keywords: ['pgp', 'encrypt', '加密', 'gpg'] },
  { id: 'pgp-decrypt', name: 'PGP 解密', description: '使用 PGP 私钥解密消息', category: 'encryption', keywords: ['pgp', 'decrypt', '解密', 'gpg'] },
  { id: 'pgp-sign', name: 'PGP 签名', description: '使用 PGP 私钥对消息签名', category: 'encryption', keywords: ['pgp', 'sign', '签名', 'gpg'] },
  { id: 'pgp-verify', name: 'PGP 验签', description: '验证 PGP 消息签名', category: 'encryption', keywords: ['pgp', 'verify', '验签', 'gpg'] },
  { id: 'pgp-key-gen', name: 'PGP 密钥生成', description: '生成 PGP 密钥对', category: 'encryption', keywords: ['pgp', 'key', 'generate', 'gpg', '生成'] },
  { id: 'sm2-encrypt', name: 'SM2 加密', description: '国密 SM2 椭圆曲线公钥加密', category: 'encryption', keywords: ['sm2', 'encrypt', '加密', '国密', 'ecc'] },
  { id: 'sm2-decrypt', name: 'SM2 解密', description: '国密 SM2 椭圆曲线公钥解密', category: 'encryption', keywords: ['sm2', 'decrypt', '解密', '国密'] },
  { id: 'sm4-encrypt', name: 'SM4 加密', description: '国密 SM4 分组对称加密', category: 'encryption', keywords: ['sm4', 'encrypt', '加密', '国密', 'symmetric'] },
  { id: 'sm4-decrypt', name: 'SM4 解密', description: '国密 SM4 分组对称解密', category: 'encryption', keywords: ['sm4', 'decrypt', '解密', '国密'] },

  // ── JSON ──────────────────────────────────────────────────
  { id: 'json-to-yaml', name: 'JSON 转 YAML', description: 'JSON 格式转换为 YAML 格式', category: 'json', keywords: ['json', 'yaml', 'convert', '转换'] },
  { id: 'json-to-xml', name: 'JSON 转 XML', description: 'JSON 格式转换为 XML 格式', category: 'json', keywords: ['json', 'xml', 'convert', '转换'] },
  { id: 'json-to-csv', name: 'JSON 转 CSV', description: 'JSON 数组转换为 CSV 表格', category: 'json', keywords: ['json', 'csv', 'convert', '转换', 'table'] },
  { id: 'json-to-toml', name: 'JSON 转 TOML', description: 'JSON 格式转换为 TOML 格式', category: 'json', keywords: ['json', 'toml', 'convert', '转换'] },
  { id: 'json-to-properties', name: 'JSON 转 Properties', description: 'JSON 格式转换为 Java Properties', category: 'json', keywords: ['json', 'properties', 'java', 'convert', '转换'] },
  { id: 'json-to-typescript', name: 'JSON 转 TypeScript', description: '根据 JSON 生成 TypeScript 接口类型', category: 'json', keywords: ['json', 'typescript', 'interface', 'type', '转换'] },
  { id: 'json-to-go-struct', name: 'JSON 转 Go Struct', description: '根据 JSON 生成 Go 结构体', category: 'json', keywords: ['json', 'go', 'golang', 'struct', '转换'] },
  { id: 'json-to-java-bean', name: 'JSON 转 Java Bean', description: '根据 JSON 生成 Java 类', category: 'json', keywords: ['json', 'java', 'bean', 'class', 'pojo', '转换'] },
  { id: 'json-to-kotlin-class', name: 'JSON 转 Kotlin 类', description: '根据 JSON 生成 Kotlin 数据类', category: 'json', keywords: ['json', 'kotlin', 'data class', '转换'] },
  { id: 'json-to-dart-class', name: 'JSON 转 Dart 类', description: '根据 JSON 生成 Dart 类', category: 'json', keywords: ['json', 'dart', 'flutter', 'class', '转换'] },
  { id: 'json-to-python-class', name: 'JSON 转 Python 类', description: '根据 JSON 生成 Python 数据类', category: 'json', keywords: ['json', 'python', 'dataclass', '转换'] },
  { id: 'json-to-rust-struct', name: 'JSON 转 Rust 结构体', description: '根据 JSON 生成 Rust 结构体', category: 'json', keywords: ['json', 'rust', 'struct', '转换'] },
  { id: 'json-to-swift-struct', name: 'JSON 转 Swift 结构体', description: '根据 JSON 生成 Swift 结构体', category: 'json', keywords: ['json', 'swift', 'ios', 'struct', '转换'] },
  { id: 'json-to-scala', name: 'JSON 转 Scala 类', description: '根据 JSON 生成 Scala Case Class', category: 'json', keywords: ['json', 'scala', 'case class', '转换'] },
  { id: 'json-to-csharp', name: 'JSON 转 C# 类', description: '根据 JSON 生成 C# 实体类', category: 'json', keywords: ['json', 'csharp', 'c#', 'class', '转换'] },
  { id: 'json-to-php', name: 'JSON 转 PHP 类', description: '根据 JSON 生成 PHP 类', category: 'json', keywords: ['json', 'php', 'class', '转换'] },
  { id: 'json-to-ruby', name: 'JSON 转 Ruby 类', description: '根据 JSON 生成 Ruby 类', category: 'json', keywords: ['json', 'ruby', 'class', '转换'] },
  { id: 'json-to-sql-schema', name: 'JSON 转 SQL Schema', description: '根据 JSON 生成 SQL 建表语句', category: 'json', keywords: ['json', 'sql', 'schema', 'ddl', '转换'] },
  { id: 'json-to-json-schema', name: 'JSON 转 JSON Schema', description: '根据 JSON 生成 JSON Schema 验证规则', category: 'json', keywords: ['json', 'schema', 'validate', '转换'] },
  { id: 'json-minify', name: 'JSON 压缩', description: '压缩 JSON，移除多余空白', category: 'json', keywords: ['json', 'minify', 'compress', '压缩'] },
  { id: 'json-pretty', name: 'JSON 格式化', description: 'JSON 格式化美化输出', category: 'json', keywords: ['json', 'pretty', 'format', 'beautify', '格式化'] },
  { id: 'json-escape', name: 'JSON 转义', description: '对 JSON 字符串进行转义处理', category: 'json', keywords: ['json', 'escape', '转义'] },
  { id: 'json-unescape', name: 'JSON 反转义', description: '对 JSON 转义字符串进行反转义', category: 'json', keywords: ['json', 'unescape', '反转义'] },
  { id: 'json-to-base64', name: 'JSON 转 Base64', description: '将 JSON 编码为 Base64 字符串', category: 'json', keywords: ['json', 'base64', 'encode', '编码'] },
  { id: 'base64-to-json', name: 'Base64 转 JSON', description: '将 Base64 字符串解码为 JSON', category: 'json', keywords: ['base64', 'json', 'decode', '解码'] },
  { id: 'extract-json-values', name: 'JSON 值提取', description: '使用 JSONPath 提取 JSON 中的值', category: 'json', keywords: ['json', 'path', 'extract', 'query', '提取'] },

  // ── YAML ──────────────────────────────────────────────────
  { id: 'yaml-to-json', name: 'YAML 转 JSON', description: 'YAML 格式转换为 JSON 格式', category: 'yaml', keywords: ['yaml', 'json', 'convert', '转换'] },
  { id: 'yaml-to-xml', name: 'YAML 转 XML', description: 'YAML 格式转换为 XML 格式', category: 'yaml', keywords: ['yaml', 'xml', 'convert', '转换'] },
  { id: 'yaml-to-csv', name: 'YAML 转 CSV', description: 'YAML 数组转换为 CSV 表格', category: 'yaml', keywords: ['yaml', 'csv', 'convert', '转换'] },
  { id: 'yaml-to-toml', name: 'YAML 转 TOML', description: 'YAML 格式转换为 TOML 格式', category: 'yaml', keywords: ['yaml', 'toml', 'convert', '转换'] },
  { id: 'yaml-to-typescript', name: 'YAML 转 TypeScript', description: '根据 YAML 生成 TypeScript 接口', category: 'yaml', keywords: ['yaml', 'typescript', 'interface', '转换'] },
  { id: 'yaml-to-go-struct', name: 'YAML 转 Go Struct', description: '根据 YAML 生成 Go 结构体', category: 'yaml', keywords: ['yaml', 'go', 'struct', '转换'] },
  { id: 'yaml-to-java-bean', name: 'YAML 转 Java Bean', description: '根据 YAML 生成 Java 类', category: 'yaml', keywords: ['yaml', 'java', 'bean', '转换'] },
  { id: 'yaml-to-python-class', name: 'YAML 转 Python 类', description: '根据 YAML 生成 Python 数据类', category: 'yaml', keywords: ['yaml', 'python', 'dataclass', '转换'] },
  { id: 'yaml-to-rust-struct', name: 'YAML 转 Rust 结构体', description: '根据 YAML 生成 Rust 结构体', category: 'yaml', keywords: ['yaml', 'rust', 'struct', '转换'] },
  { id: 'yaml-minify', name: 'YAML 压缩', description: '压缩 YAML，移除多余空白', category: 'yaml', keywords: ['yaml', 'minify', 'compress', '压缩'] },
  { id: 'yaml-pretty', name: 'YAML 格式化', description: 'YAML 格式化美化输出', category: 'yaml', keywords: ['yaml', 'pretty', 'format', '格式化'] },
  { id: 'properties-to-yaml', name: 'Properties 转 YAML', description: 'Java Properties 转换为 YAML', category: 'yaml', keywords: ['properties', 'yaml', 'java', 'convert', '转换'] },

  // ── CSS ───────────────────────────────────────────────────
  { id: 'css-minify', name: 'CSS 压缩', description: '压缩 CSS 代码，移除空白注释', category: 'css', keywords: ['css', 'minify', 'compress', '压缩'] },
  { id: 'css-prettify', name: 'CSS 格式化', description: 'CSS 代码格式化美化', category: 'css', keywords: ['css', 'pretty', 'format', 'beautify', '格式化'] },
  { id: 'css-to-js-object', name: 'CSS 转 JS 对象', description: 'CSS 样式转换为 JavaScript 对象', category: 'css', keywords: ['css', 'js', 'object', 'react', 'style', '转换'] },
  { id: 'js-object-to-css', name: 'JS 对象转 CSS', description: 'JavaScript 样式对象转换为 CSS', category: 'css', keywords: ['js', 'css', 'object', 'style', '转换'] },
  { id: 'css-to-less', name: 'CSS 转 Less', description: 'CSS 代码转换为 Less 预处理语法', category: 'css', keywords: ['css', 'less', 'preprocessor', '转换'] },
  { id: 'css-to-stylus', name: 'CSS 转 Stylus', description: 'CSS 代码转换为 Stylus 语法', category: 'css', keywords: ['css', 'stylus', 'preprocessor', '转换'] },
  { id: 'css-to-base64', name: 'CSS 转 Base64', description: 'CSS 文件编码为 Base64 Data URI', category: 'css', keywords: ['css', 'base64', 'data uri', 'encode', '编码'] },
  { id: 'base64-to-css', name: 'Base64 转 CSS', description: 'Base64 Data URI 解码为 CSS', category: 'css', keywords: ['base64', 'css', 'decode', '解码'] },

  // ── JS ────────────────────────────────────────────────────
  { id: 'js-minify', name: 'JS 压缩', description: '压缩 JavaScript 代码', category: 'js', keywords: ['js', 'javascript', 'minify', 'compress', '压缩'] },
  { id: 'js-prettify', name: 'JS 格式化', description: 'JavaScript 代码格式化美化', category: 'js', keywords: ['js', 'javascript', 'pretty', 'format', 'beautify', '格式化'] },
  { id: 'js-escape', name: 'JS 字符串转义', description: '对 JavaScript 字符串进行转义', category: 'js', keywords: ['js', 'escape', 'string', '转义'] },
  { id: 'js-unescape', name: 'JS 字符串反转义', description: '对 JavaScript 转义字符串解转义', category: 'js', keywords: ['js', 'unescape', 'string', '反转义'] },
  { id: 'ts-to-js', name: 'TypeScript 转 JS', description: '将 TypeScript 代码编译为 JavaScript', category: 'js', keywords: ['typescript', 'ts', 'js', 'compile', '编译', '转换'] },

  // ── Developer ─────────────────────────────────────────────
  { id: 'regex-tester', name: '正则表达式测试', description: '在线测试正则表达式匹配', category: 'developer', keywords: ['regex', 'regexp', '正则', 'test', 'match'] },
  { id: 'uuid-generator', name: 'UUID 生成器', description: '生成 UUID v1/v4 唯一标识符', category: 'developer', keywords: ['uuid', 'guid', 'generate', '生成', 'unique'] },
  { id: 'uuid-parser', name: 'UUID 解析器', description: '解析 UUID 的版本和信息', category: 'developer', keywords: ['uuid', 'parse', '解析', 'version'] },
  { id: 'cidr-calculator', name: 'CIDR 计算器', description: '计算 CIDR 网段的子网信息', category: 'developer', keywords: ['cidr', 'subnet', 'ip', 'network', '子网', '计算'] },
  { id: 'crontab-editor', name: 'Crontab 编辑器', description: '可视化编辑和解析 Crontab 表达式', category: 'developer', keywords: ['crontab', 'cron', 'schedule', '定时', '表达式'] },
  { id: 'timestamp-format', name: '时间戳转换', description: '时间戳与日期时间格式互转', category: 'developer', keywords: ['timestamp', 'datetime', 'date', 'time', '时间戳', '日期'] },
  { id: 'mermaid-editor', name: 'Mermaid 编辑器', description: '在线编写和预览 Mermaid 流程图', category: 'developer', keywords: ['mermaid', 'diagram', 'flowchart', '流程图', '图表'] },
  { id: 'code-to-image', name: '代码转图片', description: '将代码片段渲染为精美图片', category: 'developer', keywords: ['code', 'image', 'screenshot', '代码', '图片'] },
  { id: 'arabic-to-roman', name: '阿拉伯数字转罗马', description: '阿拉伯数字与罗马数字互转', category: 'developer', keywords: ['roman', 'arabic', 'numeral', '罗马', '数字', '转换'] },
  { id: 'english-pluralize', name: '英语单复数转换', description: '英语单词单复数形式转换', category: 'developer', keywords: ['plural', 'singular', 'english', '英语', '单复数'] },
  { id: 'color-convert', name: '颜色格式转换', description: 'HEX/RGB/HSL 等颜色格式互转', category: 'developer', keywords: ['color', 'hex', 'rgb', 'hsl', '颜色', '转换'] },
  { id: 'hash-generator', name: '哈希生成器', description: '计算 MD5/SHA-1/SHA-256 等哈希值', category: 'developer', keywords: ['hash', 'md5', 'sha', 'sha256', '哈希', '摘要'] },
  { id: 'text-diff', name: '文本比对', description: '在线比较两个文本的差异', category: 'developer', keywords: ['diff', 'text', 'compare', '文本', '比对', '差异'] },
  { id: 'websocket-tester', name: 'WebSocket 测试', description: '在线连接和测试 WebSocket 接口', category: 'developer', keywords: ['websocket', 'ws', 'test', '测试', '网络'] },
  { id: 'zh-to-pinyin', name: '汉字转拼音', description: '将中文字符转换为带声调的拼音', category: 'developer', keywords: ['pinyin', 'chinese', '汉字', '拼音', '转换'] },
  { id: 'qrcode-generate', name: '二维码生成', description: '将文本或链接转换为二维码图片', category: 'developer', keywords: ['qrcode', 'generate', '二维码', '生成', '图片'] },
  { id: 'qrcode-decode', name: '二维码解码', description: '解析识别图片中的二维码内容', category: 'developer', keywords: ['qrcode', 'decode', '二维码', '解码', '识别'] },
  { id: 'markdown-preview', name: 'Markdown 预览', description: '在线编辑和预览 Markdown 文档', category: 'developer', keywords: ['markdown', 'md', 'preview', '预览', '编辑'] },
  { id: 'base-converter', name: '进制转换', description: '二、八、十、十六等任意进制互转', category: 'developer', keywords: ['base', 'converter', '进制', '转换', '二进制', '十六进制', 'hex'] },
]

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(t => t.category === categoryId)
}

export function findTool(id: string): Tool | undefined {
  return tools.find(t => t.id === id)
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase()
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.keywords?.some(k => k.toLowerCase().includes(q))
  )
}
