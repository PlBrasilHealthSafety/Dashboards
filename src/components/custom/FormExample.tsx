import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SimpleFormField } from './SimpleFormField'

// Example form schema
const exampleFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => {
      const age = parseInt(val, 10);
      return !isNaN(age) && age >= 18;
    }, {
      message: 'You must be at least 18 years old',
    }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ExampleFormData = z.infer<typeof exampleFormSchema>

export function FormExample() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExampleFormData>({
    resolver: zodResolver(exampleFormSchema),
  })

  const onSubmit = async (data: ExampleFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Form submitted:', data)
    alert('Form submitted successfully!')
    reset()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Example Form</CardTitle>
        <CardDescription>
          This demonstrates form validation with React Hook Form and Zod
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SimpleFormField label="Username" error={errors.username}>
            <Input
              {...register('username')}
              placeholder="Enter your username"
              disabled={isSubmitting}
            />
          </SimpleFormField>

          <SimpleFormField label="Email" error={errors.email}>
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
          </SimpleFormField>

          <SimpleFormField label="Age" error={errors.age}>
            <Input
              {...register('age')}
              type="number"
              placeholder="Enter your age"
              disabled={isSubmitting}
            />
          </SimpleFormField>

          <SimpleFormField label="Password" error={errors.password}>
            <Input
              {...register('password')}
              type="password"
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
          </SimpleFormField>

          <SimpleFormField label="Confirm Password" error={errors.confirmPassword}>
            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
          </SimpleFormField>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
