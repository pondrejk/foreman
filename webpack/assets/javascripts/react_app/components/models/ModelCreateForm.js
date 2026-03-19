import React from 'react';
import { useDispatch } from 'react-redux';
import { Field } from 'formik';
import * as Yup from 'yup';
import { translate as __ } from '../../common/I18n';
import ForemanForm from '../common/forms/ForemanForm';
import TextField from '../common/forms/TextField';
import FormField from '../common/forms/FormField';
import { submitForm } from '../../redux/actions/common/forms';
import { MODELS_API_PATH, MODELS_PATH } from '../../routes/Models/constants';

const HARDWARE_MODEL_HELP = __(
  'The class of CPU supplied in this machine. This is primarily used by Sparc Solaris builds and can be left blank for other architectures. The value can be determined on Solaris via uname -m'
);

const VENDOR_CLASS_HELP = __(
  'The class of the machine reported by the Open Boot Prom. This is primarily used by Sparc Solaris builds and can be left blank for other architectures. The value can be determined on Solaris via uname -i|cut -f2 -d,'
);

const INFO_HELP = __(
  'General useful description, for example this kind of hardware needs a special BIOS setup'
);

const initialValues = {
  name: '',
  hardware_model: '',
  vendor_class: '',
  info: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required(__('can\'t be blank')),
});

const ModelCreateForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = (values, actions) => {
    dispatch(
      submitForm({
        item: 'Model',
        url: MODELS_API_PATH,
        values: { model: values },
        actions,
        successCallback: () => {
          window.location.href = MODELS_PATH;
        },
      })
    );
  };

  const handleCancel = () => {
    window.location.href = MODELS_PATH;
  };

  return (
    <ForemanForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onCancel={handleCancel}
    >
      <TextField name="name" type="text" label={__('Name')} required />

      <Field name="hardware_model">
        {({ field }) => (
          <FormField
            id="hardware_model"
            label={__('Hardware model')}
            helpInline={HARDWARE_MODEL_HELP}
          >
            <input
              type="text"
              className="form-control"
              id="hardware_model"
              {...field}
            />
          </FormField>
        )}
      </Field>

      <Field name="vendor_class">
        {({ field }) => (
          <FormField
            id="vendor_class"
            label={__('Vendor class')}
            helpInline={VENDOR_CLASS_HELP}
          >
            <input
              type="text"
              className="form-control"
              id="vendor_class"
              {...field}
            />
          </FormField>
        )}
      </Field>

      <Field name="info">
        {({ field }) => (
          <FormField
            id="info"
            label={__('Info')}
            helpInline={INFO_HELP}
            inputSizeClass="col-md-8"
          >
            <textarea
              className="form-control"
              id="info"
              rows={7}
              {...field}
            />
          </FormField>
        )}
      </Field>
    </ForemanForm>
  );
};

export default ModelCreateForm;