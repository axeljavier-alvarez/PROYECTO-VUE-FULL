import aboutRoutes from '@/modules/public/submodules/about/router/index'
import blogRoutes from '@/modules/public/submodules/blog/router/index'
import contactRoutes from '@/modules/public/submodules/contact/router/index'
import homeRoutes from '@/modules/public/submodules/home/router/index'

const routes = [
    // destructuración array
    ...aboutRoutes,
    ...blogRoutes,
    ...contactRoutes,
    ...homeRoutes

];


export default routes; 