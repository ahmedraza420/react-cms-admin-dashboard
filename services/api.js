import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api/'
})

// Banners
export async function getBanners() {
    const res = await api.get('/banner');
    return res.status === 200 ? res.data : [];
}
export async function updateBanner(id, data) {
    const res = await api.put(`/banner/${id}`, data);
    return res.status === 200 ? res.data : [];
}
export async function addBanner(data) {
    const res = await api.post(`/banner`, data);
    return res.status === 200 ? res.data : [];
}
export async function deleteBanner(id) {
    const res = await api.delete(`/banner/${id}`);
    return res.status === 200 ? res.data : [];
}

// Category
export async function getCategory() {
    const res = await api.get('/category');
    return res.status === 200 ? res.data : [];
}
export async function updateCategory(id, data) {
    const res = await api.put(`/category/${id}`, data);
    return res.status === 200 ? res.data : [];
}
export async function addCategory(data) {
    const res = await api.post(`/category`, data);
    return res.status === 200 ? res.data : [];
}
export async function deleteCategory(id) {
    const res = await api.delete(`/category/${id}`);
    return res.status === 200 ? res.data : [];
}

// Product
export async function getProduct() {
    const res = await api.get('/product');
    return res.status === 200 ? res.data : [];
}
export async function updateProduct(id, data) {
    const res = await api.put(`/product/${id}`, data);
    return res.status === 200 ? res.data : [];
}
export async function addProduct(data) {
    const res = await api.post(`/product`, data);
    return res.status === 200 ? res.data : [];
}
export async function deleteProduct(id) {
    const res = await api.delete(`/product/${id}`);
    return res.status === 200 ? res.data : [];
}

// Brand
export async function getBrand() {
    const res = await api.get('/brand');
    return res.status === 200 ? res.data : [];
}
export async function updateBrand(id, data) {
    const res = await api.put(`/brand/${id}`, data);
    return res.status === 200 ? res.data : [];
}
export async function addBrand(data) {
    const res = await api.post(`/brand`, data);
    return res.status === 200 ? res.data : [];
}
export async function deleteBrand(id) {
    const res = await api.delete(`/brand/${id}`);
    return res.status === 200 ? res.data : [];
}

// Shipping
export async function getShipping() {
    const res = await api.get('/shipping');
    return res.status === 200 ? res.data : [];
}
export async function updateShipping(id, data) {
    const res = await api.put(`/shipping/${id}`, data);
    return res.status === 200 ? res.data : [];
}
export async function addShipping(data) {
    const res = await api.post(`/shipping`, data);
    return res.status === 200 ? res.data : [];
}
export async function deleteShipping(id) {
    const res = await api.delete(`/shipping/${id}`);
    return res.status === 200 ? res.data : [];
}

// Orders
export async function getOrders() {
    const res = await api.get('/order');
    return res.status === 200 ? res.data : [];
}
export async function updateOrder(id, data) {
    const res = await api.patch(`/order/${id}`, data);
    return res.status === 200 ? res.data : [];
}
export async function deleteOrder(id) {
    console.log('Delete request purposefully withheld by Raza', 'id', id);
}

// Shipping
export async function getPosts() {
    const res = await api.get('/post');
    return res.status === 200 ? res.data : [];
}
export async function updatePost(id, data) {
    const res = await api.put(`/post/${id}`, data);
    return res.status === 200 ? res.data : [];
}
export async function addPost(data) {
    const res = await api.post(`/post`, data);
    return res.status === 200 ? res.data : [];
}
export async function deletePost(id) {
    const res = await api.delete(`/post/${id}`);
    return res.status === 200 ? res.data : [];
}

// Tags
export async function getTags() {
    const res = await api.get('/tag');
    return res.status === 200 ? res.data : [];
}
export async function updateTag(id, data) {
    const res = await api.put(`/tag/${id}`, data);
    return res.status === 200 ? res.data : [];
}
export async function addTag(data) {
    const res = await api.post(`/tag`, data);
    return res.status === 200 ? res.data : [];
}
export async function deleteTag(id) {
    const res = await api.delete(`/tag/${id}`);
    return res.status === 200 ? res.data : [];
}