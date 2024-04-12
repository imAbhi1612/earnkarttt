import {
  CalendarDaysIcon,
  CalendarRangeIcon,
  CheckSquareIcon,
  ChevronDownCircleIcon,
  ClockIcon,
  HeadingIcon,
  ListTodoIcon,
  PencilLineIcon,
  TextIcon,
  ToggleRightIcon,
  TypeIcon,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  ListSearchSvg,
  ListSvg,
  NumberSvg,
  TextEditStyleSvg,
} from '../../assets/icons/Svgs';
import { ScrollArea } from '../ui/ScrollArea';
import SearchInput from '../shared/SearchInput';
import { ClickableButton } from './ClickableButton';
import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';

// Define the determineType function
function determineType(text: string) {
  switch (text) {
    case 'Heading':
      return 'heading';
    case 'Description':
      return 'description';
    case 'Name':
      return 'name';
    case 'Number':
      return 'number';
    case 'Multi-line':
      return 'multi-line';
    case 'Rich Text':
      return 'rich-text';
    case 'Checklist':
      return 'checklist';
    case 'Multi-choice':
      return 'multi-choice';
    case 'Dropdown':
      return 'dropdown';
    case 'Combobox':
      return 'combobox';
    case 'Checkbox':
      return 'checkbox';
    case 'Switch':
      return 'switch';
    case 'Date':
      return 'date';
    case 'Date Range':
      return 'date-range';
    case 'Time':
      return 'time';
    default:
      return 'unknown'; // Fallback for unknown types
  }
}

const elementGroups = [
  {
    title: 'Layout Elements',
    elements: [
      {
        text: 'Heading',
        Icon: HeadingIcon,
      },
      {
        text: 'Description',
        Icon: PencilLineIcon,
      },
    ],
  },
  {
    title: 'Text Elements',
    elements: [
      {
        text: 'Name',
        Icon: TypeIcon,
      },
      {
        text: 'Number',
        Icon: NumberSvg,
      },
      {
        text: 'Multi-line',
        Icon: TextIcon,
      },
      {
        text: 'Rich Text',
        Icon: TextEditStyleSvg,
      },
    ],
  },
  {
    title: 'Multi Elements',
    elements: [
      {
        text: 'Checklist',
        Icon: ListTodoIcon,
      },
      {
        text: 'Multi-choice',
        Icon: ListSvg,
      },
      {
        text: 'Dropdown',
        Icon: ChevronDownCircleIcon,
      },
      {
        text: 'Combobox',
        Icon: ListSearchSvg,
      },
      {
        text: 'Checkbox',
        Icon: CheckSquareIcon,
      },
      {
        text: 'Switch',
        Icon: ToggleRightIcon,
      },
    ],
  },
  {
    title: 'Date Elements',
    elements: [
      {
        text: 'Date',
        Icon: CalendarDaysIcon,
      },
      {
        text: 'Date Range',
        Icon: CalendarRangeIcon,
      },
      {
        text: 'Time',
        Icon: ClockIcon,
      },
    ],
  },
  /* {
    title: 'Media Elements',
    elements: [
      {
        text: 'Attachments',
        Icon: PaperclipIcon,
      },
      {
        text: 'Image',
        Icon: ImageIcon,
      },
    ],
  }, */
];

interface Props {
  isUpdate?: boolean;
}

export default function FormElements({ isUpdate }: Props) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';

  const [parent] = useAutoAnimate();

  const addFormElement = useFormPlaygroundStore(state => state.addFormElement);

  const filteredElementGroups = elementGroups.map(({ elements, title }, i) => {
    const filteredElements = elements.filter(({ text }) =>
      text.toLowerCase().includes(query.toLowerCase()),
    );

    if (filteredElements.length > 0)
      return (
        <article key={i}>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <ul className="mt-3 grid grid-cols-2 gap-4" ref={parent}>
            {filteredElements.map(({ text, Icon }, i) => (
              <li key={i}>
                <ClickableButton
                  text={text}
                  Icon={Icon}
                  onClick={() => addFormElement(text, determineType(text))}
                />
              </li>
            ))}
          </ul>
        </article>
      );
    else return null;
  });

  return (
    <ScrollArea
      className={`${
        isUpdate ? 'h-[calc(100vh-139px)]' : 'h-[calc(100vh-104px)]'
      } shrink-0 pr-[26px]`}
    >
      <aside className="relative w-80">
        <section className="sticky top-0 z-10 space-y-5 bg-white pb-5">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Form Elements</h1>
            <h2 className="text-sm text-muted-foreground">
              Click elements to add to the form
            </h2>
          </div>
          <SearchInput placeholder="Search Elements" />
        </section>
        <section className="flex flex-col gap-6" ref={parent}>
          {filteredElementGroups.every(element => element === null) ? (
            <p className="text-center text-sm font-medium text-muted-foreground">
              No results found
            </p>
          ) : (
            filteredElementGroups
          )}
        </section>
      </aside>
    </ScrollArea>
  );
}
