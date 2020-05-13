/*
 * @Author: sam.guo
 * @Date: 2020-05-13 13:31:06
 * @LastEditTime: 2020-05-13 15:51:31
 * @LastEditors: Please set LastEditors
 * @Description: 配置文件
 * @FilePath: \xcx_xlsx\config.js
 */
/**
 * time: 需要查看数据的当天时间
 * title：表头
 */
const config = {
    appid: '',
    appsecret: '',
    filename: 'result', // 重命名会生成新文件，如果需要读取原有文件的数据，则将excel文件添加入根目录，并将filename命名为excel文件名称
    suffix: 'xls',
    time: '20200318',
    title: ['ref_date', 'session_cnt', 'visit_pv', 'visit_uv', 'visit_uv_new', 'stay_time_uv', 'stay_time_session', 'visit_depth'],
    sort: 1, // 是否对数据排序， 如果是-1，则反序，如果是1则正序，如果是0：按默认顺序，当前设置为-1/1时，会更改原始数据(及不能还原，但会不会对后续新增数据进行排序)
    // 样式配置，暂时只能配置列宽
    option: {
        '!cols': [
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 180 },
            { wpx: 100 }
        ]
    }
}

module.exports = {
    config: config
}