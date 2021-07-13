import service from "@/api/index";


export function exportFile(data) {

	return service({
		url: "account/exportFile", //完整路由地址
		method: 'post', //请求类型
		params: data,
		headers: {
			"Content-type": "application/json",
		},
		responseType: 'blob'  //响应类型，避免乱码
	})

}

export function downloadTemp() {

	return service({
		url: "account/downloadTemp",
		method: 'post',
		responseType: 'blob'
	})
}