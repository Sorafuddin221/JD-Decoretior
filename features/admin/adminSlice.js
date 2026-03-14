import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/api";


//fetch all products
export const fetchAdminProducts = createAsyncThunk('admin/fetchAdminProducts', async (keyword = '', { rejectWithValue }) => {
    try {

        const { data } = await api.get(`/api/admin/products/search?keyword=${keyword}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred while fetching the products.')
    }
})
//Create products
export const createProduct = createAsyncThunk('admin/createProduct', async (productData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await api.post('/api/admin/product/create', productData, config)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to create the product. Please try again.')
    }
})

//Update products
export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await api.put(`/api/admin/product/${id}`, formData, config)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update the product. Please try again.')
    }
})
//Delete products
export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (productId, { rejectWithValue }) => {
    try {

        await api.delete(`/api/admin/product/${productId}`);
        return { productId, status: 200 };

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { productId, status: 404 }; // Treat 404 as success for UI state update
        }
        return rejectWithValue(error.response?.data || 'Failed to delete the product. Please try again.')
    }
})

//|Featch All Users
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (keyword = '', { rejectWithValue }) => {
    try {
       

        const { data } = await api.get(`/api/admin/users/search?keyword=${keyword}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred while fetching the user list.')
    }
})

//|get single user
export const getSingleUser = createAsyncThunk('admin/getSingleUser', async (id, { rejectWithValue }) => {
    try {
       

        const { data } = await api.get(`/api/admin/user/${id}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to retrieve user details. Please try again.')
    }
})

//|update user role
export const updateUserRole = createAsyncThunk('admin/updateUserRole', async ({userId,role}, { rejectWithValue }) => {
    try {
       

        const { data } = await api.put(`/api/admin/user/${userId}`,{role})
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update the user's role. Please try again.")
    }
})

//|Delete  user Profile
export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, { rejectWithValue }) => {
    try {
       

        const { data } = await api.delete(`/api/admin/user/${userId}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete the user. Please try again.')
    }
})

//|Fetch All Orders
export const fetchAllOrders = createAsyncThunk('admin/fetchAllOrders', async (keyword = '', { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/api/admin/orders/search?keyword=${keyword}`);
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred while fetching orders.');
    }
});

//|Delete order
export const deleteOrder = createAsyncThunk('admin/deleteOrder', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.delete(`/api/admin/order/${id}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete the order. Please try again.')
    }
})

//|update order status
export const updateOrderStatus = createAsyncThunk('admin/updateOrderStatus', async ({orderId,status}, { rejectWithValue }) => {
    try {
         const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await api.put(`/api/admin/order/${orderId}`,{status},config)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update the order status. Please try again.')
    }
})

//|update payment status
export const updatePaymentStatus = createAsyncThunk('admin/updatePaymentStatus', async ({orderId,status, paidAmount}, { rejectWithValue }) => {
    try {
         const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await api.put(`/api/admin/order/${orderId}/payment`,{status, paidAmount},config)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update the payment status. Please try again.')
    }
})

//|Fetch All Reviews
export const fetchProductReviews = createAsyncThunk('admin/fetchProductReviews', async (productId, { rejectWithValue }) => {
    try {
         
        const { data } = await api.get(`/api/admin/reviews?id=${productId}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred while fetching product reviews.')
    }
})

//|delete review
export const deleteReview = createAsyncThunk('admin/deleteReview', async ({productId,reviewId}, { rejectWithValue }) => {
    try {
         
        const { data } = await api.delete(`/api/admin/reviews?productId=${productId}&id=${reviewId}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete the product review. Please try again.')
    }
})
 //|Get Admin Order details
            export const getAdminOrderDetails=createAsyncThunk('admin/getAdminOrderDetails',async(orderID,{rejectWithValue})=>{
                try{
                    const {data}=await api.get(`/api/admin/order/${orderID}`)
                    return data;
                }catch(error){
                    return rejectWithValue(error.response?.data || 'Failed to retrieve order details. Please try again.')
                }
            })

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        products: [],
        success: false,
        loading: false,
        error: null,
        product: {},
        deleting: {},
        users:[],
        user:{},
        message:null,
        orders:[],
        totalAmount:0,
        order:{},
        reviews:[]

    },
    reducers: {
    setUser: (state, action) => {
        state.user = action.payload;
    },
    removeErrors: (state) => {
        state.error = null
    },
    removeSuccess: (state) => {
        state.success = false
    },
    clearMessage:(state)=>{
        state.message=null
    }
},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false,
                    state.products = action.payload.products
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'An error occurred while fetching the products.'
            })
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                state.products.push(action.payload.product)

            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to create the product. Please try again.'
            })
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                state.product = action.payload.product

            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to update the product. Please try again.'
            })

        builder
            .addCase(deleteProduct.pending, (state,action) => {
                const productId=action.meta.arg;
                state.deleting[productId]=true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                const productId=action.payload.productId
                state.deleting[productId]=false;
                    state.products = state.products.filter(product => product._id !== productId)

            })
            .addCase(deleteProduct.rejected, (state, action) => {
                const productId=action.meta.arg;
                state.deleting[productId]=false;
                    state.error = action.payload?.message || 'Failed to delete the product. Please try again.'
            })
            builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false,
                    
                state.users = action.payload.users

            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'An error occurred while fetching the user list.'
            })
            builder
            .addCase(getSingleUser.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(getSingleUser.fulfilled, (state, action) => {
                state.loading = false,
                    
                state.user = action.payload.user

            })
            .addCase(getSingleUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to retrieve user details. Please try again.'
            })

            builder
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false,
                    
                state.success = action.payload.success

            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || "Failed to update the user's role. Please try again."
            })
             builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                    state.error = null
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                    
                state.message = action.payload.message

            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to delete the user. Please try again.'
            })

             builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                    state.error = null
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                    
                state.orders = action.payload.orders
                state.totalAmount = action.payload.totalAmount

            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'An error occurred while fetching orders.'
            })

            builder
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                state.message = action.payload.message

            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to delete the order. Please try again.'
            })

           

            builder
            .addCase(getAdminOrderDetails.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(getAdminOrderDetails.fulfilled, (state, action) => {
                state.loading = false,
                state.order = action.payload.order
            })
            .addCase(getAdminOrderDetails.rejected, (state, action) => {
                state.loading = false,
                state.error = action.payload?.message || 'Failed to retrieve order details. Please try again.'
            })

            builder
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                state.order = action.payload.order

            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to update the order status. Please try again.'
            })

            builder
            .addCase(updatePaymentStatus.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(updatePaymentStatus.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                state.order = action.payload.order

            })
            .addCase(updatePaymentStatus.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to update the payment status. Please try again.'
            })

            builder
            .addCase(fetchProductReviews.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.loading = false,
                    state.reviews = action.payload.reviews
                
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'An error occurred while fetching product reviews.'
            })

            builder
            .addCase(deleteReview.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                    state.message = action.payload.message
                
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to delete the product review. Please try again.'
            })

    }
})
export const { removeErrors, removeSuccess,clearMessage, setUser } = adminSlice.actions
export { updatePaymentStatus };
export default adminSlice.reducer