import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PageLayout from '../common/PageLayout/PageLayout';
import { useAPI } from '../../common/hooks/API/APIHooks';
import { translate as __, sprintf } from '../../common/I18n';
import { submitForm } from '../../redux/actions/common/forms';
import { STATUS } from '../../constants';
import { MODELS_API_PATH, MODELS_PATH } from './constants';

import ModelForm from './ModelForm';

const EditModelFormPage = ({
  match: {
    params: { id },
  },
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { response, status } = useAPI('get', `${MODELS_API_PATH}/${id}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = useMemo(
    () => ({
      name: response.name || '',
      hardware_model: response.hardware_model || '',
      vendor_class: response.vendor_class || '',
      info: response.info || '',
    }),
    [response]
  );

  const handleSubmit = formValues => {
    setIsSubmitting(true);
    dispatch(
      submitForm({
        item: 'Model',
        method: 'put',
        url: `${MODELS_API_PATH}/${id}`,
        values: { model: formValues },
        actions: {},
        successCallback: () => {
          history.push(MODELS_PATH);
        },
        handleError: () => {
          setIsSubmitting(false);
        },
      })
    );
  };

  const breadcrumbOptions = {
    breadcrumbItems: [
      {
        caption: __('Hardware Models'),
        url: MODELS_PATH,
        onClick: e => {
          e.preventDefault();
          history.push(MODELS_PATH);
        },
      },
      {
        caption:
          status === STATUS.RESOLVED
            ? sprintf(__('Edit %s'), initialValues.name)
            : __('Edit'),
      },
    ],
    isSwitchable: true,
    resource: {
      resourceUrl: MODELS_API_PATH,
      nameField: 'name',
      switcherItemUrl: `${MODELS_PATH}/:id/edit`,
    },
    onSwitcherItemClick: (e, href) => {
      e.preventDefault();
      history.push(href);
    },
  };

  if (status === STATUS.PENDING) {
    return (
      <PageLayout
        searchable={false}
        isLoading
        breadcrumbOptions={breadcrumbOptions}
      >
        {null}
      </PageLayout>
    );
  }

  if (status === STATUS.ERROR) {
    return (
      <PageLayout searchable={false} breadcrumbOptions={breadcrumbOptions}>
        {__('Something went wrong')}
      </PageLayout>
    );
  }

  return (
    <PageLayout searchable={false} breadcrumbOptions={breadcrumbOptions}>
      <ModelForm
        key={id}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </PageLayout>
  );
};

EditModelFormPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }).isRequired,
};

export default EditModelFormPage;
