import React from 'react';

import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, TableText, Caption } from '@patternfly/react-table';

import PageLayout from '../../common/PageLayout/PageLayout';
import { translate as __ } from '../../../common/I18n';


const PermissionsPage = () => (
  <PageLayout header={__('Permissions')} searchable={false}>
    <>
      <TextContent>
        <Text ouiaId="" component={TextVariants.p}>
          {__(
            'Stay secure, supported, and up-to-date by upgrading to the latest version of Foreman.' +
              ' Access new features, critical updates, and enhanced compatibility with minimal disruption.'
          )}
        </Text>
      </TextContent>
      <Table aria-label="Simple table" variant='compact' borders='compactBorderless'>
        <Caption>Resource type</Caption>
        <Thead>
          <Tr>
            <Th>{__('Permission Name')}</Th>
            <Th>{__('Actions')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td><TableText>{'Name'}</TableText></Td>
            <Td><TableText>{'Description'}</TableText></Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  </PageLayout>
);

export default PermissionsPage;