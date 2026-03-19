import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import PageLayout from '../common/PageLayout/PageLayout';
import { useAPI } from '../../common/hooks/API/APIHooks';
import { translate as __, sprintf } from '../../common/I18n';
import { submitForm } from '../../redux/actions/common/forms';
import { MODELS_API_PATH, MODELS_PATH } from './constants';

import ModelForm from './ModelForm';

const EditModelFormPage = ({
  match: {
    params: { id },
  },
}) => {
  const dispatch = useDispatch();
  const { response } = useAPI('get', `${MODELS_API_PATH}/${id}`);
  const [values, setValues] = useState({
    name: '',
    hardware_model: '',
    vendor_class: '',
    info: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!response) return;

    setValues(prevValues => ({
      ...prevValues,
      name: response.name || '',
      hardware_model: response.hardware_model || '',
      vendor_class: response.vendor_class || '',
      info: response.info || '',
    }));
  }, [response]);

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
          window.location.href = MODELS_PATH;
        },
        handleError: () => {
          setIsSubmitting(false);
        },
      })
    );
  };

  return (
    <PageLayout
      searchable={false}
      breadcrumbOptions={{
        breadcrumbItems: [
          { caption: __('Hardware Models'), url: MODELS_PATH },
          { caption: sprintf(__('Edit %s'), values.name) },
        ],
        isSwitchable: true,
        resource: {
          resourceUrl: MODELS_API_PATH,
          nameField: 'name',
          switcherItemUrl: `${MODELS_PATH}/:id/edit`,
        },
      }}
    >
      <ModelForm
        initialValues={values}
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
