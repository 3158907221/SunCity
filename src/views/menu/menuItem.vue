<template>
    <div>
        <el-submenu
                v-for="child in route"
                v-if="child.meta.hasSubMenu"
                :index="child.path">
            <template slot="title">
                <!--<i :class="child.meta.icon"></i>-->
                <span slot="title">{{child.meta.title}}</span>
            </template>
            <!--递归调用组件自身 -->
            <menu-item :route="child.children"></menu-item>
        </el-submenu>
        <el-menu-item :index="child.path" v-else>
            <!--<i :class="child.meta.icon"></i>-->
            <span slot="title">{{child.meta.title}}</span>
        </el-menu-item>
    </div>
</template>

<script>
	export default {
		name: "menuItem",
		props: ['route'],
        data() {
			return {

            }
        },
        methods: {
			toLink(path) {
				this.$router.push({ path: path })
            }
        }
	}
</script>

<style scoped>

</style>