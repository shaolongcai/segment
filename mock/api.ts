//mock/api.ts
export default {
    "GET /api/user/uploadOssHelper": {
        statusCode: 200,
        message: "success",
        data: { 
            // ossAccessKeyId:'ossAccessKeyId',
            // KeySecret:'KeySecret',
            // securityToken:'securityToken'
            name:'123123'

        }
    },
    "GET /api/user/imgList": {
        statusCode: 200,
        message: "success",
        data: [
            'https://z3.ax1x.com/2021/08/31/haGBFI.png',
            'https://z3.ax1x.com/2021/08/31/haGLm4.png',
            'https://z3.ax1x.com/2021/08/31/haGxt1.png',
        ]
    },
}
