import aboutRoutes from '@/modules/public/about/router/index'
import blogRoutes from '@/modules/public/blog/router/index'
import contactRoutes from '@/modules/public/contact/router/index'
import homeRoutes from '@/modules/public/home/router/index'

const routes = [
    // destructuración array
    ...aboutRoutes,
    ...blogRoutes,
    ...contactRoutes,
    ...homeRoutes

];


export default routes; 