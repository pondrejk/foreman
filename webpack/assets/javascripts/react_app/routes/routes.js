import Audits from './Audits';
import Models from './Models';
import HostDetails from './HostDetails';
import RegistrationCommands from './RegistrationCommands';
import HostStatuses from './HostStatuses';
import Hosts from './Hosts';
import EmptyPage from './common/EmptyPage/route';
import FiltersForm from './FiltersForm';
import Upgrade from './Upgrade';
import Permissions from './Permissions';

export const routes = [
  Audits,
  Models,
  Hosts,
  HostDetails,
  RegistrationCommands,
  HostStatuses,
  EmptyPage,
  ...FiltersForm,
  Upgrade,
  Permissions,
];
