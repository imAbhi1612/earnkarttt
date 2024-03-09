import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Button } from '../components/ui/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/AlertDialog';
import type { FormType } from '../types';
import axios from '../lib/axios';
import LoadingSvg from '../assets/loading.svg';
import Error from './Error';
import useTitle from '../hooks/useTitle';
import FormElementCard from '../components/create-form/FormElementCard';
import { Form, FormControl, FormField, FormItem } from '../components/ui/Form';

interface Props {
  onClear: () => void;
  disabled?: boolean;
}

const ClearFormButton = ({ onClear, disabled = false }: Props) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        disabled={disabled}
        className="text-primary hover:bg-slate-300/25 hover:text-primary"
      >
        Clear Form
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Clear Form?</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to clear the form? This action is irreversible
          and will permanently remove all the progress in the current form.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="sm:space-x-4">
        <AlertDialogAction onClick={onClear} type="reset">
          Yes, clear form
        </AlertDialogAction>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default function GeneratedForm() {
  const { id } = useParams();

  const { data, isPending, isError } = useQuery<FormType>({
    queryKey: ['forms', id],
    queryFn: () => axios('/forms/' + id).then(res => res.data.data.form),
  });
  // Function to generate random unique code
  function generateUniqueCode() {
    return Math.random().toString(36).substr(2, 8); // Generate a random alphanumeric string
  }

  const mutation = useMutation({
    mutationFn: (
      response: {
        elementType: string;
        question: string;
        answer: unknown;
        uniqueCode: string;
      }[],
    ) => axios.post('/forms/' + id + '/responses', { response }),
    onSuccess: () => toast.success('Form submitted successfully'),
    onError: () => toast.error('Error submitting form'),
  });

  useTitle(data?.name || 'EarnKart');

  const form = useForm();

  useEffect(() => {
    if (!data) return;
    const defaultValues: { [x: string]: unknown } = {};
    data.elements.forEach(({ id, type }) => {
      if (['switch', 'checkbox'].includes(type)) defaultValues[id] = false;
      else if (type === 'checklist') defaultValues[id] = [];
      else defaultValues[id] = null;
    });
    form.reset(defaultValues);
  }, [data, form]);

  const onSubmit = (values: { [x: string]: string }) => {
    if (!data) return;

    for (const { id, required, type } of data.elements) {
      if (
        required &&
        (!values[id] || (type === 'checklist' && values[id].length === 0))
      ) {
        toast.error('Please fill all required fields');
        return;
      }
    }

    const response = data.elements
      .filter(({ type }) => !['heading', 'description'].includes(type))
      .map(({ id, label, options, type }) => ({
        elementType: type,
        question: label,
        answer:
          options && type !== 'checklist'
            ? options.find(({ value }) => value === values[id])?.label ?? null
            : values[id] ?? null,
      }));
    // Generate unique code
    const uniqueCode = generateUniqueCode();

    // Include unique code in the response
    const responseWithCode = response.map(item => ({ ...item, uniqueCode }));

    mutation.mutate(responseWithCode);
    redirectToPartnerLink(uniqueCode);
  };

  const redirectToPartnerLink = (uniqueCode: string) => {
    const url = data?.partnerLink;
    if (url) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const urlWithCode = uniqueCode
          ? url.replace('{uniquecode}', uniqueCode)
          : url;
        window.open(urlWithCode, '_blank');
      } else {
        window.open('http://' + url, '_blank');
      }
    } else {
      console.error('Partner link is not defined.'); // or handle this case in a way appropriate for your application
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex min-h-[100dvh] flex-col bg-muted"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <header className="fixed left-0 right-0 top-0 z-30 border-b bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6">
            <h1 className="font-cursive text-3xl font-bold text-primary">
              Form
            </h1>

            {/*             <div className="flex gap-6">
              <ClearFormButton
                disabled={isPending || mutation.isPending}
                onClear={() => form.reset()}
              />
              <Button
                disabled={isPending || !data?.isActive}
                isLoading={mutation.isPending}
              >
                Submit Form
              </Button> */}
          </div>
        </header>
        {isPending ? (
          <img
            src={LoadingSvg}
            alt="Loading Spinner"
            className="mx-auto mt-24 h-20"
          />
        ) : isError ? (
          <div className="mt-24">
            <Error fullScreen={false} />
          </div>
        ) : (
          <main className="mx-auto mt-16 h-full w-full max-w-[720px] p-5">
            <ul className="space-y-5 ">
              <li className="items-center rounded-md bg-background px-5 py-3 text-2xl font-medium">
                {data.name}
              </li>
              {data.elements.map(element => (
                <li key={element.id}>
                  <FormField
                    control={form.control}
                    name={element.id}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormElementCard
                            formElement={element}
                            isView
                            field={field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </li>
              ))}
              {data.isActive ? null : (
                <li className="text-sm font-medium text-rose-700">
                  * Note: The status of this form is closed.
                </li>
              )}
              <li className="flex justify-between">
                <ClearFormButton
                  onClear={() => form.reset()}
                  disabled={mutation.isPending}
                />
                <Button
                  disabled={!data.isActive}
                  isLoading={mutation.isPending}
                >
                  Continue
                </Button>
              </li>
            </ul>
          </main>
        )}
      </form>
    </Form>
  );
}
