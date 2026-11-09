'use client'

import {Box, Button, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {useCallback, type ChangeEvent} from 'react'
import {set, unset, type StringInputProps} from 'sanity'

import {DEFAULT_ACCENT} from '../lib/constants'

const SWATCHES = [
  {name: 'Vermilion', value: '#F0502D'},
  {name: 'Coral', value: '#FF6B5E'},
  {name: 'Marigold', value: '#F5A524'},
  {name: 'Emerald', value: '#0E9F6E'},
  {name: 'Cobalt', value: '#2F5BFF'},
  {name: 'Iris', value: '#6D4AFF'},
  {name: 'Orchid', value: '#D6409F'},
  {name: 'Ink', value: '#1B1A19'},
]

const HEX = /^#[0-9a-fA-F]{6}$/

/** A friendly colour picker: swatches, the native colour wheel and a hex box. */
export function ColorInput(props: StringInputProps) {
  const {value, onChange, elementProps, readOnly} = props
  const current = value && HEX.test(value) ? value : DEFAULT_ACCENT

  const handleText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.currentTarget.value.trim()
      onChange(next ? set(next.startsWith('#') ? next : `#${next}`) : unset())
    },
    [onChange],
  )

  const handlePicker = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(set(event.currentTarget.value.toUpperCase()))
    },
    [onChange],
  )

  return (
    <Stack gap={3}>
      <Flex align="center" gap={3}>
        <input
          type="color"
          aria-label="Open the colour wheel"
          value={current}
          onChange={handlePicker}
          disabled={readOnly}
          style={{
            width: 44,
            height: 44,
            padding: 0,
            border: '1px solid rgba(128,128,128,.4)',
            borderRadius: 8,
            background: 'none',
            cursor: readOnly ? 'default' : 'pointer',
          }}
        />
        <Box flex={1}>
          <TextInput
            {...elementProps}
            value={value ?? ''}
            onChange={handleText}
            readOnly={readOnly}
            placeholder={DEFAULT_ACCENT}
          />
        </Box>
      </Flex>
      <Flex gap={2} wrap="wrap">
        {SWATCHES.map((swatch) => (
          <Button
            key={swatch.value}
            mode={current.toLowerCase() === swatch.value.toLowerCase() ? 'default' : 'ghost'}
            padding={2}
            disabled={readOnly}
            onClick={() => onChange(set(swatch.value))}
            aria-label={`Use ${swatch.name}`}
            title={swatch.name}
          >
            <Flex align="center" gap={2}>
              <span
                aria-hidden
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  background: swatch.value,
                  border: '1px solid rgba(128,128,128,.4)',
                  display: 'inline-block',
                }}
              />
              <Text size={1}>{swatch.name}</Text>
            </Flex>
          </Button>
        ))}
      </Flex>
    </Stack>
  )
}
