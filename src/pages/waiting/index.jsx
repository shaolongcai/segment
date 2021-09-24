import React, { Component } from 'react'
import { View,Text,Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro'
import './index.scss'


class Index extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            files: {}
        }
      }
 
    onLoad(e) {
        Taro.getStorage({
            key: 'files',
            success: res => {
                const file = res.data[0]
                this.setState({
                    files:file
                })
            }
        })
    }

     //切割图片
  segmentImg() {
    Taro.showLoading({
      title:'正在裁剪',
      mask:true
    })
    const url = this.state.files
    // https://segment-4gezmw2c75430e48-1255646301.ap-shanghai.app.tcloudbase.com/segment_img
    Taro.request({
      url: 'https://segment-4gezmw2c75430e48-1255646301.ap-shanghai.app.tcloudbase.com/segment_img',
      data: {
        url: url.url
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // console.log('裁剪第', index + 1, '张图片')
        console.log('res:',res)
        const segmentImgUrl = res.data.data.Data.Url
        Taro.setStorage({
          key: "segmentImgUrl",
          data: segmentImgUrl
        })
        Taro.redirectTo({
          url: '../results/index',
          success: res => {
            console.log('跳转成功')
            Taro.hideLoading()
          }
        })
      }
    })
  }

    render() {
        const files = this.state.files.url
        return (
            <View className='container'>
                <Image className='image' mode='aspectFit' src={files} />
                <AtButton type='primary' className='segment' onClick={ this.segmentImg.bind(this)}> 裁剪图片</AtButton>
            </View>
        )
    }
}

export default Index