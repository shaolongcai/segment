import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { AtButton } from 'taro-ui';
import Taro from '@tarojs/taro'
import { AtToast } from "taro-ui"
// 需要使用import来引入图片
import nullImg from '../../image/null.png';



class Default extends Component {
    // 构造器
    constructor(props) {
        super(props)
        this.state = {
            sizeToast: false,
            WHToast:false
        }
       
    }

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

    // 上传图片到alioss的逻辑
    uploadImg() {
       
        Taro.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
            success: res => {
                Taro.showLoading({
                    title: '正在上传',
                    mask: true
                })
                // 分割图只能上传小于等于3M的图片;分辨率需要小于1280 * 1280
                const size = res.tempFiles[0].size
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                Taro.getImageInfo({
                    src: res.tempFilePaths[0],
                    success: res => {
                        const imgHeight = res.height
                        const imgWidth = res.width
                        if (size >= 3 * 1000 * 1000) {
                            this.setState({
                                sizeToast : true
                            })
                            Taro.hideLoading()
                        }
                        else if (imgHeight>1280 || imgWidth>1280) {
                            this.setState({
                                WHToast : true
                            })
                            Taro.hideLoading()
                        }
                        else {
                            
                            this.getSign().then(
                                res => {
                                    const fileUrls = []
                                    const fileNameArr = tempFilePaths[0].split('/')
                                    // console.log('await返回：', res)
                                    const host = 'https://intelligent-vision-test.oss-cn-shanghai.aliyuncs.com';
                                    const signature = res.data.signature;
                                    const ossAccessKeyId = res.data.OSSAccessKeyId;
                                    const policy = res.data.policy;
                                    const key = 'test/' + fileNameArr[fileNameArr.length - 1];
        
                                    Taro.uploadFile({
                                        url: host, // 开发者服务器的URL。
                                        filePath: tempFilePaths[0],
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
                                        fileUrls.push({ url: fileUrl })
                                        this.props.imgHandle(fileUrls)
                                        this.setState({
                                            files: fileUrls
                                        })
                                        Taro.hideLoading()
                                    })
                                }
                            )
        
                        }
                    }
                })
            }
        })
    }


    render() {
        return (
            <View className='container'>
                <AtToast isOpened={this.state.sizeToast} hasMask='true' duration='2000' text="只能上传小于或等于3M的图片"></AtToast>
                <AtToast isOpened={this.state.WHToast} hasMask='true' duration='2000' text="分辨率需小于1280 * 1280"></AtToast>
                <Image className='defaultImg' src={nullImg}></Image>
                <text className='defaultText'>{this.props.text}</text>
                <AtButton type='primary' className='defaultButton' onClick={this.uploadImg.bind(this)}>{this.props.btnText}</AtButton>
            </View>
        )
    }
}

export default Default