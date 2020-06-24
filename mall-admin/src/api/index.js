// 所有接口写在这个文件
// 导出接口,使用全大写命名
// 接口命名统一Api为开头,驼峰式命名

import Axios from 'axios'
// const qs = require('qs')
import md5 from 'js-md5'
export const env = process.env.NODE_ENV === 'development'
// 测试服务器要加pdshop
// Axios.defaults.baseURL = env === 'development' ? '/api/' : '/pdShop'

Axios.defaults.baseURL = env ? '/api' : '/'
Axios.interceptors.response.use((response) => {
  // console.log(response)
  if (response.status === 200 || response.status === 304) {
    return response.data
  } else if (response.status === 400) {
    return response.statusText
  } else {
    return false
  }
})

export default Axios

/**
 * 添加分类
 * productTypeIsParent是Integer/int是否是父级0代表父级，如果不是父级请选择父级ID
 * productTypeName 是 string 分类类型名称
 * productTypeVendorId 是 string 厂商编号,建议测试为test,因为要和其他接口对接，统一test
 */
export const UrladdProductTypeByVendorId = '/goods/addProductTypeByVendorId.json'
export const ApiaddProductTypeByVendorId = async (params) => {
  try {
    const res = await Axios.post(UrladdProductTypeByVendorId, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 查询分类名称
 * vendorId是string厂商编号
 */
export const UrlgetProductType = '/goods/getProductType.json'
export const ApigetProductType = async (params) => {
  try {
    const res = await Axios.get(UrlgetProductType, { params })
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 删除分类名称
 * id是int类型唯一ID
 * vendorId是string厂商编号
 */
export const UrldeleteProductTypeById = '/goods/deleteProductTypeById.json'
export const ApideleteProductTypeById = async (params) => {
  try {
    const res = await Axios.get(UrldeleteProductTypeById, { params })
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 修改分类名称
 * productTypeNumber是string分类编号
 * productTypeVendorId是string厂商编号
 * productTypeName否string需要修改的名称
 */
export const UrlupdateProductType = '/goods/updateProductType.json'
export const ApiupdateProductType = async (params) => {
  try {
    const res = await Axios.post(UrlupdateProductType, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 文件上传接口
 * image是string文件
 */
export const UrluploadFile = '/upload/uploadFile.json'
export const ApiuploadFile = async (params) => {
  try {
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await Axios.post(UrluploadFile, params, config)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 图片上传接口
 * image是string文件
 * imgType否string文件夹名称
 */
export const UrluploadingPictures = '/vendor/uploadingPictures.json'
export const ApiuploadingPictures = async (params) => {
  try {
    // let config = {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // }
    const res = await Axios.post(UrluploadingPictures, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 查询轮播图
 * companyNumber是string厂商编号
 */
export const UrlgetAllBannerByCompanyNumber = '/banner/getAllBannerByCompanyNumber.json'
export const ApigetAllBannerByCompanyNumber = async (params) => {
  try {
    const res = await Axios.get(UrlgetAllBannerByCompanyNumber, { params })
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 添加轮播图
 * image是string轮播图地址
 * clickUrl否string是否包含外链根据业务而定
 * companyNumber是string厂商编号
 */
export const UrlinsertBanner = '/banner/insertBanner.json'
export const ApiinsertBanner = async (params) => {
  try {
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await Axios.get(UrlinsertBanner, { params }, config)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 更新轮播图
 * image是string轮播图地址
 * clickUrl否string是否包含外链根据业务而定
 * companyNumber是string厂商编号
 */
export const UrlupdateBanner = '/banner/updateBanner.json'
export const ApiupdateBanner = async (params) => {
  try {
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await Axios.get(UrlupdateBanner, { params }, config)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 删除轮播图
 companyNumber是string厂商编号
 */
export const UrldelBanner = '/banner/delBanner.json'
export const ApidelBanner = async (params) => {
  try {
    const res = await Axios.get(UrldelBanner, { params })
    return res
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 查询活动背景图
 * companyNumber是string厂商编号
 */
export const UrlgetBackgroundImageByCompanyNumber = '/banner/getBackgroundImageByCompanyNumber.json'
export const ApigetBackgroundImageByCompanyNumber = async (params) => {
  try {
    const res = await Axios.get(UrlgetBackgroundImageByCompanyNumber, { params })
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 添加活动背景图
 * companyNumber是string厂商编号
 * activityImage否string活动名图片,列如双十一 618等活动可以使用该字段来设置
 * assembleImage否string拼团活动背景图
 * bargainImage否string砍价活动背景图
 * defaultImage是string默认背景图
 * seckillImage否string秒杀活动背景图
 * signImage否string签到背景图
 */
export const UrlinsertBackgroundImage = '/banner/insertBackgroundImage.json'
export const ApiinsertBackgroundImage = async (params) => {
  try {
    const res = await Axios.post(UrlinsertBackgroundImage, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 修改活动背景图
 * companyNumber是string厂商编号
 * backgroundImageNumber是string活动背景图编号
 * activityImage否string活动名图片,列如双十一 618等活动可以使用该字段来设置
 * assembleImage否string拼团活动背景图
 * bargainImage否string砍价活动背景图
 * defaultImage是string默认背景图
 * seckillImage否string秒杀活动背景图
 * signImage否string签到背景图
 */
export const UrlupdateBackgroundImage = '/banner/updateBackgroundImage.json'
export const ApiupdateBackgroundImage = async (params) => {
  try {
    const res = await Axios.post(UrlupdateBackgroundImage, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 厂商登录
 * phone是String手机号或邮箱
 * password是String密码MD5加密后传
 */
export const UrlvendorLogin = '/vendor/vendorLogin.json'
export const ApivendorLogin = async (params) => {
  try {
    params.password = md5(params.password)
    const res = await Axios.post(UrlvendorLogin, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 厂商修改密码
 * phone是String手机号或邮箱
 * password是String密码MD5加密后传
 * code是String短信验证码
 */
export const UrlupdateVendorPassword = '/vendor/updateVendorPassword.json'
export const ApiupdateVendorPassword = async (params) => {
  try {
    params.password = md5(params.password)
    const res = await Axios.post(UrlupdateVendorPassword, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 短信验证码
 * phone是String手机号或邮箱
 * modelId 短信模板ID
 */
export const UrlgetVerCode = '/vendor/getVerCode.json'
export const ApigetVerCode = async (params) => {
  try {
    const res = await Axios.get(UrlgetVerCode, {params})
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 添加商品
 * phone是String手机号或邮箱
 * modelId 短信模板ID
 */
export const UrlinsertGoodsAndSpec = '/goods/insertGoodsAndSpec.json'
export const ApiinsertGoodsAndSpec = async (params) => {
  try {
    const res = await Axios.post(UrlinsertGoodsAndSpec, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 修改商品
 * phone是String手机号或邮箱
 * modelId 短信模板ID
 */
export const UrlupdateProductInfo = '/goods/updateProductInfo.json'
export const ApiupdateProductInfo = async (params) => {
  try {
    const res = await Axios.post(UrlupdateProductInfo, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 查詢商品
 * phone是String手机号或邮箱
 * modelId 短信模板ID
 */
export const UrlmangerGetAllProduct = '/goods/mangerGetAllProduct.json'
export const ApimangerGetAllProduct = async (params, page) => {
  try {
    const res = await Axios.post(UrlmangerGetAllProduct, params, {params: page})
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 商品审核
 * state
 * productNumber
 */
export const UrlmanagerCheckProduct = '/goods/managerCheckProduct.json'
export const ApimanagerCheckProduct = async (params) => {
  try {
    const res = await Axios.post(UrlmanagerCheckProduct, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 修改商品状态
 * state
 * productNumber
 */
export const UrlmanagerChangeStatus = '/goods/managerChangeStatus.json'
export const ApimanagerChangeStatus = async (params) => {
  try {
    const res = await Axios.post(UrlmanagerChangeStatus, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 查詢商品详情
 * productNumber
 */
export const UrlqueryProductSpec = '/goods/queryProductSpec.json'
export const ApiqueryProductSpec = async (params) => {
  try {
    const res = await Axios.get(UrlqueryProductSpec, {params})
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 查詢规格属性
 */
export const UrlgetSpecification = '/goods/getSpecification.json'
export const ApigetSpecification = async (params) => {
  try {
    const res = await Axios.get(UrlgetSpecification, {params})
    return res
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 增加规格属性
 * specName
 */
export const UrladdSpecification = '/goods/addSpecification.json'
export const ApiaddSpecification = async (params) => {
  try {
    const res = await Axios.post(UrladdSpecification, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 删除规格属性
 * id
 */
export const UrldeleteSpecification = '/goods/deleteSpecification.json'
export const ApideleteSpecification = async (params) => {
  try {
    const res = await Axios.post(UrldeleteSpecification, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 查詢规格属性值
 * specId
 */
export const UrlgetSpecificationOption = '/goods/getSpecificationOption.json'
export const ApigetSpecificationOption = async (params) => {
  try {
    const res = await Axios.get(UrlgetSpecificationOption, {params})
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 增加规格属性值
 * optionName
 * specId
 */
export const UrladdSpecificationOption = '/goods/addSpecificationOption.json'
export const ApiaddSpecificationOption = async (params) => {
  try {
    const res = await Axios.post(UrladdSpecificationOption, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 删除规格属性值
 * id
 */
export const UrldeleteSpecificationOption = '/goods/deleteSpecificationOption.json'
export const ApideleteSpecificationOption = async (params) => {
  try {
    const res = await Axios.post(UrldeleteSpecificationOption, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 查询子商户
 * id
 */
export const UrllistSubVendor = '/vendor/listSubVendor.json'
export const ApilistSubVendor = async (params, page) => {
  try {
    const res = await Axios.post(UrllistSubVendor, params, {params: page})
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 修改子商户
 * id
 */
export const UrlupdateSubVendor = '/vendor/updateSubVendor.json'
export const ApiupdateSubVendor = async (params) => {
  try {
    if (params.password) {
      params.password = md5(params.password)
    }
    const res = await Axios.post(UrlupdateSubVendor, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 添加子商户
 * id
 */
export const UrladdSubVendor = '/vendor/addSubVendor.json'
export const ApiaddSubVendor = async (params) => {
  try {
    params.password = md5(params.password)
    const res = await Axios.post(UrladdSubVendor, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 删除子商户
 * id
 */
export const UrldeleteSubVendor = '/vendor/deleteSubVendor.json'
export const ApideleteSubVendor = async (params) => {
  try {
    const res = await Axios.post(UrldeleteSubVendor, params)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 添加子商户时校验手机或者邮箱是否存在
 * |mailbox |否 |String | 邮箱|
|phone |否 |String | 手机|
 */
export const UrlcheckVendorAccount = '/vendor/checkVendorAccount.json'
export const ApicheckVendorAccount = async (params) => {
  try {
    const res = await Axios.get(UrlcheckVendorAccount, {params})
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 查询子商户商品
 * |mailbox |否 |String | 邮箱|
|phone |否 |String | 手机|
 */
export const UrlmanagerGetAllVendorProduct = '/goods/managerGetAllVendorProduct.json'
export const ApimanagerGetAllVendorProduct = async (params, page) => {
  try {
    const res = await Axios.post(UrlmanagerGetAllVendorProduct, params, {params: page})
    return res
  } catch (error) {
    throw new Error(error)
  }
}
