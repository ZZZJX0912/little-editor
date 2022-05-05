<template>
  <div class="editor">
    <div id="editor_container" class="editor_container" contenteditable @blur="blur"></div>

    <div id="variable-list" class="variable-list">
      <div
        v-for="(variable,index) in variableList"
        :key="variable.dialogVariableId"
        class="variable-item"
        :class="{'is-active':currentIndex === index}"
        @click="pickVariable"
        @mouseenter="()=>{currentIndex = ''}"
      >
      {{ variable.variableName }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 变量列表
    variableList: {
      type: Array,
      default: () => []
    },
    content: {
      type: String,
      default: ''
    },
  },
  model: {
    prop: 'content',
    event: 'update'
  },
  watch: {
    // 匹配变量
    matchFlag: {
      handler (val) {
        if (val) {
          // 显示菜单
          this.showMenu()
        } else {
          this.hiddenMenu()
        }
      }
    }
  },
  data () {
    return {
      observer: null,
      defaultForm: {},
      form: {},
      editorRef: null,
      variableListRef: null,
      matchFlag: false,
      // 匹配次数
      regTime: 0,
      currentIndex: 0
    }
  },
  mounted () {
    this.form = Object.assign({}, ...this.defaultForm)
    this.editorRef = document.getElementById('editor_container')
    this.variableListRef = document.getElementById('variable-list')
    document.body.addEventListener('keydown', this.handleKeydown)
    this.mutation()
    this.display(this.content)
  },
  methods: {
    display (val) {
      this.matchVariableToShow(val)
      this.setCursorPos(this.editorRef)
    },

    // 监听富文本输入
    mutation () {
      this.observer = new MutationObserver((mutations) => {
        console.log('mutations', mutations)
        mutations.forEach(mutation => {
          if (mutation.type === 'characterData') {
            this.matchFlag = false
            const textContent = mutation.target.textContent
            // 文案输入
            this.$nextTick(() => {
              this.matchFlag = this.matchVariable(textContent)
            })
          }
        })
        const textContent = this.editorRef.innerText

        // 向上同步数据
        this.$emit('update', textContent)
      })

      this.observer.observe(this.editorRef, {
        subtree: true,
        characterData: true,
        childList: true
      })
    },

    // 匹配变量
    matchVariable (text) {
      this.matchFlag = false
      const matchReg = /[\w\u4e00-\u9fa5]*@/g
      const match = text.match(matchReg) || []
      if (this.regTime === match.length) return false
      this.regTime = match.length
      return !!match.length
    },
    // 监听键盘事件
    listenKeyboardEnt () {},

    // 显示菜单
    showMenu () {
      const offset = this.getMenuPosition()
      this.setMenuPosition(offset)
      this.activeMenuItem(0)
    },

    // 获取菜单位置
    getMenuPosition () {
      // 高度默认偏移（line-height）
      const heightDefalutOffset = 18
      // 编辑器本身的偏移
      const editorOffset = this.editorRef.getBoundingClientRect()

      // 获取输入文字高度
      const selection = document.getSelection()
      const range = new Range()
      range.setStart(selection.focusNode, 0)
      range.setEnd(selection.focusNode, selection.focusOffset)
      const domRectList = range.getClientRects()
      const targetDomRect = domRectList[domRectList.length - 1]
      // 高度偏移
      const offsetTop = targetDomRect.top - editorOffset.top + heightDefalutOffset
      // 左侧偏移
      const offsetLeft = targetDomRect.left - editorOffset.left + targetDomRect.width
      return {
        offsetTop,
        offsetLeft
      }
    },

    setMenuPosition (offset) {
      this.variableListRef.style.display = 'block'
      this.variableListRef.style.left = `${offset.offsetLeft}px`
      this.variableListRef.style.top = `${offset.offsetTop}px`
      this.variableListRef.style.zIndex = 20000
    },
    // 活动的菜单选项
    activeMenuItem (index) {
      this.currentIndex = index
      // const childList = this.variableListRef.children
    },
    // 隐藏菜单
    hiddenMenu () {
      this.variableListRef.style.display = 'none'
    },

    blur (e) {
      this.$emit('blur', e)
    },

    // 选择变量
    pickVariable (target) {
      this.regTime -= 1
      const variable = target.innerText || target.target.innerText
      const selection = document.getSelection()
      const range = selection.getRangeAt(0)
      range.setStart(selection.focusNode, selection.focusOffset - 1)
      range.setEnd(selection.focusNode, selection.focusOffset)
      const insertNode = document.createElement('span')
      insertNode.className = 'variable'
      insertNode.innerText = `@${variable}@`
      insertNode.setAttribute('contenteditable', false)
      range.deleteContents()
      range.insertNode(insertNode)
      // span标签后续无法选中光标问题
      this.editorRef.innerHTML += ' '
      this.setCursorPos(this.editorRef)
    },

    // 设置光标问题
    setCursorPos (obj) {
      if (window.getSelection) { // ie11 10 9 ff safari
        obj.focus() // 解决ff不获取焦点无法定位问题
        const range = window.getSelection()// 创建range
        range.selectAllChildren(obj)// range 选择obj下所有子内容
        range.collapseToEnd()// 光标移至最后
      }
    },

    // 解决回显问题
    matchVariableToShow (str) {
      const reg = /@[(\w\u4e00-\u9fa5)]+@/g
      const labelStr = str.replace(reg, '<span class="variable" contenteditable="false">$&</span>')
      this.editorRef.innerHTML += labelStr
      console.log(11, this.editorRef)
    },

    // 监听键盘按下事件
    handleKeydown (e) {
      const keyCode = e.keyCode
      if (!this.variableList || !this.variableList.length || !this.matchFlag) return
      switch (keyCode) {
        // enter
        case 13:
          const targetItem = this.variableListRef.children[this.currentIndex]
          console.log(123123, targetItem)
          this.pickVariable(targetItem)
          break

        // esc
        case 27:
          this.matchFlag = false
          this.hiddenMenu()
          break

        // up
        case 38:
          if (this.currentIndex - 1 < 0) {
            this.currentIndex = this.variableList.length - 1
          } else {
            this.currentIndex--
          }
          break

        // down
        case 40:
          if (this.currentIndex + 1 > this.variableList.length - 1) {
            this.currentIndex = 0
          } else {
            this.currentIndex++
          }
          break
        default:
          return true
      }
      e.preventDefault()
    }

  }
}
</script>

<style lang='scss' scope>
.editor{
  position: relative;
}
.editor_container{
  outline: 1px solid #ddd;
  padding: 8px;
  line-height: 18px;
  height: 80px;
  overflow: scroll;
  .variable{
    color: #4d7ebb;
    cursor: pointer;
    user-select: none;
  }
}
.variable-list{
  display: none;
  position: absolute;
  box-shadow: 0px 0px 5px #666;
  width: fit-content;
  .variable-item{
    width: 120px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #ddd;
    overflow: hidden;
    user-select:none;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.is-active{
      background-color: #eee;
    }
    &:hover{
      background-color: #eee;
    }
  }
}

</style>
