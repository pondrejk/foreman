import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  TextInput,
  TextArea,
  ActionGroup,
  Button,
} from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import { translate as __ } from '../../common/I18n';
import API from '../../redux/API/API';
import LabelIcon from '../../components/common/LabelIcon';
import { MODELS_API_PATH, MODELS_PATH } from './constants';

const HARDWARE_MODEL_HELP = __(
  'The class of CPU supplied in this machine. This is primarily used by Sparc Solaris builds and can be left blank for other architectures. The value can be determined on Solaris via uname -m'
);

const VENDOR_CLASS_HELP = __(
  'The class of the machine reported by the Open Boot Prom. This is primarily used by Sparc Solaris builds and can be left blank for other architectures. The value can be determined on Solaris via uname -i|cut -f2 -d,'
);

const INFO_HELP = __(
  'General useful description, for example this kind of hardware needs a special BIOS setup'
);

const NAME_CHECK_DEBOUNCE_MS = 300;

const escapeModelNameForSearch = value =>
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const ModelForm = ({ initialValues, handleSubmit, isSubmitting }) => {
  const history = useHistory();
  const [values, setValues] = useState(initialValues);
  const [nameAlreadyExists, setNameAlreadyExists] = useState(false);
  const latestNameCheckId = useRef(0);

  const handleChange = field => valueOrEvent => {
    const value =
      valueOrEvent && valueOrEvent.target
        ? valueOrEvent.target.value
        : valueOrEvent;

    setValues(prevValues => ({ ...prevValues, [field]: value || '' }));
  };

  const onSubmit = event => {
    event.preventDefault();
    handleSubmit(values);
  };

  const handleCancel = () => {
    history.push(MODELS_PATH);
  };

  const requiredFields = ['name'];
  const duplicateNameMessage = __('Name already exists');

  useEffect(() => {
    const name = (values.name || '').trim();
    const initialName = (initialValues.name || '').trim();
    const normalizedName = name.toLowerCase();

    if (!normalizedName || normalizedName === initialName.toLowerCase()) {
      setNameAlreadyExists(false);
      return undefined;
    }

    const requestId = latestNameCheckId.current + 1;
    latestNameCheckId.current = requestId;

    const timeoutId = setTimeout(() => {
      const checkNameExists = async () => {
        try {
          const { data } = await API.get(
            MODELS_API_PATH,
            {},
            {
              search: `name="${escapeModelNameForSearch(name)}"`,
              per_page: 20,
            }
          );
          if (latestNameCheckId.current !== requestId) return;
          const results = Array.isArray(data?.results) ? data.results : [];
          const duplicateFound = results.some(
            ({ name: resultName }) =>
              (resultName || '').trim().toLowerCase() === normalizedName
          );
          setNameAlreadyExists(duplicateFound);
        } catch (_error) {
          if (latestNameCheckId.current !== requestId) return;
          setNameAlreadyExists(false);
        }
      };

      checkNameExists();
    }, NAME_CHECK_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [values.name, initialValues.name]);

  const isSubmitDisabled =
    requiredFields.some(field => !(values[field] || '').trim()) ||
    nameAlreadyExists;

  return (
    <Form id="model-create-form" isWidthLimited onSubmit={onSubmit}>
      <FormGroup
        label={__('Name')}
        isRequired
        validated={nameAlreadyExists ? 'error' : 'default'}
        helperTextInvalid={nameAlreadyExists ? duplicateNameMessage : ''}
      >
        <TextInput
          id="model_name"
          name="model_name"
          type="text"
          ouiaId="model_name-input"
          required
          value={values.name}
          onChange={handleChange('name')}
          validated={nameAlreadyExists ? 'error' : 'default'}
        />
        {nameAlreadyExists && (
          <div style={{ color: 'var(--pf-v5-global--danger-color--100)' }}>
            {duplicateNameMessage}
          </div>
        )}
      </FormGroup>
      <FormGroup
        label={__('Hardware model')}
        labelIcon={<LabelIcon text={HARDWARE_MODEL_HELP} />}
      >
        <TextInput
          id="model_hardware_model"
          name="model_hardware_model"
          type="text"
          ouiaId="model_hardware_model-input"
          value={values.hardware_model}
          onChange={handleChange('hardware_model')}
        />
      </FormGroup>
      <FormGroup
        label={__('Vendor class')}
        labelIcon={<LabelIcon text={VENDOR_CLASS_HELP} />}
      >
        <TextInput
          id="model_vendor_class"
          name="model_vendor_class"
          type="text"
          ouiaId="model_vendor_class-input"
          value={values.vendor_class}
          onChange={handleChange('vendor_class')}
        />
      </FormGroup>
      <FormGroup label={__('Info')} labelIcon={<LabelIcon text={INFO_HELP} />}>
        <TextArea
          id="model_info"
          name="model_info"
          rows={7}
          ouiaId="info-textarea"
          value={values.info}
          onChange={handleChange('info')}
        />
      </FormGroup>

      <ActionGroup>
        <Button
          variant="primary"
          type="submit"
          ouiaId="model_submit_button"
          isDisabled={isSubmitDisabled || isSubmitting}
        >
          {__('Submit')}
        </Button>
        <Button
          variant="link"
          onClick={handleCancel}
          ouiaId="model_cancel_button"
        >
          {__('Cancel')}
        </Button>
      </ActionGroup>
    </Form>
  );
};

ModelForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    hardware_model: PropTypes.string,
    vendor_class: PropTypes.string,
    info: PropTypes.string,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

ModelForm.defaultProps = {
  isSubmitting: false,
};

export default ModelForm;
