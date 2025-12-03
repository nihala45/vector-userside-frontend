"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

// Simple image upload using native input (works immediately)
const ImageUpload = ({ onChange }: { onChange: (url: string) => void }) => {
  const [preview, setPreview] = useState<string>("")

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      onChange(url)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Profile Picture</Label>
      <div className="flex items-center gap-4">
        {preview && <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-full" />}
        <Input type="file" accept="image/*" onChange={handleFile} />
      </div>
    </div>
  )
}

// Your Zod schema
const formSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "user", "moderator"]),
  gender: z.enum(["male", "female", "other"]),
  avatar: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function FormItems() {
  const [avatarUrl, setAvatarUrl] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
    },
  })

  const onSubmit = (data: FormData) => {
    console.log("Submitted:", data)
    alert("Form submitted successfully!")
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">User Registration</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Image Upload */}
        <ImageUpload onChange={(url) => setValue("avatar", url)} />

        {/* Role Select */}
        <div className="space-y-2">
          <Label>Role</Label>
          <Select onValueChange={(value) => setValue("role", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-red-500 text-sm">Role is required</p>}
        </div>

        {/* Gender Radio */}
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup defaultValue="male" onValueChange={(v) => setValue("gender", v as any)}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  )
}