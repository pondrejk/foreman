import React from 'react';

import ModelsPage from './ModelsPage';
import NewModelFormPage from './NewModelFormPage';
import EditModelFormPage from './EditModelFormPage';
import { MODELS_PATH, MODELS_PATH_NEW, MODELS_PATH_EDIT } from './constants';

export default [
  {
    path: MODELS_PATH,
    render: props => <ModelsPage {...props} />,
    exact: true,
  },
  {
    path: MODELS_PATH_NEW,
    render: props => <NewModelFormPage {...props} />,
    exact: true,
  },
  {
    path: MODELS_PATH_EDIT,
    render: props => <EditModelFormPage {...props} />,
    exact: true,
  },
];
