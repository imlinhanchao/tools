<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('')
const output = ref('')
const error = ref('')

const example = `interface User {
  id: number;
  name: string;
  email?: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob' },
];

users.forEach((u: User) => {
  console.log(greet(u));
});`

async function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    // Dynamically import TypeScript compiler
    const ts = await import('typescript')
    const result = ts.transpileModule(input.value, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2017,
        strict: false,
        removeComments: false,
      }
    })
    output.value = result.outputText
    if (result.diagnostics && result.diagnostics.length > 0) {
      error.value = result.diagnostics.map(d => typeof d.messageText === 'string' ? d.messageText : d.messageText.messageText).join('\n')
    }
  } catch (e: any) {
    error.value = e.message; output.value = ''
  }
}

function loadExample() { input.value = example; transform() }
function copyOutput() { navigator.clipboard.writeText(output.value).then(() => message.success('已复制到剪贴板')) }
onMounted(loadExample)
</script>

<template>
  <div class="tool-container">
    <div class="io-grid">
      <div class="io-panel">
        <div class="panel-header">
          <span>TypeScript 输入</span>
          <div class="btn-group">
            <el-button size="small" @click="loadExample">示例</el-button>
            <el-button size="small" @click="input = ''; output = ''; error = ''">清除</el-button>
          </div>
        </div>
        <el-input type="textarea" v-model="input" :rows="15" placeholder="请输入TypeScript代码..." @change="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>JavaScript 输出</span>
          <el-button size="small" @click="copyOutput">复制</el-button>
        </div>
        <el-input type="textarea" v-model="output" :rows="15" readonly />
        <el-alert v-if="error" :title="error" type="error" show-icon style="margin-top:8px" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { padding: 0; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.io-panel { display: flex; flex-direction: column; gap: 8px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.btn-group { display: flex; gap: 4px; }
@media (max-width: 768px) { .io-grid { grid-template-columns: 1fr; } }
</style>
