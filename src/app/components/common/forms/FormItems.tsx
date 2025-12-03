"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@repo/ui/components/button";
import { RadioGroupInput } from "@repo/ui/custom-inputs/RadioGroupInput.js"
import { TextInput } from "@repo/ui/custom-inputs/TextInput.js"
import { ImageUploadInput } from "@repo/ui/custom-inputs/ImageUpload.js"
import { SelectInput } from "@repo/ui/custom-inputs/SelectInput.js";
const demoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  profile: z
    .any()
    .refine(file => file instanceof File, "Profile image is required"),
  gallery: z
    .array(z.any())
    .optional(),
  gender: z.enum(["male", "female"], "Select a gender"),
});

type DemoFormValues = z.infer<typeof demoSchema>;

export default function FormItems() {
  const methods = useForm<DemoFormValues>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      name: "",
      profile: undefined,
      gallery: [],
      gender: "male",
    },
  });

  const onSubmit = (data: DemoFormValues) => console.log(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <TextInput name="name" label="Name" placeholder="Enter your name" />
        <ImageUploadInput name="profile" label="Profile Image" />
        <ImageUploadInput name="gallery" label="Gallery Images"  />
        <SelectInput
          name="gender"
          label="Gender"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />
        <RadioGroupInput
          name="gender"
          label="Gender"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
