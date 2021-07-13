<template>
    <div>
        <el-form :inline="true" v-model="queryData" class="demo-form-inline">

            <el-form-item label="报表日期">
                <el-time-picker v-model="queryData.cfrptdate">

                </el-time-picker>
            </el-form-item>

            <el-form-item label="银行账户">
                <el-input v-model="queryData.cfrpteaccbanknumber"
                          placeholder="请输入银行账号"/>
            </el-form-item>

            <el-form-item label="账套名称">
                <el-input v-model="queryData.cfrptecompanyname"
                          placeholder="请输入账套名称进行检索"/>
            </el-form-item>

            <el-form-item label="状态">
                <el-select value v-model="queryData.currentStatus" multiple placeholder="请选择">
                    <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <div>
                    <el-button size="small" class="red_button">重置</el-button>
                    <el-button size="small" class="search_button">查询</el-button>
                </div>
            </el-form-item>

        </el-form>

        <el-card>
            <el-row :gutter="24">

                <el-col :span="7" >
                    <span class="font" style="margin-right: 5px">单位：元</span>
                    <el-button size="small" type="danger">保存</el-button>
                    <el-button size="small" type="danger">提交</el-button>
                    <el-button size="small" class="red_button">取消提交</el-button>
                </el-col>
                <el-col :span="12">
                    <span class="red font" >
                        温馨提示：银企账号每天17点30分从金蝶同步账号余额，同步完成后需检查并提交，谢谢！
                    </span>
                </el-col>
                <el-col :span="5">
                    <el-button size="small" class="red_button" @click="tempExport">模板导出</el-button>
                    <el-button size="small" class="red_button" @click="tempImport">模板导入</el-button>
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
                        <template slot-scope="scope">{{ scope.row.cfrptdate }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="cfrptecompanyname"
                            label="账套名称"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="cfrptebankname"
                            label="金融机构名称"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="cfrpteaccbanknumber"
                            label="账号"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="cfrptecurrency"
                            label="币种">
                    </el-table-column>
                    <el-table-column
                            prop="cfrptesrcamount"
                            label="原币余额">
                        <el-input></el-input>
                    </el-table-column>
                    <el-table-column
                            prop="exchangerate"
                            label="汇率">
                    </el-table-column>
                    <el-table-column
                            prop="cfbaseamount"
                            label="本位币余额">
                    </el-table-column>
                    <el-table-column
                            prop="currentStatus"
                            label="状态">
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

        <el-dialog
                title="模板导入"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">

            <el-upload
                    class="upload-demo"
                    ref="upload"
                    drag
                    action="/api/account/uploadTemp"
                    :limit=1
                    :auto-upload="false"
                    accept=".xlsx"
                    :on-exceed="exceedFile"
                    :on-success="uploadSuccess"
                    :before-upload="beforeUploadFile">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">只能上传xlsx(Excel2007)文件，且不超过10M</div>
            </el-upload>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="uploadFile">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import {exportFile, downloadTemp} from '@/api/accountBalance/index.js'

	export default {
		data() {
			return {
				dialogVisible: false,
				// 当前页
				currentPage: 1,
				// 每页多少条
				pageSize: 10,
				queryData: {
					cfrptdate: '',
					cfrpteaccbanknumber: '',
					cfrptecompanyname: '',
					currentStatus: ''
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
				],
            }
        },
        methods: {
	        handleSizeChange(val) {
		        this.pageSize = val;
	        },
	        // 当前页
	        handleCurrentChange(val) {
		        this.currentPage = val;
	        },

            //模板导入
	        handleClose() {
	        	this.dialogVisible = false;
            },
	        exceedFile(files, fileList) {
		        this.$notify.warning({
			        title: '警告',
			        message: `只能选择 1 个文件，当前共选择了 ${files.length + fileList.length} 个`
		        });
            },
	        uploadSuccess(response) {
		        console.log("上传文件成功response" +response);
		        // response：即为后端传来的数据，这里我返回的是图片的路径
		        this.$notify.success("导入成功")
	        },
	        beforeUploadFile(file) {
	        	let fileName = file.name.substring(0, file.name.lastIndexOf('.'));
		        let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
		        let size = file.size / 1024 / 1024
                if (fileName !== "template") {
	                this.$notify.warning({
		                title: '警告',
		                message: `上传的文件名必须为 template.xlsx`
	                });

	                // return false
                }

		        if(extension !== 'xlsx') {
			        this.$notify.warning({
				        title: '警告',
				        message: `只能上传xlsx(Excel2007)文件，且不超过10M`
			        });

			        return false
		        }

		        if(size > 10) {
			        this.$notify.warning({
				        title: '警告',
				        message: `文件大小不得超过10M`
			        });

			        return false
		        }
            },
	        uploadFile() {
		        this.$refs.upload.submit()
                this.handleClose()
            },

	        tempImport() {
		        this.dialogVisible = true;
            },
	        tempExport() {
		        downloadTemp().then((res) => {
	        		console.log(res)
	        		// this.downloadFile(res)
                })

		        // let postData = {"id": "123"};
		        // exportFile(postData).then((res) => {
			    //     this.downloadFile(res)
                // })
	        },



	        downloadFile(data) {
                const link = document.createElement('a');
                let blob = new Blob([data.data], {
                    type: 'application/vnd.ms-excel'
                });
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);

                link.setAttribute('download', 'template' + '.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
	}
</script>

<style scoped>

</style>