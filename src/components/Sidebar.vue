<template>
   <div class='left-menu' id="leftMenu">
      <p>快捷功能</p>
      <ul>
        <li class="cur" @click='newMeetingPage'>
          <span class="side-icon side-icon-1"></span><span>新建</span>
        </li>
        <li><span class="side-icon side-icon-2"></span><span>搜索</span></li>
        <li @click='meetingScanPage'>
            <span class="side-icon side-icon-3"></span><span >笔记</span>
        </li>
        <li><span class="side-icon side-icon-4"></span><span>笔记本</span></li>
        <li><span class="side-icon side-icon-5"></span><span>收藏</span></li>
      </ul>
    </div>
</template>




