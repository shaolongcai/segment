import React, { Component } from 'react'
import { View,Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { AtToast } from "taro-ui"
import Taro from '@tarojs/taro'
import SegmentImage from '../../components/imageList/index'
import './index.scss'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            segmentImgUrl: '',
            saveToast:false
        }
    }

    // 可以使用所有的 React 生命周期方法
    componentDidMount() { }


    // onLoad
    onLoad(e) {
        Taro.getStorage({
            key: 'segmentImgUrl',
            success: res => {
                console.log(res.data)
                this.setState({
                    segmentImgUrl: res.data
                })
            }
        })
    }


    // onReady
    onReady() { }

    // 对应 onShow
    componentDidShow() { }

    // 对应 onHide
    componentDidHide() { }

    // 对应 onPullDownRefresh，除了 componentDidShow/componentDidHide 之外，
    // 所有页面生命周期函数名都与小程序相对应
    onPullDownRefresh() { }

    onChange() {

    }

    // 签名
    // 签名
    async getSign(params) {
        //  需要返回一个promise
        return new Promise((resolve, reject) => {
            Taro.request({
                url: 'https://segment-4gezmw2c75430e48-1255646301.ap-shanghai.app.tcloudbase.com/upload_oss_helper', //仅为示例，并非真实的接口地址
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: res => {
                    resolve(res)
                }
            })
        })
    }

    //将结果转换成oss,接受一个裁剪后的图片url
    async saveResultImg(url) {
        new Promise((reslove, reject) => {
            this.getSign().then(
                res => {
                console.log(url)
                    const fileNameArr = url.split('/')
                    // console.log('await返回：', res)
                    const host = 'https://intelligent-vision-test.oss-cn-shanghai.aliyuncs.com';
                    const signature = res.data.signature;
                    const ossAccessKeyId = res.data.OSSAccessKeyId;
                    const policy = res.data.policy;
                    const key = 'test/' + fileNameArr[fileNameArr.length - 1];

                    Taro.uploadFile({
                        url: host, // 开发者服务器的URL。
                        filePath: url,
                        name: 'file', // 必须填file。
                        formData: {
                            key,
                            policy,
                            OSSAccessKeyId: ossAccessKeyId,
                            signature,
                        },
                    }).then(res => {

                        const head = 'https://intelligent-vision-test.oss-cn-shanghai.aliyuncs.com/'
                        // https://intelligent-vision-test.oss-cn-shanghai.aliyuncs.com/test/Rd3aMHdS1ADSb4a1d633acda1c43b36e8a5bf1c87a37.png
                        // 图片访问链接
                        const fileUrl = head + key
                        reslove(fileUrl)
                    })
                }
            )
        })
    }

    insertStr(soure, start, newStr){   
        return soure.slice(0, start) + newStr + soure.slice(start);
     }

    // 下载图片逻辑
    downloadImg() {
        console.log('download')
        Taro.showLoading({
            title:'正在保存',
            mask:true
        })
        //http+s  
        const segmentImgUrl = 'https:' + this.state.segmentImgUrl.slice(5);
        console.log(segmentImgUrl)
        Taro.getImageInfo({
            src: segmentImgUrl,
            success: res => {
                console.log(res.path)
                Taro.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: res => {
                        console.log('save success')
                        this.setState({
                            saveToast:true
                        })
                        Taro.hideLoading()
                    }
                })
            }
        })


       
    }

    render() {
        const segmentImgUrl = this.state.segmentImgUrl
        return (
            <View className='container'>
                <AtToast isOpened={this.state.saveToast} hasMask='true' duration='2000' text="保存成功"></AtToast>
                {/* <SegmentImage files={segmentImgUrl} number={3} /> */}
                <Image src={ segmentImgUrl} className='image' mode='aspectFit' />
                <AtButton type='primary' className='downloadBtn' onClick={this.downloadImg.bind(this)}>保存图片</AtButton>
            </View>
        )
    }
}

export default Index