import { ContactForm, FormExample } from '@/components/custom'

export function FormsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center">React Hook Form + Zod Examples</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContactForm />
        <FormExample />
      </div>
    </div>
  )
}