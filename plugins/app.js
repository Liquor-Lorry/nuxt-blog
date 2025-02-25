// 创建新的插件文件
export default function({ app }) {
  if (process.client) {
    // 计算滚动条宽度
    const calculateScrollbarWidth = () => {
      const outer = document.createElement('div')
      outer.style.visibility = 'hidden'
      outer.style.overflow = 'scroll'
      document.body.appendChild(outer)

      const inner = document.createElement('div')
      outer.appendChild(inner)

      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
      outer.parentNode.removeChild(outer)

      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    }

    // 页面加载时计算
    calculateScrollbarWidth()

    // 监听窗口大小变化
    window.addEventListener('resize', calculateScrollbarWidth)
  }
} 