import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import store from '../../../../redux';
import PermissionsPage from '../../PermissionsPage';

describe('PermissionsPage', () => {
  it('renders PermissionsPage component', () => {
    const page = <Provider store={store}>
      <PermissionsPage />
    </Provider>;
    render(page);

    // Main page
    expect(screen.getByText(/Permissions/i)).toBeInTheDocument();
  });
});
