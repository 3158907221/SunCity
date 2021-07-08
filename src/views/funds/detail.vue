<template>
    <div>
        <el-form :inline="true" v-model="queryData" class="demo-form-inline">

            <el-form-item label="报表日期">
                <el-time-picker v-model="queryData.time">

                </el-time-picker>
            </el-form-item>

            <el-form-item label="状态">
                <el-select value v-model="queryData.status" multiple placeholder="请选择">
                    <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="账套名称">
                <el-input v-model="queryData.accountName"
                          placeholder="请输入账套名称进行检索"/>
            </el-form-item>

            <el-form-item label="所属板块">
                <el-select value v-model="queryData.block">
                    <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所属区域">
                <el-select v-model="queryData.area">
                    <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <div style="float: right">
                    <el-button size="small" class="red_button">重置</el-button>
                    <el-button size="small" class="search_button">查询</el-button>
                </div>
            </el-form-item>

        </el-form>

        <el-card>
            <el-row :gutter="12">

                <el-col :span="8">
                    <el-button size="small" type="danger">提交</el-button>
                </el-col>
                <el-col :span="4" style="float: right">
                    <el-button size="small" class="red_button">模板导出</el-button>
                    <el-button size="small" class="red_button">模板导入</el-button>
                </el-col>

            </el-row>
            <el-row style="margin-top: 10px">
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        :header-cell-style="{background:'#e1e4e5',color:'#80878f'}"
                        style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            label="报表日期"
                            width="120">
                        <template slot-scope="scope">{{ scope.row.date }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="block"
                            label="板块"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="area"
                            label="区域"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="accountName"
                            label="账套"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="100px">
                        <el-button type="text" class="text_button">编辑</el-button>
                    </el-table-column>
                </el-table>

                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.length">
                </el-pagination>
            </el-row>
        </el-card>

    </div>
</template>

<script>
	export default {
        data() {
			return {
				// 当前页
				currentPage: 1,
				// 每页多少条
				pageSize: 10,
				queryData: {
					time:[],
					accountName: '',
					block: '',
					area: '',
					status: ''
				},
				statusList:[
					{
						value: '0',
						label: '全部'
					},
					{
						value: '1',
						label: '未填报'
					},
					{
						value: '2',
						label: '已填报'
					},
					{
						value: '3',
						label: '已提交'
					},
				],
				tableData: [
					{
						date: '2016-05-03',
						name: '王小虎',
						address: '上海市普陀区金沙江路 1518 弄'
					}
                ]
            }
        },
		methods: {
			handleSizeChange(val) {
				this.pageSize = val;
			},
			// 当前页
			handleCurrentChange(val) {
				this.currentPage = val;
			}
		}
	}
</script>


<style scoped>

</style>