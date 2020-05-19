import axios from '@/axios' // 导入http中创建的axios实例
// import qs from 'qs'; // 根据需求是否导入qs模块

const test1 = {
    // 新闻详情,演示    
    articleDetail (params) {
        return axios.get('www.baidu.com', {
            params: params
        })
    }
}

export default test1
