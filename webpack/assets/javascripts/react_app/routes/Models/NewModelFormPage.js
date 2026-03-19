import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PageLayout from '../common/PageLayout/PageLayout';
import { translate as __ } from '../../common/I18n';
import { submitForm } from '../../redux/actions/common/forms';
import { MODELS_API_PATH, MODELS_PATH } from './constants';

import ModelForm from './ModelForm';

const NewModelFormPage = () => {
  const dispatch = useDispatch();
  const values = {
    name: '',
    hardware_model: '',
    vendor_class: '',
    info: '',
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = formValues => {
    setIsSubmitting(true);
    dispatch(
      submitForm({
        item: 'Model',
        method: 'post',
        url: MODELS_API_PATH,
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
          { caption: __('Create Model') },
        ],
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

export default NewModelFormPage;
