"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import axios from "axios";

type FormValues = {
  delayInput: number;
  delayInputUnit: string;
  slackMessageInput: string;
  slackWebhookURL: string;
};

const delayInputOptions = [
  { value: "Seconds", label: "Second(s)" },
  { value: "Minutes", label: "Minute(s)" },
  { value: "Hours", label: "Hours(s)" },
];

export default function Home() {
  const form = useForm<FormValues>({
    defaultValues: {
      delayInput: 0,
      delayInputUnit: "Seconds",
      slackMessageInput: "",
      slackWebhookURL: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    let delay = 0;
    if (data.delayInputUnit === "Seconds") {
      delay = data.delayInput;
    } else if (data.delayInputUnit === "Minutes") {
      delay = data.delayInput * 60;
    } else if (data.delayInputUnit === "Hours") {
      delay = data.delayInput * 60 * 60;
    }

    setTimeout(async () => {
      try {
        await axios.post('/api/slack-message', {webhookURL: data.slackWebhookURL, message: data.slackMessageInput });
        alert('Message sent to Slack!');
      } catch (error) {
        console.error('Error sending message to Slack:', error);
        return false;
      }
    }, 1000 * delay);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="delayInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delay Input</FormLabel>
                  <input
                    {...field}
                    type="number"
                    placeholder=""
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="delayInputUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a delay unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a delay unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-[200px]">
                      {delayInputOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slackMessageInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slack Message</FormLabel>
                  <textarea
                    {...field}
                    placeholder=""
                    className="w-[500px] p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slackWebhookURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slack Webhook URL</FormLabel>
                  <input
                    {...field}
                    type="text"
                    placeholder=""
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </FormItem>
              )}
            />
            <Button className="hover:cursor-pointer" type="submit">Send in {form.watch('delayInput')} {form.watch('delayInputUnit')}</Button>
          </form>
        </Form>
      </main>
    </div>
  );
}
