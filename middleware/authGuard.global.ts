export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === '/auth/' || to.path === '/login') {
        return navigateTo('/auth/login')
     }
})
