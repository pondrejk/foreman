import React from 'react';

import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, TableText } from '@patternfly/react-table';

import PageLayout from '../../common/PageLayout/PageLayout';
import { translate as __ } from '../../../common/I18n';

import { useAPI } from '../../../common/hooks/API/APIHooks';
import { Spinner } from '@patternfly/react-core';

const PermissionsPage = () => {
  const { response, status } = useAPI('get', '/api/v2/permissions', {
    params: {
      per_page: 'all',
      sort: {
        by: 'resource_type',
        order: 'DESC',
      },
    },
  });

  const results = response?.results ?? [];
  const sortedResults = [...results].sort((a, b) => {
    const typeA = a.resource_type ?? '';
    const typeB = b.resource_type ?? '';
    return typeA.localeCompare(typeB);
  });

  const displayResourceType = (resourceType) =>
    resourceType == null || resourceType === '' ? __('Miscellaneous') : resourceType;

  return (
    <PageLayout header={__('Permissions')} searchable={false}>
      <>
        <TextContent>
          <Text ouiaId="" component={TextVariants.p}>
            {__('TODO write description')}
          </Text>
        </TextContent>
        <Table aria-label="Permissions table" variant="compact" isStiped>
          <Thead>
            <Tr>
              <Th>{__('Resource Type')}</Th>
              <Th>{__('Permission Name')}</Th>
              <Th>{__('Actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {status === 'pending' ? (
              <Tr>
                <Td colSpan={3}>
                  <Spinner />
                  <TableText>{__('Loading...')}</TableText>
                </Td>
              </Tr>
            ) : (
              sortedResults.map((permission) => (
                <Tr key={permission.id}>
                  <Td>
                    <TableText>{displayResourceType(permission.resource_type)}</TableText>
                  </Td>
                  <Td>
                    <TableText>{permission.name}</TableText>
                  </Td>
                  <Td>
                    <TableText />
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </>
    </PageLayout>
  );
}

export default PermissionsPage;