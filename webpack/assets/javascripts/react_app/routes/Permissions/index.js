import React from 'react';
import PermissionsPage from './PermissionsPage';
import { PERMISSIONS_PATH } from './constants';

export default {
  path: PERMISSIONS_PATH,
  render: props => <PermissionsPage {...props} />,
  exact: true,
};
