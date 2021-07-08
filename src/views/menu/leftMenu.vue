<template>
    <div>
        <el-menu
                :default-active="$route.path"
                class="el-menu-vertical-demo"
                router
                :unique-opened="true"
                :collapse="false">
            <menu-item :route="routesInfo"></menu-item>
        </el-menu>
    </div>
</template>

<script>
	import menuItem from './menuItem.vue';
	export default {
		name: "leftMenu",
		components: {menuItem},
		data() {
			return {

			};
		},

		methods: {

		},

		computed: {
			routesInfo: function(){
				return this.$router.options.routes;
			}
		},
	}
</script>

<style scoped>

</style>