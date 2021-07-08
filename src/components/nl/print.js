const Xlsx = require('xlsx')
const FileSaver = require('file-saver')

const defaultOption = {
    header: [],
    objSeq: [],
    arrSeq: [],
    seq: []
}

const isCell = (a) => a || a === false || a === NaN || a === 0

// 转换 table 元素
const buildTable = (data, option) => {
    let htmlstr = ''
    if (option.header.length > 0) {
        htmlstr = `<tr>${option.header.map(h => `<td>${h.toString()}</td>`).join('')}</tr>`
    }

    // 字符串,根据换行符切割
    if (typeof data === 'string') {
        data = data.replace(/\n$/, '').split(/\n/)
    }
    // 构建 html 字符串
    htmlstr += data.map((row, i) => {
        if (row instanceof Array) {
            // 二维数组,循环
            let htmlCells = row.map(cell => `<td>${(isCell(cell) ? cell : '').toString()}</td> `)
            let seq = null
            if (option.arrSeq.length > 0) {
                seq = option.arrSeq;
            } else if (option.seq.length > 0) {
                seq = option.Seq
            }

            return `< tr > ${seq ? seq.map(e => htmlCells[e]).join('') : htmlCells.join('')}</tr > `
        } else if (typeof row === 'string') {
            // 字符串,切割,循环
            let htmlCells = row.replace(/[\t\n]$/, '').split(/[\t\n]/).map(cell => `<td>${(isCell(cell) ? cell : '').toString()}</td> `)
            let seq = null
            if (option.arrSeq.length > 0) {
                seq = option.arrSeq
            } else if (option.Seq.length > 0) {
                seq = option.Seq
            }
            return `< tr > ${seq ? seq.map(e => htmlCells[e]).join('') : htmlCells.join('')}</tr> `
        } else {
            // 对象,值转化数组后输出
            let seq = null
            if (option.objSeq.length > 0) {
                seq = option.objSeq
            } else if (option.seq.length > 0) {
                seq = option.Seq
            }
            return `< tr > ${
                seq
                    ? seq.map(e => row[e]).map(cell => `<td>${(isCell(cell) ? cell : '').toString()}</td>`).join('')
                    : Object.values(row).map(cell => `<td>${(isCell(cell) ? cell : '').toString()}</td>`).join('')
                }</tr > `
        }
    }).join('')

    let html = document.createElement('table')
    html.innerHTML = htmlstr
    return html
}


const convertFile = async function (data) {
    let sheet = Xlsx.utils.table_to_book(data, {
        raw: true
    })
    // 获取二进制字符串作为输出
    let xlsx = Xlsx.write(sheet, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
    })
    console.log(xlsx)
    return xlsx
}

const exportFile = async function (file, fileName) {
    FileSaver.saveAs(
        new Blob([file], {
            type: 'application/octet-stream'
        }), `${fileName}.xlsx`
    )
}

const exportFun = async function (data, fileName) {
    let date = new Date()
    let xlsx
    try {
        if (!Xlsx) throw '引入 xlsx 插件失败'
        if (!FileSaver) throw '引入 file-saver 插件失败'
        // 转换
        xlsx = await convertFile(data)
        // 导出
        exportFile(xlsx, fileName)
    } catch (e) {
        console.log(e, xlsx)
    } finally {
        console.log('导出所用时间:' + (new Date() - date) / 1000)
    }
    return xlsx
}


const exportExcel = async function (array, fileName, option) {
    return exportFun(buildTable(array, {
        ...defaultOption,
        ...option
    }), fileName)
}
const exportDom = async function (dom, fileName) {
    return exportFun(dom, fileName)
}

export default {
    exportExcel,
    exportDom
}