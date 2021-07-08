<template>
    <div>
        <el-container>
            <el-header>
                <!--<TopMenu :logoPath="logoPath" :name="name"></TopMenu>-->
            </el-header>
            <el-container id="left-container">
                <el-aside width="200px">

                    <left-menu></left-menu>

                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>


  <!--<div class="home-root" @mouseup="handleMouseUp">-->
    <!--<nav-menu class="home-menu"></nav-menu>-->
    <!--<keep-alive><router-view class="home-client"></router-view></keep-alive>-->
    <!--<el-tabs class="home-tab" v-model="tabPath" type="border-card" closable @tab-click="handleTabClick" v-if="tabList.length" @tab-remove="handleTabRemove" tab-position="bottom">-->
      <!--<el-tab-pane :key="item.name" v-for="item in tabList" :label="item.name" :name="item.path"></el-tab-pane>-->
    <!--</el-tabs>-->
  <!--</div>-->
</template>

<script>

import leftMenu from './menu/leftMenu.vue';

export default {
    name: "Home",
	components: {leftMenu},
    data() {
        return {

        };
    },

    methods: {

    },

    computed: {

    },
};
</script>

<style scoped>

</style>
