import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircledIcon, LapTimerIcon } from '@radix-ui/react-icons';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './components/ui/select';
import { FieldWithErrorMessageWrapper } from './custom-components/ErrorMessageWrapper';

const PropertyType = z.enum([
  'BANK_ACCOUNT',
  'DEPOSIT',
  'MUTUAL_FUNDS',
  'BOND',
  'LAND_OR_HOUSE'
]);
type PropertyType = z.infer<typeof PropertyType>;

const Property = z.object({
  id: z.string(),
  // Allow empty string for initial selection.
  type: z
    .enum(['', ...PropertyType.options])
    .refine((value) => value !== '', 'Property type is required.'),
  name: z.string().min(1, 'Property name is required.'),
  value: z
    .string()
    .min(1, 'Property value is required.')
    .refine((val) => !isNaN(Number(val)), 'Property value must be a number.'),
  note: z.string().min(1, 'Property name is required.')
});
const PropertiesForm = z.object({
  properties: z.array(Property)
});
type PropertiesForm = z.infer<typeof PropertiesForm>;

const PROPERTY_TYPE_TO_NAME_RECORD: Record<PropertyType, string> = {
  BANK_ACCOUNT: 'Bank account',
  DEPOSIT: 'Deposit',
  MUTUAL_FUNDS: 'Mutual funds',
  BOND: 'Bond',
  LAND_OR_HOUSE: 'Land or house'
};
const PROPERTY_TYPE_TO_NAME_LABEL_VALUES = Object.keys(
  PROPERTY_TYPE_TO_NAME_RECORD
).map((key) => ({
  label: PROPERTY_TYPE_TO_NAME_RECORD[key as PropertyType],
  value: key
}));

function App() {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<PropertiesForm>({
    defaultValues: {
      properties: []
    },
    resolver: zodResolver(PropertiesForm)
  });
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'properties'
  });

  const onSubmit = handleSubmit(
    (data) => {
      console.info(data);
    },
    (errors) => {
      console.info('error', errors);
    }
  );

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h2 className="text-2xl">Status: WIP</h2>

      <p>Full tasks list:</p>

      <ul className="list-disc pl-4">
        <li>
          <div className="flex gap-x-2 items-center">
            Remove pagination <CheckCircledIcon className="text-green-600" />
          </div>
        </li>
        <li>
          <div className="flex gap-x-2 items-center">
            In-table form <LapTimerIcon className="text-blue-600" />
          </div>
        </li>
        <li>
          <div className="flex gap-x-2 items-center">
            Import from CSV/spreadsheet{' '}
            <LapTimerIcon className="text-blue-600" />
          </div>
        </li>
        <li>
          <div className="flex gap-x-2 items-center">
            Duplicate feature <CheckCircledIcon className="text-green-600" />
          </div>
        </li>
        <li>
          <div className="flex gap-x-2 items-center">
            Temporary deleted property bucket{' '}
            <LapTimerIcon className="text-blue-600" />
          </div>
        </li>
      </ul>

      <hr />

      <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
        {fields.map((field, index) => (
          <div className="flex gap-x-2 items-center" key={field.id}>
            <FieldWithErrorMessageWrapper
              errors={errors}
              name={`properties.${index}.type`}
            >
              <Label htmlFor={`properties.${index}.type`}>Property type</Label>
              <Select
                {...register(`properties.${index}.type`)}
                onValueChange={(value) =>
                  setValue(
                    `properties.${index}.type`,
                    PropertyType.parse(value)
                  )
                }
                defaultValue={field.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPE_TO_NAME_LABEL_VALUES.map((opt) => (
                    <SelectItem value={opt.value} key={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWithErrorMessageWrapper>
            <FieldWithErrorMessageWrapper
              errors={errors}
              name={`properties.${index}.name`}
            >
              <Label htmlFor={`properties.${index}.name`}>Name</Label>
              <Input
                {...register(`properties.${index}.name`)}
                id={`properties.${index}.name`}
              />
            </FieldWithErrorMessageWrapper>
            <FieldWithErrorMessageWrapper
              errors={errors}
              name={`properties.${index}.value`}
            >
              <Label htmlFor={`properties.${index}.value`}>Value</Label>
              <Input
                {...register(`properties.${index}.value`)}
                id={`properties.${index}.value`}
              />
            </FieldWithErrorMessageWrapper>
            <FieldWithErrorMessageWrapper
              errors={errors}
              name={`properties.${index}.note`}
            >
              <Label htmlFor={`properties.${index}.note`}>Note</Label>
              <Input
                {...register(`properties.${index}.note`)}
                id={`properties.${index}.note`}
              />
            </FieldWithErrorMessageWrapper>

            <Button
              type="button"
              className="mt-2"
              variant="secondary"
              onClick={() => insert(index + 1, { ...field, id: generateId() })}
            >
              Duplicate
            </Button>

            <Button
              type="button"
              className="mt-2"
              variant="secondary"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <div className="flex gap-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({
                id: generateId(),
                name: '',
                note: '',
                type: '',
                value: ''
              })
            }
          >
            Add
          </Button>

          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}

export default App;

// Helper functions.
function generateId() {
  return btoa(new Date().valueOf().toString());
}
