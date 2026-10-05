import client from './client'

// auth
const resolveLogin = (body) => client.post(`/auth/resolve`, body)
const login = (body) => client.post(`/auth/login`, body)

// permissions
const getAllPermissions = async (type) => {
    try {
        return await client.get(`/auth/permissions/${type}`)
    } catch (err) {
        if (err.response?.status === 404) {
            // Open-source fallback if the endpoint does not exist
            return {
                data: {
                    General: [{ key: "unrestricted", name: "All Permissions", isOpenSource: true, isEnterprise: true, isCloud: true }]
                }
            }
        }
        throw err;
    }
}
const ssoSuccess = (token) => client.get(`/auth/sso-success?token=${token}`)

export default {
    resolveLogin,
    login,
    getAllPermissions,
    ssoSuccess
}
