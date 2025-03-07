export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === '/auth/') {
        return navigateTo('/auth/login')
     }
})
