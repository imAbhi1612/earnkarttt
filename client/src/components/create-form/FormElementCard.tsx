import { Trash2Icon } from 'lucide-react';
import Input from '../ui/Input';
import { Button } from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import { Switch } from '../ui/Switch';
import { Label } from '../ui/Label';
import { Separator } from '../ui/Separator';
import { Textarea } from '../ui/Textarea';
import RichTextEditor from '../shared/RichTextEditor';
import BubbleMenuEditor from '../shared/BubbleMenuEditor';
import { Checkbox } from '../ui/Checkbox';
import { DatePicker } from '../shared/DatePicker';
import { DateRangePicker } from '../shared/DateRangePicker';
import Options from './Options';
import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';
import type { FormElementsType } from '@form-builder/validation/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { Combobox } from '../ui/Combobox';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface Props {
  formElement: FormElementsType;
  isView?: boolean;
  field?: ControllerRenderProps<FieldValues, string>;
}

export default function FormElementCard({
  formElement,
  isView = false,
  field,
}: Props) {
  const { id, label, type, required, options } = formElement;
  const removeFormElement = useFormPlaygroundStore(
    state => state.removeFormElement,
  );
  const toggleRequired = useFormPlaygroundStore(state => state.toggleRequired);
  const updateLabel = useFormPlaygroundStore(state => state.updateLabel);

  return (
    <article
      className={`relative flex gap-2 rounded-md bg-white py-1 ${
        isView ? 'px-5' : 'pl-2 pr-4'
      }`}
    >
      <div
        className={`flex-grow space-y-2 ${
          ['heading', 'description', 'checkbox', 'switch'].includes(type)
            ? ''
            : 'pb-2'
        }`}
      >
        <div className="flex items-center gap-8">
          <div className="flex w-full items-center gap-5">
{/*             {type === 'switch' ? (
              <Switch
                checked={field?.value}
                onCheckedChange={field?.onChange}
                
              />
            ) : type === 'checkbox' ? (
              <Checkbox
                checked={field?.value}
                onCheckedChange={field?.onChange}
              />
            ) : null} */}
            <BubbleMenuEditor
              placeholder={
                ['heading', 'description'].includes(type)
                  ? label
                  : 'Question or Text'
              }
              content={label}
              updateHandler={html => {
                updateLabel(id, html);
              }}
              readOnly={isView}
            />
          </div>
          {isView ? null : (
            <div className="flex items-center">
              {['heading', 'description', 'switch', 'checkbox'].includes(
                type,
              ) ? null : (
                <div className="flex items-center gap-2">
                  <Switch
                    id={'required-' + id}
                    checked={required}
                    onCheckedChange={() => toggleRequired(id)}
                  />
                  <Label
                    className="cursor-pointer font-normal"
                    htmlFor={'required-' + id}
                  >
                    Required
                  </Label>
                </div>
              )}
              <Separator orientation="vertical" className="mx-4 h-7" />
              <Tooltip asChild title="Delete">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-destructive/5"
                  onClick={() => {
                    removeFormElement(id);
                  }}
                >
                  <Trash2Icon className="h-5 w-5 text-destructive" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
        {type === 'name' ? (
          <Input
            placeholder="Name "
            required={field ? required : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) : type === 'number' ? (
          <Input
            type="number"
            placeholder="Number"
            required={field ? required : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) : type === 'multi-line' ? (
          <Textarea
            placeholder="Multi line text..."
            required={field ? required : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        )  : type === 'switch' ? (
              <Switch
                checked={field?.value}
                onCheckedChange={field?.onChange}
                required={field ? required : false}
              />
            ) : type === 'checkbox' ? (
              <Checkbox
                checked={field?.value}
                onCheckedChange={field?.onChange}
                required={field ? required : false}
              />
            ) : type === 'rich-text' ? (
          <RichTextEditor field={field} />
        ) : ['checklist', 'multi-choice', 'dropdown', 'combobox'].includes(
            type,
          ) && !isView ? (
          <Options type={type} id={id} />
        ) : type === 'checklist' ? (
          <ul className="space-y-3">
            {options?.map(({ label, value }) => (
              <li key={value} className="flex items-center gap-3">
                <Checkbox
                  id={value}
                  required={field ? required : false}
                  checked={field?.value?.includes(label) ?? false}
                  onCheckedChange={checked => {
                    if (checked) field?.onChange([...field.value, label]);
                    else
                      field?.onChange(
                        field.value.filter((val: string) => val !== label),
                      );
                  }}
                />
                <Label
                  htmlFor={value}
                  className="flex h-5 items-center font-normal"
                >
                  {label}
                </Label>
              </li>
            ))}
          </ul>
        ) : type === 'multi-choice' ? (
          <RadioGroup
            className="gap-3"
            value={field?.value}
            onValueChange={field?.onChange}
          >
            {options?.map(({ label, value }) => (
              <div key={value} className="flex items-center space-x-3">
                <RadioGroupItem value={value} id={value} />
                <Label
                  htmlFor={value}
                  className="flex h-5 items-center font-normal"
                >
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : type === 'dropdown' ? (
          <Select
            value={field?.value}
            onValueChange={field?.onChange}
            required={field ? required : false}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {options?.map(({ label, value }) => (
                <SelectItem value={value} key={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === 'combobox' && options ? (
          <Combobox options={options} field={field} />
        ) : type === 'date' ? (
          <DatePicker field={field} />
        ) : type === 'date-range' ? (
          <DateRangePicker field={field} />
        ) : type === 'time' ? (
          <Input
            type="time"
            className="w-32"
            required={field ? required : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) : type === 'attachments' ? (
          <Input
            type="file"
            className="pt-1.5 text-muted-foreground"
            required={field ? required : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) : type === 'image' ? (
          <Input
            type="file"
            accept="image/*"
            className="pt-1.5 text-muted-foreground"
            required={field ? required : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) : null}
        {isView && required ? (
          <div className="pt-1 text-sm text-destructive"></div>
        ) : null}
      </div>
    </article>
  );
}
