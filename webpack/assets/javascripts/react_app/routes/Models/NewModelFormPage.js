import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PageLayout from '../common/PageLayout/PageLayout';
import { translate as __ } from '../../common/I18n';
import { submitForm } from '../../redux/actions/common/forms';
import { APIActions } from '../../redux/API';
import { selectAPIResponse } from '../../redux/API/APISelectors';
import { MODELS_API_PATH, MODELS_PATH } from './constants';

import ModelForm from './ModelForm';

const EMPTY_MODEL_INITIAL_VALUES = {
  name: '',
  hardware_model: '',
  vendor_class: '',
  info: '',
};

const NewModelFormPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const modelNamesFetchKey = 'MODEL_NAMES_NEW';
  const modelsResponse = useSelector(
    state => selectAPIResponse(state, modelNamesFetchKey),
    shallowEqual
  );
  const existingNames =
    modelsResponse && Array.isArray(modelsResponse.results)
      ? modelsResponse.results.map(({ name }) => name).filter(Boolean)
      : [];
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(
      APIActions.get({
        url: MODELS_API_PATH,
        key: modelNamesFetchKey,
        params: {
          per_page: 10000,
        },
      })
    );
  }, [dispatch]);

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
          history.push(MODELS_PATH);
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
          {
            caption: __('Hardware Models'),
            url: MODELS_PATH,
            onClick: e => {
              e.preventDefault();
              history.push(MODELS_PATH);
            },
          },
          { caption: __('Create Model') },
        ],
      }}
    >
      <ModelForm
        initialValues={EMPTY_MODEL_INITIAL_VALUES}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        existingNames={existingNames}
      />
    </PageLayout>
  );
};

export default NewModelFormPage;
