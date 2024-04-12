import FormElementCard from './FormElementCard';
import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';

interface Props {
  isUpdate?: boolean;
}

export default function FormPlayground({ isUpdate = false }: Props) {
  const formElements = useFormPlaygroundStore(state => state.formElements);

  // const cardsEndRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className={`flex-grow overflow-auto rounded-lg border-2 border-dashed bg-muted/25 ${
        isUpdate ? 'h-[calc(100vh-247px)]' : 'h-[calc(100vh-212px)]'
      }`}
    >
      {formElements.length === 0 ? (
        <p className="flex h-full items-center justify-center font-medium text-muted-foreground">
          Drag a element from the right to this area
        </p>
      ) : (
        <div className="space-y-5 py-5 pl-5 pr-5">
          {formElements.map(element => (
            <FormElementCard key={element.id} formElement={element} />
          ))}
        </div>
      )}
    </section>
  );
}
