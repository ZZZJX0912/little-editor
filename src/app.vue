<template>
  <div id="app">
    <img alt="Vue logo" src="../assets/logo.png" />
    <use-editor v-if='editorVisiable' :visiable.sync='editorVisiable'/>
    <button v-else @click="showDialog">显示弹框</button>
  </div>
</template>

<script>
import useEditor from '../src/editorDemo/useEditor';
export default {
  name: 'App',
  components: {
    useEditor: useEditor,
  },
  data(){
    return{
      editorVisiable:false
    };
  },
  methods:{
    showDialog(){
      this.editorVisiable = true;
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
