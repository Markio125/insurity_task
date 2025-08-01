// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_BACKEND || 'http://127.0.0.2:8080',
    ENDPOINTS: {
        HEALTH_CHECK: '/',
        USER_CREDIT_INFO: '/user_credit_info',
        USER_TELEMATICS_INFO: '/user_telematics_info'
    }
}

// Helper function to build API URLs
export const buildApiUrl = (endpoint, params = {}) => {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`

    // Replace path parameters (e.g., :userId with actual value)
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key])
    })

    return url
}

// API utility functions
export const apiClient = {
    get: async (endpoint, params = {}) => {
        try {
            const url = buildApiUrl(endpoint, params)
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors', // Explicitly enable CORS
            })

            if (!response.ok) {
                if (response.status === 0) {
                    throw new Error('Network error: Unable to connect to API server. Please check if the backend server is running.')
                }
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('CORS error: Unable to connect to API server. Please check if the backend server is running and CORS is configured.')
            }
            console.error('API request failed:', error)
            throw error
        }
    }
}
