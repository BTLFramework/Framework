"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

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
  onComplete: (data: any) => void;
}

export default function JsonFormRenderer({ formData, onComplete }: JsonFormRendererProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFieldChange = (sectionIndex: number, fieldIndex: number, value: any) => {
    const fieldKey = `${sectionIndex}-${fieldIndex}`;
    setFormValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onComplete(formValues);
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
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={fieldIndex} className="space-y-3">
            <Label className="text-base font-medium">{field.label}</Label>
            <div className="space-y-2">
              {field.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
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
            <div className="flex items-center space-x-4">
              {Array.from({ length: field.scale || 10 }, (_, i) => i + 1).map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant={value === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFieldChange(sectionIndex, fieldIndex, rating)}
                  className="w-10 h-10 rounded-full"
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
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-green-800 mb-1">
              Form Completed!
            </h3>
            <p className="text-green-600">{formData.successMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h2>
        <p className="text-gray-600 mb-4">{formData.subtitle}</p>
        <p className="text-gray-700">{formData.description}</p>
      </div>

      {formData.sections.map((section, sectionIndex) => (
        <Card key={sectionIndex}>
          <CardHeader>
            <CardTitle className="text-lg">{section.title}</CardTitle>
            <p className="text-gray-600">{section.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map((field, fieldIndex) => 
              renderField(field, sectionIndex, fieldIndex)
            )}
          </CardContent>
        </Card>
      ))}

      <div className="text-center">
        <Button onClick={handleSubmit} size="lg">
          {formData.submitText}
        </Button>
      </div>
    </div>
  );
} 