import dashboardRoutes from '@/modules/admin/dashboard/router/index';
import solicitudesRoutes from '@/modules/admin/solicitudes/router/index';
import analisisRoutes from '@/modules/admin/analisis/router/index';

const routes = [
  {
    path: '',
    redirect: {
      name: 'admin.dashboard'
    }
  },
  ...dashboardRoutes,
  ...solicitudesRoutes,
  ...analisisRoutes,
];

export default routes;