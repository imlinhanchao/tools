<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage as message } from 'element-plus'

const input = ref('')
const output = ref('')
const error = ref('')

const example = `.parent {
  color: red;
  font-size: 14px;
}

.parent .child {
  color: blue;
  margin: 0;
}

.parent .child:hover {
  opacity: 0.8;
}

.button {
  background: #1677ff;
  padding: 8px 16px;
}

.button:hover {
  background: #0958d9;
}`

function cssToLess(css: string): string {
  // Parse CSS blocks
  const blocks: { selector: string; props: string }[] = []
  const blockRegex = /([^{}]+)\{([^{}]*)\}/g
  let m
  while ((m = blockRegex.exec(css)) !== null) {
    blocks.push({ selector: m[1].trim(), props: m[2].trim() })
  }

  // Build nesting map
  const nested: Record<string, { props: string; children: Record<string, string> }> = {}
  const roots: string[] = []

  for (const block of blocks) {
    const selectors = block.selector.split(',').map(s => s.trim())
    for (const sel of selectors) {
      // Try to find a parent
      let foundParent = false
      for (const root of roots) {
        if (sel.startsWith(root + ' ') || sel.startsWith(root + ':')) {
          const rest = sel.slice(root.length).trim()
          const child = rest.startsWith(':') ? '&' + rest : rest
          if (!nested[root].children[child]) nested[root].children[child] = ''
          nested[root].children[child] += block.props + '\n'
          foundParent = true
          break
        }
      }
      if (!foundParent) {
        roots.push(sel)
        if (!nested[sel]) nested[sel] = { props: '', children: {} }
        nested[sel].props += block.props + '\n'
      }
    }
  }

  // Output LESS
  const lines: string[] = []
  for (const root of roots) {
    const n = nested[root]
    lines.push(`${root} {`)
    if (n.props.trim()) {
      for (const line of n.props.trim().split('\n')) {
        if (line.trim()) lines.push(`  ${line.trim()}`)
      }
    }
    for (const [child, childProps] of Object.entries(n.children)) {
      lines.push('')
      lines.push(`  ${child} {`)
      for (const line of childProps.trim().split('\n')) {
        if (line.trim()) lines.push(`    ${line.trim()}`)
      }
      lines.push('  }')
    }
    lines.push('}')
    lines.push('')
  }
  return lines.join('\n').trim()
}

function transform() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    output.value = cssToLess(input.value)
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
          <span>CSS 输入</span>
          <div class="btn-group">
            <el-button size="small" @click="loadExample">示例</el-button>
            <el-button size="small" @click="input = ''; output = ''; error = ''">清除</el-button>
          </div>
        </div>
        <el-input type="textarea" v-model="input" :rows="15" placeholder="请输入CSS代码..." @change="transform" />
      </div>
      <div class="io-panel">
        <div class="panel-header">
          <span>Less 输出</span>
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
