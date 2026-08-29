"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle, ClipboardPenLine } from "lucide-react";

interface FormField {
  type: string;
  label: string;
  placeholder?: string;
  options?: string[];
  rows?: number;
  scale?: number;
  labels?: Record<string, string>;
}

interface FormSection {
  title: string;
  description: string;
  fields: FormField[];
}

interface FormData {
  type: string;
  title: string;
  subtitle: string;
  description: string;
  sections: FormSection[];
  submitText: string;
  successMessage: string;
}

interface JsonFormRendererProps {
  formData: FormData;
  onComplete: (data: Record<string, unknown>) => Promise<boolean>;
}

export default function JsonFormRenderer({ formData, onComplete }: JsonFormRendererProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = (sectionIndex: number, fieldIndex: number, value: any) => {
    const fieldKey = `${sectionIndex}-${fieldIndex}`;
    setFormValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleSubmit = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const saved = await onComplete({
      kind: "guided-form",
      title: formData.title,
      sections: formData.sections.map((section, sectionIndex) => ({
        title: section.title,
        fields: section.fields.map((field, fieldIndex) => ({
          label: field.label,
          type: field.type,
          value: formValues[`${sectionIndex}-${fieldIndex}`] ?? null
        }))
      }))
    });
    if (saved) setIsSubmitted(true);
    setIsSaving(false);
  };

  const renderField = (field: FormField, sectionIndex: number, fieldIndex: number) => {
    const fieldKey = `${sectionIndex}-${fieldIndex}`;
    const value = formValues[fieldKey];

    switch (field.type) {
      case 'text':
        return (
          <div key={fieldIndex} className="space-y-2">
            <Label htmlFor={fieldKey}>{field.label}</Label>
            <Input
              id={fieldKey}
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => handleFieldChange(sectionIndex, fieldIndex, e.target.value)}
              className="min-h-12 rounded-xl border-btl-200 focus-visible:ring-btl-600"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={fieldIndex} className="space-y-2">
            <Label htmlFor={fieldKey}>{field.label}</Label>
            <Textarea
              id={fieldKey}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              value={value || ''}
              onChange={(e) => handleFieldChange(sectionIndex, fieldIndex, e.target.value)}
              className="rounded-xl border-btl-200 focus-visible:ring-btl-600 leading-relaxed"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={fieldIndex} className="space-y-3">
            <Label className="text-base font-medium">{field.label}</Label>
            <div className="space-y-2">
              {field.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-start gap-3 rounded-xl border border-btl-100 bg-btl-50/60 p-3">
                  <Checkbox
                    id={`${fieldKey}-${optionIndex}`}
                    checked={value?.includes(option) || false}
                    onCheckedChange={(checked) => {
                      const currentValues = value || [];
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      handleFieldChange(sectionIndex, fieldIndex, newValues);
                    }}
                  />
                  <Label htmlFor={`${fieldKey}-${optionIndex}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rating':
        return (
          <div key={fieldIndex} className="space-y-3">
            <Label className="text-base font-medium">{field.label}</Label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {Array.from({ length: field.scale || 10 }, (_, i) => i + 1).map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant={value === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFieldChange(sectionIndex, fieldIndex, rating)}
                  className="w-10 h-10 shrink-0 rounded-xl border-btl-200 data-[state=checked]:bg-btl-600"
                >
                  {rating}
                </Button>
              ))}
            </div>
            {field.labels && value && (
              <p className="text-sm text-gray-600 mt-2">
                {field.labels[value.toString()]}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <Card className="rounded-2xl bg-btl-50 border-btl-200 shadow-none">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-btl-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-btl-900 mb-1">
              Reflection saved
            </h3>
            <p className="text-btl-700">{formData.successMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-5 text-btl-900">
      <div className="rounded-2xl border border-btl-200 bg-btl-50 p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-btl-600 text-white"><ClipboardPenLine className="h-5 w-5" /></span>
          <div><p className="text-xs font-semibold uppercase tracking-widest text-btl-600">Guided reflection</p><h2 className="text-2xl font-bold leading-tight">{formData.title}</h2></div>
        </div>
        <p className="font-medium text-btl-800 mb-2">{formData.subtitle}</p>
        <p className="text-btl-700 leading-relaxed">{formData.description}</p>
      </div>

      {formData.sections.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="rounded-2xl border-btl-200 shadow-none overflow-hidden">
          <CardHeader className="border-b border-btl-100 bg-white pb-4">
            <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-btl-100 font-bold text-btl-800">{sectionIndex + 1}</span><div>
            <CardTitle className="text-lg text-btl-900">{section.title}</CardTitle>
            <p className="mt-1 text-sm leading-relaxed text-btl-700">{section.description}</p></div></div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            {section.fields.map((field, fieldIndex) => 
              renderField(field, sectionIndex, fieldIndex)
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="lg" disabled={isSaving} className="min-h-12 rounded-xl bg-btl-600 px-6 text-white hover:bg-btl-700">
          {isSaving ? "Saving…" : formData.submitText}
        </Button>
      </div>
    </div>
  );
}
