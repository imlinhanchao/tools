<template>
  <Layout>
    <!-- Tool not found -->
    <div v-if="!currentTool" class="p-6 md:p-12 mb-auto flex flex-col items-center justify-center">
      <el-result
        icon="warning"
        title="工具未找到"
        sub-title="抱歉，您访问的工具不存在或已被移除。"
      >
        <template #extra>
          <el-button type="primary" @click="router.push('/')">
            <Icon icon="ep:arrow-left" class="mr-1" />
            返回首页
          </el-button>
        </template>
      </el-result>
    </div>

    <!-- Tool page -->
    <div v-else class="p-4 md:p-6 max-w-[1400px] mx-auto min-h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6 md:mb-8 flex-wrap">
        <el-button text class="-ml-3 shrink-0" @click="router.push('/')">
          <Icon icon="ep:arrow-left" class="mr-1" />
          返回
        </el-button>
        <div class="flex-1 min-w-[200px] flex items-center gap-3">
          <div>
            <h1 class="text-[20px] md:text-2xl font-bold text-[#1a1a1a] m-0 mb-1 leading-[1.2] dark:text-white/95">{{ currentTool.name }}</h1>
            <p class="text-[13px] md:text-sm text-[#666] m-0 dark:text-white/55">{{ currentTool.description }}</p>
          </div>
          <el-button 
            circle 
            text 
            @click="toggleFavorite(currentTool.id)"
            class="!text-xl hover:!scale-110 transition-transform"
            :class="isFav ? '!text-amber-500' : '!text-gray-300 dark:!text-gray-600'"
          >
            <Icon :icon="isFav ? 'ep:star-filled' : 'ep:star'" />
          </el-button>
        </div>
        <el-tag :type="categoryTagType" class="shrink-0" effect="light">
          {{ categoryName }}
        </el-tag>
      </div>

      <!-- Dynamic component -->
      <div class="flex-1 bg-white p-4 md:p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:bg-[#1a1f2e] dark:shadow-none min-h-[400px]">
        <Suspense>
          <template #default>
            <component :is="asyncComponent" v-if="asyncComponent" />
          </template>
          <template #fallback>
            <div class="flex flex-col items-center justify-center py-20 text-[#999]">
              <el-icon class="text-3xl mb-4 animate-spin"><Loading /></el-icon>
              <span>加载中...</span>
            </div>
          </template>
        </Suspense>

        <!-- Not implemented yet -->
        <div v-if="!asyncComponent && !loading" class="py-15">
          <el-result
            icon="info"
            title="工具开发中"
            :sub-title="`「${currentTool.name}」正在开发中，敬请期待！`"
          >
            <template #extra>
              <el-button @click="router.push('/')">
                <Icon icon="ep:arrow-left" class="mr-1" />
                浏览其他工具
              </el-button>
            </template>
          </el-result>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { Loading } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import { findTool, categories } from '@/tools/index'
import { useFavorites } from '@/composables/useFavorites'

const route = useRoute()
const router = useRouter()
const { isFavorite, toggleFavorite } = useFavorites()

const loading = ref(false)
const asyncComponent = shallowRef<any>(null)

const allModules = import.meta.glob('/src/tools/**/*.vue')

const componentMap: Record<string, string> = {
  // ── Encoding ──────────────────────────────────────────────
  'url-encode': '/src/tools/encoding/UrlEncode.vue',
  'url-decode': '/src/tools/encoding/UrlDecode.vue',
  'url-parse': '/src/tools/encoding/UrlParse.vue',
  'base64-encode': '/src/tools/encoding/Base64Encode.vue',
  'base64-decode': '/src/tools/encoding/Base64Decode.vue',
  'base64-to-hex': '/src/tools/encoding/Base64ToHex.vue',
  'unicode-encode': '/src/tools/encoding/UnicodeEncode.vue',
  'unicode-decode': '/src/tools/encoding/UnicodeDecode.vue',
  'utf8-encode': '/src/tools/encoding/Utf8Encode.vue',
  'utf8-decode': '/src/tools/encoding/Utf8Decode.vue',
  'utf16-encode': '/src/tools/encoding/Utf16Encode.vue',
  'utf16-decode': '/src/tools/encoding/Utf16Decode.vue',
  'morse-encode': '/src/tools/encoding/MorseEncode.vue',
  'morse-decode': '/src/tools/encoding/MorseDecode.vue',
  'html-encode': '/src/tools/encoding/HtmlEncode.vue',
  'html-decode': '/src/tools/encoding/HtmlDecode.vue',
  // ── Encryption ────────────────────────────────────────────
  'aes-encrypt': '/src/tools/encryption/AesEncrypt.vue',
  'aes-decrypt': '/src/tools/encryption/AesDecrypt.vue',
  'des-encrypt': '/src/tools/encryption/DesEncrypt.vue',
  'des-decrypt': '/src/tools/encryption/DesDecrypt.vue',
  'triple-des-encrypt': '/src/tools/encryption/TripleDesEncrypt.vue',
  'triple-des-decrypt': '/src/tools/encryption/TripleDesDecrypt.vue',
  'rc4-encrypt': '/src/tools/encryption/Rc4Encrypt.vue',
  'rc4-decrypt': '/src/tools/encryption/Rc4Decrypt.vue',
  'rabbit-encrypt': '/src/tools/encryption/RabbitEncrypt.vue',
  'rabbit-decrypt': '/src/tools/encryption/RabbitDecrypt.vue',
  'rsa-encrypt': '/src/tools/encryption/RsaEncrypt.vue',
  'rsa-decrypt': '/src/tools/encryption/RsaDecrypt.vue',
  'rsa-key-gen': '/src/tools/encryption/RsaKeyGen.vue',
  'rsa-private-to-public': '/src/tools/encryption/RsaPrivateToPublic.vue',
  'jwt-generate': '/src/tools/encryption/JwtGenerate.vue',
  'jwt-parse': '/src/tools/encryption/JwtParse.vue',
  'pgp-encrypt': '/src/tools/encryption/PgpEncrypt.vue',
  'pgp-decrypt': '/src/tools/encryption/PgpDecrypt.vue',
  'pgp-sign': '/src/tools/encryption/PgpSign.vue',
  'pgp-verify': '/src/tools/encryption/PgpVerify.vue',
  'pgp-key-gen': '/src/tools/encryption/PgpKeyGen.vue',
  'sm2-encrypt': '/src/tools/encryption/Sm2Encrypt.vue',
  'sm2-decrypt': '/src/tools/encryption/Sm2Decrypt.vue',
  'sm4-encrypt': '/src/tools/encryption/Sm4Encrypt.vue',
  'sm4-decrypt': '/src/tools/encryption/Sm4Decrypt.vue',
  // ── JSON ──────────────────────────────────────────────────
  'json-to-yaml': '/src/tools/json/JsonToYaml.vue',
  'json-to-xml': '/src/tools/json/JsonToXml.vue',
  'json-to-csv': '/src/tools/json/JsonToCsv.vue',
  'json-to-toml': '/src/tools/json/JsonToToml.vue',
  'json-to-properties': '/src/tools/json/JsonToProperties.vue',
  'json-to-typescript': '/src/tools/json/JsonToTypescript.vue',
  'json-to-go-struct': '/src/tools/json/JsonToGoStruct.vue',
  'json-to-java-bean': '/src/tools/json/JsonToJavaBean.vue',
  'json-to-kotlin-class': '/src/tools/json/JsonToKotlinClass.vue',
  'json-to-dart-class': '/src/tools/json/JsonToDartClass.vue',
  'json-to-python-class': '/src/tools/json/JsonToPythonClass.vue',
  'json-to-rust-struct': '/src/tools/json/JsonToRustStruct.vue',
  'json-to-swift-struct': '/src/tools/json/JsonToSwiftStruct.vue',
  'json-to-scala': '/src/tools/json/JsonToScala.vue',
  'json-to-csharp': '/src/tools/json/JsonToCsharp.vue',
  'json-to-php': '/src/tools/json/JsonToPhp.vue',
  'json-to-ruby': '/src/tools/json/JsonToRuby.vue',
  'json-to-sql-schema': '/src/tools/json/JsonToSqlSchema.vue',
  'json-to-json-schema': '/src/tools/json/JsonToJsonSchema.vue',
  'json-minify': '/src/tools/json/JsonMinify.vue',
  'json-pretty': '/src/tools/json/JsonPretty.vue',
  'json-escape': '/src/tools/json/JsonEscape.vue',
  'json-unescape': '/src/tools/json/JsonUnescape.vue',
  'json-to-base64': '/src/tools/json/JsonToBase64.vue',
  'base64-to-json': '/src/tools/json/Base64ToJson.vue',
  'extract-json-values': '/src/tools/json/ExtractJsonValues.vue',
  // ── YAML ──────────────────────────────────────────────────
  'yaml-to-json': '/src/tools/yaml/YamlToJson.vue',
  'yaml-to-xml': '/src/tools/yaml/YamlToXml.vue',
  'yaml-to-csv': '/src/tools/yaml/YamlToCsv.vue',
  'yaml-to-toml': '/src/tools/yaml/YamlToToml.vue',
  'yaml-to-typescript': '/src/tools/yaml/YamlToTypescript.vue',
  'yaml-to-go-struct': '/src/tools/yaml/YamlToGoStruct.vue',
  'yaml-to-java-bean': '/src/tools/yaml/YamlToJavaBean.vue',
  'yaml-to-python-class': '/src/tools/yaml/YamlToPythonClass.vue',
  'yaml-to-rust-struct': '/src/tools/yaml/YamlToRustStruct.vue',
  'yaml-minify': '/src/tools/yaml/YamlMinify.vue',
  'yaml-pretty': '/src/tools/yaml/YamlPretty.vue',
  'properties-to-yaml': '/src/tools/yaml/PropertiesToYaml.vue',
  // ── CSS ───────────────────────────────────────────────────
  'css-minify': '/src/tools/css/CssMinify.vue',
  'css-prettify': '/src/tools/css/CssPrettify.vue',
  'css-to-js-object': '/src/tools/css/CssToJsObject.vue',
  'js-object-to-css': '/src/tools/css/JsObjectToCss.vue',
  'css-to-less': '/src/tools/css/CssToLess.vue',
  'css-to-stylus': '/src/tools/css/CssToStylus.vue',
  'css-to-base64': '/src/tools/css/CssToBase64.vue',
  'base64-to-css': '/src/tools/css/Base64ToCss.vue',
  // ── JS ────────────────────────────────────────────────────
  'js-minify': '/src/tools/js/JsMinify.vue',
  'js-prettify': '/src/tools/js/JsPrettify.vue',
  'js-escape': '/src/tools/js/JsEscape.vue',
  'js-unescape': '/src/tools/js/JsUnescape.vue',
  'ts-to-js': '/src/tools/js/TsToJs.vue',
  // ── Developer ─────────────────────────────────────────────
  'regex-tester': '/src/tools/developer/RegexTester.vue',
  'uuid-generator': '/src/tools/developer/UuidGenerator.vue',
  'uuid-parser': '/src/tools/developer/UuidParser.vue',
  'cidr-calculator': '/src/tools/developer/CidrCalculator.vue',
  'crontab-editor': '/src/tools/developer/CrontabEditor.vue',
  'timestamp-format': '/src/tools/developer/TimestampFormat.vue',
  'mermaid-editor': '/src/tools/developer/MermaidEditor.vue',
  'code-to-image': '/src/tools/developer/CodeToImage.vue',
  'arabic-to-roman': '/src/tools/developer/ArabicToRoman.vue',
  'english-pluralize': '/src/tools/developer/EnglishPluralize.vue',
  'color-convert': '/src/tools/developer/ColorConvert.vue',
  'hash-generator': '/src/tools/developer/HashGenerator.vue',
  'text-diff': '/src/tools/developer/TextDiff.vue',
  'websocket-tester': '/src/tools/developer/WebsocketTester.vue',
  'zh-to-pinyin': '/src/tools/developer/ZhToPinyin.vue',
  'qrcode-generate': '/src/tools/developer/QrcodeGenerate.vue',
  'qrcode-decode': '/src/tools/developer/QrcodeDecode.vue',
  'markdown-preview': '/src/tools/developer/MarkdownPreview.vue',
  'base-converter': '/src/tools/developer/BaseConverter.vue',
}

const categoryTagTypes: Record<string, string> = {
  encoding: '',
  encryption: 'warning',
  json: 'success',
  yaml: 'danger',
  css: '',
  js: 'info',
  developer: 'success',
}

const currentTool = computed(() => findTool(route.params.id as string))

const isFav = computed(() => currentTool.value ? isFavorite(currentTool.value.id) : false)

const categoryName = computed(() => {
  if (!currentTool.value) return ''
  const cat = categories.find(c => c.id === currentTool.value!.category)
  return cat?.name ?? ''
})

type ElTagType = 'success' | 'info' | 'warning' | 'danger' | ''
const categoryTagType = computed(
  (): ElTagType => (categoryTagTypes[currentTool.value?.category ?? ''] ?? '') as ElTagType
)

async function loadComponent(id: string) {
  const modulePath = componentMap[id]
  if (!modulePath || !allModules[modulePath]) {
    asyncComponent.value = null
    return
  }
  loading.value = true
  try {
    const loader = allModules[modulePath] as () => Promise<any>
    asyncComponent.value = defineAsyncComponent({
      loader,
      loadingComponent: { template: '<div></div>' },
      delay: 200,
      timeout: 15000,
    })
  } catch {
    asyncComponent.value = null
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      asyncComponent.value = null
      await loadComponent(id as string)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
</style>
