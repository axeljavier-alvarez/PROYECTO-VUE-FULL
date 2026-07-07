import dashboardRoutes from '@/modules/admin/dashboard/router/index';
import solicitudesRoutes from '@/modules/admin/solicitudes/router/index';
import analisisRoutes from '@/modules/admin/analisis/router/index';
import visitaCampoRoutes from '@/modules/admin/visita-campo/router/index';

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
  ...visitaCampoRoutes
];

export default routes;