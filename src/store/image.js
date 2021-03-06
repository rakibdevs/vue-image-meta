import axios from 'axios'
//import router from '../router'


const state = () => ({
    image           : null,
    images          : null,
    paginatedImages : null,
    createdImage    : null,
    isLoading       : false,
    isUploading     : false,
})

const getters = {
    image            : state => state.image,
    images           : state => state.images,
    paginatedImages  : state => state.paginatedImages,
    isLoading        : state => state.isLoading,
    isUploading      : state => state.isUploading,

};


const actions = {

    // get images
    async getImages({ commit }, query = null) {
        let page    = (query !== null)?query.page:''
            //search  = (query !== null)?query.search:''
        
        await axios.get(`${process.env.VUE_APP_API_ENDPOINT}images?page=`+page)
            .then(res => {
                const images = res.data.data;
                commit('setImages', images);
                const pagination = {
                    total: res.data.total,  
                    per_page: res.data.per_page, 
                    current_page: res.data.current_page, 
                    total_pages: res.data.last_page 
                }
                res.data.pagination = pagination;
                commit('setImagesPaginated', res.data);
            }).catch(err => {
                console.log('error', err);
            });
    },

    // store image
    async storeImage({ commit }, image) {
        const data = new FormData();
        
        data.append('image', image);
        
        commit('imageUploading', true);
        await axios.post(`${process.env.VUE_APP_API_ENDPOINT}images`, data)
            .then(res => {
                commit('getUploadedImage', res.data)
                commit('imageUploading', false)
                return res.data
            }).catch(err => {
                console.log('error', err);
                commit('imageUploading', false);
            });
    },

    // store image
    async storeImageByUrl({ commit }, url) {
        const data = new FormData();
        
        data.append('url', url);
        
        commit('imageUploading', true);
         await axios.post(`${process.env.VUE_APP_API_ENDPOINT}images/url`, data)
            .then(res => {
                commit('getUploadedImage', res.data)
                commit('imageUploading', false)
                return res.data
            }).catch(err => {
                console.log('error', err);
                commit('imageUploading', false);
            });
    },
    // get images
    async getSingleImage({ commit }, id) {
        
        await axios.get(`${process.env.VUE_APP_API_ENDPOINT}images/`+id)
            .then(res => {
                const image = res.data;
                commit('setImage', image);
            }).catch(err => {
                console.log('error', err);
            });
    },
    
}

// mutations
const mutations = {
    getUploadedImage: (state, image) => {
        state.createdImage = image;
    },

    setImages: (state, images) => {
        state.images = images;
    },
    setImage: (state, image) => {
        state.image = image;
    },

    setImagesPaginated: (state, paginatedImages) => {
        state.paginatedImages = paginatedImages;
    },

    imageUploading(state, isLoading) {
        state.isUploading = isLoading
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}