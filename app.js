/*
 * @Author: sam.guo
 * @Date: 2020-05-13 13:27:46
 * @LastEditTime: 2020-05-13 15:29:48
 * @LastEditors: Please set LastEditors
 * @Description: 获取微信小程序数据日趋势
 * @FilePath: \xcx_xlsx\app.js
 */
const express = require('express');
const request = require('request');
const xlsx = require('node-xlsx')
const fs = require('fs')
const config = require('./config').config;

const app = express()

/**
 * @description: 启动node本地服务器，可不使用
 */
app.listen(3000, () => {
    console.log('server is running')
})

// 小程序接口返回json数据键
var xlsxTitle = ['ref_date', 'session_cnt', 'visit_pv', 'visit_uv', 'visit_uv_new', 'stay_time_uv', 'stay_time_session', 'visit_depth']

/**
 * @description: 请求小程序接口获取access_token
 * @return: {String} access_token
 */
function getAccessToken() {
    return new Promise((resolve, reject) => {
        request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.appsecret}`, (err, res) => {
            console.log(res.body)
            if (res.body) {
                const data = JSON.parse(res.body)
                resolve(data.access_token)
            } else {
                reject(err)
            }
        })
    })
}

/**
 * @description: 获取微信小程序日趋势数据
 * @param {type} {String} access_token
 * @return: 
 */
function getweanalysisappiddailyvisittrend(access_token) {
    return new Promise((resolve, reject) => {
        request({ url: `https://api.weixin.qq.com/datacube/getweanalysisappiddailyvisittrend?access_token=${access_token}`, method: "POST", body: JSON.stringify({ "begin_date": config.time, "end_date": config.time }) }, (err, res) => {
            if (err) {
                reject(err)
            } else if (res.body) {
                resolve(res.body)
            }
        })
    })
}

/**
 * @description: 对请求到的日趋势数据进行格式化
 * @param {type}  {JSON} data
 * @return: {Array} result 整理好后的array数据，例如： [20101210, 1, 1, 1, 1, 1, 1, 1], 对应xlsxTitle
 */
function setData(data) {
    const jsonData = JSON.parse(data);
    if (!jsonData || !jsonData.list || jsonData.list.length === 0) return false
    const item = jsonData.list[0]
    const result = []
    for (let k of xlsxTitle) {
        result.push(item[k])
    }
    return result
}

/**
 * @description: 读取已存在的xlsx表数据，如果不存在则须在创建xlsx表的时候添加title，如果已存在则向最后一行添加数据
 * @return: {JSON} 读取到的xlsx数据
 */
function readXlsx() {
    return new Promise((resolve, reject) => {
        try {
            var obj = xlsx.parse(`./${config.filename}.${config.suffix}`);
            resolve(obj)
        } catch (err) {
            console.log('读取失败或不存在该表')
            resolve(false)
        }
    })
}

/**
 * @description: 检查当天数据是否已存在，如果存在则不进行添加
 * @param {type} {JSON} oldd xlsx表中已存在的数据
 * @param {type} {Array} newd 从小程序API新获取到的数据
 * @return: {Boolean} 是否已存在，存在则返回 true, 否则 false
 */
function checkData(oldd, newd) {
    for (let k of oldd[0].data) {
        if (k[0] === newd[0]) {
            return false
        }
    }
    return true
}

/**
 * @description: 写入xlsx表
 * @param {type} {JSON} xlsxData， {title: 'sheet', data: [[],[]]}
 */
function writeXlsx(xlsxData) {
    // 对数据根据日期重新排序
    if (config.sort !== 0) {
        xlsxData[0].data.sort(function(a, b) {
            if (config.sort > 0) {
                return a[0] - b[0]
            } else {
                return b[0] - a[0]
            }
        })
    }
    var buffer = xlsx.build(xlsxData, config.option);
    fs.writeFile(`./${config.filename}.${config.suffix}`, buffer, function(err) {
        if (err) {
            console.error('存储失败')
        } else {
            console.log('更新成功')
        }
    })
}

/**
 * @description: 对新老数据进行检测处理，最终形成node-xlsx所需要的数据，并调取写入函数生成excel表
 * @param {type} {JSON} data {list: []} 通过小程序接口获取到的日趋势数据
 */
async function getXlsxData(data) {
    const newData = setData(data)
    const oldData = await readXlsx()
    let xlsxData;
    if (newData) {
        if (oldData) {
            xlsxData = oldData
            if (checkData(oldData, newData)) {
                xlsxData[0].data.push(newData)
            } else {
                console.log('未更新数据')
            }
        } else {
            xlsxData = [{
                name: 'sheet1',
                data: [config.title, newData]
            }]
        }
        writeXlsx(xlsxData)
    }
}

/**
 * @description: 入口函数，获取access_token以及日趋势数据
 */
async function inti() {
    try {
        const token = await getAccessToken()
        const data = await getweanalysisappiddailyvisittrend(token)
        getXlsxData(data)
    } catch (err) {
        console.log('请求报错')
    }
}
inti()