import Fly from 'flyio/dist/npm/wx'

const fly = new Fly()

fly.config.baseURL = 'https://sharkbook.mljr.com'

fly.interceptors.request.use(request => {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  return request
})

// 添加响应拦截器
fly.interceptors.response.use(
  response => {
    wx.hideLoading()
    return response.data // 请求成功之后将返回值返回
  },
  err => {
    // 请求出错，根据返回状态码判断出错原因
    console.log(err)
    wx.hideLoading()
    if (err) {
      return '请求失败'
    };
  }
)

export const sendCode = params => fly.post(`/users/sendCode`, params)

export const getLocations = params => fly.get(`/location/mechanism/${params.id}`)

export const getLocationsById = params => fly.get(`/location/${params.id}`)

export const addLocation = params => fly.post(`/location/add`, params)

export const updateLocation = params => fly.post(`/location/update`, params)

export const delLocation = params => fly.post(`/location/del`, params)

export const getManagers = params => fly.get(`/users/mechanism/${params.id}`)

export const updateUser = params => fly.post(`/users/update`, params)

export const addUser = params => fly.post(`/users/add`, params)

export const getUser = params => fly.get(`/users/${params.id}`)

export const getUserDetail = params => fly.post(`/users/getUserDetail`, params)

export const getUserOffice = params => fly.get(`users/office/${params.id}`)

export const existByEmail = params => fly.post(`users/existByEmail`, params)

export const getAllCategory = params => fly.get(`/category/office/${params.id}`)

export const addCategory = params => fly.post(`/category/add`, params)

export const updateCategory = params => fly.post(`/category/update`, params)

export const getAllShelf = params => fly.get(`/shelf/office/${params.id}`)

export const addShelf = params => fly.post(`/shelf/add`, params)

export const updateShelf = params => fly.post(`/shelf/update`, params)

export const getBookDetail = params => fly.post(`/books/findAllBookDetail`, params)

export const addBook = params => fly.post(`/books/add`, params)

export const updateBook = params => fly.post(`/books/update`, params)

export const borrowBook = params => fly.post(`/books/detail/borrow`, params)

export const returnBook = params => fly.post(`/books/detail/return`, params)

export const getEntryBooks = params => fly.get(`/books/detail/entry/${params.id}/${params.office_id}`)

export const getStatisticsBooks = params => fly.get(`/books/detail/statistics/${params.office_id}/${params.type_id}`)

export const getStatisticsCount = params => fly.post(`/books/detail/statistics/count`, params)

export const getBorrowBooks = params => fly.get(`/books/detail/borrow/${params.id}/${params.office_id}`)

export const getMechanisms = params => fly.get(`/mechanism`)

export const getMechanismByEmail = params => fly.post(`/mechanism/findMechanismByEmail`, params)

export const getUsersBySignature = params => fly.post(`/users/signature`, params)

export const updateUserBySignature = params => fly.post(`/users/updateUserBySignature`, params)

export default fly
