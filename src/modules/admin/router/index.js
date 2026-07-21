import dashboardRoutes from '@/modules/admin/dashboard/router/index';
import solicitudesRoutes from '@/modules/admin/solicitudes/router/index';
import analisisRoutes from '@/modules/admin/analisis/router/index';
import visitaCampoRoutes from '@/modules/admin/visita-campo/router/index';
import emisionConstanciaRoutes from '@/modules/admin/emision-constancia/router/index';
import autorizacionesRoutes from '@/modules/admin/autorizaciones/router/index';
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
  ...visitaCampoRoutes,
  ...emisionConstanciaRoutes,
  ...autorizacionesRoutes
];

export default routes;