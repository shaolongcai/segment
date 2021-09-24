import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { AtButton } from 'taro-ui'
import Default from '../../components/default/index'
import Taro from '@tarojs/taro'
import Base64 from 'base-64';
import { AtImagePicker } from 'taro-ui'
import { AtActivityIndicator } from 'taro-ui'



export default class Index extends Component {
  // 构造器
  constructor(props) {
    super(props)
    this.state = {
      dataHad: false,
      files: [],
    }
  }

  componentWillMount() {
    // Taro.request({
    //   url: 'http://localhost:9527/api/user/imgList',
    //   method: "GET",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: res => {
    //     console.log(res.data.data)
    //     const data = res.data.data
    //     const datas = data.map(item => {
    //       return (
    //         <View className='at-col at-col-6'>
    //           {/* 这个是props */}
    //           <SegmentImage imgUrl={item} imgHandle={this.imgHandle.bind(this)}></SegmentImage>
    //         </View>
    //       )
    //     })
    //   }
    // })
  }


  // 获取签名
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

  // 变更图片的回调
  onChange(files) {
    // 需要添加loading
    Taro.showLoading({
      title:'正在上传',
      mask:true
    })

    // 1.删除掉数组长度 - 9 剩下的元素
    if (files.length > 9) {
      files.splice(8, files.length - 9)
    }
    
    const segmentImgs = []
    files.forEach((file, index) => {
      console.log(index)
      if (file.file && index < 9) {
        const tempFilePath = file.file.path
        this.getSign().then(res => {
          const fileNameArr = tempFilePath.split('/')
          const host = 'https://intelligent-vision-test.oss-cn-shanghai.aliyuncs.com';
          const signature = res.data.signature;
          const ossAccessKeyId = res.data.OSSAccessKeyId;
          const policy = res.data.policy;
          const key = 'test/' + fileNameArr[fileNameArr.length - 1];

          Taro.uploadFile({
            url: host, // 开发者服务器的URL。
            filePath: tempFilePath,
            name: 'file', // 必须填file。
            formData: {
              key,
              policy,
              OSSAccessKeyId: ossAccessKeyId,
              signature,
            },
          }).then(res => {
            const head = 'https://intelligent-vision-test.oss-cn-shanghai.aliyuncs.com/'
            // https://intelligent-vision-test.oss-cn-shanghai.aliyuncs.com/test/Rd3aMHdS1ADSb4a1d633acda1c43b36e8a5bf1c87a37.png 图片访问链接
            const fileUrl = head + key
            file.url = fileUrl
          })
        })
      }
    })
    this.setState({
      files: files,
    })
    Taro.hideLoading()
  }

  //切割图片
  segmentImg() {
    Taro.showLoading({
      title:'正在裁剪',
      mask:true
    })
    const urls = this.state.files
    // https://segment-4gezmw2c75430e48-1255646301.ap-shanghai.app.tcloudbase.com/segment_img
    const segmentImgUrls = []
    urls.forEach((url, index) => {
      console.log(url)
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
          segmentImgUrls.push(segmentImgUrl)
          this.setState({
            segmentImgUrls
          })
          console.log(segmentImgUrls)
          Taro.setStorage({
            key: "segmentImgUrls",
            data: segmentImgUrls
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
    });
  }


  // 处理子组件的图片选择，true为选中，flase为取消选中
  imgHandle(files) {
    this.setState({
      dataHad: false,
      files: files,
      length: files.length,
    })
    Taro.setStorage({
      key: 'files',
      data: files,
      success: (res) => {
        Taro.navigateTo({
          url:'../waiting/index'
        })
      }
    })
  }



  onFail(mes) {
    console.log(mes)
  }
  onImageClick(index, file) {
    console.log(index, file)
  }


  render() {
    return (
      <View className='index'>
        {
          this.state.dataHad ?
            <View>
              <AtImagePicker
                showAddBtn={ this.state.files.length >=9 ? false : true}
                multiple
                files={this.state.files}
                onChange={this.onChange.bind(this)}
                onFail={this.onFail.bind(this)}
                onImageClick={this.onImageClick.bind(this)}
              />
              <AtButton type='primary' className='segmentImg' onClick={this.segmentImg.bind(this)}>开始裁剪</AtButton>
            </View>
            :
            <View className='defaultUpload'>
              <Default text='请先上传待裁剪图片' btnText='上传图片' imgHandle={this.imgHandle.bind(this)} ></Default>
              </View>
        }
      </View>
    )
  }
}

// 待做：


//成功提示
//改文案

