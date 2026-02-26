"use client"

import * as React from "react"

import { ComponentExample, getExampleCode } from "@/components/component-examples"
import { ComponentPreview } from "@/components/component-preview"

export function ComponentPreviewWrapper({ name }: { name: string }) {
  const code = getExampleCode(name)

  return (
    <ComponentPreview name={name} code={code}>
      <ComponentExample name={name} />
    </ComponentPreview>
  )
}
