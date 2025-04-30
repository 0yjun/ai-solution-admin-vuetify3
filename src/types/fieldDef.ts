import type { ValidationRule } from 'vuetify'

export interface FieldDef {
  key: string
  text: string
  temp: string
  name: string
  label: string
  placeholder: string
  disabled: boolean
  maxlength: number | null
  counter: boolean
  type: 'text'|'number'|'combo'|'array'
  autofocus: boolean
  color: boolean
  message: string
  rule: ValidationRule[]
  fetchUrl?: string| null
  appendItems?: Record<string, string|boolean|null>[]
  itemLabel?: string
  itemValue?: string
}
