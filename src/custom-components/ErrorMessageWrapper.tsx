import { ErrorMessage } from '@hookform/error-message';
import clsx from 'clsx';
import { ComponentProps, ReactNode } from 'react';

interface Props extends ComponentProps<typeof ErrorMessage> {
  children: ReactNode;
}

export function FieldWithErrorMessageWrapper({ children, ...props }: Props) {
  return (
    <div
      className={clsx(
        {
          'has-error': hasError({
            name: props.name,
            errors: props.errors
          })
        },
        'min-w-[200px]'
      )}
    >
      {children}

      <div className="error-message text-xs min-h-4">
        <ErrorMessage {...props} />
      </div>
    </div>
  );
}

// Helper functions.
function hasError({
  errors,
  name
}: Pick<ComponentProps<typeof ErrorMessage>, 'errors' | 'name'>) {
  const keys = name.split('.');
  let hasErrorResult = true;
  let currentField = errors;

  for (const key of keys) {
    currentField = currentField?.[key];

    if (currentField === undefined) {
      hasErrorResult = false;
      break;
    }
  }

  return hasErrorResult;
}
