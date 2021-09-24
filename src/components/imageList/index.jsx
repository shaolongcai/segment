import { Component } from 'react'
import { View ,Image} from '@tarojs/components'
import './index.scss'
import { AtIcon } from 'taro-ui'

// 需要使用import来引入图片
// import defaultImg from '../../image/818.png';

// 接受两个参数：图片数组 ，展示个数
class SegmentImage extends Component{
    // 构造器
    constructor(props){ 
        super(props)
        //
        this.state = {
            files: []
        } 

       


    }

    // 动态计算所占宽度
    render() {
        // 参数：图片路径，一行个数
        const files = this.props.files
        const number = this.props.number

        // 父组件传给子组件,通过props去定制属性
        const imgs = files.map((file) => {
            const imgWidth =  (375 - 10*(this.props.number+1) ) / this.props.number+'px' 
            const imgHeight = (375 - 10*(this.props.number + 1)) / this.props.number + 'px'
            const sytle1 = {
                width: imgWidth,
                height: imgHeight
            }
            // / this.props.number + 'px'
            return <Image src={file} mode='aspectFit' className='SegmentImageImg' style={sytle1} />
          })
        return(
            <View className='SegContainer'>
                {imgs}
            </View>
        )
    }
}

export default SegmentImage

// 750 = 个数*widht + margin*(个数+1)
// 750 -margin*（个数+1） 