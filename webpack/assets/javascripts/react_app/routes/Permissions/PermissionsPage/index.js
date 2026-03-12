import React from 'react';

import { TextContent, Text, TextVariants } from '@patternfly/react-core';

import PageLayout from '../../common/PageLayout/PageLayout';
import { translate as __ } from '../../../common/I18n';


const PermissionsPage = () => (
  <PageLayout header={__('Permissions')} searchable={false}>
    <>
      <TextContent>
        <Text ouiaId="upgrade-page-top-msg" component={TextVariants.p}>
          {__(
            'Stay secure, supported, and up-to-date by upgrading to the latest version of Foreman.' +
              ' Access new features, critical updates, and enhanced compatibility with minimal disruption.'
          )}
        </Text>
      </TextContent>
      <br />
    </>
  </PageLayout>
);

export default PermissionsPage;